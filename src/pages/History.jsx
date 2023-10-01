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
import useGuildHistory from "../hooks/useGuildHistory";

function History() {
  const { data } = useGuildHistory();

  return <div>History</div>;
}

export default History;
