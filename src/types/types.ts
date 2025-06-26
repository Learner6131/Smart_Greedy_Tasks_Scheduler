export type Pending = {
  taskID: string;
  taskname: string;
  deadline: Date;
  subtaskID: string;
  subtaskname: string;
  subtaskdescription: string;
  subtaskduration: number;
  subtaskstatus: string;
  weight: Weight;
};

export type Weight = {
  deadline: number;
  priorityScore: number;
  daysLeft: number;
  remaining: number;
  task: TaskType;
};

export type Subtask = {
  subtaskID: string;
  subtaskname: string;
  subtaskduration: number;
  subtaskstatus: string;
  subtaskdescription: string;
};

export type TaskType = {
  _id: string;
  userID: string;
  taskname: string;
  deadline: Date;
  duration: number;
  priority: string;
  description: string;
  status: string;
  subtasks: Subtask[];
  workedDuration: number;
  remainingDuration: number;
};
