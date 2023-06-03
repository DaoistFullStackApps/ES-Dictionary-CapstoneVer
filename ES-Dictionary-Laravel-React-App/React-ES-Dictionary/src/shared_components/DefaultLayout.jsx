import React from "react";
import { Outlet } from "react-router-dom";

export default function DefaultLayout() {
  return (
    <div>
      <div className="bg-gray-600">Default Layout</div>
      <div className="childContainer"><Outlet /></div>
    </div>
  );
}
