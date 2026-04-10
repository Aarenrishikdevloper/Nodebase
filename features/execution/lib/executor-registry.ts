import { nodeTypeEnum } from "@/lib/db/schema";
import { QwenExecutor } from "../components/qwen/excecutor";
import { NodeExecutor } from "../type/type";
import { httpRequestExecutor } from "../components/http-request/executor";
import { manualTriggerExecutor } from "@/features/trigger/componets/manual-trigger/executor";
import { LlamaExecutor } from "../components/llama/executor";
import { DeepseekExecutor } from "../components/Deepseek/executor";
import { discordExecutor } from "../components/discord/executor";
import { SlackExecutor } from "../components/slack/execution";
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
  LLAMA: LlamaExecutor,
  ANTHROPIC: notImplementedExecutor,
  DISCORD: discordExecutor,
  SLACK: SlackExecutor, 
  DEEPSEEK:DeepseekExecutor,
};  
export const getExecutor =(type:NodeType):NodeExecutor=>{
    const executor = executorRegistry[type]
    if(!executor){
        throw new Error(`no executor  found for node type: ${type}`)
    } 
    return executor
}