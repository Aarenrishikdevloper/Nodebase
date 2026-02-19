import { NodeType } from "@/type/type"
import { Node, NodeProps, useReactFlow } from "@xyflow/react"
import { memo, useState } from "react"
import { BaseExecUtionNode } from "../base-execution-node"
import DisCordDaialog, { anthropciFormValues } from "./dialog"

type DiscordNodeData ={
    webhookUrl?:string,  
    content?:string,  
    username?:string
}    
type DiscoedNodeType = Node<DiscordNodeData>      
export const DiscordNode = memo((props:NodeProps<DiscoedNodeType>)=>{  
    const [open, setopen] = useState(false) 
    const {setNodes} = useReactFlow()
    const nodeData = props.data    
    console.log(nodeData.content)
    const description = nodeData?.content ? `Send: ${nodeData.content.slice(0,50)}...`:"Not configured"       
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
    return(
        <>    
        <DisCordDaialog open={open} onOpenChange={setopen}  onSubmit={handleSubmit}/>
          <BaseExecUtionNode    
             {...props}     
             name="Discord Request"    
             icon={"/discord.svg"}   
             description={description}     
             onSetting={handleOpenSettings}   
             onDoubleClick={handleOpenSettings}   
             
             
          />
        </>
    )
})
DiscordNode.displayName = "DiscordNode"