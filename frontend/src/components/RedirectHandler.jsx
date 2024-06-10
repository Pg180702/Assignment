import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthRedirect = () => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get("token");
      const userId = queryParams.get("userId");

      if (token && userId) {
        // Store token and userId in local storage
        localStorage.setItem("token", token);
        localStorage.setItem("user-id", userId);
        console.log(localStorage.getItem("token"));

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
