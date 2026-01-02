import { db } from "@/lib/db";
import { nodes, workflows } from "@/lib/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const workflowRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.auth?.user?.id) {
      throw new Error("User not authenticated");
    }
    return await db.transaction(async (tx) => {
      const [workflow] = await tx
        .insert(workflows)
        .values({
          name: "Untitled",
          userId: ctx.auth.user.id,
        })
        .returning({
          id: workflows.id,
          name: workflows.name,
        });
      await tx.insert(nodes).values({
        workflowId: workflow.id,
        type: "INITIAL",
        name: "INTIAL",
        position: { x: 0, y: 0 },
      });
      return workflow;
    });
  }),
});
