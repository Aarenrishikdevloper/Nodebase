import Handlebars from "handlebars";   
import { NodeExecutor } from "../../type/type";
import { llmaChannel } from "@/inngest/channel/llma";
import { NonRetriableError } from "inngest";
import { db } from "@/lib/db";
import { and, eq, sql } from "drizzle-orm";
import { credentials } from "@/lib/db/schema";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";   
import {generateText} from "ai"
import { decrypt } from "@/lib/encryption";
Handlebars.registerHelper('json',(context)=>{
    const jsonString = JSON.stringify(context, null,2) 
    const SafeString = new Handlebars.SafeString(jsonString)  
    return SafeString
})     

type llamaData ={
    variableName?:string,  
    credentialId?:string,  
    systemPrompt?:string,    
    userPrompt?:string,    

}  
export const LlamaExecutor:NodeExecutor<llamaData> = async({
    data,    
    nodeId, 
    userId, 
    step,     
    context,
    publish,
})=>{ 
    console.log(data)
      await publish(
        llmaChannel().status({
            nodeId, 
            status:"loading"
        })
      )    
      if(!data.variableName){
         await publish(
        llmaChannel().status({
            nodeId, 
            status:"error"
        })   
      )     
      throw new NonRetriableError("llma node: Variable name is missing")
      }  
       if(!data.credentialId){
         await publish(
        llmaChannel().status({
            nodeId, 
            status:"error"
        })   
      )     
      throw new NonRetriableError("llma node: Credential is missing")
      } 
      if(!data.userPrompt){
            await publish(
        llmaChannel().status({
            nodeId, 
            status:"error"
        })   
      )     
      throw new NonRetriableError("llma node: Credential is missing")
      }   
      const systemPrompt = data.systemPrompt?Handlebars.compile(data.systemPrompt)(context):"You are a helpful assistant"; 
      const userPrompt = Handlebars.compile(data.userPrompt)(context)     
      const credential = await step.run("get-credential",async()=>{
           const result = await db.select().from(credentials).where(
            and(
                eq(credentials.id, data.credentialId!),  
                eq(credentials.userId, userId)
            )
           ).limit(1)  
           return result[0]
      })     
      if(!credential){
        throw new NonRetriableError("llama node: Credential not found")
      } 
      const openrouter = createOpenRouter({
          apiKey:decrypt(credential.data as string)
         

         
      })       
      try {
            const{steps} = await step.ai.wrap(
                "llma-generate-text",  
                 generateText, 
                 {
                    model:openrouter("meta-llama/llama-3.2-3b-instruct"), 
                    system:systemPrompt,   
                    prompt:userPrompt,  
                    experimental_telemetry:{
                        isEnabled:true, 
                        recordInputs:true, 
                        recordOutputs:true
                    }
                 }
            ) 
            const text = steps[0].content.find((part)=>part.type=== "text")?.text  
            await publish(llmaChannel().status({nodeId, status:"success"}))      
            return{
                ...context,  
                [data.variableName]:{text}
            }
      } catch (error) {
           await publish(llmaChannel().status({nodeId, status:"success"}))         
           throw error;
      }

}