import { checkSubscription } from "@/lib/subscription";
import React from "react";
import Info from "../_components/info";
import SubscriptionButton from "./_components/subscription-button";

const BillingPage = async () => {
  const isPro = await checkSubscription();

  return (
    <div className="w-full">
      <Info isPro={isPro} />
      <div className="my-5" style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />
      <div className="space-y-2">
        <p className="text-sm font-medium text-white/70">Subscription</p>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
          {isPro ? "You are on the Pro plan. Manage your subscription below." : "You are on the Free plan. Upgrade for unlimited boards."}
        </p>
        <div className="pt-2">
          <SubscriptionButton isPro={isPro} />
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
