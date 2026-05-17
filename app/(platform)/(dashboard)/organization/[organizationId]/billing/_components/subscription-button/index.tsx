"use client";
import { stripeRedirect } from "@/actions/stripe-redirect";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import useProModal from "@/hooks/use-pro-modal";
import React from "react";
import { toast } from "sonner";

interface ISubscriptionButtonProps {
  isPro: boolean;
}
const SubscriptionButton = ({ isPro }: ISubscriptionButtonProps) => {
  const { onOpen } = useProModal();
  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onClick = () => {
    if (isPro) {
      execute({});
    } else {
      onOpen();
    }
  };

  return (
    <button
      disabled={isLoading}
      onClick={onClick}
      className="inline-flex items-center rounded-[6px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ fontSize: "13px", padding: "8px 18px", background: "#00e599", color: "#050505" }}
    >
      {isPro ? "Manage subscription" : "Upgrade to Pro"}
    </button>
  );
};

export default SubscriptionButton;
