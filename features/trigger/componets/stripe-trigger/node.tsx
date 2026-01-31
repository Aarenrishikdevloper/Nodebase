import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../../base-trigger";
import { StripeTriggerDialog } from "./dialog";

export const StripeTriggerNode = memo((props:NodeProps)=>{  
    const [open, setopen] = useState(false); 
    const handleOpenSettings=()=>setopen(true)
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
        />
        </>
    )
})