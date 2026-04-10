'use client';
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useEffect, useState } from "react";
import { BaseExecUtionNode } from "../base-execution-node";
import React from "react";
import {  qwenFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node";
import {  QWEN_CHANNEL_NAME } from "@/inngest/channel/qwen";
import { fetchQwenRealtimeToken } from "./action";
import { useNodeConfig } from "@/features/workflow/hooks/use-workflow";
import { useParams } from "next/navigation";
import { getNodeConfigFromIDB, saveNodeConfigToIDB } from "@/lib/utils";
import QwenDialog from "./dialog";
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
    const [defaultdata, setDefault] = useState<qwenFormValues | null>(null)
    const nodeData = props.data    
    const description = defaultdata?.userPrompt ?`Qwen3.6: ${defaultdata.userPrompt.slice(0,50)}`:"Not Configured"    
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
    const key = `${workflowId}-${props.id}`
    const saveConfig = useNodeConfig()
    const hanleSubmtit =async(values:qwenFormValues)=>{
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
        await saveNodeConfigToIDB(key, values) 
        setDefault(values) 
        await saveNodeConfigToIDB(key, values)

    } 
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
            <QwenDialog onSubmit={hanleSubmtit} open={dialog} onOpenChange={setDialog} defaultValues={defaultdata!}/>
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
