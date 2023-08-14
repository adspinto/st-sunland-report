import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";

const screens = [
  {
    path: "/",
    element: <Home />,
  },
];
const router = createBrowserRouter(screens);
const Router = () => <RouterProvider router={router} />;
export default Router;
