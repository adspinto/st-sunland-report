import "../App.css";
import useGuild from "../hooks/useGuild";
import Table from "../components/Table";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import MobileCard from "../components/MobileCard";

function App() {
  const query = useGuild();
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });

  return (
    <main>
      {!isDesktopOrLaptop && <MobileCard data={query.data} />}
      {isDesktopOrLaptop && <Table data={query.data} />}
    </main>
  );
}

export default App;
