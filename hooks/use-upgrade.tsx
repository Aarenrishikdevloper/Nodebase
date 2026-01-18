import { UpGradeModel } from "@/components/UpGradeModel";
import { TRPCClientError } from "@trpc/client";
import { useState } from "react"

export const useUpgrade = ()=>{
    const[open, setopen] = useState(false); 
     const handleError =(error:unknown)=>{
        if(error instanceof TRPCClientError){
            if(error.data?.code == "FORBIDDEN"){
                setopen(true); 
                return true
            }
        } 
        return
     }
    const model = <UpGradeModel open={open} onOpenChange={setopen}/> 
    return{handleError, model}
}