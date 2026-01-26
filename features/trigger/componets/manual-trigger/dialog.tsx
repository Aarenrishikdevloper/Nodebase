import { Dialog,DialogContent, DialogHeader } from '@/components/ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';

import React from 'react'
interface Props {
    open:boolean;  
    onOpenChange:(open:boolean)=>void
}
export const ManualTriggerDialog = ({
  open, 
  onOpenChange
}:Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
        <DialogContent>
             <DialogHeader>
                <DialogHeader>
                    MannualTrigger
                </DialogHeader>  
                <DialogDescription>
                    Configure  Settings for the normal trigger node
                </DialogDescription>
             </DialogHeader>  
             <div className="py-4">
              <p className='text-sm text-muted-foreground'>
                       Used to manually execute a workflow, no Configuration avalaible.
              </p>
             </div>
        </DialogContent>
    </Dialog>
  )
}
