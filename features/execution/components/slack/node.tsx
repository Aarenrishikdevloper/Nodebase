'use client';
import { Node, NodeProps, useReactFlow } from '@xyflow/react';
import React, { memo, useEffect, useState } from 'react'
import { BaseExecUtionNode } from '../base-execution-node';
import SlackDaialog, { SlackFormValues } from './dialog';
import { useNodeConfig } from '@/features/workflow/hooks/use-workflow';
import { useParams } from 'next/navigation';
import { getNodeConfigFromIDB, saveNodeConfigToIDB } from '@/lib/utils';
import { useNodeStatus } from '../../hooks/use-node';
import { SLACK_CHANNEL_NAME } from '@/inngest/channel/slack';
import { fetchSlackRealtime } from './action';

type SlackNodeData ={
    webhookUrl?:string,  
    content?:string, 
    username?:string
}  
type SlackNodeType = Node<SlackNodeData>    
export const SlackNode = memo((props:NodeProps<SlackNodeType>)=>{  
    const nodedata = props.data  
    const [defaultdata, setDefault] = useState<SlackFormValues | null>(null)
    const description = defaultdata?.content ?`Send: ${defaultdata.content.slice(0,50)}....`:"Not Configured"  
    const [open, setopen] = useState(false) 
        const {setNodes} = useReactFlow()   
     
        const params = useParams()  
        const workflowId = params.workflowId as string
        const saveConfig = useNodeConfig()  
        const key =`${workflowId}-${props.id}`
        const handleOpenSettings =()=>setopen(true)   
          const handleSubmit =(values:SlackFormValues)=>{ 
                    setNodes((nodes)=>
                        nodes.map((node)=>{
                            if(node.id === props.id){
                                 return {
                                    ...node,  
                                    data:{
                                        ...node.data, 
                                        ...values
                                    }
                                 }
                            } 
                            return node
                        })
                         
                    )     
                    saveConfig.mutate({
                        nodeId:props.id,  
                        workflowId:workflowId, 
                        config:values
                        
                    })  
                    saveNodeConfigToIDB(key, values)
                    setDefault(values)
                    setopen(false)   
                    
                }      
              const nodeStatus = useNodeStatus({
                     nodeId:props.id, 
                     channel:SLACK_CHANNEL_NAME, 
                     topic:"status",  
                     refreshToken:fetchSlackRealtime
                   })     
         useEffect(() => {
               
                       const loadfromcace = async () => {
                           
                           const cached = await getNodeConfigFromIDB(key)
                           if (cached) {
                               setDefault((prev) => ({
                                   ...prev,
                                   ...cached
                               }))
                           }
                       }
                       loadfromcace()
               
               
                   }, [workflowId, props.id])         
    return(  
        <React.Fragment>  
            <SlackDaialog open={open} onOpenChange={setopen} onSubmit={handleSubmit} defaultValues={defaultdata!}/>
        <BaseExecUtionNode    
        {...props}  
        id={props.id}  
        icon={'/slack.svg'}   
        description={description}        
        onDoubleClick={handleOpenSettings}  
        onSetting={handleOpenSettings} 
        name='SLACK Request'   
        status={nodeStatus}
        
        />  
        </React.Fragment>
    )
})