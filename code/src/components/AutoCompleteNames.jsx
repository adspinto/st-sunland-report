import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Context } from "../context/AppContext";
import { useContext } from "react";

export default function ComboBox({ players }) {
  const { setAutocompleteId } = useContext(Context);
  return (
    <Autocomplete
      onChange={(event, newValue) => {
        setAutocompleteId(newValue?._id);
      }}
      disablePortal
      id="combo-box-demo"
      options={players}
      sx={{ width: "100%", "& fieldset": { border: "none" } }}
      renderInput={(params) => <TextField {...params} label="Busca Player" />}
    />
  );
}
