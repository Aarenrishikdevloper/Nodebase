import {  qwenChannel } from "@/inngest/channel/qwen";
import { NodeExecutor } from "../../type/type";
import { error } from "console";
import { NonRetriableError } from "inngest";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";  
import Handlebars from "handlebars";
import { credentials } from "@/lib/db/schema";  
import {createOpenRouter} from "@openrouter/ai-sdk-provider"
import { decrypt } from "@/lib/encryption"; 
import {generateText} from "ai" 
Handlebars.registerHelper("json", (context) => {
     const jsonString = JSON.stringify(context, null, 2);      
     const SafeString = new Handlebars.SafeString(jsonString);   
     return SafeString;
})
type QwenNodeData ={
    variableName?:string,  
     credentialId:string,  
     systemPrompt?:string, 
     userPrompt?:string;
}     

export const QwenExecutor:NodeExecutor<QwenNodeData> = async(
    {
        data, 
        nodeId, 
        userId, 
        context, 
        step, 
        publish
    }
)=>{
    console.log("Executing Qwen Node with data:", data) 
    console.log(userId)
     await  publish(qwenChannel().status({nodeId, status:"loading"}));  
     if(!data.variableName){
         await publish(qwenChannel().status({nodeId, status:"error"}))  
         throw new NonRetriableError("Qwen Node: variable name is missing");
     }  
     if(!data!.credentialId){
          await publish(qwenChannel().status({ nodeId, status: "error" }));
          throw new NonRetriableError("Qwen node: credential is required");
     }  
     if(!data!.userPrompt){
         await publish(qwenChannel().status({ nodeId, status: "error" }));
         throw new NonRetriableError("Qwen node: User prompt is missing");
     }  
     const systemPrompt = data.systemPrompt?Handlebars.compile(data.systemPrompt)(context):"You are a helpfull assistant" 
     const userPrompt = Handlebars.compile(data.userPrompt)(context)    
     const credential = await step.run("get-credential", async()=>{
        return await db.query.credentials.findFirst({ 
            where:(cred, {eq, and})=>and(
                eq(cred.id, data.credentialId), 
                eq(cred.userId, userId)
            )
            
        })     
        
     })  
     if(!credential){  
          throw new NonRetriableError("Gemini node: Credentials not found");
            
     }   
     console.log(decrypt(credential.data as string));
     const openrouter = createOpenRouter({
        apiKey:decrypt(credential.data as string)    
     })
     try {
        const{steps} = await step.ai.wrap(
            "qwen-generate-text",  
            generateText,  
            {
                model:openrouter("qwen/qwen3.6-plus:free"), 
                system:systemPrompt, 
                prompt:userPrompt, 
                experimental_telemetry:{
                    isEnabled:true, 
                    recordInputs:true, 
                    recordOutputs:true
                }
            }
             
        )      
        console.log("Qwen response:", steps[0].content)
         const text = steps[0].content.find((part)=>part.type === "text")?.text
         await publish(
            qwenChannel().status({nodeId, status:"success"})
         )  
         return{
            ...context, 
            [data.variableName]:{text}
         }
          
     } catch (error) {
           await publish(qwenChannel().status({ nodeId, status: "error" }));   
           throw error;
     }
} 