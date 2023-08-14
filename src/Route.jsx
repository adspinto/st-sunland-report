import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
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
];
const router = createBrowserRouter(screens);
const Router = () => <RouterProvider router={router} />;
export default Router;
