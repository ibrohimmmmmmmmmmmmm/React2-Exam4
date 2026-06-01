import React, { memo } from "react";
import OrganizationHeader from "../components/Header/OrganizationHeader";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";

export default memo(function LayoutOrg() {
  return (
    <>
      <OrganizationHeader />
      <main className="min-h-[calc(100vh-128px)] bg-slate-50/50">
        <Outlet />
      </main>
      <Footer />
    </>
  );
});
