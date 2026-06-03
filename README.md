# Taskify — Full-Stack Task Management System

A comprehensive **full-stack task management web application** built with **MERN** (MongoDB, Express, React, Node.js) designed specifically for **academic/college environments** with role-based hierarchies, approval workflows, real-time chat, and automated reminder systems.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Workflow & Usage](#workflow--usage)
- [Role Hierarchy & Permissions](#role-hierarchy--permissions)
- [API Overview](#api-overview)
- [Contributing](#contributing)

---

## 🎯 Overview

**Taskify** is designed for managing tasks across academic institutions with a hierarchical role structure:
- **Principal** — Top-level administrator
- **HOD (Head of Department)** — Department-level management
- **Faculty** — Task creators and team leads
- **Student** — Task participants

The system includes:
- **User approval workflows** based on department and role
- **Task management** with board/table views and status tracking
- **Real-time chat** for team communication
- **Email notifications** and task reminders
- **Soft delete** and trash management
- **Department-based filtering** and access control

---

## ✨ Key Features

### Authentication & Authorization
- **Email or PRN-based login** with password
- **HTTP-only JWT cookies** for secure session management
- **Role-based access control** with department scoping
- **Registration approval workflow** (Principal > HOD > Faculty/Student)

### Task Management
- **Create, Read, Update, Delete (CRUD)** operations for tasks
- **Multiple views**: Board view (Kanban-style) and Table view
- **Task properties**: Title, description, date, priority, stage, assigned team members
- **Firebase integration** for file/asset uploads
- **Soft delete & Trash management**
- **Sub-tasks** support for complex task breakdown

### Team & User Management
- **Department-based user filtering**
- **Role hierarchy** for task assignment permissions
- **Team member directory** with name, title, email, department, role, section
- **User approval panels** for management

### Real-Time Communication
- **Socket.IO-powered chat rooms** with authentication
- **Chat room management**: Create, join, leave, invite
- **Message history** with user avatars
- **Real-time notifications**

### Background Jobs & Automation
- **BullMQ task queue** for email and reminder jobs
- **node-cron scheduling** for periodic tasks
- **Email notifications** for registrations, approvals, and task assignments
- **Automated task reminders** before deadlines

### Monitoring & Analytics
- **Dashboard** with task statistics and charts
- **Department-specific analytics**
- **Notification panels** for pending approvals and alerts

---

## 🛠 Tech Stack

| Layer | Technology |
|--------|------------|
| **Frontend** | React 18 (Vite), React Router 6, Redux Toolkit + RTK Query, Tailwind CSS, Headless UI |
| **Backend** | Node.js, Express, Mongoose (MongoDB), JWT, Socket.IO, node-cron, BullMQ |
| **Database** | MongoDB (Atlas or local instance) |
| **External Services** | Firebase (file uploads), Nodemailer (email), Redis (optional, for queue jobs) |
| **State Management** | Redux Toolkit with RTK Query for API calls |
| **Real-Time** | Socket.IO for bi-directional communication |
| **UI Components** | Recharts (analytics), React Icons, Sonner (toasts), React Hook Form |

---

## 📁 Project Structure

```
Taskify/
├── client/                          # React frontend application
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── tasks/               # Task-specific components
│   │   │   ├── AddUser.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ...
│   │   ├── pages/                   # Page components
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── ChatRoom.jsx
│   │   │   └── ...
│   │   ├── redux/                   # State management
│   │   │   ├── store.js
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── uiSlice.js
│   │   │   │   └── apiSlice.js
│   │   │   └── api/                 # RTK Query APIs
│   │   │       ├── authApiSlice.js
│   │   │       ├── taskApiSlice.js
│   │   │       ├── userApiSlice.js
│   │   │       └── chatApiSlice.js
│   │   ├── utils/
│   │   │   ├── firebase.js          # Firebase config
│   │   │   ├── contants.js
│   │   │   └── dummydata.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                          # Express backend API
│   ├── controllers/                 # Request handlers
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   ├── userController.js
│   │   └── chatController.js
│   ├── models/                      # Mongoose schemas
│   │   ├── userModel.js
│   │   ├── taskModel.js
│   │   ├── chatRoomModel.js
│   │   └── notis.js                 # Notifications model
│   ├── routes/                      # API routes
│   │   ├── authRoute.js
│   │   ├── taskRoute.js
│   │   ├── userRoute.js
│   │   ├── chatRoute.js
│   │   └── index.js
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   └── errorMiddleware.js
│   ├── services/
│   │   └── emailService.js          # Nodemailer config
│   ├── socket/
│   │   └── chat.js                  # Socket.IO handlers
│   ├── jobs/
│   │   ├── taskReminder.js
│   │   └── escalation.js
│   ├── queues/
│   │   └── reminderQueue.js         # BullMQ queue setup
│   ├── utils/
│   │   ├── connectDB.js
│   │   └── roleHierarchy.js         # Permission logic
│   ├── index.js                     # Server entry point
│   └── package.json
│
├── PROJECT_SUMMARY.md
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** v16+ and **npm** or **yarn**
- **MongoDB** (Atlas or local instance)
- **Redis** (optional, for background jobs)
- **Firebase** account (for file uploads)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd Taskify-Full-Stack-Project-using-MERN-main
```

### Step 2: Install Server Dependencies
```bash
cd server
npm install
```

### Step 3: Install Client Dependencies
```bash
cd ../client
npm install
```

---

## ⚙️ Configuration

### Server Environment Variables
Create a `.env` file in the `server/` directory:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskify?retryWrites=true&w=majority
MONGODB_URI_ALT=mongodb://localhost:27017/taskify     # Alternative local URI

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
ADMIN_SECRET_KEY=your_admin_registration_key

# Server
PORT=5000
NODE_ENV=development

# Email Service (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM=noreply@taskify.com

# Optional Redis (for BullMQ)
REDIS_URL=redis://localhost:6379

---

## 🏃 Running the Application

### Option 1: Run Both Server and Client in Separate Terminals

**Terminal 1 - Start the Server:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Start the Client:**
```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

### Option 2: Build for Production
```bash
# Build the client
cd client
npm run build

# Build and run server (with NODE_ENV=production)
cd ../server
npm start
```

---

## 📊 Workflow & Usage

### 1. User Registration & Approval Flow

```
┌─────────────────┐
│ User Registers  │
└────────┬────────┘
         │
         ▼
    ┌─────────────────────────────────────┐
    │ Role Check & Department Assignment  │
    └────────┬────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
 Principal      HOD/Faculty/Student
    │                 │
    │ Auto-Approved   │ Pending HOD Approval
    │                 │
    ▼                 ▼
  Active          ┌──────────────────┐
                  │ Awaiting Approval │
                  │ (by HOD/Principal)│
                  └────────┬─────────┘
                           │
                    ┌──────┴──────┐
                    │             │
                    ▼             ▼
                 Approved      Rejected
                    │
                    ▼
                  Active
```

### 2. Task Management Workflow

```
┌──────────────────┐
│ Create New Task  │ (Faculty/HOD/Principal)
└────────┬─────────┘
         │
         ▼
┌──────────────────────────┐
│ Assign Team Members      │ (Department-based filtering)
│ Set Priority & Deadline  │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────┐
│ TODO             │ ◄── View in Board/Table
│ IN PROGRESS  (Move task between stages)
│ COMPLETED        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Task Completed   │
└──────────────────┘

(Soft Delete → Trash → Permanent Delete)
```

### 3. Real-Time Chat Workflow

```
1. User creates/joins a Chat Room
2. Sends join requests (for private rooms)
3. Host approves requests
4. Members exchange messages in real-time via Socket.IO
5. Session can be ended by host
6. Chat history is preserved in MongoDB
```

### 4. Task Reminder System

```
┌─────────────────────────────────────┐
│ Task Created with Deadline          │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ node-cron triggers daily scan        │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Check for upcoming deadlines         │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ BullMQ enqueues reminder jobs        │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Nodemailer sends email reminders     │
│ In-app notifications pushed          │
└─────────────────────────────────────┘
```

---

## 👥 Role Hierarchy & Permissions

### Role Levels (High to Low)
1. **Principal** — Level 5 (Highest)
2. **HOD** — Level 4
3. **Faculty** — Level 3
4. **Student** — Level 1 (Lowest)

### Key Permissions

| Action | Principal | HOD | Faculty | Student |
|--------|-----------|-----|---------|---------|
| Create Task | ✅ | ✅ | ✅ | ❌ |
| Assign Task | ✅ | ✅ (own dept) | ✅ | ❌ |
| Approve Users | ✅ | ✅ (own dept) | ❌ | ❌ |
| View All Departments | ✅ | ❌ | ❌ | ❌ |
| View Team | ✅ | ✅ (own dept) | ✅ (own dept) | ✅ |
| Access Chat | ✅ | ✅ | ✅ | ✅ |
| View Dashboard | ✅ | ✅ | ✅ | ✅ |

**Role Hierarchy File**: [server/utils/roleHierarchy.js](server/utils/roleHierarchy.js) contains the permission logic.

---

## 🔌 API Overview

### Authentication APIs
```
POST   /api/auth/register         Register new user
POST   /api/auth/login            Login with email/PRN and password
POST   /api/auth/logout           Logout (clear JWT cookie)
PUT    /api/auth/change-password  Change user password
```

### User & Team APIs
```
GET    /api/user/all              Get all approved users
GET    /api/user/by-department/:dept  Get users by department
GET    /api/user/pending-requests Get pending approval requests
PUT    /api/user/approve/:id      Approve user registration
PUT    /api/user/reject/:id       Reject user registration
GET    /api/user/me               Get current user info
PUT    /api/user/update           Update user profile
```

### Task APIs
```
GET    /api/task                  Get all tasks (with filters)
POST   /api/task/create           Create new task
GET    /api/task/:id              Get task details
PUT    /api/task/:id              Update task
DELETE /api/task/:id              Delete task (soft delete)
GET    /api/task/trash            Get deleted tasks
PUT    /api/task/:id/restore      Restore from trash
POST   /api/task/:id/subtask      Add subtask
```

### Chat APIs
```
GET    /api/chat/rooms            Get all chat rooms (user is member)
POST   /api/chat/rooms/create     Create new chat room
GET    /api/chat/rooms/:id        Get room details and messages
PUT    /api/chat/rooms/:id/join   Join room or send join request
DELETE /api/chat/rooms/:id        End chat room session
```

### Notifications APIs
```
GET    /api/notification          Get all notifications
PUT    /api/notification/:id/read Mark notification as read
```

---

## 🔗 Socket.IO Events

Real-time communication for chat and notifications:

```javascript
// Chat Events
socket.on('join-room', (roomId) => {})        // Join a chat room
socket.on('send-message', (data) => {})       // Send message
socket.on('message', (data) => {})            // Receive message
socket.on('user-joined', (data) => {})        // User joined notification
socket.on('user-left', (data) => {})          // User left notification

// Notification Events
socket.on('notification', (data) => {})       // Receive notification
socket.on('approval-request', (data) => {})   // New approval request
```

---

## 📝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

---

## 📄 License

ISC

---

## 👨‍💼 Authors

- **Vansh Rekhi
- Vedika Pande**

---

