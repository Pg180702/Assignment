import React, { useEffect, useState } from "react";
import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
const Navbar = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const username = localStorage.getItem("user-id");
    if (username) setLoading(true);
    else setLoading(false);
  }, []);
  const username = localStorage.getItem("user-id");
  const logout = () => {
    localStorage.removeItem("user-id");
    localStorage.removeItem("token");
    window.location.href = "/";
  };
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
          {loading && (
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
          {!loading && (
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
