import React, { useContext, useEffect, useState } from "react";
import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import { UserContext } from "./UserContext";
import { Link } from "react-router-dom";
const Navbar = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);
  // const [loading, setLoading] = useState(false);

  const logout = () => {
    setUserInfo(null);
    sessionStorage.removeItem("user-id");
    sessionStorage.removeItem("token");
    window.location.href = "/";
  };
  const username = userInfo;
  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: "#343a40" }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontSize: "1rem", fontWeight: "bold" }}
          >
            <Link
              to="/"
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "1.2rem",
              }}
            >
              XenoCRM
            </Link>
          </Typography>
          {username && (
            <>
              <Link to="/audience">
                <Button style={{ color: "white", fontSize: "0.9rem" }}>
                  Create Audience
                </Button>
              </Link>
              <Button
                style={{ color: "white", fontSize: "0.9rem" }}
                onClick={logout}
              >
                Logout
              </Button>
              <Link to={"/campaign"}>
                <Button style={{ color: "white", fontSize: "0.9rem" }}>
                  My Campaigns
                </Button>
              </Link>
            </>
          )}
          {!username && (
            <>
              <Link to="/login">
                <Button style={{ color: "white", fontSize: "0.9rem" }}>
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button style={{ color: "white", fontSize: "0.9rem" }}>
                  Register
                </Button>
              </Link>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
