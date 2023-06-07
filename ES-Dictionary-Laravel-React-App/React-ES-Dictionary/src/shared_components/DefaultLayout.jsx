import React from "react";
import {BookOpenIcon} from "@heroicons/react/24/outline";
import { Link, Outlet } from "react-router-dom";
import "../views/Css/Mobile.Css"


export default function DefaultLayout() {
  return (
    <div className="min-h-screen">
      <div className="flex p-3 my-auto items-center bg-coffee text-black space-x-1">
       <BookOpenIcon className="w-8"/>
        <Link className="text-2xl font-bold mb-2" to={'/hero'}>Es-Dictionary</Link>
      </div>
      <div className="childContainer">
        <Outlet />
      </div>
    </div>
  );
}
