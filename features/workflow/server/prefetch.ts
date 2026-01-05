import { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.workflow.getMany>;
export const prefetchWorkflows = (params: Input) => {
  return prefetch(trpc.workflow.getMany.queryOptions(params));
};
