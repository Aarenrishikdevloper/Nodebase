import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { authClient } from '@/lib/auth-client';

interface UpgraseModelTypes{
    open:boolean;  
    onOpenChange:(open:boolean)=>void
}
export const UpGradeModel = ({open,onOpenChange}:UpgraseModelTypes) => {
  return (
     <AlertDialog open={open} onOpenChange={onOpenChange}>   
       <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Upgrade to pro</AlertDialogTitle>     
          <AlertDialogDescription>
            You need an active  Subscription  to perform this action
          </AlertDialogDescription>
        </AlertDialogHeader> 
        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel> 
          <AlertDialogAction onClick={()=>authClient.checkout({slug:"Pro"})}>
                      Upgrade Now
          </AlertDialogAction>
        </AlertDialogFooter>
       </AlertDialogContent>

     </AlertDialog>
  )
}
