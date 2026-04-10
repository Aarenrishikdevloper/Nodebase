import Handlebars from "handlebars";
import { NodeExecutor } from "../../type/type";
import { slackChannel } from "@/inngest/channel/slack";
import { NonRetriableError } from "inngest";
import { decode } from "html-entities";
import ky from "ky";
Handlebars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2)
    const SafeString = new Handlebars.SafeString(jsonString)
    return SafeString
})
interface SlackData {
    variableName?: string;
    webhookUrl?: string;
    content?: string
}
export const SlackExecutor: NodeExecutor<SlackData> = async ({
    data,
    nodeId,
    context,
    step,
    publish
}) => {
    await publish(
        slackChannel().status({
            nodeId,
            status: "loading"
        })
    )
    if (!data.content) {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error"
            })

        )
        throw new NonRetriableError("Slack node: Message Content is required")
    }
    if (!data.variableName) {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error"
            })

        )
        throw new NonRetriableError("Slack node: VariableName is required")
    }
    if (!data.webhookUrl) {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error"
            })

        )
        throw new NonRetriableError("Slack node: WebhookUrl is required")
    }
    if (!data.content) {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error"
            })

        )
        throw new NonRetriableError("Slack node: Content is required")
    }
    const rawContent = Handlebars.compile(data.content)(context)
    const content = decode(rawContent)
    try {
        const result = await step.run("slack-webhook", async () => {
            await ky.post(data.webhookUrl!, {
                json: {
                    text: content
                }
            })
            return {
                ...context,
                [data.variableName!]: {
                    messageContent: content.slice(0, 2000)
                }
            }
        })
        await publish(
            slackChannel().status({
                nodeId,
                status: "success"
            })

        )
        return result

    } catch (error) {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error"
            })

        )
        throw error
    }
}