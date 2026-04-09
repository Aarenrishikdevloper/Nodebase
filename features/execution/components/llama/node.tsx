'use client'

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";
import { BaseExecUtionNode } from "../base-execution-node";
import  LlamaDaialog, { llmaFormValues } from "./dialog";
import { useParams } from "next/navigation";
import { useNodeConfig } from "@/features/workflow/hooks/use-workflow";
import { useNodeStatus } from "../../hooks/use-node";
import { LLAMA_CHANNEL_NAME } from "@/inngest/channel/llma";
import { fetchLlmaRealTimeToken } from "./action";
import { getNodeConfigFromIDB, saveNodeConfigToIDB } from "@/lib/utils";


type  llamaNodeData ={
    variableName?:string;  
    credentialId?:string;  
    systemPrompt?:string;  
    userPrompt?:string;  // Changed from usePrompt to userPrompt
}   
type llamaNodeType = Node<llamaNodeData>;     
export const LlamaNode = memo((props:NodeProps<llamaNodeType>)=>{  
    const [dialogopen, setDialogOpen] = useState(false)
    const nodeData = props.data;   
    const [defaultData, setDefault] = useState<llmaFormValues | null>(null)
    const description = defaultData?.userPrompt?` Llama-3.2-3B: ${defaultData?.userPrompt.slice(0,50)}....`:"Not configured"    
    const handleOpenSettings =()=>setDialogOpen(true)          
    const {setNodes} = useReactFlow()   
      const params = useParams();     
        const workflowId = params.workflowId as string           
       const nodeStatus = useNodeStatus({
         nodeId:props.id, 
         channel:LLAMA_CHANNEL_NAME, 
         topic:"status",  
         refreshToken:fetchLlmaRealTimeToken
       }) 
       const key =`${workflowId}-${props.id}`
        const saveConfig = useNodeConfig()
    const handleSubmit =async(values:llmaFormValues)=>{ 
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
              setDefault(values) 
              await saveNodeConfigToIDB(key, values)
              setDialogOpen(false)
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
    return ( 
        <>  
        <LlamaDaialog open={dialogopen} onOpenChange={setDialogOpen} defaultValues={nodeData} onSubmit={handleSubmit}/>
        <BaseExecUtionNode   
          {...props}  
          id={props.id}   
          icon={'/meta-logo.webp'}   
          name="llama Request" 
          description={description}   
          onSetting={handleOpenSettings}  
          onDoubleClick={handleOpenSettings}  
          status={nodeStatus}
        /> 
        </>
    )
})   
LlamaNode.displayName ="llama"
