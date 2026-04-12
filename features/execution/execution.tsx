'use client';
import { EmptyView, EntityContainer, EntityHeaders, EntityItem, EntityList, ErroView, LoadingView } from "@/components/ui/entity-view";
import { executionStatusEnum } from "@/lib/db/schema";
import { formatDistanceToNow } from "date-fns";

import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react";
import { ReactNode } from "react";
import { useSuspenseExecutions } from "./hooks/use-execution";
type ExecutionItemType = {
  id: string;
  startedAt: Date;
  status: "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";
  completedAt: Date | null;
  workflow: { id: string; name: string };
}
 
export const ExecutionHeader =({disabled}:{disabled?:boolean})=>{
    return (
        <> 
          <EntityHeaders     
            nobutton={true}
            title="Executions" 
            description="View your workflow  execution history"
          />
        </>
    )
}   
export const ExecutionContainer =({children}:{children:ReactNode})=>{
    return(
        <EntityContainer header={<ExecutionHeader/>} >
            {children}
        </EntityContainer>
    )
}   

type ExecutionStatustype = (typeof  executionStatusEnum.enumValues[number] )   
const formatStatus =(status:ExecutionStatustype)=>{
    return status.charAt(0) + status.slice(1).toLowerCase()
}
const getStatusIcon = (status: ExecutionStatustype) =>
  ({
    RUNNING:   <Loader2Icon className="size-5 text-blue-600 animate-spin" />,
    COMPLETED: <CheckCircle2Icon className="size-5 text-green-600" />,
    FAILED:    <XCircleIcon className="size-5 text-red-600" />,
    CANCELLED: <ClockIcon className="size-5 text-muted-foreground" />,
  } as Record<ExecutionStatustype, React.ReactElement>)[status]; 
  
export const ExecutionsItem =({data}:{data:ExecutionItemType})=>{    
    const duration = data.completedAt ? Math.round(new Date(data.completedAt).getTime() - new Date(data.startedAt).getTime()) / 1000 : null
    const subtitle =(
        <>  
           {data.workflow.name} &bull;  Started {" "}     
           {formatDistanceToNow(data.startedAt,{addSuffix:true})} 
           {duration !== null && <> &bull;  Took {duration} sec </>}
        </>
    )
    return(
        <EntityItem   
           href={`/executions/${data.id}`}   
           title={formatStatus(data.status)}   
           subtitle={subtitle}    
           image={
            <div className="size-9 flex items-center justify-center">   
               {getStatusIcon(data.status)}

            </div>
           }

        />
    )

} 
export const ExecutionError =()=>{
   return <ErroView message="Error Loading Credentials...."/>  

}   
export const ExecutionLoader =()=>{
  return <LoadingView message="Loading Credentials...."/>
}      
export const ExecutionsEmpty =()=>{
    return <EmptyView message="You haven't created any ecvution yet. Get started by runing  your  first workflow"/>
}
export const ExecutionList =()=>{ 
    const excutions = useSuspenseExecutions()
    return(
        <EntityList  
            items={excutions.data.items}        
            getKey={(execution)=>execution.id}    
            renderItem={(execution)=><ExecutionsItem data={execution}/>}   
            emptyView={<ExecutionsEmpty/>}
        />
    )
}