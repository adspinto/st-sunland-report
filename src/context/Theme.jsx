import { createContext, useMemo, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
export const ColorModeContext = createContext({ toggleColorMode: () => {} });
const initalValue = { mode: "light" };
export const AppContext = createContext(initalValue);

export default function ToggleColorMode({ children }) {
  const persistMode = window.localStorage.getItem("theme_mode") || "light";
  const [mode, setMode] = useState(persistMode);
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          window.localStorage.setItem("theme_mode", prevMode === "light" ? "dark" : "light");
          return prevMode === "light" ? "dark" : "light";
        });
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}
