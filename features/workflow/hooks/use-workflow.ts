import { useTRPC } from "@/trpc/cleint";
import { useMutation, useQueryClient, useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useWorkflowParams } from "./use-workflow-params";
import { error } from "console";
export const useSuspenseWorkflows = () => {
  const trpc = useTRPC();
  const [params] = useWorkflowParams();
  return useSuspenseQuery(trpc.workflow.getMany.queryOptions(params));
};
export const useCreateWorkFlow = () => {
  const trpc = useTRPC(); 
    const queryClient = useQueryClient();  
  return useMutation(
    trpc.workflow.create.mutationOptions({
      onSuccess: (data) => {
        toast.success("Workflow Creation Sucessfully");   
         queryClient.invalidateQueries(trpc.workflow.getMany.queryOptions({}))   
      },
      onError: (error) => {
        console.log(error.message);
        toast.error("Something Went Wrong");
      },
    }),
  );
};  
export const useRemoveWorkflow =()=>{
  const trpc = useTRPC();  
  const queryClient = useQueryClient();  
  return useMutation(
    trpc.workflow.remove.mutationOptions({
      onSuccess:(data)=>{
        toast.success(`Workflow deleted Sucessfully `);  
        queryClient.invalidateQueries(trpc.workflow.getMany.queryOptions({}))    
        
      },   
        onError: (error) => {
        console.log(error.message);
        toast.error("Something Went Wrong");
      },

    })
  ) 
}
export const useSuspenseWorkflow =(id:string)=>{
  const trpc = useTRPC()    
   return  useSuspenseQuery(trpc.workflow.getone.queryOptions({id}))
}   
export const useUpdateWorkflowName =()=>{
   const queryClient = useQueryClient();  
   const trpc = useTRPC();  
   return useMutation(
     trpc.workflow.updateName.mutationOptions({
      onSuccess:(data)=>{
         toast.success("Workflow name Updated Sucessfully");  
         queryClient.invalidateQueries(trpc.workflow.getMany.queryOptions({}));  
         queryClient.invalidateQueries(trpc.workflow.getone.queryOptions({id:data.id}))
      },  
      onError:(error)=>{  
        console.log(error);
         toast.error("Failed to update workflow")
      }
     })
   )
}  
export const useUpdateWorkflow =()=>{
  const  queryClient  = useQueryClient() 
  const trpc = useTRPC() 
  return useMutation(
    trpc.workflow.update.mutationOptions({
      onSuccess:(data)=>{
        toast.success(`Workflow data  Saved Sucessfully`); 
        queryClient.invalidateQueries(trpc.workflow.getMany.queryOptions({})); 
        queryClient.invalidateQueries(trpc.workflow.getone.queryOptions({id:data.id}))
      }, 
      onError:(error)=>{ 
        console.log(error);
        toast.success("Failed to save Workflow data")
      }
    })
  )
}