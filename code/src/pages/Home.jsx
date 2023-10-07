import "../App.css";
import useGuild from "../hooks/useGuild";
import MobileCard from "../components/MobileCard";
import LinearProgress from "@mui/material/LinearProgress";
import Variants from "../components/Variants";
import { useTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Filter from "../components/Filter";
import { Box } from "@mui/material";
import { useContext, useMemo } from "react";
import { Context } from "../context/AppContext";

function Home() {
 
  const query = useGuild();


  const { autocompleteId, filtersList, user } = useContext(Context);
  // const isDesktopOrLaptop = useMediaQuery({
  //   query: "(min-width: 1224px)",
  // });

  const theme = useTheme();
  const players = useMemo(
    () => query?.data?.map((item) => ({ label: item.name, _id: item._id })),
    [query.data]
  );

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
      <Filter players={players} />
      <MobileCard theme={theme} data={queryData} user={user} />
      {/* {isDesktopOrLaptop && <Table theme={theme} data={queryData} />} */}
    </Container>
  );
}

export default Home;
