// components/TodaySchedule.tsx
"use client";
import React from "react";
import { useTodaySchedule } from "../hooks/useTodaySchedule";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function TodaySchedule() {
  const { plan, loading, toggleStatus, regenerate } = useTodaySchedule();
  const todayStr = new Date().toDateString();

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" align="center" gutterBottom>
        📅 {todayStr} - Today&apos;s Schedule
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : plan.length === 0 ? (
        <Typography color="textSecondary">
          You have no tasks for today.
        </Typography>
      ) : (
        <List>
          {plan.map((item) => (
            <ListItem
              key={`${item.taskID}-${item.subtaskID}`}
              sx={{
                mb: 1,
                bgcolor:
                  item.subtaskstatus === "completed"
                    ? "success.light"
                    : "background.paper",
                border: "1px solid",
                borderColor:
                  item.subtaskstatus === "completed"
                    ? "success.main"
                    : "grey.300",
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.taskname}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body1">{item.subtaskname}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {item.subtaskdescription} – {item.subtaskduration} hr
                    </Typography>
                    {item.subtaskstatus === "completed" && (
                      <Typography variant="caption" color="success.main">
                        ✔ Completed
                      </Typography>
                    )}
                  </>
                }
              />
              <IconButton
                edge="end"
                color={
                  item.subtaskstatus === "completed" ? "success" : "default"
                }
                onClick={() =>
                  toggleStatus(item.taskID, item.subtaskID, item.subtaskstatus)
                }
                title="Mark as Done"
              >
                <CheckCircleIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}

      <Box textAlign="center" mt={2}>
        <button
          onClick={regenerate}
          style={{
            backgroundColor: "#1976d2",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          🔁 Regenerate Today&apos;s Plan
        </button>
      </Box>
    </Box>
  );
}
