import { NodeToolbar, Position } from '@xyflow/react';
import React, { ReactNode } from 'react'
import { Button } from './ui/button';
import { SettingsIcon, TrashIcon } from 'lucide-react';
interface WorkflowProps {
    children:ReactNode,  
    showToolbar?:boolean, 
    onDelete?:()=>void;  
    onSettings?:()=>void;  
    name?:string,  
    description?:string
}
export const Workflownode = ({
   children, 
   showToolbar = true,  
   onDelete, 
   onSettings, 
   name, 
   description 

}:WorkflowProps) => {
  return (
    <> 
       {showToolbar && (
         <NodeToolbar>
            <Button size={'sm'} variant={'ghost'}>
                <SettingsIcon className='size-4'/>  

            </Button>  
            <Button size={'sm'} variant={'ghost'}>
                <TrashIcon className='size-4'/>
            </Button>
         </NodeToolbar>
       )} 
       {children}  
       {name && (
          <NodeToolbar position= {Position.Bottom} isVisible className='max-w-[200px] text-center'>     
           <p>{name}</p>   
           {description && (
             <p className='text-muted-foreground  truncate text-sm'>  
                {description}

             </p>
           )}
           

          </NodeToolbar>
       )}
    </>
  )
}
