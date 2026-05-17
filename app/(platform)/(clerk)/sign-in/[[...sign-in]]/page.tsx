import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  return (
    <SignIn
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
            boxShadow: "0 0 0 1px rgba(0,0,0,0.5)",
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
