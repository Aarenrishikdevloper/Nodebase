import { BaseHandle } from '@/components/React_Flow/BaseHandle'
import { BaseNode, BaseNodeContent } from '@/components/React_Flow/BaseNode'
import { NodeStatus, NodeStatusIndicator } from '@/components/React_Flow/node-status-indicator'
import { Workflownode } from '@/components/workflow-node'
import { NodeProps, Position } from '@xyflow/react'
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
  return(
    <Workflownode   
      name={name}  
      description={description}   
      onDelete={()=>{}}    
      onSettings={()=>{}}
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
