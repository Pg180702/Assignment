import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Register from "./Register";
import { tablePaginationClasses } from "@mui/base";

const Home = () => {
  const [server, setServer] = useState(false);
  useEffect(() => {
    const checkServer = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/healthcheck`
      );
      const resData = await response.json();
      if (resData.message) setServer(true);
    };
    checkServer();
  }, []);
  return <>{!server ? <Loader /> : <Register />}</>;
};

export default Home;
