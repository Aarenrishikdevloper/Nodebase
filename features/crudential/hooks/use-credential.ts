import { useTRPC } from "@/trpc/cleint";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";

export const useCreateCredential =()=>{
    const queryClient = useQueryClient(); 
    const trpc = useTRPC(); 
    return useMutation(
        trpc.credential.create.mutationOptions({
            onSuccess:(data)=>{
                toast.success("Credentials Created Sucessfully"); 
                //todo invalidation
            }, 
            onError:()=>{
                toast.error("Failed to create  credentials")
            }
        })
    )
}