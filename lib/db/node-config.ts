import { db } from "./index";
import { nodeConfigs, nodes } from "./schema";
import { eq, and } from "drizzle-orm";

/**
 * Save node configuration
 * @param workflowId - ID of the workflow
 * @param nodeId - ID of the node
 * @param data - Configuration data (any JSON-serializable object)
 * @returns The created node config record
 */
export async function saveNodeConfig(
  workflowId: string,
  nodeId: string,
  data: Record<string, any>
) {
  const result = await db.insert(nodeConfigs).values({
    workflowId,
    nodeId,
    data,
  }).returning();
  
  return result[0];
}

/**
 * Get the latest node configuration
 * @param nodeId - ID of the node
 * @returns The latest node config or null
 */
export async function getLatestNodeConfig(nodeId: string) {
  const result = await db
    .select()
    .from(nodeConfigs)
    .where(eq(nodeConfigs.nodeId, nodeId))
    .orderBy((t) => [t.createdAt])
    .limit(1);
  
  return result[0] || null;
}

/**
 * Get all configurations for a node
 * @param nodeId - ID of the node
 * @returns Array of node configs
 */
export async function getNodeConfigs(nodeId: string) {
  return await db
    .select()
    .from(nodeConfigs)
    .where(eq(nodeConfigs.nodeId, nodeId))
    .orderBy((t) => [t.createdAt]);
}

/**
 * Get all configurations for a workflow's nodes
 * @param workflowId - ID of the workflow
 * @returns Array of node configs
 */
export async function getWorkflowNodeConfigs(workflowId: string) {
  return await db
    .select()
    .from(nodeConfigs)
    .where(eq(nodeConfigs.workflowId, workflowId))
    .orderBy((t) => [t.createdAt]);
}

/**
 * Update a node configuration
 * @param configId - ID of the config to update
 * @param data - New configuration data
 * @returns The updated node config record
 */
export async function updateNodeConfig(
  configId: string,
  data: Record<string, any>
) {
  const result = await db
    .update(nodeConfigs)
    .set({ data, updatedAt: new Date() })
    .where(eq(nodeConfigs.id, configId))
    .returning();
  
  return result[0];
}

/**
 * Delete a node configuration
 * @param configId - ID of the config to delete
 */
export async function deleteNodeConfig(configId: string) {
  await db.delete(nodeConfigs).where(eq(nodeConfigs.id, configId));
}

/**
 * Delete all configurations for a node
 * @param nodeId - ID of the node
 */
export async function deleteNodeConfigs(nodeId: string) {
  await db.delete(nodeConfigs).where(eq(nodeConfigs.nodeId, nodeId));
}
