import { useState, useEffect } from "react";

interface SubtaskItem {
  taskID: string;
  taskname: string;
  subtaskID: string;
  subtaskname: string;
  subtaskdescription: string;
  subtaskduration: number;
  subtaskstatus: string;
}

export function useTodaySchedule() {
  const [plan, setPlan] = useState<SubtaskItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodayPlan = async () => {
    setLoading(true);
    const res = await fetch("/api/scheduleTasks/today");
    if (res.status === 404) {
      await fetch("/api/scheduleTasks/regenerate", { method: "POST" });
      const res2 = await fetch("/api/scheduleTasks/today");
      const data2 = await res2.json();
      setPlan(data2);
    } else {
      const data = await res.json();
      setPlan(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTodayPlan();
  }, []); // if not the [] then function runs evry time

  const toggleStatus = async (
    taskID: string,
    subtaskID: string,
    currentStatus: string
  ) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";

    if (!subtaskID) {
      throw new Error("to call toggle give correct ID");
    }

    await fetch(`/api/tasks/${taskID}/subtasks/${subtaskID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subtaskstatus: newStatus }),
    });
    await fetch(`/api/scheduleTasks/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subtaskID, newStatus }),
    });

    fetchTodayPlan();
  };

  const regenerate = async () => {
    await fetch("/api/scheduleTasks/regenerate", { method: "POST" });

    fetchTodayPlan();
  };

  return { plan, loading, toggleStatus, regenerate };
}
