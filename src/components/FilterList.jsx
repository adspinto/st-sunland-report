import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import CheckBox from "@mui/icons-material/RadioButtonCheckedOutlined";
import CheckBoxOutlineBlank from "@mui/icons-material/RadioButtonUncheckedOutlined";
import { Context } from "../context/AppContext";

export default function NestedList({ open }) {
  const { setFilters, filtersList } = React.useContext(Context);

  return (
    <List
      sx={{ width: "100%" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {filtersList.map((item) => {
            return (
              <ListItemButton
                onClick={() =>
                  setFilters({
                    [item.filterStateName]: !item.value,
                  })
                }
                key={item.filterStateName}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  {item.value ? <CheckBox /> : <CheckBoxOutlineBlank />}
                </ListItemIcon>
                <ListItemText primary={item.filterLabel} />
              </ListItemButton>
            );
          })}
        </List>
      </Collapse>
    </List>
  );
}
