import { BaseHandle } from '@/components/React_Flow/BaseHandle'
import { BaseNode, BaseNodeContent } from '@/components/React_Flow/BaseNode'
import { NodeStatus, NodeStatusIndicator } from '@/components/React_Flow/node-status-indicator'
import { Workflownode } from '@/components/workflow-node'
import { NodeProps, Position, useReactFlow } from '@xyflow/react'
import { LucideIcon } from 'lucide-react'
import Image from 'next/image'
import React, { memo, ReactNode } from 'react'
interface BaseTriggerPeops extends NodeProps{
    icon:LucideIcon | string  
    name:string, 
    description?:string,  
    children?:ReactNode,  
    status?:NodeStatus, 
    onSettings?:()=>void; 
    onDoubleClick?:()=>void;
}
export const BaseTriggerNode = memo(({
    id,  
    icon:Icon,  
    name,  
    description, 
    children,  
    onDoubleClick, 
    onSettings, 
    status
}:BaseTriggerPeops)=>{
      const IconComponent = typeof Icon !== 'string' ? Icon : null   
      const {setEdges, setNodes} = useReactFlow()
      const handleDelte =()=>{
          setNodes((currentNodes)=>{
            const updateNodes = currentNodes.filter((node)=>node.id !== id)  
            return updateNodes
          })    
          setEdges((currentEdges)=>{
            const updatedEdges = currentEdges.filter((edge)=>edge.source !== id) 
            return updatedEdges
          })
      }
  return(
    <Workflownode   
      name={name}  
      description={description}   
      onDelete={handleDelte}    
      onSettings={onSettings}
    >
      <NodeStatusIndicator status={status} variant={'border'} classNmae='rounded-l-2xl'>    

        <BaseNode status={status} onDoubleClick={onDoubleClick} className='rounded-l-xl relative group'> 
           <BaseNodeContent>  
            {typeof Icon === 'string' ? (
              <Image src={Icon} alt="" width={16} height={16} />
            ) : (
              IconComponent && <IconComponent className='size-4 text-muted-foreground'/>
            )} 
            {children}  
            <BaseHandle  
               id={"source-1"}  
               type='source'   
               position={Position.Right}
            />
           </BaseNodeContent>
        </BaseNode>
      </NodeStatusIndicator>
    </Workflownode>
  )
}) 
BaseTriggerNode.displayName = "BaseTriggerNode"
