import { useState } from "react";
import "../App.css";
import useGuild from "../hooks/useGuild";

function App() {
  const query = useGuild();

  const { isSuccess, data, isLoading } = query;

  
  return <>andrezada</>;
}

export default App;
