import { Menu } from "@mui/icons-material";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useCustomStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  headingLg: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "flex",
    },
    justifyContent: "center",
  },
}));

const Navbar = () => {
  const customClass = useCustomStyles();
  return (
    <AppBar>
      <Toolbar className={customClass.toolbar}>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu">
          <Menu />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          className={customClass.headingLg}
          sx={{ flexGrow: 1 }}
        >
          BEL-Marketing
        </Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
