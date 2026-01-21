import { Handle, NodeProps, Position } from "@xyflow/react";
import { Placeholder } from "drizzle-orm";
import { forwardRef, ReactNode } from "react";
import { partial } from "zod/v4-mini";
import { BaseNode } from "./BaseNode";

export type PlaceholderNodeProps =Partial<NodeProps> &{
    children:ReactNode,  
    onClick:()=>void
} 
export const PlaceHolderNode = forwardRef<HTMLDivElement, PlaceholderNodeProps>(
    ({children,onClick},ref)=>{
       return(
         <BaseNode onClick={onClick} ref={ref} className="w-auto h-auto  border-dashed  border-gray-400 bg-card p-4  text-center text-gray-400  shadow-none cursor-pointer  hover:border-gray-500 hover:bg-gray-50">   
            {children}  
            <Handle type="target" style={{visibility:'hidden'}} position={Position.Bottom} isConnectable={false}/>    
            <Handle  
               type="target"  style={{visibility:'hidden'}}   position={Position.Bottom}  isConnectable={false}
            />
            
         </BaseNode>
       )
    }
)