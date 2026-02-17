'use client'

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecUtionNode } from "../base-execution-node";
import  { anthropciFormValues } from "./dialog";
import GeminiDialog from "./dialog";

type AntthropicNodeData ={
    variableName?:string;  
    credentialId?:string;  
    systemPrompt?:string;  
    usePrompt?:string;
}   
type AnthropicNodeType = Node<AntthropicNodeData>;     
export const GeminiNode = memo((props:NodeProps<AnthropicNodeType>)=>{  
    const [dialogopen, setDialogOpen] = useState(false)
    const nodeData = props.data; 
    const description = nodeData.usePrompt?`gemini-2.0-flash: ${nodeData.usePrompt.slice(0,50)}....`:"Not configured"    
    const handleOpenSettings =()=>setDialogOpen(true)   
    const {setNodes} = useReactFlow()
    const handleSubmit =(value:anthropciFormValues)=>{  
          setNodes((nodes)=>{
            nodes.map((node)=>{
                return{
                    ...node, 
                    data:{
                        ...node.data,  
                        ...value
                    }
                } 
            
            }) 
            return nodes
        })  
        setDialogOpen(false)
    }
    return ( 
        <>  
        <GeminiDialog open={dialogopen} onOpenChange={setDialogOpen} defaultValues={nodeData} onSubmit={handleSubmit}/>
        <BaseExecUtionNode   
          {...props}  
          id={props.id}   
          icon={'/gemini.svg'}   
          name="Deepseek Request" 
          description={description}   
          onSetting={handleOpenSettings}  
          onDoubleClick={handleOpenSettings}
        /> 
        </>
    )
})   
GeminiNode.displayName ="Gemini"
