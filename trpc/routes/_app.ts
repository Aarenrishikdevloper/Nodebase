import { workflowRouter } from "@/features/workflow/server/server";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import { z } from "zod";
import { credentialsRoute } from "@/features/crudential/server/server";
export const appRouter = createTRPCRouter({
  workflow: workflowRouter, 
  credential:credentialsRoute,
});
// export type definition of API
export type AppRouter = typeof appRouter;
