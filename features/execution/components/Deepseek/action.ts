'use server';
import { DeepseekChannel } from "@/inngest/channel/deepseek";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

 
export type deepseekToken = Realtime.Token<typeof DeepseekChannel,['status']>   
export async function fetchDeepSeekRealTimeToken():Promise<deepseekToken>{
    const token = await getSubscriptionToken(inngest,{
        channel:DeepseekChannel(), 
        topics:['status']
    }) 
    return token
}