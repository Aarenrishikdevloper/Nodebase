'use client';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ErroView, LoadingView } from "@/components/ui/entity-view";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSuspenseWorkflow, useUpdateWorkflowName } from "@/features/workflow/hooks/use-workflow";
import { addEdge, applyEdgeChanges, applyNodeChanges, Background, Connection, Controls, Edge, EdgeChange, MiniMap, NodeChange, ReactFlow , type Node } from "@xyflow/react";
import { useSetAtom } from "jotai";
import { SaveIcon, Workflow } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";  
import '@xyflow/react/dist/style.css';

import { editorAtom } from "../store/atom";
import { nodeComponet } from "@/config/node-componets";
export const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {
    return <div className="ml-auto">
        <Button
            size={'sm'}

        >
            <SaveIcon className="size-4" />
            Save
        </Button>
    </div>
}

export const EditorHeader = ({ workflowId }: { workflowId: string }) => {
    return (
        <header className="flex h-14  shrink-0 items-center gap-2  border-b  px-4 bg-background">
            <SidebarTrigger />
            <div className="flex flex-row  items-center justify-between  gap-x-4 w-full">
                <EditorBreadCrumb workflowId={workflowId} />
                <EditorSaveButton workflowId={workflowId} />
            </div>
        </header>
    )
}
export const EditorBreadCrumb = ({ workflowId }: { workflowId: string }) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link prefetch href={'/workflows'}>
                            Workflows

                        </Link>

                    </BreadcrumbLink>
                </BreadcrumbItem>  
                <BreadcrumbSeparator/>  
                <EditorNameInput workflowId={workflowId}/>
            </BreadcrumbList>
        </Breadcrumb>
    )
}  
export const EditorNameInput =({workflowId}:{workflowId:string})=>{ 
    const {data:woekflow} = useSuspenseWorkflow(workflowId)    
    const [isEditing, setEditing] = useState(false)   
    const[name, setname] = useState(woekflow.name)    
    const inputref = useRef<HTMLInputElement>(null)   
    const updateWorkflow = useUpdateWorkflowName();
    useEffect(() => {
      if(woekflow.name){
         setname(woekflow.name)
      }
    
    }, [woekflow.name])  
    useEffect(() => {
       if(isEditing && inputref.current){
         inputref.current.focus();  
         inputref.current.select()
       }
    }, [isEditing])   
    const handleSave = async()=>{
        if(name === woekflow.name){
            setEditing(false); 
            return;
        } 
        try {
            await updateWorkflow.mutateAsync({
                id:workflowId,  
                name:name
            }) 
        } catch (error) {
           setname(name)
        }finally{
            setEditing(false)
        }
    }   
    const handleKeyDown = (e:React.KeyboardEvent)=>{
             if(e.key === "Enter"){
                handleSave()
             }else if(e.key === "Escape"){
                setname(woekflow.name) 
                setEditing(false)
             }
    }
    
    if(isEditing){
        return <Input   
           ref={inputref}    
           value={name}   
           onChange={(e)=>setname(e.target.value)}   
           className="h-7 auto min-w-[100px] px-2"   
           onBlur={handleSave}  
           onKeyDown={handleKeyDown}
        />
    }
    return(
        <BreadcrumbItem  
          className=" cursor-pointer hover:text-foreground transition-colors"   
          onClick={()=>setEditing(true)}
        > 
           {woekflow.name}
        </BreadcrumbItem>
    )
}      

export const EditorLoading =()=>{
    return <LoadingView message="Loading editor...."/>
}       
export const EditorError =()=>{
    return <ErroView message="Error loading editor"/>
}  

export const Editor = ({workflowId}:{workflowId:string})=>{   
    const {data:woekflow} = useSuspenseWorkflow(workflowId)    
    const[nodes, setnodes] = useState<Node[]>(woekflow.nodes)  
    const[edges, setedges] = useState<Edge[]>(woekflow.edges)
    const setEditor = useSetAtom(editorAtom)  
    const onNodeChange = useCallback((change:NodeChange[])=>setnodes((nodeSnapShot)=>applyNodeChanges(change, nodeSnapShot)),[])   
    const  onEdgeChange = useCallback((change:EdgeChange[])=>setedges((edgesSnapshot)=>applyEdgeChanges(change, edgesSnapshot)),[]) 
    const onConnect = useCallback((params:Connection)=>setedges((edgeSnapShot)=>addEdge(params, edgeSnapShot)),[])    
    return <div className="h-full w-full">     
       <ReactFlow     
          nodes={nodes}    
          edges={edges}     
          nodeTypes={nodeComponet}
          onNodesChange={onNodeChange}    
          onEdgesChange={onEdgeChange}   
          onConnect={onConnect}
          fitView 
          snapGrid={[10,10]}    
          snapToGrid 
          panOnScroll    
          panOnDrag={false}     
          selectionOnDrag   
          onInit={setEditor} 
          
       >
          <Background/>  
          <Controls/>    
          <MiniMap/>
          
       </ReactFlow>

    </div>
}