// hooks/useTodaySchedule.ts
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

  // Fetches today’s plan; regenerates if not found
  const fetchTodayPlan = async () => {
    setLoading(true);
    // Try to get existing schedule
    console.log("calling today from fetpalns");
    const res = await fetch("/api/scheduleTasks/today");
    console.log("calling today from fetpalns completed");
    if (res.status === 404) {
      // If none, generate a new schedule
      console.log(
        "**************************************************************************************calling regenerate from fetch planes"
      );
      await fetch("/api/scheduleTasks/regenerate", { method: "POST" });
      console.log(
        "**************************************************************************************calling regenerate from fetch planes completed"
      );
      // Then fetch the newly created schedule
      console.log("calling today form if");
      const res2 = await fetch("/api/scheduleTasks/today");
      console.log("calling today form if completed");
      const data2 = await res2.json();
      setPlan(data2);
    } else {
      // Schedule exists: parse and set state
      const data = await res.json();
      setPlan(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTodayPlan();
    // We want this to run only once (on mount), hence empty deps
  }, []);

  // Toggle status of a subtask: update both Tasks and DailySchedule
  const toggleStatus = async (
    taskID: string,
    subtaskID: string,
    currentStatus: string
  ) => {
    console.log(
      "calling toggle status################################################"
    );
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    // Update main Tasks DB
    if (!subtaskID) {
      throw new Error("to call toggle give correct ID");
    }

    console.log("calling to the subid put request");
    await fetch(`/api/tasks/${taskID}/subtasks/${subtaskID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subtaskstatus: newStatus }),
    });
    console.log("calling to the subid put request completed");
    // Update DailySchedule
    console.log("calling for update in toggle");
    await fetch(`/api/scheduleTasks/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subtaskID, newStatus }),
    });
    console.log("calling for update in toggle completed");

    // Refresh plan
    fetchTodayPlan();
  };

  // Regenerate handler (for button)
  const regenerate = async () => {
    console.log("calling regerate Post");
    await fetch("/api/scheduleTasks/regenerate", { method: "POST" });
    console.log("calling regerate Post completed");

    fetchTodayPlan();
  };

  return { plan, loading, toggleStatus, regenerate };
}
