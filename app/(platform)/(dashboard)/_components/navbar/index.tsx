import React from "react";
import { Plus } from "lucide-react";

import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import MobileSidebar from "../mobile-sidebar";
import FormPopover from "@/components/form/form-popover";

const clerkVars = {
  colorBackground: "#111318",
  colorInputBackground: "#1a1d24",
  colorPrimary: "#00e599",
  colorText: "#e8e8e8",
  colorTextSecondary: "rgba(255,255,255,0.45)",
  colorNeutral: "#ffffff",
  colorDanger: "#f87171",
  borderRadius: "6px",
  fontSize: "13px",
};

const Navbar = () => {
  return (
    <nav
      className="fixed z-50 top-0 px-4 w-full h-14 flex items-center"
      style={{
        background: "rgba(8,8,8,0.92)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <MobileSidebar />
      <div className="flex items-center gap-x-4">
        <div className="hidden md:flex">
          <Logo />
        </div>
        <FormPopover side="bottom" align="start" sideOffset={18}>
          <Button
            size="sm"
            className="rounded-[5px] hidden md:flex h-auto py-1.5 px-3 font-medium text-[13px]"
            style={{ background: "#00e599", color: "#050505" }}
          >
            Create
          </Button>
        </FormPopover>
        <FormPopover sideOffset={6}>
          <Button
            size="sm"
            className="rounded-[5px] flex md:hidden"
            style={{ background: "#00e599", color: "#050505" }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </FormPopover>
      </div>

      <div className="ml-auto flex items-center gap-x-3">
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl="/organization/:id"
          afterSelectOrganizationUrl="/organization/:id"
          afterLeaveOrganizationUrl="/select-org"
          appearance={{
            baseTheme: dark,
            variables: clerkVars,
            elements: {
              rootBox: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
              organizationSwitcherTrigger: {
                color: "#e8e8e8",
                fontSize: "13px",
                padding: "4px 8px",
                borderRadius: "6px",
                gap: "6px",
              },
              organizationPreviewMainIdentifier: {
                color: "#e8e8e8",
                fontSize: "13px",
              },
              organizationPreviewSecondaryIdentifier: {
                color: "rgba(255,255,255,0.4)",
              },
              organizationSwitcherPopoverCard: {
                background: "#111318",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
              },
              organizationSwitcherPopoverActionButton: {
                color: "rgba(255,255,255,0.7)",
              },
              organizationSwitcherPopoverActionButtonText: {
                color: "rgba(255,255,255,0.7)",
              },
              organizationSwitcherPopoverActionButtonIcon: {
                color: "rgba(255,255,255,0.4)",
              },
            },
          }}
        />

        <UserButton
          afterSignOutUrl="/"
          appearance={{
            baseTheme: dark,
            variables: clerkVars,
            elements: {
              avatarBox: { height: 30, width: 30 },
              userButtonPopoverCard: {
                background: "#111318",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
              },
              userButtonPopoverActions: {
                background: "#111318",
              },
              userButtonPopoverActionButton: {
                color: "rgba(255,255,255,0.7)",
              },
              userButtonPopoverActionButtonText: {
                color: "rgba(255,255,255,0.7)",
              },
              userButtonPopoverActionButtonIcon: {
                color: "rgba(255,255,255,0.4)",
              },
              userButtonPopoverFooter: {
                display: "none",
              },
              userPreviewMainIdentifier: {
                color: "#e8e8e8",
                fontWeight: "500",
              },
              userPreviewSecondaryIdentifier: {
                color: "rgba(255,255,255,0.4)",
                fontSize: "12px",
              },
            },
          }}
        />
      </div>
    </nav>
  );
};

export default Navbar;
