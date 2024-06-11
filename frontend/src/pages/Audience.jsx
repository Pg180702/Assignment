import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
const Audience = () => {
  const navigate = useNavigate();
  const [audienceSize, setAudienceSize] = useState(0);
  const [conditions, setConditions] = useState([
    // {
    //   attribute: "",
    //   operator: "",
    //   value: "",
    //   logic: "",
    // },
  ]);
  const [initialRule, setInitialRule] = useState({
    attribute: "",
    operator: "",
    value: "",
  });
  const [message, setMessage] = useState("");
  const handleAddCondition = () => {
    setConditions([
      ...conditions,
      { attribute: "", operator: "", value: "", logic: "" },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sessionStorage.getItem("user-id"))
      alert("Please Login/Register First");
    else {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/audience`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ initialRule, conditions }),
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        setAudienceSize(data.size);
        alert(`Audience check success`);
      } else alert("Audience Check Failed");
    }
  };
  const handleAttributeChange = (index, value) => {
    const newConditions = [...conditions];
    newConditions[index].attribute = value;
    setConditions(newConditions);
  };
  const handleOperatorChange = (index, value) => {
    const newConditions = [...conditions];
    newConditions[index].operator = value;
    setConditions(newConditions);
  };
  const handleAudienceSave = async (e) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/campaign-message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            userId: sessionStorage.getItem("user-id"),
            initialRule,
            conditions,
          }),
        }
      );
      if (response.status === 200) {
        alert("Campaign Created and delivery api triggered");
        navigate("/campaign");
      } else alert("Error in Creating Campaign");
    } catch (error) {
      alert("Error while creating campaign");
    }
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "6rem",
          padding: "4rem",
        }}
      >
        <Button variant="contained" onClick={handleAddCondition}>
          Add Rule
        </Button>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ padding: "1rem" }}>
            <Grid xs={12} sm={4} item>
              <InputLabel id="demo-simple-select-autowidth-label">
                Attribute
              </InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                fullWidth
                label="Attribute"
                value={initialRule.attribute}
                onChange={(e) =>
                  setInitialRule((prev) => ({
                    ...prev,
                    attribute: e.target.value,
                  }))
                }
              >
                <MenuItem value="total_spent">Total Spend</MenuItem>
                <MenuItem value="noOfVisits">No Of Visists</MenuItem>
                <MenuItem value="lastVisited">Last Visit</MenuItem>
              </Select>
            </Grid>
            <Grid xs={12} sm={4} item>
              <InputLabel id="demo-simple-select-autowidth-label">
                operator
              </InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                fullWidth
                label="Age"
                value={initialRule.operator}
                onChange={(e) =>
                  setInitialRule((prev) => ({
                    ...prev,
                    operator: e.target.value,
                  }))
                }
              >
                <MenuItem value=">">Greater Than</MenuItem>
                <MenuItem value="<">Less Than</MenuItem>
                <MenuItem value="=">Equal To</MenuItem>
              </Select>
            </Grid>
            <Grid xs={12} sm={4} item>
              <TextField
                fullWidth
                sx={{ marginTop: "1.5rem" }}
                value={initialRule.value}
                onChange={(e) =>
                  setInitialRule((prev) => ({
                    ...prev,
                    value: e.target.value,
                  }))
                }
              />
            </Grid>
          </Grid>
          {conditions.map((condition, index) => (
            <Grid
              container
              spacing={2}
              key={index}
              sx={{
                padding: "1rem",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              }}
            >
              <Grid xs={12} sm={4} item>
                <InputLabel id="demo-simple-select-autowidth-label">
                  Attribute
                </InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  fullWidth
                  label="Attribute"
                  value={condition.attribute}
                  onChange={(e) => handleAttributeChange(index, e.target.value)}
                >
                  <MenuItem value="total_spent">Total Spend</MenuItem>
                  <MenuItem value="noOfVisits">No Of Visists</MenuItem>
                  <MenuItem value="lastVisited">Last Visit</MenuItem>
                </Select>
              </Grid>
              <Grid xs={12} sm={4} item>
                <InputLabel id="demo-simple-select-autowidth-label">
                  operator
                </InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  fullWidth
                  label="Age"
                  value={condition.operator}
                  onChange={(e) => handleOperatorChange(index, e.target.value)}
                >
                  <MenuItem value=">">Greater Than</MenuItem>
                  <MenuItem value="<">Less Than</MenuItem>
                  <MenuItem value="=">Equal To</MenuItem>
                </Select>
              </Grid>
              <Grid xs={12} sm={4} item>
                <TextField
                  fullWidth
                  sx={{ marginTop: "1.5rem" }}
                  value={condition.value}
                  onChange={(e) => {
                    const newConditions = [...conditions];
                    newConditions[index].value = e.target.value;
                    setConditions(newConditions);
                  }}
                />
              </Grid>
              <Grid xs={12} sm={4} item>
                <InputLabel id="demo-simple-select-autowidth-label">
                  Logical Operator
                </InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  fullWidth
                  label="Age"
                  value={condition.logic}
                  onChange={(e) => {
                    const newConditions = [...conditions];
                    newConditions[index].logic = e.target.value;
                    setConditions(newConditions);
                  }}
                >
                  <MenuItem value="AND">AND</MenuItem>
                  <MenuItem value="OR">OR</MenuItem>
                </Select>
              </Grid>
            </Grid>
          ))}
          {audienceSize > 0 ? (
            <>
              <Typography>Audience Size is {audienceSize}</Typography>
            </>
          ) : (
            <></>
          )}
          <Button type="submit">Check Audience Size</Button>
          <Box sx={{ marginTop: "2rem" }}>
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
              <TextField
                variant="outlined"
                label="Enter Campaign Message"
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button
                variant="contained"
                type="button"
                onClick={handleAudienceSave}
              >
                Add campaign and save audience
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </>
  );
};

export default Audience;
