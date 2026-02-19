'use client';
import { Node, NodeProps, useReactFlow } from '@xyflow/react';
import React, { memo, useState } from 'react'
import { BaseExecUtionNode } from '../base-execution-node';
import SlackDaialog from './dialog';

type SlackNodeData ={
    webhookUrl?:string,  
    content?:string, 
    username?:string
}  
type SlackNodeType = Node<SlackNodeData>    
export const SlackNode = memo((props:NodeProps<SlackNodeType>)=>{  
    const nodedata = props.data 
    const description = nodedata?.content ?`Send: ${nodedata.content.slice(0,50)}....`:"Not Configured"  
    const [open, setopen] = useState(false) 
        const {setNodes} = useReactFlow()
       
        const handleOpenSettings =()=>setopen(true)  
         const handleSubmit =(value:any)=>{ 
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
                setopen(false)
            }
    return(  
        <React.Fragment>  
            <SlackDaialog open={open} onOpenChange={setopen} onSubmit={handleSubmit}/>
        <BaseExecUtionNode    
        {...props}  
        id={props.id}  
        icon={'/slack.svg'}   
        description={description}        
        onDoubleClick={handleOpenSettings}  
        onSetting={handleOpenSettings} 
        name='SLACK Request'
        
        />  
        </React.Fragment>
    )
})