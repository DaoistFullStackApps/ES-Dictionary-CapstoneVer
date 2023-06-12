import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Hero2 from "./views/Hero2.jsx";
import DefaultLayout from "./shared_components/DefaultLayout.jsx";
import PageLoading from "./helper_functions/PageLoading.jsx";
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
        element: <Suspense fallback={<PageLoading />}><Dictionary /></Suspense>
      },
      {
        path: "/hero",
        element: <Suspense fallback={<PageLoading />}><Hero /></Suspense>
      },
      {
        path: "/hero3",
        element: <Suspense fallback={<PageLoading />}><Hero3 /></Suspense>
      },
      {
        path: "/login",
        element: <Suspense fallback={<PageLoading />}><Login /></Suspense>
      },
      {
        path: "/maintenance",
        element: <Suspense fallback={<PageLoading />}><Maintenance /></Suspense>
      },
    ],
  },

  {
    path: "*",
    element:<Suspense fallback={<PageLoading />}><NotFound /></Suspense>
  },
]);

export default router;
