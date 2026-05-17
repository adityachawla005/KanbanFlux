import React from "react";
import Navbar from "./_components/navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full" style={{ background: "#080808" }}>
      <Navbar />
      {children}
    </div>
  );
};

export default DashboardLayout;
