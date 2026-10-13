NMC Smart Civic Complaint & Resolution Portal

A civic platform where residents report public issues (potholes, broken streetlights, garbage, water supply, drainage), and municipal teams assign, resolve and track them transparently.

Status: Backend API complete and tested. Web portal, mobile app, maps and ML features are planned (see Roadmap).

Why this project

Citizens often have no clear way to report a civic problem or to see what happened afterwards. This portal gives every complaint a clear owner, a status and a visible timeline, from the moment it is submitted to the moment the citizen confirms it is fixed.

Features (implemented)
Secure accounts: registration and login with hashed passwords (bcrypt) and JWT authentication.
Four roles with role-based access control (RBAC): Citizen, Department Staff, Field Worker, Administrator.
Complaint submission with title, description, category and GeoJSON location. The responsible department is assigned automatically from the category.
Complete complaint lifecycle with enforced rules for which status can follow which.
Assignment of complaints to field workers by department staff or administrators.
Timeline: every status change is recorded, so citizens can see the full history of their complaint.
Citizen confirmation: the citizen who filed a complaint can close it as satisfactory or reopen it with a reason.
Dashboard summary: complaint counts by status, scoped to the department for staff and global for administrators.
Filtering complaints by status.
Administrator tools: create departments, categories and staff, field worker or admin accounts.
Validation on every request (zod) and consistent JSON responses.
Complaint lifecycle
text
Submitted -> Under Review -> Assigned -> In Progress -> Resolved -> Closed
                  |                                        |
                  +-> Rejected                             +-> Reopened -> Assigned
Roles and permissions
Role	Can do
Citizen	Register, submit complaints, view own complaints and their timeline, confirm or reopen a resolved complaint
Department Staff	View complaints of their department, review and reject, assign field workers, view department summary
Field Worker	View assigned complaints, mark work In Progress and Resolved
Administrator	Everything above across all departments, plus create departments, categories and users

Authorization is always decided by the API, never by the client.

Tech stack
Layer	Technology
API	Node.js, Express 5
Database	MongoDB Atlas (Mongoose)
Auth and security	JWT, bcryptjs, Helmet, CORS, zod validation
Planned	React (web), React Native + Expo (mobile), OpenStreetMap, Python + PyTorch
Repository structure
text
apps/web          React web portal (planned)
apps/mobile       React Native + Expo app (planned)
services/api      Node.js + Express API (implemented)
services/ml       Python + PyTorch service (planned)
packages/shared   Shared utilities (planned)
docs              Requirements, architecture, data model, API contract
infra             Deployment notes (planned)
Getting started
Prerequisites
Node.js 20 or newer
A free MongoDB Atlas cluster and its connection string
Setup
bash
git clone https://github.com/Om-Tikle/NMC-SMART-CIVIC-PORTAL.git
cd NMC-SMART-CIVIC-PORTAL/services/api
npm install

Create a .env file in services/api (use .env.example as a template):

text
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=a_long_random_secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173

Never commit the .env file. It is already listed in .gitignore.

Start the API:

bash
npm run dev

Check that it works by opening http://localhost:5000/api/v1/health.

Creating the first administrator

Public registration always creates a citizen account, so the first administrator is created manually:

Register a user through POST /api/v1/auth/register.
In MongoDB Atlas, open the users collection and change that user's role to admin.
Log in as that user. From then on, use POST /api/v1/users to create staff, field worker and further admin accounts.
API overview

All endpoints are under /api/v1. Successful responses look like { "success": true, "data": {} } and errors like { "success": false, "message": "..." }. Protected endpoints need the header Authorization: Bearer <token>.

Method	Endpoint	Access
GET	/health	Public
POST	/auth/register	Public (creates a citizen)
POST	/auth/login	Public
GET	/auth/me	Signed in
POST	/users	Admin
GET	/departments	Public
POST	/departments	Admin
GET	/categories	Public
POST	/categories	Admin
POST	/complaints	Signed in (citizen)
GET	/complaints?status=	Signed in (results depend on role)
GET	/complaints/summary	Staff, Admin
GET	/complaints/:id	Owner, department staff, assigned worker, admin
GET	/complaints/:id/updates	Same as above
PATCH	/complaints/:id/status	Department staff, assigned field worker, admin
POST	/complaints/:id/assign	Department staff, admin
POST	/complaints/:id/resolution	Citizen who filed the complaint

Example complaint submission:

json
POST /api/v1/complaints
{
  "category": "<category id>",
  "title": "Pothole on main road",
  "description": "Large pothole near the bus stop",
  "location": { "type": "Point", "coordinates": [73.8567, 18.5204] }
}

Coordinates are [longitude, latitude].

Documentation
MVP requirements
System architecture
Data model
API contract
Roadmap
React web portal with a separate dashboard for each role
Complaint images and address or landmark field
User management and department editing tools
Map integration with OpenStreetMap
React Native mobile app for citizens
ML-assisted category and priority suggestions
Automated tests, pagination and deployment
Author

Built by Om Kailash Tikle as a mini project.

Copyright (c) 2026 Om Kailash Tikle. All rights reserved.