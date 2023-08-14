import "../App.css";
import useGuild from "../hooks/useGuild";
import Table from "../components/Table";
import { useMediaQuery } from "react-responsive";
import MobileCard from "../components/MobileCard";
import LinearProgress from "@mui/material/LinearProgress";
import Variants from "../components/Variants";
import Header from "../components/Header";
import useUser from "../hooks/useUser";


function Home() {
  const query = useGuild();
  // const user = useUser();
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });

  if (!query.data) {
    return (
      <div>
        <LinearProgress />
        <Variants />
        <br/>
        <Variants />
        <br/>
        <Variants />
        <br/>
        <Variants />
      </div>
    );
  }

  return (
    <main>
      {!isDesktopOrLaptop && <MobileCard data={query.data} />}
      {isDesktopOrLaptop && <Table data={query.data} />}
    </main>
  );
}

export default Home;
