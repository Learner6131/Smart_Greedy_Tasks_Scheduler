// "use client";
// import React from "react";
// import { useState, useEffect } from "react";
// import { Pending, Subtask } from "@/types/types";

// export default function TodaySchedule() {
//   const today = new Date();

//   const [plan, setPlan] = useState<Pending[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [displayedSubtasks, setDisplayedSubtasks] = useState<Set<string>>(
//     new Set()
//   );

//   const fetchTodayPlan = async () => {
//     const res = await fetch("/api/scheduleTasks/today");
//     const data = await res.json();

//     const newIDs = new Set(displayedSubtasks);
//     data.forEach((sub: Subtask) => newIDs.add(sub.subtaskID));
//     setDisplayedSubtasks(newIDs);

//     setPlan(data);
//     if (data) {
//       console.log("status", data[0].subtaskstatus);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchTodayPlan();
//   }, []);

//   const toggleStatus = async (
//     taskID: string,
//     subtaskID: string,
//     currentStatus: string
//   ) => {
//     console.log("current status : ", currentStatus);
//     const newStatus = currentStatus === "completed" ? "pending" : "completed";
//     console.log("new status : ", newStatus);
//     await fetch(`/api/tasks/${taskID}/subtasks/${subtaskID}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ subtaskstatus: newStatus }),
//     });
//     fetchTodayPlan();
//   };

//   return (
//     <div>
//       <div className="showdate flex justify-center  bg-black text-white p-4">
//         {" "}
//         {today.toDateString()}
//       </div>
//       <div className="p-6 max-w-3xl mx-auto">
//         <h1 className="text-2xl font-bold mb-4">📅 Today`&apos;`s Schedule</h1>
//         {loading ? (
//           <p>Loading...</p>
//         ) : plan.length === 0 ? (
//           <p className="text-gray-500">You have no tasks for today.</p>
//         ) : (
//           <ul className="space-y-4">
//             {plan
//               .filter(
//                 (item) =>
//                   item.subtaskstatus !== "completed" ||
//                   displayedSubtasks.has(item.subtaskID)
//               )
//               .map((item) => (
//                 <li
//                   key={`${item.taskID}-${item.subtaskID}`}
//                   className={`rounded shadow flex justify-between items-start border ${
//                     item.subtaskstatus === "completed"
//                       ? "bg-green-200 border-green-400"
//                       : "bg-white border-gray-200"
//                   } p-4`}
//                 >
//                   <div>
//                     <h3 className="text-lg font-semibold">{item.taskname}</h3>
//                     <p className="font-medium">{item.subtaskname}</p>
//                     <p className="text-sm text-gray-600">
//                       {item.subtaskdescription}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       Duration: {item.subtaskduration} hr
//                     </p>
//                     {item.subtaskstatus === "completed" && (
//                       <p className="text-green-600 text-xs font-medium mt-1">
//                         ✔ Completed
//                       </p>
//                     )}
//                   </div>
//                   <button
//                     onClick={() =>
//                       toggleStatus(
//                         item.taskID,
//                         item.subtaskID,
//                         item.subtaskstatus
//                       )
//                     }
//                     className={`text-2xl ${
//                       item.subtaskstatus === "completed"
//                         ? "text-green-600"
//                         : "text-gray-400"
//                     }`}
//                     title="Mark as Done"
//                   >
//                     ✅
//                   </button>
//                 </li>
//               ))}
//           </ul>
//         )}
//       </div>
//       <button
//         onClick={async () => {
//           const res = await fetch("/api/scheduleTasks/regenerate", {
//             method: "POST",
//           });
//           const data = await res.json();
//           alert(data.message); // Optional: toast/snackbar
//           window.location.reload(); // Or re-call fetchTodayPlan()
//         }}
//         className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
//       >
//         🔁 Regenerate Today`&apos;`s Plan
//       </button>
//     </div>
//   );
// }

import React from "react";
import TodaySchedule from "@/components/TodaySchedule";

export default function TodaysSchedulePage() {
  return <TodaySchedule />;
}
