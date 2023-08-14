import { useState } from "react";
import Header from "../components/Header";
import TemporaryDrawer from "../components/TemporaryDrawer";

const Wrapper = ({ children }) => {
  const [state, setState] = useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    console.log("hihihihihihihihihihi")
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  return (
    <>
      <Header toggleDrawer={toggleDrawer} />
      {children}
      <TemporaryDrawer state={state} toggleDrawer={toggleDrawer} />
    </>
  );
};

export default Wrapper;
