import { BaseHandle } from "@/components/React_Flow/BaseHandle";
import { BaseNode, BaseNodeContent } from "@/components/React_Flow/BaseNode";
import { NodeStatus, NodeStatusIndicator } from "@/components/React_Flow/node-status-indicator";
import { Workflownode } from "@/components/workflow-node";
import { NodeProps, Position, useReactFlow } from "@xyflow/react";
import { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, ReactNode } from "react";

interface BaseExecutionNodeProps extends NodeProps{
    icon:LucideIcon | string;  
    name:string, 
    description?:string,  
    children?:ReactNode,  
    status?:NodeStatus,  
    onSetting?:()=>void;  
    onDoubleClick?:()=>void;
} 
export const BaseExecUtionNode = memo(
    ({
         icon,  
      id, 
      icon:Icon,  
      name,  
      status,  
      description, 
      children, 
      onDoubleClick, 
      onSetting
    }:BaseExecutionNodeProps)=>{ 
        const {setNodes, setEdges} = useReactFlow()  
        const handleDelete =()=>{
            setNodes((currntNodes)=>{
                const updateNodes = currntNodes.filter((node)=>node.id !== id)   
                return updateNodes
            })  
            setEdges((curentEdges)=>{
                const updateEdges = curentEdges.filter((edge)=>edge.source !== id && edge.target !== id)  
                return updateEdges
            })
        }
        return (
            <Workflownode   
               name={name}  
               description={description}  
               onDelete={handleDelete}   
               onSettings={onSetting}
            >
             <NodeStatusIndicator status={status} variant={'border'}>   
                <BaseNode  
                status={status} 
                onDoubleClick={onDoubleClick}
                > 
                <BaseNodeContent> 
                   
                   {typeof Icon == 'string' ?(
                     <Image src={Icon} alt="" width={16} height={16}/>
                   ):(
                     <Icon  className="size-4  text-muted-foreground "/>
                   )} 
                   {children}  
                   <BaseHandle   
                     id={"target-1"}  
                     type="target"  
                     position={Position.Left}
                   />   
                   <BaseHandle   
                      id={'source-1'}  
                      type={'source'}  
                      position={Position.Right}
                   />
                     
                   
                </BaseNodeContent>

                </BaseNode>

             </NodeStatusIndicator>
            </Workflownode>
        )
    }
)