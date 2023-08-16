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

function Home() {
  const query = useGuild();
  // const user = useUser();

  const { autocompleteId } = useContext(Context);
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const theme = useTheme();
  const players = useMemo(
    () => query?.data?.map((item) => ({ label: item.name, _id: item._id })),
    [query.data]
  );
  const queryData = useMemo(
    () =>
      autocompleteId
        ? query?.data?.filter((item) => item._id === autocompleteId)
        : query.data,
    [autocompleteId, query.data]
  );
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
      {!isDesktopOrLaptop && <MobileCard theme={theme} data={queryData} />}
      {isDesktopOrLaptop && <Table theme={theme} data={queryData} />}
    </Container>
  );
}

export default Home;
