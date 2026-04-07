import {channel, topic} from "@inngest/realtime"  
export const DEEPSEEK_CHANNEL_NAME ="Deepseek-execution"; 
export const DeepseekChannel = channel(DEEPSEEK_CHANNEL_NAME).addTopic(
    topic("status").type<{
        nodeId:string;  
        status:'loading' | 'success' | 'error'
    }>()
)