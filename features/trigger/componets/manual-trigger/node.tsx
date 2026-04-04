import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { ManualTriggerDialog } from "./dialog";
import { BaseTriggerNode } from "../../base-trigger";
import { MousePointerIcon } from "lucide-react";
import { useNodeStatus } from "@/features/execution/hooks/use-node";
import { MANUAL_TRIGGER_CHANNEL } from "@/inngest/channel/manual-trigger";
import { fetchManualTrigger } from "./action";

export const ManualTriggerNode = memo((props:NodeProps)=>{ 
    const [dialogopen, setdialogOpen] = useState(false) 
     const handleOpenSetting =()=>setdialogOpen(true)   
        const nodeStatus = useNodeStatus({
                         nodeId:props.id,  
                         channel:MANUAL_TRIGGER_CHANNEL,   
                         topic:"status", 
                         refreshToken:fetchManualTrigger
                     })
    return(
      <>   
       <ManualTriggerDialog open={dialogopen} onOpenChange={setdialogOpen}/>      
       <BaseTriggerNode 
         {...props}   
         icon={MousePointerIcon}     
         name="Manual Trigger"
         description="when clicking execute workflow "   
         onSettings={handleOpenSetting} 
         onDoubleClick={handleOpenSetting}  
         status={nodeStatus}
       />
      </>
    )
})