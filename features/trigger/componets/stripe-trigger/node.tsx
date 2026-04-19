import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../../base-trigger";
import { StripeTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/execution/hooks/use-node";
import { STRIPE_CHANNEL_NAME } from "@/inngest/channel/stripe";
import { fetchStripeTriggerRealtimeToken } from "./action";

export const StripeTriggerNode = memo((props:NodeProps)=>{  
    const [open, setopen] = useState(false); 
    const handleOpenSettings=()=>setopen(true)   
       const nodeStatus =useNodeStatus({
              nodeId:props.id, 
              channel:STRIPE_CHANNEL_NAME, 
              topic:"status", 
              refreshToken:fetchStripeTriggerRealtimeToken,
            })
    return(
        <> 
        <StripeTriggerDialog
           open={open}  
           onOpenChange={setopen}
        
        />
        <BaseTriggerNode   
           {...props}  
           icon={"/stripe.svg"}  
           name="Stripe" 
           description="When stripe event is captured"  
           onDoubleClick={handleOpenSettings}   
           onSettings={handleOpenSettings} 
           status={nodeStatus}
        />
        </>
    )
})