import Menu from "@mui/icons-material/Menu";
import { IconButton, useTheme } from "@mui/material";
import Brightness7 from "@mui/icons-material/Brightness7";
import Brightness4 from "@mui/icons-material/Brightness4";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useContext } from "react";
import { ColorModeContext } from "../context/Theme";
import { Context } from "../context/AppContext";

const Header = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { toggleDrawer, user } = useContext(Context);
  const guildName = user ? user["custom:guildName"] : "";
  return (
    <Box
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
        p: 3,
      }}
      className="header-container"
    >
      <h2>{guildName || "Relatório ST"}</h2>
      <Box>
        <IconButton
          sx={{ ml: 1 }}
          onClick={colorMode.toggleColorMode}
          color="inherit"
        >
          {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
        <Button
          sx={{
            color: "text.primary",
          }}
          onClick={toggleDrawer("left", true)}
        >
          <Menu />
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
