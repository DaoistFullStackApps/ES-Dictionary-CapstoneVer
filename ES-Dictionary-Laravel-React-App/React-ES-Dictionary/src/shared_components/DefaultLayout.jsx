import React from "react";
import { Outlet } from "react-router-dom";

export default function DefaultLayout() {
  return (
    <div>
      <div>Default Layout</div>
      <div className="childContainer"><Outlet /></div>
    </div>
  );
}
