"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import useCardModal from "@/hooks/use-card-modal";
import { fetcher } from "@/lib/fetcher";
import { CardWithList } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import CardModalHeader from "./header";
import CardModalDescription from "./description";
import CardModalActions from "./actions";
import { AuditLog } from "@prisma/client";
import CardModalActivity from "./activity";

const CardModal = () => {
  const { isOpen, onClose, id } = useCardModal();
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaError, setMediaError] = useState(false);

  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ["card", id],
    queryFn: () => fetcher(`/api/cards/${id}`),
    enabled: !!id,
  });

  const { data: auditLogsData } = useQuery<AuditLog[]>({
    queryKey: ["card-logs", id],
    queryFn: () => fetcher(`/api/cards/${id}/logs`),
    enabled: !!id,
  });

  // Set media URL from fetched card data
  useEffect(() => {
    if (cardData?.mediaUrl) {
      setMediaUrl(cardData.mediaUrl);
      setMediaError(false);
      console.log("🔍 Video URL from cardData:", cardData.mediaUrl);
    }
  }, [cardData]);

  // Handle SAS refresh if media fails to load
  const handleMediaError = async () => {
    try {
      const res = await fetch(`/api/cards/${id}/refresh-url`);
      if (!res.ok) throw new Error("Refresh failed");
      const { mediaUrl: newUrl } = await res.json();
      setMediaUrl(newUrl);
      setMediaError(false);
    } catch (err) {
      console.error("🔁 SAS refresh failed", err);
      setMediaError(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="outline-none">
        {cardData ? (
          <CardModalHeader data={cardData} />
        ) : (
          <CardModalHeader.Skeleton />
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3 space-y-6">
            {/* Media Preview */}
            {!mediaError && mediaUrl && cardData?.mediaType === "video" && (
              <video
                controls
                className="w-full rounded-md shadow"
                onError={handleMediaError}
              >
                <source src={mediaUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            {!mediaError && mediaUrl && cardData?.mediaType === "audio" && (
              <audio
                controls
                className="w-full"
                onError={handleMediaError}
              >
                <source src={mediaUrl} type="audio/mpeg" />
                Your browser does not support the audio tag.
              </audio>
            )}

            {mediaError && (
              <div className="text-center text-red-500">
                Media failed to load. Please close and reopen the modal.
              </div>
            )}

            {cardData ? (
              <CardModalDescription data={cardData} />
            ) : (
              <CardModalDescription.Skeleton />
            )}

            {auditLogsData ? (
              <CardModalActivity items={auditLogsData} />
            ) : (
              <CardModalActivity.Skeleton />
            )}
          </div>

          {cardData ? (
            <CardModalActions data={cardData} />
          ) : (
            <CardModalActions.Skeleton />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardModal;
