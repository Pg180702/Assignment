import React, { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";
const RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUserInfo } = useContext(UserContext);
  useEffect(() => {
    const handleOAuthRedirect = () => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get("token");
      const userId = queryParams.get("userId");

      if (token && userId) {
        // Store token and userId in local storage
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user-id", userId);
        console.log(sessionStorage.getItem("token"));
        setUserInfo({ userId: userId, token: token });
        // Redirect to a secure page or home page
        alert("Successfully looged in/registered");
        navigate("/audience");
      } else {
        // Handle error, e.g., redirect to an error page
        console.error("OAuth process failed: Missing token or userId");
        navigate("/");
      }
    };

    handleOAuthRedirect();
  }, [location, navigate]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "4rem",
      }}
    >
      Loading...
    </div>
  );
};

export default RedirectHandler;
