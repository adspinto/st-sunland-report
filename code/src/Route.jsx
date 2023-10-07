import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History"
import Wrapper from "./layout/Wrapper";

const screens = [
  {
    path: "/",
    element: (
      <Wrapper>
        <Home />
      </Wrapper>
    ),
  },
  {
    path: "/history",
    element: (
      <Wrapper>
        <History />
      </Wrapper>
    ),
  },
];
const router = createBrowserRouter(screens);
const Router = () => <RouterProvider router={router} />;
export default Router;
