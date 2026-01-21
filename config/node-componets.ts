import { Intialnode } from "@/components/intialnode";
import { NodeType } from "@/type/type";
import { NodeTypes } from "@xyflow/react";
export const nodeComponet ={
    [NodeType.INITIAL]:Intialnode      
 } as  const satisfies NodeTypes   

 export type RegisterNodeType  = keyof typeof nodeComponet