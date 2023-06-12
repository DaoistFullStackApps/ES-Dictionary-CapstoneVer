import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Hero2 from "./views/Hero2.jsx";
import DefaultLayout from "./shared_components/DefaultLayout.jsx";
import Loading from "./helper_functions/Loading.jsx";
const Hero = lazy(() => import("./views/Hero.jsx"));
const Hero3 = lazy(() => import("./views/Hero3.jsx"));
const Dictionary = lazy(() => import("./views/Dictionary.jsx"));
const Login = lazy(() => import("./views/Login.jsx"));
const Maintenance = lazy(() => import("./views/Maintenance.jsx"));
const NotFound = lazy(() => import("./views/NotFound.jsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Navigate to="/hero2" />
      },
      {
        path: "/hero2",
        element: <Hero2 />,
      },
      {
        path: "/dictionary",
        element: <Suspense fallback={<Loading />}><Dictionary /></Suspense>
      },
      {
        path: "/hero",
        element: <Suspense fallback={<Loading />}><Hero /></Suspense>
      },
      {
        path: "/hero3",
        element: <Suspense fallback={<Loading />}><Hero3 /></Suspense>
      },
      {
        path: "/login",
        element: <Suspense fallback={<Loading />}><Login /></Suspense>
      },
      {
        path: "/maintenance",
        element: <Suspense fallback={<Loading />}><Maintenance /></Suspense>
      },
    ],
  },

  {
    path: "*",
    element:<Suspense fallback={<Loading />}><NotFound /></Suspense>
  },
]);

export default router;
