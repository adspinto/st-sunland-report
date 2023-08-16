import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Groups from "@mui/icons-material/Groups";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Logout from "@mui/icons-material/Logout";
import { Auth } from "aws-amplify";
import { useContext, Fragment } from "react";
import { Context } from "../context/AppContext";

export default function TemporaryDrawer() {
  const { toggleDrawer, drawerState: state } = useContext(Context);
  const Icons = {
    Username: {
      component: <AccountCircle />,
      onClick: () => {},
    },
    Guild: {
      component: <Groups />,
      onClick: () => {},
    },
    Sair: {
      component: <Logout id="logout" />,
      onClick: async () => {
        try {
          await Auth.signOut();
        } catch (error) {
          console.log("error signing out: ", error);
        }
      },
    },
  };
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={(event) => {
        if (event.target.id === "logout" || event.target.innerText === "Sair") {
          const value =
            event.target.id === "logout" ? "Sair" : event.target.innerText;

          Icons[value].onClick();
        } else {
          toggleDrawer(anchor, false)(event);
        }
      }}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {["Username", "Guild", "Sair"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>{Icons[text].component}</ListItemIcon>
              <ListItemText primary={index === 0 ? "Username" : text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      {["left"].map((anchor) => (
        <Fragment key={anchor}>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </Fragment>
      ))}
    </div>
  );
}
