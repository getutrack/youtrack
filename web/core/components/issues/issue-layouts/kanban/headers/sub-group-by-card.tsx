import React, { FC } from "react";
import { observer } from "mobx-react";
import { Circle, ChevronDown, ChevronUp } from "lucide-react";
import { TIssueKanbanFilters } from "@youtrack/types";
// mobx

interface IHeaderSubGroupByCard {
  icon?: React.ReactNode;
  title: string;
  count: number;
  column_id: string;
  collapsedGroups: TIssueKanbanFilters;
  handleCollapsedGroups: (toggle: "group_by" | "sub_group_by", value: string) => void;
}

export const HeaderSubGroupByCard: FC<IHeaderSubGroupByCard> = observer((props) => {
  const { icon, title, count, column_id, collapsedGroups, handleCollapsedGroups } = props;
  return (
    <div
      className={`relative flex w-full flex-shrink-0 flex-row items-center gap-1 rounded-sm py-1.5 cursor-pointer`}
      onClick={() => handleCollapsedGroups("sub_group_by", column_id)}
    >
      <div className="flex h-[20px] w-[20px] flex-shrink-0 items-center justify-center overflow-hidden rounded-sm transition-all hover:bg-custom-background-80">
        {collapsedGroups?.sub_group_by.includes(column_id) ? (
          <ChevronDown width={14} strokeWidth={2} />
        ) : (
          <ChevronUp width={14} strokeWidth={2} />
        )}
      </div>

      <div className="flex h-[20px] w-[20px] flex-shrink-0 items-center justify-center overflow-hidden rounded-sm">
        {icon ? icon : <Circle width={14} strokeWidth={2} />}
      </div>

      <div className="flex flex-shrink-0 items-center gap-1 text-sm">
        <div className="line-clamp-1 text-custom-text-100">{title}</div>
        <div className="pl-2 text-sm font-medium text-custom-text-300">{count || 0}</div>
      </div>
    </div>
  );
});