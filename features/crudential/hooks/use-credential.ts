import { useTRPC } from "@/trpc/cleint";
import { useMutation, useQuery, useQueryClient, useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query"
import toast from "react-hot-toast";
import { useCredentialsParams } from "./use-credentials-params";
import { CredentialsType } from "@/type/type";

export const useCreateCredential =()=>{   
    const queryClient = useQueryClient(); 
    const trpc = useTRPC(); 
    return useMutation(
        trpc.credential.create.mutationOptions({
            onSuccess:(data)=>{
                toast.success("Credentials Created Sucessfully"); 
                //todo invalidation  
                 queryClient.invalidateQueries(trpc.credential.getMany.queryOptions({}))
            }, 
            onError:()=>{
                toast.error("Failed to create  credentials")
            }
        })
    )
}   
export const useSuspenseCredentials = ()=>{
    const trpc =useTRPC(); 
    const [params] =useCredentialsParams()   
    return useSuspenseQuery(trpc.credential.getMany.queryOptions(params))
}   
export const useRemoveCredentials = ()=>{
    const trpc = useTRPC()  
    const queryClient = useQueryClient()  
    return useMutation(
        trpc.credential.remove.mutationOptions({
            onSuccess:(data)=>{
                toast.success("Credential remove Sucessfully"); 
                queryClient.invalidateQueries(trpc.credential.getMany.queryOptions({}))
            },   
            onError:(error)=>{ 
                console.log(error)
                toast.error("Something Went Wrong")
            }
        })
    )  
   
} 
 export const useSuspenseCredential = (id:string)=>{    
    const trpc = useTRPC()
    return useSuspenseQuery(trpc.credential.getOne.queryOptions({id}))
        
} 
export const useUpdateCredentials =()=>{
    const queryClient = useQueryClient()  
    const trpc = useTRPC()  
    return useMutation(
        trpc.credential.update.mutationOptions({
            onSuccess:(data)=>{
                toast.success("Credentials Saved Sucessfully"), 
                queryClient.invalidateQueries(trpc.credential.getMany.queryOptions({}))  
            },  
            onError:(error)=>{
                console.log(error) 
                toast.error("Something Went Wrong")
            }
        })
    )
}   
 export const useCredentialsByType = (type:CredentialsType)=>{
    const trpc = useTRPC(); 
    return useQuery(trpc.credential.getByType.queryOptions({type}))
 }