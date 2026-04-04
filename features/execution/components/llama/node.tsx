'use client'

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecUtionNode } from "../base-execution-node";
import  { anthropciFormValues } from "./dialog";
import OepnAIDaialog from "./dialog";

type  llamaNodeData ={
    variableName?:string;  
    credentialId?:string;  
    systemPrompt?:string;  
    usePrompt?:string;
}   
type llamaNodeType = Node<llamaNodeData>;     
export const LlamaNode = memo((props:NodeProps<llamaNodeType>)=>{  
    const [dialogopen, setDialogOpen] = useState(false)
    const nodeData = props.data; 
    const description = nodeData.usePrompt?` Llama-3.2-3B: ${nodeData.usePrompt.slice(0,50)}....`:"Not configured"    
    const handleOpenSettings =()=>setDialogOpen(true)    
    const {setNodes} = useReactFlow()
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
              setDialogOpen(false)
          }
    return ( 
        <>  
        <OepnAIDaialog open={dialogopen} onOpenChange={setDialogOpen} defaultValues={nodeData} onSubmit={handleSubmit}/>
        <BaseExecUtionNode   
          {...props}  
          id={props.id}   
          icon={'/meta-logo.webp'}   
          name="Llama Request" 
          description={description}   
          onSetting={handleOpenSettings}  
          onDoubleClick={handleOpenSettings}
        /> 
        </>
    )
})   
LlamaNode.displayName ="llama"
