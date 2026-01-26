import { Intialnode } from "@/components/intialnode";
import { ManualTriggerNode } from "@/features/trigger/componets/manual-trigger/node";
import { NodeType } from "@/type/type";
import { NodeTypes } from "@xyflow/react";
export const nodeComponet ={
    [NodeType.INITIAL]:Intialnode,   
    [NodeType.MANUAL_TRIGGER]  : ManualTriggerNode
 } as  const satisfies NodeTypes   

 export type RegisterNodeType  = keyof typeof nodeComponet