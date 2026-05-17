import React, { Suspense } from "react";
import Info from "../_components/info";
import ActivityList from "./_components/activity-list";
import { checkSubscription } from "@/lib/subscription";

const ActivityPage = async () => {
  const isPro = await checkSubscription();
  return (
    <div className="w-full">
      <Info isPro={isPro} />
      <div className="my-5" style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />
      <Suspense fallback={<ActivityList.Sekeleton />}>
        <ActivityList />
      </Suspense>
    </div>
  );
};

export default ActivityPage;
