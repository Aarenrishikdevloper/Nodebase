import { prefetch, trpc } from "@/trpc/server";
import { inferInput } from "@trpc/tanstack-react-query";

type Input = inferInput<typeof trpc.executions.getMany>  
export const prefechExecutions = (params:Input)=>{
    return prefetch(trpc.executions.getMany.queryOptions(params))
}  
export const prefetchExecution =(id:string)=>{
    return prefetch(trpc.executions.getOne.queryOptions({id}))
}