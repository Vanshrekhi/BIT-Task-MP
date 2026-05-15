# Technologies Used in Taskify Project

This document outlines all the technologies used in the Taskify full-stack project, including their purpose and how they are implemented.

## Frontend (Client)

### React
- **Use**: JavaScript library for building user interfaces.
- **How**: Used to create the main application components in `src/App.jsx` and various pages like `Dashboard.jsx`, `Login.jsx`, etc. Components are organized in the `components/` folder, with task-specific components in `tasks/`.

### Vite
- **Use**: Build tool and development server for modern web projects.
- **How**: Configured in `vite.config.js` to handle the React application build process, providing fast development server and optimized production builds.

### Tailwind CSS
- **Use**: Utility-first CSS framework for styling.
- **How**: Configured in `tailwind.config.js` and `postcss.config.js`. Used throughout the application for responsive and consistent styling of components like buttons, modals, and layouts.

### Redux Toolkit
- **Use**: State management library for JavaScript applications.
- **How**: Implemented in `redux/store.js` with slices for authentication (`authSlice.js`), UI state (`uiSlice.js`), and API interactions (`apiSlice.js`). API slices are further divided into `authApiSlice.js`, `chatApiSlice.js`, `taskApiSlice.js`, and `userApiSlice.js` for managing different aspects of the application state.

### Firebase
- **Use**: Backend-as-a-Service platform for authentication and real-time database.
- **How**: Configured in `utils/firebase.js` for handling real-time features, possibly for notifications or chat functionality.

## Backend (Server)

### Node.js
- **Use**: JavaScript runtime for server-side development.
- **How**: The entire server is built on Node.js, with the main entry point in `index.js`.

### Express.js
- **Use**: Web application framework for Node.js.
- **How**: Used to set up routes in `routes/` (e.g., `authRoute.js`, `taskRoute.js`, `userRoute.js`, `chatRoute.js`) and handle HTTP requests. Controllers in `controllers/` manage the business logic for users, tasks, and chat.

### MongoDB
- **Use**: NoSQL database for storing application data.
- **How**: Connected via `utils/connectDB.js`. Data models are defined in `models/` including `userModel.js`, `taskModel.js`, `chatRoomModel.js`, and `notis.js` for notifications.

### Socket.io
- **Use**: Library for real-time, bidirectional communication.
- **How**: Implemented in `socket/chat.js` for real-time chat functionality in the application.

### Email Service
- **Use**: For sending emails (e.g., notifications, reminders).
- **How**: Handled by `services/emailService.js`, likely integrated with task reminders and escalations.

### Queue System
- **Use**: For managing background jobs and asynchronous tasks.
- **How**: Implemented in `queues/reminderQueue.js` for handling task reminders.

### Scheduled Jobs
- **Use**: For running periodic tasks like escalations and reminders.
- **How**: Defined in `jobs/escalation.js` and `jobs/taskReminder.js` to automate processes based on time or conditions.

## Other Utilities

### Authentication Middleware
- **Use**: To secure routes and verify user authentication.
- **How**: Implemented in `middleware/authMiddleware.js` and used across routes to protect endpoints.

### Error Middleware
- **Use**: For handling and logging errors in the application.
- **How**: Defined in `middleware/errorMiddleware.js` to provide consistent error responses.

### Role Hierarchy
- **Use**: To manage user roles and permissions.
- **How**: Configured in `utils/roleHierarchy.js` to define different user types like Admin, Faculty, HOD, Employee, Student.

### Constants and Dummy Data
- **Use**: For storing application constants and sample data.
- **How**: Located in `utils/contants.js` and `utils/dummydata.js` for development and testing purposes.

This project leverages the MERN stack (MongoDB, Express.js, React, Node.js) with additional tools for real-time communication, styling, state management, and background processing to create a comprehensive task management application.