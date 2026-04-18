import React, { memo, useState } from 'react'
import { BaseTriggerNode } from '../../base-trigger'
import { NodeProps } from '@xyflow/react'
import { GoogleFormDialog } from './dialog'
import { useNodeStatus } from '@/features/execution/hooks/use-node'
import { GOOGLE_TRIGGER_CHANNEL_NAME } from '@/inngest/channel/googleform'
import { fetchGoogleTriggerRealTimeToken } from './action'

export const GoogleFormTrigger = memo((props:NodeProps)=>{
     const [open, setopen] = useState(false); 
        const handleOpenSettings=()=>setopen(true)   
        const nodeStatus =useNodeStatus({
          nodeId:props.id, 
          channel:GOOGLE_TRIGGER_CHANNEL_NAME, 
          topic:"status", 
          refreshToken:fetchGoogleTriggerRealTimeToken,
        })
     return(
        <>     
        <GoogleFormDialog open={open} onOpenChange={setopen}/>
        <BaseTriggerNode   
        {...props}   
        icon={'/googleform.svg'}  
        name='Google Form'  
        status={nodeStatus}
        description='When Google form is submitted'   
        onDoubleClick={handleOpenSettings}  
        onSettings={handleOpenSettings}
        />
        </>
     )
})