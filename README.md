# NMC Smart Civic Complaint & Resolution Portal

A zero-cost-first civic platform for reporting, tracking, and resolving public complaints.

## Planned stack
- React Native + Expo mobile app
- React.js web portal
- Node.js + Express API
- MongoDB Atlas Free database
- Python + PyTorch for ML features
- JWT, IMA, and RBAC security
- OpenStreetMap integration

## Project phases
1. Repository and project foundation
2. Requirements and user roles
3. Backend foundation
4. Web portal
5. Mobile app
6. Maps, notifications, and complaint workflow
7. ML-assisted classification
8. Testing, security review, and deployment

## Core complaint API

The current backend exposes these core endpoints under `/api/v1`:

- `GET /categories` lists active complaint categories publicly.
- `POST /categories` creates a category (administrator JWT required). Its
  `defaultDepartment` must be an existing department ID.
- `POST /complaints` submits a complaint (JWT required). The category selects
  the assigned department and every new complaint is `Submitted`.
- `GET /complaints` lists only the signed-in citizen's complaints; staff see
  their assigned department, field workers see their assignments, and admins
  see all complaints.
- `GET /complaints/:id` returns a complaint only when the signed-in user is
  permitted to view it.

Complaint creation requires `category`, `title`, `description`, and GeoJSON
`location`, for example: `{ "type": "Point", "coordinates": [73.8567, 18.5204] }`.
Coordinates are `[longitude, latitude]`. Staff accounts must have their
`department` reference set before they can view department complaints.
