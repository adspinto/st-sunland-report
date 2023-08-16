import { useState } from "react";
import Header from "../components/Header";
import TemporaryDrawer from "../components/TemporaryDrawer";
import Theme from "../context/Theme"


const Wrapper = ({ children }) => {
  const [state, setState] = useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  return (
    <Theme>
      <Header toggleDrawer={toggleDrawer} />
      {children}
      <TemporaryDrawer state={state} toggleDrawer={toggleDrawer} />
    </Theme>
  );
};

export default Wrapper;
