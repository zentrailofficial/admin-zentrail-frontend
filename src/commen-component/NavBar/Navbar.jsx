// import * as React from 'react';
// import PropTypes from 'prop-types';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import { createTheme } from '@mui/material/styles';
// import DashboardIcon from '@mui/icons-material/Dashboard';

// import { AppProvider } from '@toolpad/core/AppProvider';
// import { DashboardLayout } from '@toolpad/core/DashboardLayout';
// import { DemoProvider, useDemoRouter } from '@toolpad/core/internal';
// import AutoStoriesIcon from '@mui/icons-material/AutoStories';
// import WorkIcon from '@mui/icons-material/Work';
// import { Outlet } from 'react-router-dom';

// const NAVIGATION = [
//   // {
//   //   kind: 'header',
//   //   title: 'Main items',
//   // },
//   {
//     segment: 'dashboard',
//     title: 'Dashboard',
//     icon: <DashboardIcon />,
//   },
//   {
//     segment: 'blog',
//     title: 'Blog',
//     icon: <AutoStoriesIcon />,
//   },
//   {
//     segment: 'portfolio',
//     title: 'Portfolio',
//     icon: <WorkIcon />,

//   },
//   {
//     segment: 'services',
//     title: 'Services',
//     icon: <DashboardIcon />
//   },
//   {
//       segment: 'category',
//     title: 'category',
//     icon: <DashboardIcon />
//   },
//   {
//     segment: 'categoryservices',
//     title: 'category services',
//     icon: <DashboardIcon />
//   },
//   // {
//   //   kind: 'header',
//   //   title: 'Analytics',
//   // },
//   // {
//   //   segment: 'reports',
//   //   title: 'Reports',
//   //   icon: <BarChartIcon />,
//   //   children: [
//   //     {
//   //       segment: 'sales',
//   //       title: 'Sales',
//   //       icon: <DescriptionIcon />,
//   //     },
//   //     {
//   //       segment: 'traffic',
//   //       title: 'Traffic',
//   //       icon: <DescriptionIcon />,
//   //     },
//   //   ],
//   // },
//   // {
//   //   segment: 'integrations',
//   //   title: 'Integrations',
//   //   icon: <LayersIcon />,
//   // },
// ];

// const demoTheme = createTheme({
//   cssVariables: {
//     colorSchemeSelector: 'data-toolpad-color-scheme',

//   },
//   colorSchemes: { light: true, dark: true },
//   breakpoints: {
//     values: {
//       xs: 0,
//       sm: 600,
//       md: 600,
//       lg: 1200,
//       xl: 1536,
//     },
//   },
// });

// function DemoPageContent({ pathname }) {
//   return (
//     <Box
//       sx={{
//         width: '100%',
//         height: '100vh',

//         py: 4,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         textAlign: 'center',
//       }}
//     >
//       <Typography>Dashboard content for {pathname}</Typography>
//     </Box>
//   );
// }

// function Navbar(props) {
//   const { window } = props;
//   const [session, setSession] = React.useState({
//     user: {
//       name: 'Bharat Kashyap',
//       email: 'bharatkashyap@outlook.com',
//       image: 'https://avatars.githubusercontent.com/u/19550456',
//     },
//   });

//   const authentication = React.useMemo(() => {
//     return {
//       signIn: () => {
//         setSession({
//           user: {
//             name: 'Bharat Kashyap',
//             email: 'bharatkashyap@outlook.com',
//             image: 'https://avatars.githubusercontent.com/u/19550456',
//           },
//         });
//       },
//       signOut: () => {
//         setSession(null);
//       },
//     };
//   }, []);

// return (

//       <AppProvider sx={{ width: '100vw' , height: '100%' }}
//         branding={{
//           logo: <img src="./companylogo.png" alt="MUI logo" />,
//           title: 'Admin panel',
//           homeUrl: '/dashboard',
//         }}
//         session={session}
//         authentication={authentication}
//         navigation={NAVIGATION}
//         theme={demoTheme}
//         // window={demoWindow}

//       >
//         <DashboardLayout sx={{ width: '100%', height: '111vh', p:3,flexGlow:1  }}>
//           <Outlet />
//         </DashboardLayout>
//       </AppProvider>

//   );
// }
// export default Navbar;

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
import { useThemeMode } from "../../utils/ThemeProvider";
import { useState } from "react";

const FULL_DRAWER_WIDTH = 240;
const MINI_DRAWER_WIDTH = 60;

const NAV_ITEMS = [
  { title: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { title: "Blog", icon: <AutoStoriesIcon />, path: "/blog" },
  { title: "Portfolio", icon: <WorkIcon />, path: "/portfolio" },
  { title: "Services", icon: <DashboardIcon />, path: "/services" },
  { title: "Category", icon: <DashboardIcon />, path: "/category" },
  {
    title: "Category Services",
    icon: <DashboardIcon />,
    path: "/categoryservices",
  },
];

export default function Navbar() {
  const theme = useTheme();
  const { toggleColorMode } = useThemeMode();
  const navigate = useNavigate();

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
    <Box sx={{ display: "flex" ,width:"100%"}}>
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
            Admin Panel
          </Typography>
          <IconButton onClick={toggleColorMode} color="inherit">
            {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
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
