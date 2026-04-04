import type {GetStepTools,Inngest} from "inngest"
import type { Realtime } from "@inngest/realtime";
export type WorkFlowContext = Record<string,unknown>   
export type StepToools = GetStepTools<Inngest.Any>  
export interface NodeExecuteParam<IData=Record<string,unknown>>{
    data:IData;  
    nodeId:string;  
    userId:string; 
    context:WorkFlowContext; 
    step:StepToools; 
    publish:Realtime.PublishFn
} 
export type NodeExecutor<IData=Record<string,unknown>>=(
    params:NodeExecuteParam<IData>  

)=>Promise<WorkFlowContext>