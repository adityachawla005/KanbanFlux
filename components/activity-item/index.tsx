import { AuditLog } from "@prisma/client";
import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { generateLogMessage } from "@/lib/generate-log-message";
import { format } from "date-fns";

interface IActivityItemProps {
  data: AuditLog;
}
const ActivityItem = ({ data }: IActivityItemProps) => {
  return (
    <li className="flex items-center gap-x-3 py-2">
      <Avatar className="h-7 w-7 shrink-0">
        <AvatarImage src={data.userImage} />
      </Avatar>
      <div className="flex flex-col space-y-0.5">
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
          <span className="font-medium text-white/80">{data.userName}</span>
          <span className="ml-1">{generateLogMessage(data)}</span>
        </p>
        <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
          {format(new Date(data.createdAt), "MMM d, yyyy 'at' h:mm a")}
        </p>
      </div>
    </li>
  );
};

export default ActivityItem;
