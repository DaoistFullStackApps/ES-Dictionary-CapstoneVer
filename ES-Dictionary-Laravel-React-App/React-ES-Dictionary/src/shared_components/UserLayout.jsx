import React from "react";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div>
      <div>User Layout</div>
      <div className="childContainer"><Outlet /></div>
    </div>
  );
}
