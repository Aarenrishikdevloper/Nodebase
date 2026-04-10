'use server';
import { slackChannel } from "@/inngest/channel/slack";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

 
export type slackToken = Realtime.Token<typeof slackChannel,['status']>    

export async function fetchSlackRealtime():Promise<slackToken> {   
    const token = await getSubscriptionToken(inngest,{
        channel:slackChannel(), 
        topics:['status']
    })
    return token
    
}