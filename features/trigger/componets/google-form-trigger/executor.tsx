import { NodeExecutor } from "@/features/execution/type/type"
import { googleFormTriggerChannel } from "@/inngest/channel/googleform"

type GoogleFormData = Record<string,unknown>  
export const googleFormTriggerExecutor:NodeExecutor<GoogleFormData>=async({nodeId, context, step,publish})=>{
    await publish(googleFormTriggerChannel().status({
        nodeId, 
        status:"loading"
    }))   
    const result =await step.run("google-form-trigger", async()=>context); 
    await publish(
        googleFormTriggerChannel().status({
            nodeId, 
            status:'success'
        })
    ) 
    return result
}