import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <main>
      <Navbar />
      <Outlet />
    </main>
  );
};

export default Layout;
