import React, { useState } from "react";
// types
import type { TIssue } from "@utrack/types";
// ui
import { AlertModalCore } from "@utrack/ui";
// hooks
import { useProject } from "@/hooks/store";

type Props = {
  data: Partial<TIssue>;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
};

export const DeclineIssueModal: React.FC<Props> = (props) => {
  const { isOpen, onClose, data, onSubmit } = props;
  // states
  const [isDeclining, setIsDeclining] = useState(false);
  // store hooks
  const { getProjectById } = useProject();
  // derived values
  const projectDetails = data.project_id ? getProjectById(data?.project_id) : undefined;

  const handleClose = () => {
    setIsDeclining(false);
    onClose();
  };

  const handleDecline = async () => {
    setIsDeclining(true);
    await onSubmit().finally(() => setIsDeclining(false));
  };

  return (
    <AlertModalCore
      handleClose={handleClose}
      handleSubmit={handleDecline}
      isSubmitting={isDeclining}
      isOpen={isOpen}
      title="Decline issue"
      content={
        <>
          {" "}
          Are you sure you want to decline issue{" "}
          <span className="break-words font-medium text-custom-text-100">
            {projectDetails?.identifier}-{data?.sequence_id}
          </span>
          {""}? This action cannot be undone.
        </>
      }
      primaryButtonText={{
        loading: "Declining",
        default: "Decline",
      }}
    />
  );
};
