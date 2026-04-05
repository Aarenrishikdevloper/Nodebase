"use server";
import { llmaChannel } from "@/inngest/channel/llma";

import { inngest } from "@/inngest/client";
import {  getSubscriptionToken, Realtime } from "@inngest/realtime";

 
export type llmaToken = Realtime.Token<typeof llmaChannel,['status']>  
export async function fetchLlmaRealTimeToken():Promise<llmaToken> {
    const token = await getSubscriptionToken(inngest,{
        channel:llmaChannel(), 
        topics:['status']
    }) 
    return token
}