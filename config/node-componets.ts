import { Intialnode } from "@/components/intialnode";
import { DeepSeekNode } from "@/features/execution/components/Deepseek/node";
import { GeminiNode } from "@/features/execution/components/gemini/node";
import { OpenAiNode } from "@/features/execution/components/openai/node";
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
    [NodeType.OPENAI]:OpenAiNode, 
    [NodeType.GEMINI]:GeminiNode
 } as  const satisfies NodeTypes   

 export type RegisterNodeType  = keyof typeof nodeComponet