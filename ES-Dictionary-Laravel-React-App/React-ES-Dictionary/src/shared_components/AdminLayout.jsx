import React from "react";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div>
      <div>Admin Layout</div>
      <div className="childContainer"><Outlet /></div>
    </div>
  );
}
