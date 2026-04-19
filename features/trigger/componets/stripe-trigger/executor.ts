import { NodeExecutor } from "@/features/execution/type/type"
import { stripeTriggerChannel } from "@/inngest/channel/stripe"

 type stripeTriggerData = Record<string, unknown>  
 export const stripeTriggerExecutor:NodeExecutor<stripeTriggerData> = async({
     nodeId, 
     context, 
     step, 
     publish
 })=>{
          await publish(
            stripeTriggerChannel().status({
                nodeId, 
                status:"loading"
            })
          )   
          const result = await  step.run('stripe-executor', async()=>context); 
          await publish(
            stripeTriggerChannel().status({
                nodeId, 
                status:"success"
            })
          ) 
          return result
 } 