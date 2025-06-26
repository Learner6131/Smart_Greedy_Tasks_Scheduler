# Smart AI-Based Task Scheduler

An intelligent task scheduling application that uses machine learning to generate, adjust, and optimize daily task plans based on deadlines, priorities, durations, and user preferences.

---

## 🚀 Features

- **AI-Driven Planning**: Leverages a custom LLM integration to generate an optimal set of subtasks for the day.
- **Adaptive Rescheduling**: Automatically updates today’s plan when tasks are completed early or delayed.
- **Priority & Deadline Aware**: Considers task priority levels and upcoming deadlines to allocate time slots.
- **Manual Regeneration**: One-click regeneration of today’s schedule for testing or rebalancing.

## 📦 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Material UI Icons
- **Backend**: Next.js API Routes (with MongoDB + Mongoose)
- **AI/ML**: OpenAI GPT-4 (via API) for schedule generation

## ⚙️ Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/smart-task-scheduler.git
   cd smart-task-scheduler
   ```
2. Install dependencies:
   ```bash
   npm install
   # or yarn install
   ```
3. Create a `.env.local` file at the root with:
   ```bash
   MONGODB_URI=your_mongo_connection_string
   OPENAI_API_KEY=your_openai_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   # or yarn dev
   ```
5. Open http://localhost:3000 in your browser.

## 🔧 Configuration

- **MongoDB**: Ensure your MongoDB Atlas or local instance is reachable.
- **OpenAI**: Sign up and obtain an API key with GPT-4 access.
- **Environment Variables**:
  - `MONGODB_URI` – MongoDB connection URI.
  - `OPENAI_API_KEY` – OpenAI API key.

## 📖 Usage

- Navigate to `/dashboard` to view and manage tasks.
- The system auto-generates today’s plan on first load.
- Toggle subtasks as completed to see real-time updates.
- Click **Regenerate Today’s Plan** to refresh the AI-generated schedule.

## 🧠 AI Integration

1. **Prompt Design**: The backend builds a prompt including:
   - Pending tasks (name, duration, deadline, priority)
   - Completed subtasks to exclude
2. **Model Call**: Calls OpenAI’s `/v1/chat/completions` endpoint with GPT-4.
3. **Parsing**: Parses the JSON response into a list of `PlanItem` objects.
4. **Error Handling**: Falls back to a greedy algorithm if the AI call fails.

## 🛠️ Scripts

| Command       | Description                         |
| ------------- | ----------------------------------- |
| `npm run dev` | Start dev server                    |
| `npm run build` | Build for production              |
| `npm run start` | Start production server           |
| `npm run lint` | Lint code                          |



---

*Happy scheduling!*
