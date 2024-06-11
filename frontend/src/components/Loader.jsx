import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";
const Loader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "1.5rem",
        marginBottom: "1.5rem",
      }}
    >
      <CircularProgress sx={{ color: "#284b63" }} />
      <h4>
        Kindly Wait For Server On Render To Start. It can Take 50 to 60 seconds
      </h4>
    </Box>
  );
};

export default Loader;
