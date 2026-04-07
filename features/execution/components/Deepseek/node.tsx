'use client'

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecUtionNode } from "../base-execution-node";
import DeepSeekDaialog, { anthropciFormValues } from "./dialog";
import DisCordDaialog from "../discord/dialog";
import { useParams } from "next/navigation";
import { useNodeStatus } from "../../hooks/use-node";
import { DEEPSEEK_CHANNEL_NAME } from "@/inngest/channel/deepseek";
import { fetchDeepSeekRealTimeToken } from "./action";
import { useNodeConfig } from "@/features/workflow/hooks/use-workflow";

type AntthropicNodeData ={
    variableName?:string;  
    credentialId?:string;  
    systemPrompt?:string;  
    usePrompt?:string;
}   
type AnthropicNodeType = Node<AntthropicNodeData>;     
export const DeepSeekNode = memo((props:NodeProps<AnthropicNodeType>)=>{  
    const [dialogopen, setDialogOpen] = useState(false)
    const nodeData = props.data; 
    const description = nodeData.usePrompt?`DeepSeek-R1-0528: ${nodeData.usePrompt.slice(0,50)}....`:"Not configured"    
    const handleOpenSettings =()=>setDialogOpen(true)   
    const {setNodes} = useReactFlow()  
    const params = useParams(); 
    const workflowId = params.workflowId as string    
     const saveConfig = useNodeConfig()
     const handleSubmit =(values:anthropciFormValues)=>{ 
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
            workflowId,
            nodeId: props.id,
            config: values
        })
              setDialogOpen(false)
           }  
                    
                  const nodeStatus = useNodeStatus({
                    nodeId:props.id, 
                    channel:DEEPSEEK_CHANNEL_NAME, 
                    topic:"status",  
                    refreshToken:fetchDeepSeekRealTimeToken,
                  })
    return ( 
        <>    
        <DeepSeekDaialog open={dialogopen} onOpenChange={setDialogOpen} defaultValues={nodeData} onSubmit={handleSubmit}/>
        <BaseExecUtionNode   
          {...props}  
          id={props.id}   
          icon={'/deepseek.svg'}   
          name="Deepseek Request" 
          description={description}   
          onSetting={handleOpenSettings}  
          onDoubleClick={handleOpenSettings} 
          status={nodeStatus}
        /> 
        </>
    )
})   
DeepSeekNode.displayName ="Deepseek"
