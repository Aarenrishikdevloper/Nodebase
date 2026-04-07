import Handlebars from "handlebars";    
import { NodeExecutor } from "../../type/type";
import { DeepseekChannel } from "@/inngest/channel/deepseek";
import { NonRetriableError } from "inngest";
import { db } from "@/lib/db";
import { credentials } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { decrypt } from "@/lib/encryption";
import { generateText } from "ai";
import { llmaChannel } from "@/inngest/channel/llma";
Handlebars.registerHelper("json",(context)=>{
    const jsonString = JSON.stringify(context, null,2);  
    const safeString = new Handlebars.SafeString(jsonString); 
    return safeString
})   
type DeepSeekData ={
    variableName?:string; 
    credentialId?:string;  
    systemPrompt?:string; 
    userPrompt?:string
}      
export const DeepseekExecutor:NodeExecutor<DeepSeekData> = async({
    data, 
    nodeId, 
    userId, 
    step,  
    context, 
    publish
})=>{
    console.log(data); 
    await publish(
        DeepseekChannel().status({
            nodeId,  
            status:"loading"
        })
    )  
    if(!data.variableName){    
         await publish(
        DeepseekChannel().status({
            nodeId,  
            status:"error"
        })
      )  

         throw new NonRetriableError("Deepseek node: Variable name is missing")
    }  
    if(!data.credentialId){
            await publish(
        DeepseekChannel().status({
            nodeId,  
            status:"error"
        })
      )  

         throw new NonRetriableError("Deepseek node: CredentialId is missing")
    }     
    if(!data.credentialId){
            await publish(
        DeepseekChannel().status({
            nodeId,  
            status:"error"
        })
      )  

         throw new NonRetriableError("Deepseek node: CredentialId is missing")
    }        
    const sytemPrompt = data.systemPrompt?Handlebars.compile(data.systemPrompt)(context):"You are a helpful assistant"      
    const userPrompt = Handlebars.compile(data.userPrompt)(context)    
    const credential = await step.run("get-credential", async()=>{
        const result =await db.select().from(credentials).where(
            and(
                eq(credentials.id, data.credentialId!),  //this is injectable
                eq(credentials.userId,userId)
            )
        ).limit(1)    
        return result[0]
    })   
    if(!credential){
        throw new NonRetriableError("Deepseek node: Credentials not found")
    }  
    const openRouter  = createOpenRouter({
        apiKey:decrypt(credential.data as string)    
    })  
    try {
           const {steps}  =  await step.ai.wrap(
            "deepseek-generate-text", 
            generateText,  
            {
                model:openRouter("deepseek/deepseek-v3.1-terminus"),     
                system:sytemPrompt,  
                prompt:userPrompt,
                experimental_telemetry:{
                    isEnabled:true,  
                    recordInputs:true,  
                    recordOutputs:true
                }
            }
           )    
           const text = steps[0].content.find((part)=>part.type === "text")?.text   
           await publish(DeepseekChannel().status({nodeId, status:"success"}))     
           return {
               ...context, 
               [data.variableName]:{text}
           }
    } catch (error) {   
         await publish(
        DeepseekChannel().status({
            nodeId,  
            status:"error"
        })
      )  
        throw error
    }


}