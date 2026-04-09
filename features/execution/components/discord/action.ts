'use server'
import { discordChannel } from "@/inngest/channel/discord";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type discordToken = Realtime.Token<typeof discordChannel,['status']>        
export async function fetchDiscordRealtimeToken():Promise<discordToken> {
     const token = await getSubscriptionToken(inngest,{
        channel:discordChannel(),  
        topics:['status']
     }) 
     return token
}