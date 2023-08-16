import { createContext, useMemo, useState } from "react";

const initialContext = { open, setOpen: () => {} };
export const Context = createContext(initialContext);

const AppContext = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [autocompleteId, setAutocompleteId] = useState("");
  const [drawerState, setDrawerState] = useState({
    left: false,
  });
  const [filters, setFilters] = useState({
    az: true,
    za: false,
    investAsc: false,
    investDesc: false,
    renomeAsc: false,
    renomeDesc: false,
  });

  const filtersList = useMemo(() => {
    return [
      {
        filterLabel: "A-Z",
        filterStateName: "az",
        value: filters.az,
        fieldValue: "name",
      },
      {
        filterLabel: "Z-A",
        filterStateName: "za",
        value: filters.za,
        fieldValue: "name",
      },
      {
        filterLabel: "Ivestimentos Asc",
        filterStateName: "investAsc",
        value: filters.investAsc,
        fieldValue: "invst_sofar",
      },
      {
        filterLabel: "Investimentos Desc",
        filterStateName: "investDesc",
        value: filters.investDesc,
        fieldValue: "invst_sofar",
      },

      {
        filterLabel: "Renome Asc",
        filterStateName: "renomeAsc",
        value: filters.renomeAsc,
        fieldValue: "bount_week",
      },
      {
        filterLabel: "Renome Desc",
        filterStateName: "renomeDesc",
        value: filters.renomeDesc,
        fieldValue: "bount_week",
      },
    ];
  }, [filters]);

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
    () => ({
      open,
      setOpen: handleOpen,
      drawerState,
      toggleDrawer,
      autocompleteId,
      setAutocompleteId,
      filtersList,
      filters,
      setFilters,
    }),
    [open, drawerState, autocompleteId, filters]
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default AppContext;
