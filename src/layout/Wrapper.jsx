import { useState } from "react";
import Header from "../components/Header";
import TemporaryDrawer from "../components/TemporaryDrawer";
import Theme from "../context/Theme";
import AppContext from "../context/AppContext";

const Wrapper = ({ children }) => {

  return (
    <Theme>
      <AppContext>
        <Header />
        {children}
        <TemporaryDrawer />
      </AppContext>
    </Theme>
  );
};

export default Wrapper;
