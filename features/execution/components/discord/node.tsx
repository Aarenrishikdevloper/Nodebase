'use client';
import { NodeType } from "@/type/type"
import { Node, NodeProps, useReactFlow } from "@xyflow/react"
import { memo, useEffect, useState } from "react"
import { BaseExecUtionNode } from "../base-execution-node"
import DisCordDaialog, { discordFormType } from "./dialog"
import { useNodeConfig } from "@/features/workflow/hooks/use-workflow"
import { useParams } from "next/navigation"
import { getNodeConfigFromIDB, saveNodeConfigToIDB } from "@/lib/utils"
import { useNodeStatus } from "../../hooks/use-node";
import { DISCORD_CHANNEL_NAME } from "@/inngest/channel/discord";
import { fetchDiscordRealtimeToken } from "./action";

type DiscordNodeData = {
    webhookUrl?: string,
    content?: string,
    username?: string
}
type DiscoedNodeType = Node<DiscordNodeData>
export const DiscordNode = memo((props: NodeProps<DiscoedNodeType>) => {
    const [open, setopen] = useState(false)
    const { setNodes } = useReactFlow() 
    const params = useParams()
    const workflowId = params.workflowId as string
    const saveConfig = useNodeConfig()
    const key = `${workflowId}-${props.id}`
    const [defauilt, setDefault] = useState<discordFormType | null>(null)
    const nodeData = props.data
    
    console.log(nodeData.content)
    const description = defauilt?.content ? `Send: ${defauilt.content.slice(0, 50)}...` : "Not configured"
    const handleOpenSettings = () => setopen(true)     
    const nodeStatus = useNodeStatus({
            nodeId: props.id,
            channel: DISCORD_CHANNEL_NAME,
            topic: "status",
            refreshToken:fetchDiscordRealtimeToken,
        })
    const handleSubmit = async(values: discordFormType) => {
        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === props.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            ...values
                        }
                    }
                }
                return node
            })

        ) 
        saveConfig.mutate({
            workflowId:workflowId, 
            nodeId:props.id,  
            config:values
        }) 
        await saveNodeConfigToIDB(key, values)  
        setDefault(values)
        setopen(false)
    } 
     useEffect(() => {
    
            const loadfromcace = async () => {
                //const key = `${workflowId}-${props.id}`
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
    return (
        <>
            <DisCordDaialog open={open} onOpenChange={setopen} onSubmit={handleSubmit} defaultValues={defauilt!}/>
            <BaseExecUtionNode
                {...props}
                name="Discord Request"
                icon={"/discord.svg"}
                description={description}
                onSetting={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
                status={nodeStatus}


            />
        </>
    )
})
DiscordNode.displayName = "DiscordNode"