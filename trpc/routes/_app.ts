import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import { z } from "zod";
export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        name: z.string().optional(),
      }),
    )
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.name ?? "world"}!`,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
