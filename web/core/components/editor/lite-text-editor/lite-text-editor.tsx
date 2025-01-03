import React from "react";
// editor
import { EditorRefApi, ILiteTextEditor, LiteTextEditorWithRef, TNonColorEditorCommands } from "@utrack/editor";
// types
import { IUserLite } from "@utrack/types";
// components
import { IssueCommentToolbar } from "@/components/editor";
// constants
import { EIssueCommentAccessSpecifier } from "@/constants/issue";
// helpers
import { cn } from "@/helpers/common.helper";
import { getEditorFileHandlers } from "@/helpers/editor.helper";
import { isCommentEmpty } from "@/helpers/string.helper";
// hooks
import { useMember, useMention, useUser } from "@/hooks/store";
// utrack web hooks
import { useFileSize } from "@/utrack-web/hooks/use-file-size";

interface LiteTextEditorWrapperProps extends Omit<ILiteTextEditor, "fileHandler" | "mentionHandler"> {
  workspaceSlug: string;
  workspaceId: string;
  projectId: string;
  accessSpecifier?: EIssueCommentAccessSpecifier;
  handleAccessChange?: (accessKey: EIssueCommentAccessSpecifier) => void;
  showAccessSpecifier?: boolean;
  showSubmitButton?: boolean;
  isSubmitting?: boolean;
  uploadFile: (file: File) => Promise<string>;
}

export const LiteTextEditor = React.forwardRef<EditorRefApi, LiteTextEditorWrapperProps>((props, ref) => {
  const {
    containerClassName,
    workspaceSlug,
    workspaceId,
    projectId,
    accessSpecifier,
    handleAccessChange,
    showAccessSpecifier = false,
    showSubmitButton = true,
    isSubmitting = false,
    placeholder = "Add comment...",
    uploadFile,
    ...rest
  } = props;
  // store hooks
  const { data: currentUser } = useUser();
  const {
    getUserDetails,
    project: { getProjectMemberIds },
  } = useMember();
  // derived values
  const projectMemberIds = getProjectMemberIds(projectId);
  const projectMemberDetails = projectMemberIds?.map((id) => getUserDetails(id) as IUserLite);
  // use-mention
  const { mentionHighlights, mentionSuggestions } = useMention({
    workspaceSlug,
    projectId,
    members: projectMemberDetails,
    user: currentUser ?? undefined,
  });
  // file size
  const { maxFileSize } = useFileSize();

  const isEmpty = isCommentEmpty(props.initialValue);

  function isMutableRefObject<T>(ref: React.ForwardedRef<T>): ref is React.MutableRefObject<T | null> {
    return !!ref && typeof ref === "object" && "current" in ref;
  }

  return (
    <div className="border border-custom-border-200 rounded p-3 space-y-3">
      <LiteTextEditorWithRef
        ref={ref}
        fileHandler={getEditorFileHandlers({
          maxFileSize,
          projectId,
          uploadFile,
          workspaceId,
          workspaceSlug,
        })}
        mentionHandler={{
          highlights: mentionHighlights,
          suggestions: mentionSuggestions,
        }}
        placeholder={placeholder}
        containerClassName={cn(containerClassName, "relative")}
        {...rest}
      />
      <IssueCommentToolbar
        accessSpecifier={accessSpecifier}
        executeCommand={(key) => {
          if (isMutableRefObject<EditorRefApi>(ref)) {
            ref.current?.executeMenuItemCommand({
              itemKey: key as TNonColorEditorCommands,
            });
          }
        }}
        handleAccessChange={handleAccessChange}
        handleSubmit={(e) => rest.onEnterKeyPress?.(e)}
        isCommentEmpty={isEmpty}
        isSubmitting={isSubmitting}
        showAccessSpecifier={showAccessSpecifier}
        editorRef={isMutableRefObject<EditorRefApi>(ref) ? ref : null}
        showSubmitButton={showSubmitButton}
      />
    </div>
  );
});

LiteTextEditor.displayName = "LiteTextEditor";
