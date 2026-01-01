import { workflowRouter } from "@/features/workflow/server/server";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import { z } from "zod";
export const appRouter = createTRPCRouter({
  workflow: workflowRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
