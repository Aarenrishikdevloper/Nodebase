import { db } from "@/lib/db";
import { inngest } from "./client";
import { executions, executionStatusEnum } from "@/lib/db/schema";
import { error } from "better-auth/api";
import { and, eq } from "drizzle-orm";
import { NonRetriableError, step } from "inngest";
import { topologicalSort } from "./utils";
import { qwenChannel } from "./channel/qwen";
import { getExecutor, NodeType } from "@/features/execution/lib/executor-registry";
import { httpRequestChannel } from "./channel/httprequest";
import { manualTriggerChannel } from "./channel/manual-trigger";
import { llmaChannel } from "./channel/llma";
export const executeWorkflow = inngest.createFunction(
    {
        id:"execute-workflow",  
        retries:process.env.NODE_ENV === "production"?3:0, 
        onFailure:async({event, step})=>{

            const updatedExecution = await db.update(executions).set({
                status:"FAILED",   
                error:event.data.error.message, 
                errorStack:event.data.error.stack
            }).where(eq(executions.inngestEventId, event.data.event.id!)).returning();  
            return updatedExecution

        }      
        
        
    }, 
    {
      event:"workflows/execute.workflow", 
      channels:[
        qwenChannel(),  
        httpRequestChannel(), 
        manualTriggerChannel(),  
        llmaChannel(),
      ],      

      

    },  
    async ({event, step, publish})=>{
        const inngetEventId = event.id; 
        const workflowId = event.data.workflowId  
        if(!inngetEventId || !workflowId){
            throw new NonRetriableError("Event Id or WorkflowId missing")
        } 
        await step.run("Create-execution", async()=>{
            const createWorkflow = await db.insert(executions).values({
                workflowId:workflowId,    
                inngestEventId:inngetEventId

            }).returning()  
            return createWorkflow
        })    
        const sortedNodes = await step.run("prepare-workflow", async()=>{
            const workflow = await db.query.workflows.findFirst({
                where:(wf,{eq})=>eq(wf.id, workflowId),  
                with:{
                    nodes:true,  
                    connections:true
                }
            }) 
            if(!workflow){
                throw new Error("workflow not found")
            }    
            return topologicalSort(workflow.nodes, workflow.connections)
        })    
        const userId = await step.run('find-user-id', async()=>{
            const workflow = await db.query.workflows.findFirst({
                where:(wf, {eq})=>eq(wf.id, workflowId), 
                with:{user:true}
            })   
            if (!workflow?.userId) throw new Error("User not found");
            return workflow.userId
        })   
        let context = event.data.intialData  || {}   
        for(const node of sortedNodes){
            const nodeConfig =  await db.query.nodeConfigs.findFirst({
                where:(nc,{eq,and})=>and(
                    eq(nc.workflowId, workflowId), 
                    eq(nc.nodeId, node.id)
                )
            })
            const executor = getExecutor(node.type as NodeType)      
            context = await executor({
                data:nodeConfig?.data as Record<string, unknown> || node.data as Record<string, unknown>,  
                nodeId:node.id,  
                userId, 
                context, 
                step, 
                publish
             })

            
        }  
        await  step.run('update-execution',async()=>{
            const resutlt  = await db.update(executions).set({
                status:'COMPLETED',  
                completedAt:new Date(), 
                output:context
            }).where(
                and(
                    eq(executions.inngestEventId, inngetEventId),
                    eq(executions.workflowId, workflowId)
                )
            ).returning() 
            return resutlt
        })  
        return{
            workflowId, 
            result:context
        }
 
    }   
    
    
)