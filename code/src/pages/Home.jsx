import "../App.css";
import MobileCard from "../components/MobileCard";
import LinearProgress from "@mui/material/LinearProgress";
import Variants from "../components/Variants";
import { useTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Filter from "../components/Filter";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { Context } from "../context/AppContext";
import useGuildV2 from "../hooks/useGuildV2";

function Home() {
  const [selected, setSelected] = useState();
  const query = useGuildV2();

  useEffect(() => {
    if (query.data) {
      const currentList = query.data[0];
      setSelected(currentList);
    }
  }, [query.data]);

  const { autocompleteId, filtersList, user } = useContext(Context);

  const theme = useTheme();
  const players = useMemo(
    () =>
      selected?.members?.map((item) => ({ label: item.name, _id: item._id })),
    [selected?.members]
  );

  const queryData = useMemo(() => {
    let data = selected?.members || [];

    if (autocompleteId) {
      return data?.filter((item) => item._id === autocompleteId);
    }

    const findChecked = filtersList.find((item) => item.value);
    if (findChecked) {
      data = [...data].sort((a, b) => {
        switch (findChecked.filterStateName) {
          case "az":
            return a[findChecked.fieldValue] > b[findChecked.fieldValue]
              ? 1
              : -1;
          case "za":
            return b[findChecked.fieldValue] > a[findChecked.fieldValue]
              ? 1
              : -1;
          case "investAsc":
            return parseInt(a[findChecked.fieldValue].replaceAll(",", "")) >
              parseInt(b[findChecked.fieldValue].replaceAll(",", ""))
              ? 1
              : -1;
          case "investDesc":
            return parseInt(a[findChecked.fieldValue].replaceAll(",", "")) <
              parseInt(b[findChecked.fieldValue].replaceAll(",", ""))
              ? 1
              : -1;
          case "renomeAsc":
            return a[findChecked.fieldValue] > b[findChecked.fieldValue]
              ? 1
              : -1;
          case "renomeDesc":
            return a[findChecked.fieldValue] < b[findChecked.fieldValue]
              ? 1
              : -1;

          default:
            return a - b;
        }
      });
    }

    return data;
  }, [autocompleteId, selected?.members, filtersList]);

  if (!query.data) {
    return (
      <Box
        sx={{
          bgcolor: "background.default",
          color: "text.primary",
          p: 3,
        }}
      >
        <LinearProgress />
        <Variants />
        <br />
        <Variants />
        <br />
        <Variants />
        <br />
        <Variants />
      </Box>
    );
  }

  const handleSelect = (event) => {
    console.log(event.target.value);
    setSelected(null);
    setTimeout(() => {
      setSelected(event.target.value);
    }, 500);
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
      {query.data && (
        <>
          <div style={{ margin: "15px" }}>Data do relatório</div>
          <FormControl sx={{ marginBottom: "15px", width: "95%" }}>
            <InputLabel id="demo-simple-select-label">Data</InputLabel>
            <Select
              defaultValue=""
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selected || {}}
              label="Semana"
              onChange={handleSelect}
            >
              {query.data.map((item) => {
                const timestampString = item.date;
                const timestamp = parseInt(timestampString, 10); // Convert the string to a number
                const date = new Date(timestamp);
                const day = date.getDate();
                const year = date.getFullYear();
                const month = date.getMonth();

                const formattedDate = `${day}/${month + 1}/${year}`;
                return (
                  <MenuItem key={item.date} value={item}>
                    {formattedDate}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </>
      )}

      <Filter players={players} />

      <MobileCard theme={theme} data={queryData} user={user} />
      {/* {isDesktopOrLaptop && <Table theme={theme} data={queryData} />} */}
    </Container>
  );
}

export default Home;
