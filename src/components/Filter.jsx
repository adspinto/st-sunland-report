import Box from "@mui/material/Box";
import AutoCompleteNames from "./AutoCompleteNames";
import FilterAlt from "@mui/icons-material/FilterAlt";
import { Button } from "@mui/material";
import FilterList from "./FilterList";
import { useContext } from "react";
import { Context } from "../context/AppContext";
const Filter = ({ players = [] }) => {
  const { open, setOpen } = useContext(Context);
  return (
    <>
      <Box
        sx={{
          width: "95%",
          display: "flex",

          mb: 1,
          boxShadow: 3,
        }}
      >
        <AutoCompleteNames players={players} />
        <Button onClick={setOpen} color="inherit">
          <FilterAlt />
        </Button>
      </Box>
      <FilterList open={open} handleClick={setOpen} />
    </>
  );
};
export default Filter;
