# Atlas

Atlas is an intelligent goal-planning and scheduling platform designed to help you break down complex tasks—like studying System Design—into actionable subtasks with AI-powered mind mapping and smart scheduling.

## 🚀 Project Overview

Have a lengthy task, such as mastering a subject or completing a large project? Atlas lets you:
- **Input your domain, subject, and (optionally) a syllabus**
- **Choose your desired depth of study**
- **Leverage AI to generate a mind map of subtasks**
- **Automatically schedule tasks for you, optimizing your daily workload**
- **Visualize your progress and daily agenda**
- **Dynamically split heavy subtasks into manageable chunks**
- **Auto-reschedule unfinished tasks to keep you on track**

Atlas acts as your personal assistant, handling all the planning and scheduling so you can focus on what matters most: getting things done.

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Backend:** Spring Boot (Java), MongoDB

## ✨ Features

- AI-powered mind map generation for any goal or subject
- Personalized scheduling based on your preferences and daily limits
- Calendar integration for easy tracking
- Dynamic task splitting and auto-rescheduling
- Progress visualization and daily task view

## 📦 Getting Started

### Prerequisites

- Node.js (for frontend)
- Java 21+ and Maven (for backend)
- MongoDB instance

### Installation

#### 1. Clone the repository

```sh
git clone https://github.com/yourusername/atlas.git
cd atlas
```

#### 2. Setup Backend

```sh
cd backend/Atlas
# Configure MongoDB connection in src/main/resources/application.properties
./mvnw spring-boot:run
```

#### 3. Setup Frontend

```sh
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` (or as specified by Vite).

## 📚 Usage

1. Register and log in.
2. Enter your study domain, subject, and (optionally) syllabus.
3. Select the depth of coverage.
4. Let Atlas generate your mind map and schedule.
5. View your daily tasks and track your progress.
6. If a task feels too large, split it further with one click.
7. Unfinished tasks are automatically rescheduled.

## 🤖 AI & Scheduling

Atlas uses AI to analyze your input and generate a hierarchical breakdown of your goal. The backend schedules tasks intelligently, considering your daily limits and preferences, and adapts dynamically as you progress.

## 📝 License

This project is licensed under the MIT License.

---

*Built with ❤️ using React, TypeScript, and Spring Boot.*
