/* eslint-disable react/prop-types */
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
import { Box } from "@mui/material";
import { useContext, useMemo } from "react";
import { Context } from "../context/AppContext";

function History({ query }) {
  const { autocompleteId, filtersList, user } = useContext(Context);
  // const isDesktopOrLaptop = useMediaQuery({
  //   query: "(min-width: 1224px)",
  // });

  const theme = useTheme();
  const queryData = useMemo(() => {
    let data = query?.data || [];

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
              ? -1
              : 1;
          case "investDesc":
            return parseInt(a[findChecked.fieldValue].replaceAll(",", "")) <
              parseInt(b[findChecked.fieldValue].replaceAll(",", ""))
              ? -1
              : 1;
          case "renomeAsc":
            return a[findChecked.fieldValue] > b[findChecked.fieldValue]
              ? -1
              : 1;
          case "renomeDesc":
            return a[findChecked.fieldValue] < b[findChecked.fieldValue]
              ? -1
              : 1;

          default:
            return a - b;
        }
      });
    }

    return data;
  }, [autocompleteId, query.data, filtersList]);

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

  return <MobileCard theme={theme} data={queryData} user={user} />;
}

export default History;
