import { PAGINATION } from "@/config/constants";
import { db } from "@/lib/db";
import { connections, nodes, workflows } from "@/lib/db/schema";
import { polarClient } from "@/lib/polar";
import { getCustomerStateSafe } from "@/lib/utils";

import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { count, and, desc, eq, ilike } from "drizzle-orm";
import z, { string } from "zod";

export const workflowRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.auth?.user?.id) {
      throw new Error("User not authenticated");
    }
    return await db.transaction(async (tx) => {   
      const customer  = await getCustomerStateSafe(ctx.auth.user.id)
      const isPremium = customer?.activeSubscriptions.some(
        (sub)=>sub.status === "active"
      )??false    
      console.log(isPremium);
      if(!isPremium){
        const existingWorkflows = await tx.select({id:workflows.id}).from(workflows).where(
          eq(workflows.userId,ctx.auth.user.id)
        ).limit(5)    
        if(existingWorkflows.length >=5){ 
          
           throw new TRPCError({
             code:"FORBIDDEN",  
             message:"Free plan alows only 5 workflows. Upgrade to premium."
           })   
        }
      }
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
              search && searchtrime ? ilike(workflows.name, `%${searchtrime}%`) : undefined,
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
    }),
    getone:protectedProcedure.input(z.object({id:z.string()})).query(async({ctx,input})=>{
        return await db.transaction(async(tx)=>{
          const[workflow] = await tx.select().from(workflows).where(
            and(
              eq(workflows.id, input.id),  
              eq(workflows.userId, ctx.auth.user.id)
            )
          )  
          if(!workflow){
            throw new Error("Workflow not found")
          }   
          const workflowNodes =await tx.select().from(nodes).where(eq(nodes.workflowId, workflow.id))    
          const worlflowConnection = await tx.select().from(connections).where(eq(connections.workflowId,workflow.id))   
          return{
            ...workflow,  
            nodes:workflowNodes,  
            connection:worlflowConnection
          }
        })   
        
    }), 
    updateName:protectedProcedure.input(
      z.object({id:z.string(), name:z.string().min(1)})
    ).mutation(async({ctx,input})=>{
      const updated = await db.update(workflows).set({name:input.name, updatedAt:new Date()}).where(
        and(
          eq(workflows.id, input.id),  
          eq(workflows.userId, ctx.auth.user.id)      

        )
      ).returning();  
      if(updated.length === 0){
         throw new Error("Workflow not found or not authorised");
      }  
      return updated[0]    
    })
});    

