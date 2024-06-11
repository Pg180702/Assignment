import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import React from "react";

const Campaign_Card = ({ data, id }) => {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {data.content}
        </Typography>
        <Typography variant="h5" component="div">
          Created at: {new Date(data.createdAt).toLocaleString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Get Stats</Button>
      </CardActions>
    </Card>
  );
};

export default Campaign_Card;
