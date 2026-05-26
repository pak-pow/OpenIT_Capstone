# 🎓 Paldo: Barangay Scholarship System

**Paldo** is a modern, premium web application designed to streamline the scholarship application and management process for Local Government Units (LGUs) and Barangays. Built as a Capstone Project, it bridges the gap between deserving students and life-changing educational grants through an intuitive, automated, and beautifully designed platform.

---

## ✨ Key Features

### For Students
* **Smart Match Engine**: Automatically matches students with the best scholarship opportunities based on their GWA, income rank, and profile.
* **One-Click Applications**: Apply to matched or urgent opportunities seamlessly without filling out redundant paperwork.
* **Real-time Status Tracking**: Monitor your application status across multiple tabs (Pending, Approved, Withdrawn, Ended, Rejected).
* **Active Scholar Hub**: Once approved, students get an exclusive dashboard view highlighting their active grant and expected stipends.

### For Administrators
* **Centralized Dashboard**: A bird's-eye view of all active scholarships, total funds disbursed, and pending applications.
* **Applicant Processing**: Easily approve or reject applications. (Approving a student automatically withdraws their other pending applications to free up slots!).
* **Real-time Analytics**: Built-in mock metrics to visualize approval rates and demographic distributions.

---

## 🛠️ Technology Stack

* **Frontend**: React.js (built with Vite for lightning-fast HMR)
* **Styling**: Vanilla CSS with premium design aesthetics (Glassmorphism, dark/light modes, CSS variables, Lucide React icons)
* **Backend**: .NET / C# Web API (Configured for both Server Mode and Console Mode)
* **Database**: PostgreSQL (via Entity Framework Core)
* **Mock Data Architecture**: Decoupled JSON data structures (`scholarships.json`, `applicants.json`, `metrics.json`) for easy i18n support and API simulation.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* .NET 8.0 SDK
* PostgreSQL

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The frontend will launch locally, usually at `http://localhost:5173`.*

### 2. Backend Setup
```bash
cd backend
dotnet restore
dotnet run
```
*You will be prompted to run in either Console Mode (1) or Server Web API Mode (2).*

---

## 🎨 Design Philosophy

Paldo strictly adheres to a premium, modern design language:
* **"Paldo" Aesthetics**: Deep navy blues (`#0a1931`), vibrant golden yellows (`#ffc000`), and smooth transitions.
* **Attention to Detail**: Features like glowing shadows, custom animated celebration modals (e.g., "UY PALDO!! 💸"), and intuitive typography using standard modern web fonts.
* **UX First**: Every interaction, from simulating an approval (`Shift+3`) to logging out, includes micro-animations and safety confirmations.

---

## ⌨️ Development Shortcuts (Simulation Hotkeys)

Since the frontend currently simulates backend state for demonstration purposes, use the following hotkeys on the Student Dashboard:
* `Shift + 3`: **Simulate Approval** (Approves a pending application, decrements available slots, and withdraws other pending apps).
* `Shift + 4`: **Simulate Rejection** (Rejects the oldest pending application).
* `Shift + 5`: **Simulate Scholarship End** (Concludes your active scholarship and frees up a slot for the community).

---

## 📄 License

This project was developed as a Capstone Project and is intended for academic and demonstration purposes.