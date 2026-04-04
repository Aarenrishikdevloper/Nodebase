import { nodeTypeEnum } from "@/lib/db/schema";
import { QwenExecutor } from "../components/qwen/excecutor";
import { NodeExecutor } from "../type/type";
import { httpRequestExecutor } from "../components/http-request/executor";
import { manualTriggerExecutor } from "@/features/trigger/componets/manual-trigger/executor";
const notImplementedExecutor: NodeExecutor = async () => {
  throw new Error("Executor not implemented");
};
export type NodeType = typeof nodeTypeEnum.enumValues[number]   
export const executorRegistry: Record<NodeType, NodeExecutor> = {
  MANUAL_TRIGGER: manualTriggerExecutor,
  INITIAL: notImplementedExecutor,
  HTTP_REQUEST: httpRequestExecutor,
  GOOGLE_FORM_TRIGGER: notImplementedExecutor,
  STRIPE_TRIGGER: notImplementedExecutor,
  QWEN:QwenExecutor as NodeExecutor,     // ✅ only real one
  LLAMA: notImplementedExecutor,
  ANTHROPIC: notImplementedExecutor,
  DISCORD: notImplementedExecutor,
  SLACK: notImplementedExecutor, 
  DEEPSEEK:notImplementedExecutor,
};  
export const getExecutor =(type:NodeType):NodeExecutor=>{
    const executor = executorRegistry[type]
    if(!executor){
        throw new Error(`no executor  found for node type: ${type}`)
    } 
    return executor
}