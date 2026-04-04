'use server'
import { manualTriggerChannel } from "@/inngest/channel/manual-trigger";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";


export type ManualTriggerToken = Realtime.Token<typeof manualTriggerChannel,['status']>     
export  async function fetchManualTrigger():Promise<ManualTriggerToken>{    
    const token = getSubscriptionToken(inngest,{
        channel:manualTriggerChannel(), 
        topics:['status']
    })
    return token
}