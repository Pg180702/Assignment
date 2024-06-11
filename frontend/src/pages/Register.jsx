import React, { useState, useContext } from "react";
import getGoogleOauthURL from "../utils/getGoogleUrl";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";
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

const Register = () => {
  const [name, setName] = useState("");
  const { setUserInfo } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/register`,
      {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
        headers: { "Content-Type": "application/json" },
      }
    );
    const resData = await response.json();
    if (response.status === 200) {
      alert("Registration success");
      setUserInfo(resData.userId);
      sessionStorage.setItem("user-id", resData.userId);
      sessionStorage.setItem("jsontoken", resData.token);

      navigate("/audience");
    } else if (response.status === 400)
      alert("User already exists, Kindly Login or use a different email");
    else alert("registration failed");
  };
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
            <Typography variant="h5">Register</Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} sx={{ padding: "1rem" }}>
                <Grid xs={12} sm={12} item>
                  <TextField
                    placeholder="Enter First Name"
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
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
                <Grid xs={12} sm={12} sx={{ textAlign: "center" }}>
                  OR
                </Grid>
                <Grid xs={12} sm={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    href={getGoogleOauthURL()}
                  >
                    Register With Google <span> </span> <GoogleIcon />
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

export default Register;
