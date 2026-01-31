import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { ManualTriggerDialog } from "./dialog";
import { BaseTriggerNode } from "../../base-trigger";
import { MousePointerIcon } from "lucide-react";

export const ManualTriggerNode = memo((props:NodeProps)=>{ 
    const [dialogopen, setdialogOpen] = useState(false) 
     const handleOpenSetting =()=>setdialogOpen(true)
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
       />
      </>
    )
})