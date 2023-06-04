import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function DefaultLayout() {
  return (
    <div>
      <div className="bg-coffee text-black">
        <Link className="text-2xl font-bold p-6 " to={'/hero'}>es-dictionary</Link>
      </div>
      <div className="childContainer">
        <Outlet />
      </div>
    </div>
  );
}
