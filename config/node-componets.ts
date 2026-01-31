import { Intialnode } from "@/components/intialnode";
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
 } as  const satisfies NodeTypes   

 export type RegisterNodeType  = keyof typeof nodeComponet