'usec lient'
import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import React, { useState } from "react";
import { memo } from "react";
import { BaseExecUtionNode } from "../base-execution-node";
import { GlobeIcon } from "lucide-react";
import HttpRequestDaialog, { anthropciFormValues } from "./dialog";

type HttpRequestNodeData ={
   variableName?:string;  
   endpoint?:string;  
   method?:"GET" |"POST" | "PUT"  | "PATCH" | "DELETE"  ,  
   body?:string
}   
type HTTPRequestNodeType = Node<HttpRequestNodeData>   
export const HttpRequestNode = memo((props:NodeProps<HTTPRequestNodeType>)=>{   
    const nodedata  = props.data 
     const {setNodes} = useReactFlow()
    const description = nodedata?.endpoint ? `${nodedata.method || "GET"}:${nodedata.endpoint}`:"Not Configured"
     const [open, setopen] = useState(false)  
      const handleOpenSettings =()=>setopen(true)  
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
                setopen(false)
            }
    return (
        <React.Fragment>  
            <HttpRequestDaialog onOpenChange={setopen} open={open} defaultValues={nodedata} onSubmit={handleSubmit}/>
            <BaseExecUtionNode     
             {...props}  
             icon={GlobeIcon}   
             name="HTTP Request"   
             description={description}  
             onDoubleClick={handleOpenSettings} 
             onSetting={handleOpenSettings}

            />
        </React.Fragment>
    )
})  
