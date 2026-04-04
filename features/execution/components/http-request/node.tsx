'use client'
import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import React, { useState } from "react";
import { memo, useCallback, useEffect } from "react";
import { BaseExecUtionNode } from "../base-execution-node";
import { GlobeIcon } from "lucide-react";
import HttpRequestDaialog, { anthropciFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node";
import { HTTP_REQUEST_CHANNEL_NAME } from "@/inngest/channel/httprequest";
import { fetchHttpRequestRealTime } from "./action";
import { useAtomValue } from "jotai";
import { editorAtom } from "@/features/editor/store/atom";
import { useNodeConfig, useUpdateWorkflow } from "@/features/workflow/hooks/use-workflow";
import { useParams } from "next/navigation";

type HttpRequestNodeData = {
    variableName?: string;
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    body?: string
}
type HTTPRequestNodeType = Node<HttpRequestNodeData>
export const HttpRequestNode = memo((props: NodeProps<HTTPRequestNodeType>) => {
    const nodedata = props.data
    const { setNodes, getNodes, getEdges } = useReactFlow()
    const editor = useAtomValue(editorAtom)
    const description = nodedata?.endpoint ? `${nodedata.method || "GET"}:${nodedata.endpoint}` : "Not Configured"
    const [open, setopen] = useState(false)
    const params = useParams();
    const workflowId = params.workflowId as string

    const saveConfig = useNodeConfig()
    const handleOpenSettings = useCallback(() => setopen(true), [])
    const handleSubmit = useCallback((values: anthropciFormValues) => {
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
            workflowId,
            nodeId: props.id,
            config: values
        })
        setopen(false)
    }, [props.id, setNodes])
    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: HTTP_REQUEST_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchHttpRequestRealTime
    })


    // Auto-save when dialog closes

    return (
        <React.Fragment>
            <HttpRequestDaialog onOpenChange={setopen} open={open} defaultValues={nodedata} onSubmit={handleSubmit} />
            <BaseExecUtionNode
                {...props}
                icon={GlobeIcon}
                name="HTTP Request"
                description={description}
                onDoubleClick={handleOpenSettings}
                onSetting={handleOpenSettings}
                status={nodeStatus}

            />
        </React.Fragment>
    )
})  
