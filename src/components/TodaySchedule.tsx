"use client";
import React from "react";
import { useTodaySchedule } from "../hooks/useTodaySchedule";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function TodaySchedule() {
  const { plan, loading, toggleStatus, regenerate } = useTodaySchedule();
  const todayStr = new Date().toDateString();

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <SpaceDashboardIcon /> {todayStr} - Today&apos;s Schedule
      </h1>

      {loading ? (
        <div className="text-center text-lg text-gray-500 animate-pulse">
          Loading tasks...
        </div>
      ) : plan.length === 0 ? (
        <div className="text-center text-gray-400">
          You have no tasks for today.
        </div>
      ) : (
        <div className="space-y-4">
          {plan.map((item) => (
            <div
              key={`${item.taskID}-${item.subtaskID}`}
              className={`shadow-md rounded-xl p-4 border transition hover:shadow-lg flex justify-between items-start gap-4
                ${
                  item.subtaskstatus === "completed"
                    ? "bg-green-100 border-green-300"
                    : "bg-white border-gray-100"
                }
              `}
            >
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.taskname}</h2>
                <p className="text-sm text-gray-700 mb-1">{item.subtaskname}</p>
                <p className="text-xs text-gray-500 mb-1">
                  {item.subtaskdescription} – {item.subtaskduration} hr
                </p>
                {item.subtaskstatus === "completed" && (
                  <span className="text-sm text-green-700 font-medium">
                    ✔ Completed
                  </span>
                )}
              </div>

              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() =>
                    toggleStatus(
                      item.taskID,
                      item.subtaskID,
                      item.subtaskstatus
                    )
                  }
                  className={`text-2xl hover:scale-110 transition-transform
                    ${
                      item.subtaskstatus === "completed"
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  `}
                  title={
                    item.subtaskstatus === "completed"
                      ? "Mark as Pending"
                      : "Mark as Completed"
                  }
                >
                  <CheckCircleIcon />
                </button>
              </div>
            </div>
          ))}

          <div className="text-center mt-4">
            <button
              onClick={regenerate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Regenerate Today&apos;s Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
