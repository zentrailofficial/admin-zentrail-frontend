import {
  Box,
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
  Collapse,
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
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { useThemeMode } from "../../context/ThemeProvider";
import { useState } from "react";
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
      show: user?.role == "admin",
      group: "Website"
    },
    Category: {
      title: "Category",
      icon: <CategoryIcon />,
      path: "/category",
      show: user?.role == "admin",
      group: "Website"
    },
    subCategory: {
      title: "Sub Category",
      icon: <SatelliteIcon />,
      path: "/listsubcategory",
      show: user?.role == "admin",
      group: "Website"
    },
    inqueryform: {
      title: "Leads",
      icon: <NewReleasesIcon />,
      path: "/leads",
      show: user?.role == "admin" || user?.role == "manager" || user?.role == "executive",
      group: "CRM"
    },
    TravelPackage: {
      title: "Travel Package",
      icon: <HikingIcon />,
      path: "/travelpackage",
      show: user?.role == "admin",
      group: "Website"
    },
    Portfolio: {
      title: "Portfolio",
      icon: <WorkIcon />,
      path: "/portfolio",
      show: user?.role == "admin",
      group: "Website"
    },
    Service: {
      title: "Services",
      icon: <SettingsSuggestIcon />,
      path: "/services",
      show: user?.role == "admin",
      group: "Website"
    },
    servicePage: {
      title: "Service Page",
      icon: <MiscellaneousServicesIcon />,
      path: "/categoryservices",
      show: user?.role == "admin",
      group: "Website"
    },
    User: {
      title: "Role",
      icon: <VerifiedUserOutlined />,
      path: "/role",
      show: user?.role == "admin" || user?.role == "manager",
      group: "CRM"
    },
  };

  const staticItems = [
    { title: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  ];

  const panelType = user?.panel;
  const allowed = user?.allowedModels?.[panelType] || [];

  const allowedItems = allowed
    .map((key) => sidebarMap[key])
    .filter(Boolean);
  const websiteItems = allowedItems.filter((item) => item.group === "Website");
  const crmItems = allowedItems.filter((item) => item.group === "CRM");

  const fetchApiForPanelToken = async (val) => {
    console.log(val?.target?.innerText)
    const response = await apiClient.post("/api/auth/superadmin/token", { "panel": val?.target?.innerText });
    console.log(response?.data)
  }

  const sidebarGroups = [
    ...staticItems,
    ...(websiteItems.length
      ? [{
        title: "Website",
        icon: <AutoStoriesIcon />,
        children: websiteItems,
        show: true,
      }]
      : []),
    ...(crmItems.length
      ? [{
        title: "CRM",
        icon: <VerifiedUserOutlined />,
        children: crmItems,
        show: true,
      }]
      : []),
  ];

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
  const [openMenus, setOpenMenus] = useState({});

const handleToggleMenu = (menuTitle) => {
  setOpenMenus((prev) => ({
    ...prev,
    [menuTitle]: !prev[menuTitle],
  }));
};

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMiniDrawerToggle = () => {
    setMiniDrawer(!miniDrawer);
  };
const drawerContent = (
  <div>
    <Toolbar sx={{ justifyContent: "center" }} />
    {user?.role !== "superadmin" ? (
      <List>
        {sidebarGroups
          .filter((group) => group.show !== false)
          .map((group) => (
            <Box key={group.title}>
              <ListItemButton
                onClick={() => {
                  if (!group.children?.length) {
                    navigate(group.path);
                  } else {
                    handleToggleMenu(group.title);
                  }
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
                  {group.icon}
                </ListItemIcon>

                {!miniDrawer && (
                  <>
                    <ListItemText
                      primary={group.title}
                      sx={{
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    />
                    {group.children?.length > 0 &&
                      (openMenus[group.title] ? (
                        <ExpandLess sx={{ color: "#c843ff" }} />
                      ) : (
                        <ExpandMore sx={{ color: "#c843ff" }} />
                      ))}
                  </>
                )}
              </ListItemButton>

              {!miniDrawer && group.children?.length > 0 && (
                <Collapse
                  in={openMenus[group.title]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding sx={{ pl: 6 }}>
                    {group.children.map((child) => {
                      const isActive = location.pathname === child.path;
                      return (
                        <ListItemButton
                          key={child.title}
                          onClick={() => navigate(child.path)}
                          sx={{
                            py: 0.5,
                            px: 2,
                            borderRadius: 1,
                            backgroundColor: isActive
                              ? "rgba(200, 67, 255, 0.1)"
                              : "transparent",
                            "&:hover": {
                              backgroundColor: "rgba(200, 67, 255, 0.15)",
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: 2,
                              justifyContent: "center",
                              color: "#c843ff",
                            }}
                          >
                            {child.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={child.title}
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
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </Box>
          ))}
      </List>
    ) : (
      <List>
        {user?.panel?.map((val) => (
          <ListItemButton key={val} onClick={(val) => fetchApiForPanelToken(val)}>
            {val}
          </ListItemButton>
        ))}
      </List>
    )}
  </div>
);

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
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

      <Box
        component="nav"
        sx={{
          width: { sm: miniDrawer ? MINI_DRAWER_WIDTH : FULL_DRAWER_WIDTH },
          flexShrink: 0,
        }}
      >
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
          },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
