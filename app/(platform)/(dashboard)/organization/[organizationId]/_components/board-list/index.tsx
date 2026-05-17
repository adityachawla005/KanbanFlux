import FormPopover from "@/components/form/form-popover";
import Hint from "@/components/hint";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/db";
import { getAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { HelpCircle, Plus, User2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const BoardList = async () => {
  const { orgId } = auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  const boards = await db.board.findMany({
    where: {
      orgId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const availableCount = await getAvailableCount();
  const isPro = await checkSubscription();
  return (
    <div className="space-y-4">
      <div className="flex items-center font-medium text-xs uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em" }}>
        Your Boards
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {boards.map((board) => (
          <Link
            href={`/board/${board.id}`}
            key={board.id}
            className="group relative aspect-video bg-no-repeat bg-center bg-cover rounded-lg h-full w-full p-2.5 overflow-hidden"
            style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition duration-200 rounded-lg" />
            <p className="relative font-semibold text-white text-sm drop-shadow">{board.title}</p>
          </Link>
        ))}
        <FormPopover side="right" sideOffset={10}>
          <div
            className="aspect-video relative w-full h-full rounded-lg flex flex-col gap-y-1 items-center justify-center transition-colors duration-150 cursor-pointer bg-white/[0.04] hover:bg-white/[0.08]"
            role="button"
            style={{ border: "1px dashed rgba(255,255,255,0.1)" }}
          >
            <Plus className="h-5 w-5 text-white/30" />
            <p className="text-xs text-white/40">New board</p>
            <span className="text-[10px] text-white/25">
              {isPro ? "Unlimited" : `${availableCount} remaining`}
            </span>
            <Hint
              side="bottom"
              sideOffset={40}
              description="Free workspaces can have up to 5 boards. Upgrade for unlimited."
            >
              <HelpCircle className="absolute bottom-2 right-2 h-3.5 w-3.5 text-white/20" />
            </Hint>
          </div>
        </FormPopover>
      </div>
    </div>
  );
};

BoardList.Skeleton = function BoardListSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-video h-7 w-60 mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <Skeleton className="aspect-video h-full w-full p-2" />
        <Skeleton className="aspect-video h-full w-full p-2" />
        <Skeleton className="aspect-video h-full w-full p-2" />
        <Skeleton className="aspect-video h-full w-full p-2" />
        <Skeleton className="aspect-video h-full w-full p-2" />
        <Skeleton className="aspect-video h-full w-full p-2" />
        <Skeleton className="aspect-video h-full w-full p-2" />
        <Skeleton className="aspect-video h-full w-full p-2" />
      </div>
    </div>
  );
};

export default BoardList;
