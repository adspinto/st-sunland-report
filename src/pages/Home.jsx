import "../App.css";
import useGuild from "../hooks/useGuild";
import Table from "../components/Table";
import { useMediaQuery } from "react-responsive";
import MobileCard from "../components/MobileCard";
import LinearProgress from "@mui/material/LinearProgress";
import Variants from "../components/Variants";
import Header from "../components/Header";
import useUser from "../hooks/useUser";
import { useTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";

function Home() {
  const query = useGuild();
  // const user = useUser();
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const theme = useTheme();
  if (!query.data) {
    return (
      <div>
        <LinearProgress />
        <Variants />
        <br />
        <Variants />
        <br />
        <Variants />
        <br />
        <Variants />
      </div>
    );
  }

  return (
    <Container
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        color: "text.primary",
        p: 3,
      }}
    >
      {!isDesktopOrLaptop && <MobileCard theme={theme} data={query.data} />}
      {isDesktopOrLaptop && <Table theme={theme} data={query.data} />}
    </Container>
  );
}

export default Home;
