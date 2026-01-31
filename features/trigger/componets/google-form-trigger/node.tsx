import React, { memo, useState } from 'react'
import { BaseTriggerNode } from '../../base-trigger'
import { NodeProps } from '@xyflow/react'
import { GoogleFormDialog } from './dialog'

export const GoogleFormTrigger = memo((props:NodeProps)=>{
     const [open, setopen] = useState(false); 
        const handleOpenSettings=()=>setopen(true)
     return(
        <>     
        <GoogleFormDialog open={open} onOpenChange={setopen}/>
        <BaseTriggerNode   
        {...props}   
        icon={'/googleform.svg'}  
        name='Google Form'   
        description='When Google form is submitted'   
        onDoubleClick={handleOpenSettings}  
        onSettings={handleOpenSettings}
        />
        </>
     )
})