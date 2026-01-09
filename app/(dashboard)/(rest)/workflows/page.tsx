import { WorkFlowContainer, WokflowError, WorkflowList, WorkflowLoader } from "@/features/workflow/components/workflow";
import { workflowParameters } from "@/features/workflow/server/params-loader";
import { prefetchWorkflows } from "@/features/workflow/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
type props ={
  searchparams:Promise<SearchParams>
}
const Page = async ({searchparams}:props) => {
  await requireAuth();  
  const params = await workflowParameters(searchparams)  
  prefetchWorkflows(params)
  return (
    <WorkFlowContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<WokflowError/>} >
            <Suspense fallback={<WorkflowLoader/>}>     
              <WorkflowList/>

            </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkFlowContainer>
  );
};

export default Page;
