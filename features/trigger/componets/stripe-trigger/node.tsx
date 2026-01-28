import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { BaseTriggerNode } from "../../base-trigger";

export const StripeTriggerNode = memo((props:NodeProps)=>{
    return(
        <> 
        <BaseTriggerNode   
           {...props}  
           icon={"/stripe.svg"}  
           name="Stripe" 
           description="When stripe event is captured"  
           
        />
        </>
    )
})