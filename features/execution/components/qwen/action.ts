"use server";
import { qwenChannel } from "@/inngest/channel/qwen";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

 
export type QwenToken = Realtime.Token<typeof qwenChannel,['status']>   

export async function  fetchQwenRealtimeToken():Promise<QwenToken> {    
    const token = await getSubscriptionToken(inngest,{
        channel:qwenChannel(),  
        topics:['status']
    })   
    return token
     
}