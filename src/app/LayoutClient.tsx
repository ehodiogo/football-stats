"use client";
import React from "react";
import { AppBar, Toolbar, Typography, CssBaseline, Drawer, List, ListItemIcon, ListItemText, Box, Divider, ListItemButton } from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import TableChartIcon from "@mui/icons-material/TableChart";
import GroupIcon from "@mui/icons-material/Group";
import Link from "next/link";

const drawerWidth = 220;

const navItems = [
  { label: "Matches", icon: <SportsSoccerIcon />, path: "/matches" },
  { label: "Standings", icon: <TableChartIcon />, path: "/standings" },
  { label: "Teams", icon: <GroupIcon />, path: "/teams" },
];

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Football Statistics
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {navItems.map((item) => (
              <ListItemButton
                key={item.label}
                component={Link}
                href={item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
} 