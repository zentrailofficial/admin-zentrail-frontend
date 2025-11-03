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
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import WorkIcon from "@mui/icons-material/Work";
import {
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
  ChevronLeft,
  VerifiedUserOutlined,
} from "@mui/icons-material";
import { useThemeMode } from "../../context/ThemeProvider";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import HikingIcon from '@mui/icons-material/Hiking';
import commoncss from "../../styles/commoncss";
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import CategoryIcon from '@mui/icons-material/Category';
import SatelliteIcon from '@mui/icons-material/Satellite';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import { apiClient } from "../../lib/api-client";

const FULL_DRAWER_WIDTH = 240;
const MINI_DRAWER_WIDTH = 60;



export default function Navbar() {
  const theme = useTheme();
  const location = useLocation()
  const { user, logout } = useAuth();
  const { toggleColorMode } = useThemeMode();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const sidebarMap = {
    Blog: {
      title: "Blog",
      icon: <AutoStoriesIcon />,
      path: "/blog",
      show:user?.role =="admin"
    },
    Category: {
      title: "Category",
      icon: <CategoryIcon />,
      path: "/category",
      show:user?.role =="admin"
    },
    subCategory: {
      title: "Sub Category",
      icon: <SatelliteIcon />,
      path: "/listsubcategory",
      show:user?.role =="admin"
    },
    inqueryform: {
      title: "Leads",
      icon: <NewReleasesIcon />,
      path: "/leads",
      show:user?.role =="admin"|| user?.role =="manager"|| user?.role =="executive"
    },
    TravelPackage: {
      title: "Travel Package",
      icon: <HikingIcon />,
      path: "/travelpackage",
      show:user?.role =="admin"
    },
    Portfolio: {
      title: "Portfolio",
      icon: <WorkIcon />,
      path: "/portfolio",
      show:user?.role =="admin"
    },
    Service: {
      title: "Services",
      icon: <SettingsSuggestIcon />,
      path: "/services",
      show:user?.role =="admin"
    },
    servicePage: {
      title: "Service Page",
      icon: <MiscellaneousServicesIcon />,
      path: "/categoryservices",
      show:user?.role =="admin"
    },
    User:{
      title: "Role",
      icon: <VerifiedUserOutlined />,
      path: "/role",
      show:user?.role =="admin"|| user?.role =="manager"
    },
  };

  const staticItems = [
    { title: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  ];
  // console.log(user)
  // console.log(user?.panel)
  // console.log(user?.allowedModels)
  const panelType = user?.panel;
  // console.log(user?.allowedModels?.[panelType])

  const fetchApiForPanelToken = async (val) => {
    console.log(val?.target?.innerText)
    const response = await apiClient.post("/api/auth/superadmin/token", { "panel": val?.target?.innerText });
    console.log(response?.data)
  }

  // const NAV_ITEMS = [
  //   ...staticItems,
  //   ...user?.allowedModels?.[panelType]?.map((key) => sidebarMap[key]).filter(Boolean), 
  // ];

  const NAV_ITEMS = [
    ...staticItems,
    ...(user?.allowedModels?.[panelType]
      ? user.allowedModels[panelType].map((key) => sidebarMap[key]).filter(Boolean).filter(item => item.show !== false)
      : [])
  ];

  // const NAV_ITEMS = [
  //   ...staticItems,
  //   ...Object.values(user?.allowedModels || {})
  //     .flat() // flatten all arrays
  //     .map((key) => sidebarMap[key])
  //     .filter(Boolean)
  // ];



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
  const drawerContent = (
    <div>
      <Toolbar sx={{ justifyContent: "center" }} />
      {user?.role !== "superadmin" ? <List>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;

          return (
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
                  color: "#c843ff",
                }}
              >
                {item.icon}
              </ListItemIcon>

              {!miniDrawer && (
                <ListItemText
                  primary={item.title}
                  sx={{
                    ...(isActive && {
                      background:
                        "linear-gradient(135deg, #c843ff, #ff7eff, #75d9e6ff)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: 600,
                    }),
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List> :
        <List>
          {user?.panel?.map((val) => <ListItemButton onClick={(val) => fetchApiForPanelToken(val)}>{val}</ListItemButton>)}
        </List>}
    </div>
  );

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      {/* <CssBaseline /> */}

      {/* Top AppBar */}
      <AppBar sx={commoncss.apptop}>
        <Toolbar>
          <IconButton
            color="red"
            edge="start"
            onClick={handleDrawerToggle}
            sx={commoncss.iconbtn2}>
            <MenuIcon />
          </IconButton>
          <IconButton
            edge="start"
            onClick={handleMiniDrawerToggle}
            sx={commoncss.iconbtn}
          >
            {miniDrawer ? <MenuIcon /> : <ChevronLeft />}
          </IconButton>
          <Typography
            variant="h6"
            sx={[commoncss.navtypography, { textTransform: 'capitalize' }]}>
            {user.panel === "travel" ? 'Zentrail' : user.panel} Admin Panel
          </Typography>
          <IconButton onClick={toggleColorMode}
            sx={commoncss.iconbtn}>
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
