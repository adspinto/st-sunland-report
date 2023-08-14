import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Groups from "@mui/icons-material/Groups";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Logout from "@mui/icons-material/Logout";
import Filter from "@mui/icons-material/Filter";
import { Auth } from "aws-amplify";

export default function TemporaryDrawer({ state, toggleDrawer }) {
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
    }
  
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
        <React.Fragment key={anchor}>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
