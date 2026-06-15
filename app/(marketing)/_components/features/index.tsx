"use client";

const FEATURES = [
  {
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />
      </svg>
    ),
    label: "AI Extraction",
    body: "spaCy NLP reads any pasted text — notes, Slack threads, emails — and pulls out every task, owner, and deadline.",
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" />
      </svg>
    ),
    label: "Instant Boards",
    body: "Extracted tasks turn into draggable Kanban cards in one click — sorted by list, assignee, or priority.",
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
      </svg>
    ),
    label: "Voice & Media",
    body: "Record voice notes or attach files to any AI-generated card before it lands on the board.",
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
      </svg>
    ),
    label: "Organizations & Auth",
    body: "Clerk-powered sign-in with multi-tenant workspaces — every board, list, and card scoped to the active org.",
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
      </svg>
    ),
    label: "Activity Log",
    body: "A full audit trail of every create, move, rename, and delete, so the team always knows what changed.",
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
      </svg>
    ),
    label: "Billing & Plans",
    body: "Upgrade to Pro through Stripe Checkout for unlimited boards and AI runs, billed per organization.",
  },
];

export const Features = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
    {FEATURES.map((f, idx) => (
      <div
        key={idx}
        className="group relative cursor-default overflow-hidden rounded-xl transition-all duration-300 ease-out"
        style={{
          border: "1px solid transparent",
          padding: "24px",
        }}
      >
        {/* Hover frame + wash (fades in) */}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
          aria-hidden
          style={{
            border: "1px solid rgba(0,229,153,0.18)",
            background:
              "radial-gradient(120% 120% at 0% 0%, rgba(0,229,153,0.06) 0%, transparent 55%)",
          }}
        />

        <div className="relative flex items-start gap-4">
          {/* Icon tile */}
          <div
            className="flex shrink-0 items-center justify-center rounded-lg transition-all duration-300 ease-out group-hover:scale-105"
            style={{
              width: "40px",
              height: "40px",
              background: "rgba(0,229,153,0.06)",
              border: "1px solid rgba(0,229,153,0.14)",
              color: "rgba(0,229,153,0.65)",
            }}
          >
            <span className="block transition-colors duration-300 group-hover:text-[#00e599]">
              {f.icon}
            </span>
          </div>

          <div className="flex-1">
            {/* Title + index + arrow */}
            <div className="flex items-center gap-2.5">
              <p
                className="font-mono font-medium text-white transition-colors duration-300"
                style={{ fontSize: "17px", letterSpacing: "-0.01em" }}
              >
                {f.label}
              </p>
              <svg
                className="ml-auto -translate-x-1.5 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
                width="15"
                height="15"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#00e599"
                strokeWidth={2}
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>

            {/* Description */}
            <p
              className="mt-2.5"
              style={{
                fontSize: "14.5px",
                color: "rgba(255,255,255,0.58)",
                lineHeight: 1.72,
              }}
            >
              {f.body}
            </p>

            {/* Underline loading bar */}
            <div
              className="mt-4 overflow-hidden rounded-full"
              style={{ height: "2px", background: "rgba(255,255,255,0.05)" }}
            >
              <div
                className="h-full w-0 rounded-full transition-[width] duration-[700ms] ease-out group-hover:w-full"
                style={{
                  background: "linear-gradient(90deg, rgba(0,229,153,0.4), #00e599)",
                  boxShadow: "0 0 8px rgba(0,229,153,0.5)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);
