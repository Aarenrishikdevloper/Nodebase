'use client'

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecUtionNode } from "../base-execution-node";
import DeepSeekDaialog, { anthropciFormValues } from "./dialog";

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
        <DeepSeekDaialog open={dialogopen} onOpenChange={setDialogOpen} defaultValues={nodeData} onSubmit={handleSubmit}/>
        <BaseExecUtionNode   
          {...props}  
          id={props.id}   
          icon={'/deepseek.svg'}   
          name="Deepseek Request" 
          description={description}   
          onSetting={handleOpenSettings}  
          onDoubleClick={handleOpenSettings}
        /> 
        </>
    )
})   
DeepSeekNode.displayName ="Deepseek"
