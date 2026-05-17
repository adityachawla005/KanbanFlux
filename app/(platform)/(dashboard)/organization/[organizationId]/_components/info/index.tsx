"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";
import Image from "next/image";
import React from "react";

interface IInfoProps {
  isPro: boolean;
}

const Info = ({ isPro }: IInfoProps) => {
  const { organization, isLoaded } = useOrganization();

  if (!isLoaded) {
    return <Info.Skeleton />;
  }
  return (
    <div className="flex items-center gap-x-4">
      <div className="w-[52px] h-[52px] relative">
        <Image
          fill
          alt="Organization"
          src={organization?.imageUrl!}
          className="rounded-lg object-cover"
        />
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-lg text-white tracking-tight">{organization?.name}</p>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
          <CreditCard className="h-3 w-3" />
          {isPro ? (
            <span style={{ color: "#00e599" }}>Pro</span>
          ) : (
            <span>Free</span>
          )}
        </div>
      </div>
    </div>
  );
};

Info.Skeleton = function SkeletonInfo() {
  return (
    <div className="flex items-center gap-x-4">
      <div className="w-[52px] h-[52px] relative">
        <Skeleton className="w-full h-full absolute rounded-lg bg-white/10" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-[180px] bg-white/10" />
        <Skeleton className="h-3.5 w-[80px] bg-white/10" />
      </div>
    </div>
  );
};
export default Info;
