import { OrganizationList } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function CreateOrganizationPage() {
  return (
    <OrganizationList
      hidePersonal
      afterSelectOrganizationUrl="/organization/:id"
      afterCreateOrganizationUrl="/organization/:id"
      appearance={{
        baseTheme: dark,
        variables: {
          colorBackground: "#0f0f0f",
          colorInputBackground: "#161616",
          colorPrimary: "#00e599",
          colorText: "#ffffff",
          colorTextSecondary: "rgba(255,255,255,0.45)",
          borderRadius: "6px",
          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        },
        elements: {
          card: {
            border: "1px solid rgba(255,255,255,0.07)",
          },
          formButtonPrimary: {
            background: "#00e599",
            color: "#050505",
            fontWeight: "500",
          },
        },
      }}
    />
  );
}
