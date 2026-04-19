"use server";
import { stripeTriggerChannel } from "@/inngest/channel/stripe";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

 
export type stripeTriggerToken = Realtime.Token<typeof stripeTriggerChannel,['status']>      
export async function fetchStripeTriggerRealtimeToken():Promise<stripeTriggerToken> {
    const toeken = await getSubscriptionToken(inngest,{
        channel:stripeTriggerChannel(), 
        topics:['status']
    }) 
    return toeken
}