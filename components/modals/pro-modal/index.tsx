"use client";

import { stripeRedirect } from "@/actions/stripe-redirect";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAction } from "@/hooks/use-action";
import useProModal from "@/hooks/use-pro-modal";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";

const ProModal = () => {
  const { onClose, isOpen } = useProModal();
  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess: (data) => { window.location.href = data; },
    onError: (error) => toast.error(error),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md p-0 overflow-hidden border-white/8"
        style={{ background: "#0f1117" }}
      >
        <div className="aspect-video relative">
          <Image src="/hero.svg" alt="KanbanFlux Pro" className="object-cover" fill />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1117] to-transparent" />
        </div>
        <div className="px-6 pb-6 space-y-5">
          <div>
            <h2 className="font-semibold text-lg text-white tracking-tight">
              Upgrade to KanbanFlux Pro
            </h2>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
              Unlock everything for your workspace.
            </p>
          </div>
          <ul className="space-y-2">
            {["Unlimited boards", "Advanced checklists", "Admin & security features", "Priority support"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#00e599" }} />
                {item}
              </li>
            ))}
          </ul>
          <button
            onClick={() => execute({})}
            disabled={isLoading}
            className="w-full rounded-[6px] font-medium py-2.5 transition-colors disabled:opacity-50"
            style={{ background: "#00e599", color: "#050505", fontSize: "13px" }}
          >
            {isLoading ? "Redirecting..." : "Upgrade now"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProModal;
