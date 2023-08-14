import Menu from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
const Header = ({ user, toggleDrawer }) => {
  return (
    <Box className="header-container">
      <h2>{"Relatório ST"}</h2>
      <Button onClick={toggleDrawer("left", true)}>
        <Menu />
      </Button>
    </Box>
  );
};

export default Header;
