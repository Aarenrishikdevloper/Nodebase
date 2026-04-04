import { Intialnode } from "@/components/intialnode";
import { DeepSeekNode } from "@/features/execution/components/Deepseek/node";
import { DiscordNode } from "@/features/execution/components/discord/node";
import { QwenNode } from "@/features/execution/components/qwen/node";
import { HttpRequestNode } from "@/features/execution/components/http-request/node";
import { LlamaNode } from "@/features/execution/components/llama/node";
import { SlackNode } from "@/features/execution/components/slack/node";
import { GoogleFormTrigger } from "@/features/trigger/componets/google-form-trigger/node";
import { ManualTriggerNode } from "@/features/trigger/componets/manual-trigger/node";
import { StripeTriggerNode } from "@/features/trigger/componets/stripe-trigger/node";
import { NodeType } from "@/type/type";
import { NodeTypes } from "@xyflow/react";

export const nodeComponet ={
    [NodeType.INITIAL]:Intialnode,   
    [NodeType.MANUAL_TRIGGER]  : ManualTriggerNode,
    [NodeType.STRIPE_TRIGGER] : StripeTriggerNode, 
    [NodeType.GOOGLE_FORM_TRIGGER]:GoogleFormTrigger,  
    [NodeType.DEEPSEEK]:DeepSeekNode, 
    [NodeType.LLAMA]:LlamaNode, 
    [NodeType.QWEN]:QwenNode, 
    [NodeType.DISCORD]:DiscordNode, 
    [NodeType.SLACK]:SlackNode,  
    [NodeType.HTTP_REQUEST]:HttpRequestNode
 } as  const satisfies NodeTypes   

 export type RegisterNodeType  = keyof typeof nodeComponet