import React from "react";
import { Outlet } from "react-router-dom";

export default function HomePageLayout() {
  return (
    <div
      style={{
        minHeight: "91vh",
        maxHeight: "91vh",
      }}
    >
      <div className="scrollable-container">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
