import React from "react";
import { Outlet } from "react-router-dom";

export default function DefaultLayout() {
  return (
    <div>
      <div className="bg-blue-500 text-white">
        <h1 className="text-2xl font-semibold p-2">es-dictionary</h1>
      </div>
      <div className="childContainer">
        <Outlet />
      </div>
    </div>
  );
}
