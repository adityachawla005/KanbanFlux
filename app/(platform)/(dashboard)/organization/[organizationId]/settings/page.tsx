import { OrganizationProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import React from "react";

const OrganizationSettingsPage = () => {
  return (
    <div className="w-full">
      <OrganizationProfile
        appearance={{
          baseTheme: dark,
          variables: {
            colorBackground: "#0f0f0f",
            colorInputBackground: "#161616",
            colorPrimary: "#00e599",
            colorText: "#ffffff",
            colorTextSecondary: "rgba(255,255,255,0.45)",
            borderRadius: "6px",
          },
          elements: {
            rootBox: { boxShadow: "none", width: "100%" },
            card: {
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "none",
              width: "100%",
              background: "#0f0f0f",
            },
            formButtonPrimary: {
              background: "#00e599",
              color: "#050505",
            },
          },
        }}
      />
    </div>
  );
};

export default OrganizationSettingsPage;
