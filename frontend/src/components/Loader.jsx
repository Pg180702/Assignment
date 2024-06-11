import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";
const Loader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "1.5rem",
        marginBottom: "1.5rem",
      }}
    >
      <CircularProgress sx={{ color: "#284b63" }} />
    </Box>
  );
};

export default Loader;
