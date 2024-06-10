import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";

const AddCampaign = () => {
  const [message, setMessage] = useState("");
  const handleSubmit = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/campaign-message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message, userId }),
        }
      );
      if (response.ok) alert("Campaign Created. View It Under My Campaigns");
      else alert("Error in Creating Campaign");
    } catch (error) {
      alert("Error while creating campaign");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "3rem",
          gap: "2rem",
        }}
      >
        <TextField variant="outlined" label="Enter Campaign Message" />
        <Button variant="contained" type="submit">
          ADD
        </Button>
      </Box>
    </form>
  );
};

export default AddCampaign;
