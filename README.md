# Task Manager API

A full-stack task management application built with Node.js/Express backend and React frontend, allowing caseworkers to create and track tasks, stored in a sqlite database with validation and unit testing.

# 🚀 Quick Start

## Installation & Setup

### Backend

```bash
npm install
cd backend
npm run dev
# API Server runs on http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Frontend App runs on http://localhost:5173
```

# 🧪 Running Tests

```bash
cd backend
npm test
```

Note: During development, the backend uses a file-based SQLite database (tasks.db) while tests use an in-memory database for isolation.

# API Endpoints

## GET /

Health check endpoint

### Response:

```json
{
    "success": true,
    "data": "Hello World"
}
```

## GET /tasks

Get all tasks from the database

### Response:

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "title": "Task title",
            "description": "Optional description",
            "status": 0,
            "due": "2024-12-31T14:30"
        }
    ]
}
```

## POST /tasks

Add a task to the database.

### Request body:

```json
{
    "title": "Task title", // REQUIRED - string
    "description": "Description", // OPTIONAL - string
    "status": 0, // OPTIONAL - 0 (pending) or 1 (completed)
    "due": "2024-12-31T14:30" // REQUIRED - Future datetime in YYYY-MM-DDThh:mm format
}
```

### Response:

```json
{
    "success": true,
    "data": {
        "id": 1,
        "title": "Task title",
        "description": "Description",
        "status": 0,
        "due": "2024-12-31T14:30"
    }
}
```

## Error responses:

Missing title: `{"success": false, "message": "Title is required"} `

Missing due date: `{"success": false, "message": "Due date/time is required"}`

Past due date: `{"success": false, "message": "Due date/time must be in the future"}`

Invalid date format: `{"success": false, "message": "Invalid date format. Use YYYY-MM-DDTHH:mm"}`

## License

For DTS Developer Technical Test - Junior Software Developer role application
