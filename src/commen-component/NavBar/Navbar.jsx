import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  IconButton,
  MenuItem,
  Menu,
  Avatar,
  Divider,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import WorkIcon from "@mui/icons-material/Work";
import {
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
  ChevronLeft,
} from "@mui/icons-material";
import { useThemeMode } from "../../context/ThemeProvider";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import HikingIcon from '@mui/icons-material/Hiking';
const FULL_DRAWER_WIDTH = 240;
const MINI_DRAWER_WIDTH = 60;

const NAV_ITEMS = [
  { title: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { title: "Blog", icon: <AutoStoriesIcon />, path: "/blog" },
  { title: "Portfolio", icon: <WorkIcon />, path: "/portfolio" },
  { title: "Services", icon: <DashboardIcon />, path: "/services" },
  { title: "Category", icon: <DashboardIcon />, path: "/category" },
  {
    title: "Category Feature",
    icon: <DashboardIcon />,
    path: "/categoryservices",
  },
  {
    title: "Travel Package",
    icon: <HikingIcon />,
    path: "/travelpackage",
  },
  
  {
    title: "Leads",
    icon: <DashboardIcon />,
    path: "/leads",
  },
];

export default function Navbar() {
  const theme = useTheme();
  const { user ,logout} = useAuth();
  const { toggleColorMode } = useThemeMode();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/")
  };

  const [mobileOpen, setMobileOpen] = useState(false);
  const [miniDrawer, setMiniDrawer] = useState(false); // For desktop

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMiniDrawerToggle = () => {
    setMiniDrawer(!miniDrawer);
  };
console.log(user)
  const drawerContent = (
    <div>
      <Toolbar sx={{ justifyContent: "center" }} />
      <List>
        {NAV_ITEMS.map((item) => (
          <ListItemButton
            key={item.title}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            sx={{
              justifyContent: miniDrawer ? "center" : "flex-start",
              px: miniDrawer ? 2 : 3,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: miniDrawer ? 0 : 2,
                justifyContent: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!miniDrawer && <ListItemText primary={item.title} />}
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      {/* <CssBaseline /> */}

      {/* Top AppBar */}
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleMiniDrawerToggle}
            sx={{ mr: 2, display: { xs: "none", sm: "inline-flex" } }}
          >
            {miniDrawer ? <MenuIcon /> : <ChevronLeft />}
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
           {user.panel === "travel" ? 'Zentrail' : user.panel } Admin Panel
          </Typography>
          <IconButton onClick={toggleColorMode} color="inherit">
            {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <IconButton onClick={handleMenuOpen} color="inherit">
            <Avatar sx={{ bgcolor: "primary.main" }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Avatar>
          </IconButton>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Typography sx={{ px: 2, py: 1, fontWeight: "bold" }}>
              {user?.name || "User"}
            </Typography>
            <Divider />
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Navigation */}
      <Box
        component="nav"
        sx={{
          width: { sm: miniDrawer ? MINI_DRAWER_WIDTH : FULL_DRAWER_WIDTH },
          flexShrink: 0,
        }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: FULL_DRAWER_WIDTH },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: miniDrawer ? MINI_DRAWER_WIDTH : FULL_DRAWER_WIDTH,
              overflowX: "hidden",
              transition: "width 0.3s",
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: "margin-left 0.3s",
          width: {
            sm: miniDrawer
              ? `${MINI_DRAWER_WIDTH}px`
              : `${FULL_DRAWER_WIDTH}px`,
          }, // create space for drawer
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
