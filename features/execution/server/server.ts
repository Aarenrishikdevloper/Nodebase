import { PAGINATION } from "@/config/constants";
import { db } from "@/lib/db";
import { executions, workflows } from "@/lib/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, count, desc, eq } from "drizzle-orm";
import z from "zod";

export const executionRouter = createTRPCRouter({
    getMany: protectedProcedure.input(
        z.object({
            page: z.number().default(PAGINATION.DEFAULT_PAGE),
            pageSize: z.number().min(PAGINATION.MIN_PAGE_SIZE).max(PAGINATION.MAX_PAGE_SIZE).default(PAGINATION.DEFAULT_PAGE_SIZE)
        })

    ).query(async ({ ctx, input }) => {
        const { page, pageSize } = input
        const offset = (page - 1) * pageSize
        const [items, totalResult] = await Promise.all([
            db.select({
                id: executions.id, startedAt: executions.startedAt, status: executions.status, completedAt: executions.completedAt, workflow: {
                    id: workflows.id,
                    name: workflows.name
                }
            }).from(executions).innerJoin(workflows, eq(executions.workflowId, workflows.id)).where(eq(workflows.userId, ctx.auth.user.id))
                .orderBy(desc(executions.startedAt)).limit(pageSize).offset(offset),

            db.select({ count: count() }).from(executions).innerJoin(workflows, eq(executions.workflowId, workflows.id)).where(eq(
                workflows.userId, ctx.auth.user.id
            ))
        ])
        const totalCount = totalResult[0]?.count ?? 0
        const totalPages = Math.ceil(totalCount / pageSize);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1
        return {
            items,
            page,
            pageSize,
            totalCount,
            hasNextPage,
            hasPreviousPage
        }
    }), 
    getOne:protectedProcedure.input(z.object({id:z.string()})).query(async({ctx, input})=>{
        const result = await db.query.executions.findFirst({
            where:and(
                eq(executions.id, input.id), 
                //eq(workflows.userId, ctx.auth.user.id)
            ),
            with:{
               workflow:{
                 columns:{
                    id:true, 
                    name:true
                 }
               }
            }
        })
        if(!result){
            throw new Error("Execution not found")
        }
        return result
    })

})