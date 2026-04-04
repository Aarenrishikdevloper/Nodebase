'use server';
import { httpRequestChannel } from "@/inngest/channel/httprequest";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

 
export type HttpRequestToken = Realtime.Token<typeof httpRequestChannel,['status']>    
export  async function fetchHttpRequestRealTime():Promise<HttpRequestToken> {  
    const token = await getSubscriptionToken(inngest,{
        channel:httpRequestChannel(), 
        topics:['status']
    }) 
    return token
     
}