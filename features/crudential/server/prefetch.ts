import { prefetch, trpc } from "@/trpc/server";
import { inferInput } from "@trpc/tanstack-react-query";

type input  = inferInput<typeof  trpc.credential.getMany>    
export const prefetchCredentials = (param:input)=>{
    return prefetch(trpc.credential.getMany.queryOptions(param))
} 
export const prefetchCredential =(id:string)=>{
    return prefetch(trpc.credential.getOne.queryOptions({id}))
}