"use client";
import { EmptyView, EntityContainer, EntityHeaders, EntityItem, EntityList, EntityPagination, EntitySearch, LoadingView } from "@/components/ui/entity-view";
import React from "react";
import { useCreateWorkFlow, useRemoveWorkflow, useSuspenseWorkflows } from "../hooks/use-workflow";
import { useRouter } from "next/navigation";
import { InferSelectModel } from "drizzle-orm";
import { workflows } from "@/lib/db/schema";
import  {formatDistanceToNow} from 'date-fns'
import { WorkflowIcon } from "lucide-react";
import { useWorkflowParams } from "../hooks/use-workflow-params";
import { useEntitySearch } from "../hooks/use-search";
//--- Workflow Container -----
export const WorkFlowContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer header={<WorkflowHeader /> } search={<WorkflowSearch/>} pagination={<WorkflowPagination/>}>{children}</EntityContainer>
  );
};
//WorkflowHeader
export const WorkflowHeader = ({ disabled }: { disabled?: boolean }) => {
  const createWorkflow = useCreateWorkFlow();
  const router = useRouter();
  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflow/${data.id}`);
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };
  return (
    <>
      <EntityHeaders
        title="Workflows"
        description="Create and mange your WorkSpaces"
        newButtonLabel="New Workflow"
        disabled={disabled}
        isCreating={createWorkflow.isPending}
        onNew={handleCreate}
      />
    </>
  );
};  
type woekflow = InferSelectModel<typeof workflows>      
export const WorkflowItem =({data}:{data:woekflow})=>{   
  const removeWorkflow = useRemoveWorkflow(); 
  const handleRemove =()=>{
    removeWorkflow.mutate({id:data.id})
  }
return  <EntityItem   
     href={`/workflow/${data.id}`}   
     title={data.name}   
     subtitle={
       <> 
         Updated {formatDistanceToNow(data.updatedAt,{addSuffix:true})} {" "}  
         &bull; Created {' '}     
         {formatDistanceToNow(data.createdAt,{addSuffix:true})}
       </>
     }  
     image={
       <div className="size-8 flex items-center justify-center">
        <WorkflowIcon className="size-5 text-muted-foreground"/>
       </div>
     }  
     onRemove={handleRemove} 
     isRemoving={removeWorkflow.isPending}
  />
}   
export const WorkFlowEmpty =()=>{  
     const createWorkflow = useCreateWorkFlow();
  const router = useRouter();
  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflow/${data.id}`);
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };
   return(
     <> 
       <EmptyView onNew={handleCreate} message="You haven't created any workflows yet. Get started by creating your first workflow"/>
     </>
   )
}
export const WorkflowList =()=>{
   const workflows = useSuspenseWorkflows();  
   return <EntityList   
      items={workflows.data.items}    
      getKey={(workflow)=>workflow.id}   
      renderItem={(workflow)=><WorkflowItem data={workflow}/>}   
      emptyView={<WorkFlowEmpty/>}
   />
}  
export const WorkflowLoader =()=>{
  return <LoadingView message="Loading Workflows...."/>
}   

export const WorkflowSearch =()=>{
  const [params, setParams] = useWorkflowParams()      
  const {searchValue, onSearchChange} = useEntitySearch({
    params, 
    setParams
  })  
  console.log(searchValue)   
  console.log(params)

  return <EntitySearch   
     placeholder="Search Workflows"   
     value={searchValue}  
     onChange={onSearchChange}
  />
}
export const WorkflowPagination =()=>{
   const workflows = useSuspenseWorkflows();  
   const [params, setParams] = useWorkflowParams()
  return (
    <EntityPagination   
       disabled={!workflows.isFetched}   
       totalpage={workflows.data.totalPages}   
       page={workflows.data.page || 1}   
       onPageChange={(page)=>setParams({...params, page})}
    />
  )
}