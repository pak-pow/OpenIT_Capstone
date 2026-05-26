# Paldo: Barangay Scholarship System

Paldo is a comprehensive web application designed to streamline the scholarship application and management process for Local Government Units (LGUs) and Barangays. Developed as a Capstone Project, it bridges the gap between students seeking financial assistance and the organizations providing educational grants. 

The system provides an intuitive, automated platform that reduces paperwork and manual processing while offering a premium user experience.

---

## Architecture Overview

The project is structured as a full-stack application divided into two primary components:

* **frontend/**: A Single Page Application (SPA) built with React and Vite.
* **backend/**: A RESTful Web API built with ASP.NET Core and Entity Framework Core.

---

## Core Features

### Student Portal
* **Smart Match Engine**: Evaluates a student's profile (General Weighted Average, income rank, etc.) and automatically matches them with eligible scholarship opportunities.
* **Streamlined Applications**: Enables students to apply for matched scholarships seamlessly without redundant data entry.
* **Status Tracking**: Provides real-time visibility into application statuses across multiple categories (Pending, Approved, Withdrawn, Ended, Rejected).
* **Active Scholar Hub**: A dedicated view for approved scholars highlighting active grants and expected stipends.

### Administrator Portal
* **Centralized Dashboard**: Provides administrators with a high-level overview of active scholarships, disbursed funds, and application queues.
* **Application Processing**: Administrators can review, approve, or reject applications. (Note: Approving an application automatically withdraws the student's other pending applications to free up community slots).
* **Metrics and Analytics**: Built-in data visualization for monitoring approval rates and demographic distributions.

---

## Technology Stack

### Frontend
* **Framework**: React.js 18
* **Build Tool**: Vite (for optimized bundling and Fast Refresh)
* **Styling**: Vanilla CSS (implementing modern design aesthetics including Glassmorphism, CSS variables for theming, and responsive layouts)
* **Icons**: Lucide React
* **Data Management**: Context API with decoupled JSON mock data (scholarships, applicants, metrics) for localization and API simulation.

### Backend
* **Framework**: ASP.NET Core 8.0 Web API
* **Language**: C#
* **ORM**: Entity Framework Core
* **Database**: PostgreSQL
* **Architecture**: MVC Pattern (Models, Views/DTOs, Controllers)

---

## Getting Started

### Prerequisites
* Node.js (v18 or higher)
* .NET 8.0 SDK
* PostgreSQL Server

### Frontend Configuration
The frontend can be run locally using the Vite development server.

```bash
cd frontend
npm install
npm run dev
```
The application will be accessible at http://localhost:5173.

### Backend Configuration
The backend requires setting up a PostgreSQL connection string inside `appsettings.json` or `appsettings.Development.json`.

```bash
cd backend
dotnet restore
dotnet run
```
The REST API will boot up and listen for requests from the frontend client.

---

## Frontend Simulation Hotkeys

For demonstration and development purposes, the frontend currently supports hotkeys to simulate backend state transitions without requiring a live database connection. These can be executed from the Student Dashboard:

* `Shift + 3`: **Simulate Approval**. Approves the first pending application, decrements global available slots, and withdraws other pending applications.
* `Shift + 4`: **Simulate Rejection**. Rejects the oldest pending application.
* `Shift + 5`: **Simulate Scholarship End**. Concludes an active scholarship, moving it to the 'Ended' state and freeing up a slot.

---

## License

This project was developed as a Capstone Project and is intended for academic, evaluation, and demonstration purposes.