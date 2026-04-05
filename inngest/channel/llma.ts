import { channel, topic } from "@inngest/realtime";

export const LLAMA_CHANNEL_NAME = "llama-execution";  
export const llmaChannel = channel(LLAMA_CHANNEL_NAME).addTopic(
    topic('status').type<{
         nodeId:string, 
         status:"loading" | "success" | "error"
    }>()
)