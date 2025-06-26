"use client";
import { TaskType } from "@/types/types";
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import CheckIcon from "@mui/icons-material/Check";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteIcon from "@mui/icons-material/Delete";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
function Dashboard() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [expandedTaskIds, setExpandedTaskIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/tasks");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      const tasks = Array.isArray(data)
        ? data
        : Array.isArray(data.tasks)
        ? data.tasks
        : [];
      setTasks(tasks);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setTasks([]); // fallback to empty list
    }
  };

  const toggleTaskStatus = async (task: TaskType) => {
    const newStatus =
      task.status === "completed"
        ? task.workedDuration > 0
          ? "ongoing"
          : "pending"
        : "completed";

    await fetch(`/api/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    fetchTasks();
  };

  const toggleSubtaskStatus = async (
    task: TaskType,
    subtaskID: string,
    currentStatus: string
  ) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    console.log("calling put for subtasks");
    await fetch(`/api/tasks/${task._id}/subtasks/${subtaskID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subtaskstatus: newStatus }),
    });
    console.log("calling put subtasks done");
    fetchTasks();
  };

  const toggleExpand = (taskId: string) => {
    setExpandedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const deleteTask = async (_id: string) => {
    await fetch(`/api/tasks/${_id}`, { method: "DELETE" });
    fetchTasks();
  };

  const deleteSubtask = async (taskId: string, subtaskID: string) => {
    const task = tasks.find((t) => t.userID === taskId);
    if (!task) {
      throw new Error("no tasks founds");
    }
    const updatedSubtasks = task.subtasks.filter(
      (s) => s.subtaskID !== subtaskID
    );

    await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subtasks: updatedSubtasks }),
    });

    fetchTasks();
  };
  const statusBadge = (status: string) => {
    const base = "text-sm font-semibold px-2 py-1 rounded-full";
    if (status === "completed") return `${base} bg-green-200 text-green-700`;
    if (status === "ongoing") return `${base} bg-yellow-200 text-yellow-800`;
    return `${base} bg-red-200 text-red-700`;
  };

  const getIconColor = (status: string) => {
    return status === "completed" ? "text-green-600" : "text-gray-500";
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        <SpaceDashboardIcon /> Dashboard
      </h1>

      {loading ? (
        <div className="text-center text-lg text-gray-500 animate-pulse">
          Loading tasks...
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center text-gray-400">No tasks found.</div>
      ) : (
        <div className="space-y-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className={`shadow-md rounded-xl p-6 border transition hover:shadow-lg
    ${
      task.status === "completed"
        ? "bg-green-100 border-green-300"
        : task.status === "ongoing"
        ? "bg-yellow-100 border-yellow-300"
        : "bg-white border-gray-100"
    }
  `}
            >
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <div className="flex-1 min-w-[250px]">
                  <h2 className="text-xl font-semibold mb-1">
                    {task.taskname}
                  </h2>
                  <p className="text-sm text-black mb-1">
                    Deadline : {new Date(task.deadline).toLocaleDateString()}
                  </p>
                  <Progress
                    color="green"
                    value={(task.workedDuration / task.duration) * 100}
                  />
                  <p className="text-sm text-black mb-1">
                    Completed : {(task.workedDuration / task.duration) * 100}%
                  </p>
                  <p className="text-sm text-black mb-1">
                    Priority: {task.priority}
                  </p>
                  <p className="text-sm text-black mb-2">
                    Description : {task.description}
                  </p>
                  <span className={statusBadge(task.status)}>
                    {task.status}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => toggleTaskStatus(task)}
                    title="Toggle Task Status"
                    className={`text-xl ${getIconColor(
                      task.status
                    )} hover:scale-110 transition`}
                  >
                    <CheckIcon />
                  </button>
                  <button
                    onClick={() => toggleExpand(task.userID)}
                    title="Expand Subtasks"
                    className="text-xl text-blue-500 hover:scale-110 transition"
                  >
                    {expandedTaskIds.includes(task.userID) ? (
                      <KeyboardArrowDownIcon />
                    ) : (
                      <KeyboardArrowRightIcon />
                    )}
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    title="Delete Task"
                    className="text-xl text-red-500 hover:scale-110 transition"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>

              {/* Subtasks */}
              {expandedTaskIds.includes(task.userID) && (
                <div className="mt-4 border-t pt-4">
                  <h3 className="font-medium mb-2 text-gray-800">
                    <TaskAltIcon /> Subtasks:
                  </h3>
                  <div className="space-y-3">
                    {task.subtasks.map((sub) => (
                      <div
                        key={sub.subtaskID}
                        className="bg-gray-50 p-3 rounded-md flex justify-between items-center"
                      >
                        <div className="flex-1">
                          <p className="font-semibold">{sub.subtaskname}</p>
                          <p className="text-sm text-gray-600">
                            {sub.subtaskdescription}
                          </p>
                          <p className="text-xs text-gray-500">
                            Duration: {sub.subtaskduration} hrs
                          </p>
                          <span className={statusBadge(sub.subtaskstatus)}>
                            {sub.subtaskstatus}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <button
                            onClick={() =>
                              toggleSubtaskStatus(
                                task,
                                sub.subtaskID,
                                sub.subtaskstatus
                              )
                            }
                            title="Toggle Subtask Status"
                            className={`text-xl ${getIconColor(
                              sub.subtaskstatus
                            )} hover:scale-110 transition`}
                          >
                            ✅
                          </button>
                          <button
                            onClick={() =>
                              deleteSubtask(task.userID, sub.subtaskID)
                            }
                            title="Delete Subtask"
                            className="text-xl text-red-500 hover:scale-110 transition"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
