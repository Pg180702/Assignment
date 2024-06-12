import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Modal,
  Typography,
  Box,
} from "@mui/material";
import React, { useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { sm: 400, xs: 300 },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const Campaign_Card = ({ data, id }) => {
  const [stats, setStats] = useState(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const fetchStats = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/campaign-stats/${id}`
      );
      const resData = await response.json();
      console.log(resData);
      setStats({ success: resData.success, failed: resData.fail });
    } catch (error) {
      alert("fetch error");
    }
  };
  return (
    <>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} variant="h5">
            {data.content}
          </Typography>
          <Typography variant="p" component="div" sx={{ fontSize: "1.5rem" }}>
            Created at: {new Date(data.createdAt).toLocaleString()}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            onClick={() => {
              handleOpen();
              fetchStats();
            }}
          >
            Get Stats
          </Button>
        </CardActions>
      </Card>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {stats ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">
                  Total Audience: {stats.success + stats.failed}
                </Typography>
                <Typography variant="h6" sx={{ marginTop: "1.5rem" }}>
                  Requests that were successful: {stats.success}
                </Typography>
                <Typography variant="h6" sx={{ marginTop: "1.5rem" }}>
                  Requests that failed: {stats.failed}
                </Typography>
              </Box>
            </>
          ) : (
            <Typography
              variant="h4"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "Poppins",
                fontSize: "2em",
              }}
            >
              <CircularProgress />
            </Typography>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default Campaign_Card;
