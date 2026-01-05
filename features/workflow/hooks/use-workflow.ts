import { useTRPC } from "@/trpc/cleint";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useWorkflowParams } from "./use-workflow-params";
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
