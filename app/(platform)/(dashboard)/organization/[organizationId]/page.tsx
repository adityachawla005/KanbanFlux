import React, { Suspense } from "react";
import Info from "./_components/info";
import BoardList from "./_components/board-list";
import { checkSubscription } from "@/lib/subscription";

const OrganizationIdPage = async () => {
  const isPro = await checkSubscription();
  return (
    <div className="w-full mb-20">
      <Info isPro={isPro} />
      <div className="my-5" style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />
      <Suspense fallback={<BoardList.Skeleton />}>
        <BoardList />
      </Suspense>
    </div>
  );
};

export default OrganizationIdPage;
