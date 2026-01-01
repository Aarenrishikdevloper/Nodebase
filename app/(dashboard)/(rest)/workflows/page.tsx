import { WorkFlowContainer } from "@/features/workflow/components/workflow";
import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireAuth();
  return (
    <WorkFlowContainer>
      <p>p</p>
    </WorkFlowContainer>
  );
};

export default Page;
