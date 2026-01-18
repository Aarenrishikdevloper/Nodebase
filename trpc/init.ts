import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { workflows } from "@/lib/db/schema";
import { polarClient } from "@/lib/polar";
import { initTRPC, TRPCError } from "@trpc/server";
import { count, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: "user_123" };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authenticated",
    });
  return next({ ctx: { ...ctx, auth: session, db } });
});  

export const premiumProcedure = protectedProcedure.use(async({ctx,next})=>{
  const customer = await polarClient.customers.getStateExternal({externalId:ctx.auth.user.id})     
  const isPremium = customer.activeSubscriptions.some((sub)=> sub.status === "active")??false
  if(isPremium){
    return next({
      ctx:{...ctx, customer}
    })  
  }  
  const result = await ctx.db.select({value:count()}).from(workflows).where(
    eq(workflows.userId, ctx.auth.user.id)
  )  
  const workflowCount= Number(result[0].value ?? 0);
  
  if(workflowCount >=5){
     throw new TRPCError({
       code:"FORBIDDEN",  
       message:"Free plan allows only 5 Woekflow. Upgrade to premium"

     })
  }  
  return next({
    ctx:{...ctx, customer}
  })
})
