import { nodes, connections } from "@/lib/db/schema"
import {InferSelectModel} from "drizzle-orm"  
import toposort from "toposort"
import { inngest } from "./client" 
import  {createId} from "@paralleldrive/cuid2"
type Nodes =   InferSelectModel<typeof nodes>    
type Connection = InferSelectModel<typeof connections>    
export const topologicalSort =(nodes:Nodes[], connections:Connection[]):Nodes[]=>{   
    if(connections.length === 0){
        return nodes
    }
    const edges:[string, string][] = connections.map((conn)=>[
        conn.fromNodeId,  
        conn.toNodeId
    ])     
    const connectedNodeId = new Set<string>()    
    for(const conn of connections){
        connectedNodeId.add(conn.fromNodeId) 
        connectedNodeId.add(conn.toNodeId)
    }   
    for(const node of nodes){
        if(!connectedNodeId.has(node.id)){
            edges.push([
                node.id, node.id
            ])
        }
    } 
    let sortedNodeIds:string[]    
    try{
            sortedNodeIds  =  toposort(edges)   
            sortedNodeIds =[...new Set(sortedNodeIds)]     

    }catch(error){
        if(error instanceof Error && error.message.includes('Cyclic')){
            throw new Error("Workflow contains a cycle")
        } 
        throw error
    }   
    const nodemap = new Map(nodes.map((n)=>[n.id,n]))   
    return sortedNodeIds.map((id)=>nodemap.get(id)!).filter(Boolean)
} 
export const sendWorkFlowExecution =(data:{workflowId:string;[key:string]:any})=>{
    return inngest.send({
        name:'workflows/execute.workflow', 
        data, 
        id:createId()
    })
}