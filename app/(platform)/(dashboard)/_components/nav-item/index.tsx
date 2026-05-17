"use client";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Organization } from "@/types";
import { Activity, CreditCard, Layout, Settings } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface INavItemProps {
  organization: Organization;
  isActive: boolean;
  isExpanded: boolean;
  onExpand: (id: string) => void;
}

const NavItem = ({ organization, isActive, isExpanded, onExpand }: INavItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const routes = [
    {
      label: "Boards",
      icon: <Layout className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}`,
    },
    {
      label: "Activity",
      icon: <Activity className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}/activity`,
    },
    {
      label: "Settings",
      icon: <Settings className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}/settings`,
    },
    {
      label: "Billing",
      icon: <CreditCard className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}/billing`,
    },
  ];

  const onClick = (href: string) => router.push(href);

  return (
    <AccordionItem value={organization.id} className="border-none">
      <AccordionTrigger
        onClick={() => onExpand(organization.id)}
        className={cn(
          "flex items-center gap-x-2 p-1.5 rounded-md transition-colors text-start no-underline hover:no-underline hover:bg-white/5",
          isActive && !isExpanded && "bg-[#00e599]/10"
        )}
        style={{ color: isActive && !isExpanded ? "#00e599" : "rgba(255,255,255,0.65)" }}
      >
        <div className="flex items-center gap-x-2">
          <div className="w-7 h-7 relative">
            <Image
              src={organization.imageUrl}
              fill
              alt="Organization image"
              className="rounded-sm object-cover"
            />
          </div>
          <span className="font-medium text-sm">{organization.name}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-1">
        {routes.map((route) => {
          const isRoutActive = pathname === route.href;
          return (
            <Button
              key={route.label}
              onClick={() => onClick(route.href)}
              className={cn(
                "w-full font-normal justify-start pl-10 mb-1 transition-colors",
                isRoutActive
                  ? "bg-[#00e599]/10 text-[#00e599] hover:bg-[#00e599]/15"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              )}
              variant="ghost"
            >
              {route.icon}
              {route.label}
            </Button>
          );
        })}
      </AccordionContent>
    </AccordionItem>
  );
};

NavItem.Skeleton = function SkeletonNavItem() {
  return (
    <div className="flex items-center gap-x-2">
      <div className="w-10 h-10 relative shrink-0">
        <Skeleton className="h-full w-full absolute bg-white/10" />
      </div>
      <Skeleton className="h-10 w-full bg-white/10" />
    </div>
  );
};

export default NavItem;
