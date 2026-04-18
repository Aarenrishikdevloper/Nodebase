'use server';
import { googleFormTriggerChannel } from "@/inngest/channel/googleform";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

 
export type GoogleFormTriggerToken = Realtime.Token<typeof googleFormTriggerChannel,['status']>   
export async function fetchGoogleTriggerRealTimeToken() {   
    const token = await getSubscriptionToken(inngest,{
        channel:googleFormTriggerChannel(), 
        topics:['status']
    }) 
    return token
    
}