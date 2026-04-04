'use client';
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecUtionNode } from "../base-execution-node";
import React from "react";
import GeminiDialog, { GeminiFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node";
import {  QWEN_CHANNEL_NAME } from "@/inngest/channel/qwen";
import { fetchQwenRealtimeToken } from "./action";
import { useNodeConfig } from "@/features/workflow/hooks/use-workflow";
import { useParams } from "next/navigation";
type QwenNodeData ={
    variableName?:string,  
     credentialId:string,  
     systemPrompt?:string, 
     userPrompt?:string;
}   
type QwenNodeType = Node<QwenNodeData>;        
export const QwenNode = memo((props:NodeProps<QwenNodeType>)=>{
    const {setNodes} = useReactFlow()    
    const [dialog, setDialog]    = useState(false)     
    const nodeData = props.data    
    const description = nodeData?.userPrompt ?`Qwen3.6: ${nodeData.userPrompt.slice(0,50)}`:"Not Configured"    
    const handleOpenSettings = ()=>{
        setDialog(true)
    }    
    const nodeStatus = useNodeStatus({
        nodeId:props.id,  
        channel:QWEN_CHANNEL_NAME,  
        topic:"status",  
        refreshToken:fetchQwenRealtimeToken
    })     
    const params = useParams(); 
    const workflowId = params.workflowId as string           

    const saveConfig = useNodeConfig()
    const hanleSubmtit =(values:GeminiFormValues)=>{
        setNodes((nodes)=>nodes.map((node)=>{
            if(node.id === props.id){
                return{
                    ...node, 
                    data:{
                        ...node.data, 
                        ...values
                    }
                }
            } 
            return node;
        }))  
        saveConfig.mutate({
            workflowId, 
            nodeId:props.id, 
            config:values
        })
    }
    return(  
         <React.Fragment> 
            <GeminiDialog onSubmit={hanleSubmtit} open={dialog} onOpenChange={setDialog} defaultValues={nodeData}/>
        <BaseExecUtionNode    
            {...props}   
             id={props.id}    
             name="Qwen Request"     
             description={description}   
             onSetting={handleOpenSettings}    
             onDoubleClick={handleOpenSettings}  
             icon={'/qwen.webp'} 
             status={nodeStatus}

        />      

        </React.Fragment>
    )
})    

QwenNode.displayName = "QwenNode"
