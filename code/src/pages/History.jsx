import "../App.css";
import useGuild from "../hooks/useGuild";
import Table from "../components/Table";
import { useMediaQuery } from "react-responsive";
import MobileCard from "../components/MobileCard";
import LinearProgress from "@mui/material/LinearProgress";
import Variants from "../components/Variants";
import { useTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Filter from "../components/Filter";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { Context } from "../context/AppContext";
import useGuildHistory from "../hooks/useGuildHistory";

function History() {
  const { historyKeys } = useGuildHistory();

  const [selected, setSelected] = useState("");

  // const players = useMemo(
  //   () => seleted?.map((item) => ({ label: item.name, _id: item._id })),
  //   [seleted]
  // );

  useEffect(() => {
    const first = historyKeys?.[0];
    console.log(first)
    if (first) {
      setSelected(first.parsed);
    }
  }, [historyKeys]);
  const selectData = (data) => {
    console.log("what", data);
    setSelected(data);
    
  };
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        color: "text.primary",
        p: 3,
      }}
    >
      <FormControl fullWidth>
        <InputLabel>Data</InputLabel>
        <Select defaultValue="" value={selected} label="Data">
          {historyKeys &&
            historyKeys.map((item, index) => {
              return (
                <MenuItem
                  onClick={() => selectData(item)}
                  key={item.key + index}
                  value={selected}
                >
                  Relatorio de: {item.parsed}
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>
      {/* <Filter players={players} /> */}
    </Container>
  );
}

export default History;
