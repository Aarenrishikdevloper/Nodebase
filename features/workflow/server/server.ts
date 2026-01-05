import { PAGINATION } from "@/config/constants";
import { db } from "@/lib/db";
import { nodes, workflows } from "@/lib/db/schema";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { count, and, desc, eq, ilike } from "drizzle-orm";
import z from "zod";
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
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .max(PAGINATION.MAX_PAGE_SIZE)
          .min(PAGINATION.MIN_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;
      const offset = (page - 1) * pageSize;  
      const searchtrime = search?.trim()
      const [items, totalCount] = await Promise.all([
        db
          .select()
          .from(workflows)
          .where(
            and(
              eq(workflows.userId, ctx.auth.user.id),
              search && searchtrime ? ilike(workflows.name, `%${search}%`) : undefined,
            ),
          )
          .orderBy(desc(workflows.updatedAt))
          .offset(offset)
          .limit(pageSize),
        db
          .select({ count: count() })
          .from(workflows)
          .where(
            and(
              eq(workflows.userId, ctx.auth.user.id),
              search ? ilike(workflows.name, `%${search}%`) : undefined,
            ),
          )
          .then((rows) => Number(rows[0].count)),
      ]);
      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPages = page < totalPages;
      const haspreviousPage = page > 1;
      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPages,
        haspreviousPage,
      };
    }),
    remove:protectedProcedure 
    .input(z.object({id:z.string()}))   
    .mutation(async({ctx, input})=>{
      return await db.delete(workflows).where(
        and(
          eq(workflows.id, input.id), 
          eq(workflows.userId, ctx.auth.user.id)
        )
      )
    })
});    

