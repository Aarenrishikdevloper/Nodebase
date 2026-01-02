"use client";
import { EntityContainer, EntityHeaders } from "@/components/ui/entity-view";
import React from "react";
import { useCreateWorkFlow } from "../hooks/use-workflow";
import { useRouter } from "next/navigation";

//--- Workflow Container -----
export const WorkFlowContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer header={<WorkflowHeader />}>{children}</EntityContainer>
  );
};
//WorkflowHeader
export const WorkflowHeader = ({ disabled }: { disabled?: boolean }) => {
  const createWorkflow = useCreateWorkFlow();
  const router = useRouter();
  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`$workflow/${data.id}`);
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };
  return (
    <>
      <EntityHeaders
        title="Workflows"
        description="Create and mange your WorkSpaces"
        newButtonLabel="New Workflow"
        disabled={disabled}
        isCreating={createWorkflow.isPending}
        onNew={handleCreate}
      />
    </>
  );
};
