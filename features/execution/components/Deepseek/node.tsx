'use client'

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";
import { BaseExecUtionNode } from "../base-execution-node";
import DeepSeekDaialog, { anthropciFormValues } from "./dialog";
import { useParams } from "next/navigation";
import { useNodeStatus } from "../../hooks/use-node";
import { DEEPSEEK_CHANNEL_NAME } from "@/inngest/channel/deepseek";
import { fetchDeepSeekRealTimeToken } from "./action";
import { useGetNodeConfig, useNodeConfig } from "@/features/workflow/hooks/use-workflow";
import { getNodeConfigFromIDB, saveNodeConfigToIDB } from "@/lib/utils";

type AntthropicNodeData = {
    variableName?: string;
    credentialId?: string;
    systemPrompt?: string;
    userPrompt?: string;
}
type AnthropicNodeType = Node<AntthropicNodeData>;
export const DeepSeekNode = memo((props: NodeProps<AnthropicNodeType>) => {
    const [dialogopen, setDialogOpen] = useState(false)
    const nodeData = props.data;
   
    const handleOpenSettings = () => setDialogOpen(true)
    const { setNodes } = useReactFlow()
    const params = useParams();

    const workflowId = params.workflowId as string
    const saveConfig = useNodeConfig()

    const [defauilt, setDefault] = useState<anthropciFormValues | null>(null)

    const handleSubmit = async (values: anthropciFormValues) => {
      
        const key = `${workflowId}-${props.id}`;
          // Update local state in React Flow  
        setNodes((nodes) => nodes.map((node) => {
            if (node.id === props.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        ...values
                    }
                }
            }
            return node;
        }))

        // Persist to backend
        saveConfig.mutate({
            workflowId,
            nodeId: props.id,
            config: values

        })
        setDefault(values)
        await saveNodeConfigToIDB(key, values);
        setDialogOpen(false)



    }
    useEffect(() => {

        const loadfromcace = async () => {
            const key = `${workflowId}-${props.id}`
            const cached = await getNodeConfigFromIDB(key)
            if (cached) {
                setDefault((prev) => ({
                    ...prev,
                    ...cached
                }))
            }
        }
        loadfromcace()


    }, [workflowId, props.id])
     const description = defauilt?.userPrompt ? `DeepSeek-R1-0528: ${defauilt?.userPrompt.slice(0, 50)}....` : "Not configured"
  
    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: DEEPSEEK_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchDeepSeekRealTimeToken,
    })




    return (
        <>
            <DeepSeekDaialog open={dialogopen} onOpenChange={setDialogOpen} defaultValues={defauilt as Partial<anthropciFormValues>} onSubmit={handleSubmit} />
            <BaseExecUtionNode
                {...props}
                id={props.id}
                icon={'/deepseek.svg'}
                name="Deepseek Request"
                description={description}
                onSetting={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
                status={nodeStatus}
            />
        </>
    )
})
DeepSeekNode.displayName = "Deepseek"
