import { createContext, useMemo, useState } from "react";

const initialContext = { open, setOpen: () => {} };
export const Context = createContext(initialContext);

const AppContext = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [autocompleteId, setAutocompleteId] = useState("");
  const [drawerState, setDrawerState] = useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerState({ ...drawerState, [anchor]: open });
  }; 

  const handleOpen = () => setOpen(!open);

  const value = useMemo(
    () => ({ open, setOpen: handleOpen, drawerState, toggleDrawer, autocompleteId, setAutocompleteId }),
    [open, drawerState, autocompleteId]
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default AppContext;
