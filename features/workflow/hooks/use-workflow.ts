import { useTRPC } from "@/trpc/cleint";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateWorkFlow = () => {
  const trpc = useTRPC();
  return useMutation(
    trpc.workflow.create.mutationOptions({
      onSuccess: (data) => {
        toast.success("Workflow Creation Sucessfully");
      },
      onError: (error) => {
        console.log(error.message);
        toast.error(error.message);
      },
    }),
  );
};
