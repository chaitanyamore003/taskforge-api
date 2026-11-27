# 🚀 TaskForge API

**A RESTful backend API for collaborative project and task management.**

TaskForge is a team collaboration and task management backend that enables users to create projects, collaborate with team members, assign tasks, and track project progress through structured workflows and analytics.

Built with Node.js, Express.js, PostgreSQL, and Prisma, it provides secure authentication, role-based access control, advanced task management, and project-level insights.

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login.
- Secure password hashing using bcrypt.
- JWT-based authentication.
- Protected API endpoints.
- Role-based access control.

### 📁 Project Management
- Create and manage projects.
- Retrieve projects associated with the authenticated user.
- Add team members to projects.
- View detailed project information.
- Restrict project operations based on user roles.

### ✅ Task Management
- Create, update, and delete tasks.
- Assign tasks to project members.
- Manage task statuses and priorities.
- Automatically maintain task completion timestamps.
- Enforce task ownership and project membership rules.

### 🔍 Advanced Task Querying
- Pagination and configurable page limits.
- Filter tasks by status.
- Filter tasks by priority.
- Filter tasks by assignee.
- Sort tasks using supported fields and sort directions.

### 📊 Project Analytics
- Project-level task summaries.
- Task statistics grouped by status.
- Task statistics grouped by priority.
- Track overall project progress.

### 🛡️ Security & Reliability
- Input validation using express-validator.
- Centralized error handling.
- Authentication and authorization middleware.
- Consistent API response structures.
- Database-backed data integrity.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| PostgreSQL | Relational database |
| Supabase | Database hosting |
| Prisma ORM | Database access and migrations |
| JWT | Authentication |
| bcrypt | Password hashing |
| express-validator | Request validation |
| Jest | Automated testing |
| Supertest | API integration testing |
| Swagger / OpenAPI | API documentation |

---

## 📂 Project Structure

```text
TaskForge/
│
├── src/
│   ├── config/
│   │   └── swagger.js
│   │
│   ├── controllers/
│   │
│   ├── middleware/
│   │
│   ├── routes/
│   │
│   ├── services/
│   │
│   ├── validators/
│   │
│   ├── utils/
│   │
│   └── app.js
│
├── prisma/
│   └── schema.prisma
│
├── tests/
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (18+ recommended)
- npm
- PostgreSQL database or Supabase account
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/chaitanyamore003/taskforge-api.git

cd taskforge-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory.

```env
PORT=3000

DATABASE_URL="your-postgresql-connection-string"

JWT_SECRET_KEY="your-secret-key"
JWT_EXPIRES_IN="1d"
```

Refer to `.env.example` for the complete configuration.

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run Database Migrations

```bash
npx prisma migrate dev
```

### 6. Start the Development Server

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

---

## 📡 API Reference

All endpoints are organized under the `/api` prefix.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate and receive JWT |

### Projects

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/projects` | Create a project |
| GET | `/api/projects` | Retrieve user's projects |
| GET | `/api/projects/:projectId` | Get project details |
| POST | `/api/projects/:projectId/members` | Add a project member |
| DELETE | `/api/projects/:projectId` | Delete a project |
| GET | `/api/projects/:projectId/summary` | Retrieve project analytics |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/projects/:projectId/tasks` | Create a task |
| GET | `/api/projects/:projectId/tasks` | Retrieve project tasks |
| PATCH | `/api/tasks/:taskId` | Update a task |
| DELETE | `/api/tasks/:taskId` | Delete a task |

### Task Query Parameters

The task listing endpoint supports advanced querying:

```http
GET /api/projects/:projectId/tasks?page=1&limit=10&status=TODO&priority=HIGH&assigneeId=USER_ID&sortBy=createdAt&sortOrder=desc
```

Supported parameters:

| Parameter | Description |
|---|---|
| `page` | Page number |
| `limit` | Number of records per page |
| `status` | Filter by task status |
| `priority` | Filter by task priority |
| `assigneeId` | Filter by assigned user |
| `sortBy` | Field used for sorting |
| `sortOrder` | Sorting direction (`asc` / `desc`) |

---

## 📖 API Documentation

TaskForge provides interactive API documentation through Swagger UI using the OpenAPI specification.

Once the development server is running, visit:

```text
http://localhost:3000/api-docs
```

Swagger UI allows developers to:
- Explore available API endpoints.
- Understand request parameters and response structures.
- Test API endpoints directly from the browser.
- Authorize requests using JWT Bearer authentication.

---

## 🧪 Testing

TaskForge uses Jest and Supertest for automated testing.

Run the complete test suite:

```bash
npm test
```

Run tests in watch mode (if configured):

```bash
npm run test:watch
```

The test suite covers API functionality, authentication, authorization, validation, and edge cases.

---

## 🔒 Authorization Model

TaskForge implements role-based access control to ensure that project resources are accessed only by authorized users.

- **Project Owners:** Manage projects and control project membership.
- **Project Members:** Collaborate on projects and perform permitted task operations.

Access to protected resources requires a valid JWT.

---

## 🗺️ Future Improvements

Potential enhancements include:

- Real-time task updates using WebSockets.
- Email notifications and activity tracking.
- Task deadlines and reminders.
- File attachments.
- More advanced project analytics.
- Docker-based deployment.
- CI/CD integration.

---

## 📄 License

This project is licensed under the ISC License.

---

**TaskForge API** — Building a structured foundation for better team collaboration and project management.