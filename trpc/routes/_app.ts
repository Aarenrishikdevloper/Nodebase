import { workflowRouter } from "@/features/workflow/server/server";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import { z } from "zod";
import { credentialsRoute } from "@/features/crudential/server/server";
import { executionRouter } from "@/features/execution/server/server";
export const appRouter = createTRPCRouter({
  workflow: workflowRouter, 
  credential:credentialsRoute, 
  executions:executionRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
