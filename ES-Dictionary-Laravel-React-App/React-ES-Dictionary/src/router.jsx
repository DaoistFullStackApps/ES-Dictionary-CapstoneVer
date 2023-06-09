import { createBrowserRouter, Navigate, Link } from "react-router-dom";
import Login from "./views/Login.jsx";
import Dictionary from "./views/Dictionary.jsx";
import Hero from "./views/Hero.jsx";
import Users from "./views/Users.jsx";
import Admin from "./views/Admin.jsx";
import NotFound from "./views/NotFound.jsx";
import DefaultLayout from "./shared_components/DefaultLayout.jsx";
import UserLayout from "./shared_components/UserLayout.jsx";
import AdminLayout from "./shared_components/AdminLayout.jsx";
import Maintenance from "./views/Maintenance.jsx";
import Hero2 from "./views/Hero2.jsx";
import Hero3 from "./views/Hero3.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/hero2" />,
      },
      {
        path: "/dictionary",
        element: <Dictionary />,
      },
      {
        path: "/hero",
        element: <Hero />,
      },
      {
        path: "/hero2",
        element: <Hero2 />,
      },
      {
        path: "/hero3",
        element: <Hero3 />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/maintenance",
        element: <Maintenance />,
      },
    ],
  },
  // {
  //   path: "/",
  //   element: <UserLayout />,
  //   children: [
  //     {
  //       path: "/dictionary",
  //       element: <Dictionary />,
  //     },

  //     {
  //       path: "/users",
  //       element: <Users />,
  //     },
  //   ],
  // },
  // {
  //   path: "/",
  //   element: <AdminLayout />,
  //   children: [
  //     {
  //       path: "/login",
  //       element: <Login />,
  //     },
  //     {
  //       path: "/admin",
  //       element: <Admin />,
  //     },
  //   ],
  // },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
