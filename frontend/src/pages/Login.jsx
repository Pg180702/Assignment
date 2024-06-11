import React, { useState } from "react";
import getGoogleOauthURL from "../utils/getGoogleUrl";
import {
  Stack,
  TextField,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/login`,
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.status === 200) {
      alert("Login success");
      localStorage.setItem("user-id", response.userId);
      localStorage.setItem("jsontoken", response.token);
    } else alert("Login failed");
  };
  //login page
  return (
    <div>
      <Grid>
        <Card
          sx={{
            maxWidth: 800,
            padding: "20px 5px",
            margin: "140px auto auto auto",
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          }}
        >
          <CardContent>
            <Typography variant="h5">Login</Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} sx={{ padding: "1rem" }}>
                <Grid xs={12} sm={12} item>
                  <TextField
                    placeholder="Enter Email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid xs={12} sm={12} item>
                  <TextField
                    placeholder="Enter Password"
                    label="Password"
                    variant="outlined"
                    fullWidth
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
                <Grid xs={12} sm={12} item>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ backgroundColor: "#284b63" }}
                  >
                    Submit
                  </Button>
                </Grid>
                <Grid xs={12} sm={12}>
                  OR
                </Grid>
                <Grid xs={12} sm={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    href={getGoogleOauthURL()}
                  >
                    Login With Google <GoogleIcon />
                  </Button>
                </Grid>
                {/* <Grid xs={12} sm={12} item>
                  <button type="button" onClick={loginHandler}>
                    <GoogleIcon />
                  </button>
                </Grid> */}
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
};

export default Login;
