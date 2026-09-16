# API Contract — MVP

Base API path:

```text
/api/v1
```

## Authentication

```text
POST /auth/register
POST /auth/login
GET  /auth/me
```

- Register creates a citizen account.
- Login returns a JWT.
- `GET /auth/me` returns the signed-in user.
- Protected endpoints require a valid JWT.

## Complaint categories

```text
GET    /categories
POST   /categories
PATCH  /categories/:id
DELETE /categories/:id
```

- Anyone signed in may view active categories.
- Only administrators manage categories.

## Complaints

```text
POST  /complaints
GET   /complaints/my
GET   /complaints/:id
PATCH /complaints/:id
POST  /complaints/:id/updates
POST  /complaints/:id/assign
```

### Citizen access
- Create a complaint.
- View their own complaints.
- View a complaint timeline.
- Add a follow-up message where allowed.
- Confirm resolution or reopen a resolved complaint.

### Staff access
- View department complaints.
- Change status.
- Assign a field worker.
- Add progress updates.

### Field worker access
- View assigned complaints.
- Add progress updates.
- Mark work as resolved.

### Administrator access
- View and manage all complaints.
- Manage users, departments, and categories.

## Departments

```text
GET   /departments
POST  /departments
PATCH /departments/:id
```

Only administrators create or edit departments.

## Reports — later MVP step

```text
GET /reports/summary
GET /reports/department
```

Reports should show complaint counts by status, category, and department.

## Response conventions

```text
Successful request:
{ "success": true, "data": {} }

Failed request:
{ "success": false, "message": "Clear explanation" }
```

## API rules
- Validate every request on the server.
- Return only data appropriate for the requesting user’s role.
- Do not expose password hashes, secret tokens, or internal error details.
- Keep the API versioned under `/api/v1`.