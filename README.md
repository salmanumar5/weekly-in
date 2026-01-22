# 🗓️ Weekly Availability Tracker

**Minimalist Hybrid Work Planning for Modern Teams.**

The Weekly Availability Tracker is a streamlined tool designed for hybrid teams to coordinate their "Work From Office" (WFO) and "Work From Home" (WFH) schedules. Inspired by Apple’s clean design language, it prioritizes simplicity and visibility over complex HR management.

---

## ✨ Key Features

- **Apple-Inspired UI:** A beautiful, glassmorphic interface with smooth transitions and a focus on clarity.
- **Weekly Focus:** Track availability for the *current* ongoing week only. No clutter from the past, no anxiety about the future.
- **Team-Based Coordination:** Create a team, share a unique invite code, and see everyone's plans at a glance.
- **Hybrid Statuses:**
  - `WFO` (Work From Office) - Emerald green indicator.
  - `WFH` (Work From Home) - Blue indicator.
  - `OFF` (Weekend/Admin Set) - Subtle grey, locked from editing.
- **Admin Controls:** Team creators can configure which days are "Off Days" (weekends) and remove members if needed.
- **Instant Sync:** Changes are saved instantly to a MongoDB cloud database.

---

## 🚀 Getting Started (Local Development)

To run this application on your local machine, follow these steps:

### 1. Prerequisites
- Ensure you have [Node.js](https://nodejs.org/) installed.
- Ensure you have an active internet connection (to connect to the cloud database).

### 2. Installation
Open your terminal in the project root folder and run:
```bash
npm install
```

### 3. Run Locally
We use the Vercel CLI to bridge the Frontend (React) and Backend (API functions) locally:
```bash
npm run dev
```
*Note: If prompted to "Set up and deploy," you can select **Y**, then choose your scope. If it asks to link to an existing project, select **N**. It will start a local server at `http://localhost:3000`.*

### 4. Database Access
The app is pre-configured with a MongoDB Atlas connection string. To ensure it works for you:
- Make sure your IP address is whitelisted in your MongoDB Atlas settings (Network Access -> Allow access from anywhere).

---

## 🛠️ How to Use

### For Everyone
1. **Login:** Enter your name and email. The system creates an account for you automatically.
2. **Join a Team:** Enter a unique invite code provided by your team lead.
3. **Set Availability:** On the main dashboard, click the cards under "Your Availability" to toggle between **Office** and **Home**. 
4. **View Team:** Scroll down to the "Team Overview" table to see where your teammates will be working each day.

### For Team Admins
1. **Create Team:** Click the `+` icon in the sidebar to create a new team.
2. **Invite Members:** Copy the unique code from the **Team Settings** (gear icon) and share it.
3. **Manage Weekends:** Use the Settings panel to select which days are considered weekends for your team. This locks those days for everyone.

---

## 🏗️ Technical Stack

- **Frontend:** React 19 + Tailwind CSS (Inter Font).
- **Backend:** Vercel Serverless Functions (TypeScript).
- **Database:** MongoDB Atlas.
- **Styling:** Custom Glassmorphism and Apple-inspired shadow systems.

---

## 📝 Design Philosophy

"Less is more." This app is not an attendance system or a payroll tool. It is a **visibility and planning tool**. It assumes trust within the team and focuses on solving the single most common question in hybrid work: *"When are you coming into the office?"*

---

## ⚖️ Rules of the System
- **Current Week Only:** You can only edit data for the current week.
- **Immutability:** Once a week passes, the data is archived (read-only in the DB).
- **Admin Authority:** Only the person who created the team can change the weekend configuration.

---

**Built with ❤️ for hybrid teams everywhere.**