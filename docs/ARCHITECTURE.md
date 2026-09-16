# System Architecture — NMC Smart Civic Complaint & Resolution Portal

## Architecture overview

```text
Citizen Mobile App (React Native + Expo) ─┐
                                          ├── Express API ── MongoDB Atlas Free
Citizen & Staff Web Portal (React.js) ────┘        │
                                                   ├── OpenStreetMap
                                                   └── Python + PyTorch service (future phase)
```

## Applications

### Mobile application
Used primarily by citizens to submit complaints, attach photos, set locations, track progress, and confirm resolution.

### Web portal
Used by citizens, department staff, field workers, and administrators. It provides complaint management and administrative views.

### API service
A Node.js and Express service that:
- authenticates users
- applies JWT, IMA, and RBAC rules
- validates requests
- manages complaints, assignments, updates, and reports
- communicates with MongoDB Atlas
- provides APIs for both mobile and web applications

### Database
MongoDB Atlas Free will store:
- users and roles
- departments
- complaint categories
- complaints
- assignment records
- complaint status history
- progress updates

### ML service — later phase
A separate Python and PyTorch service will eventually suggest complaint categories and priority. It must not be required for the MVP to function.

## Core data flow

```text
Citizen submits complaint
        ↓
API validates citizen and saves complaint
        ↓
Staff reviews and assigns complaint
        ↓
Field worker adds progress updates
        ↓
Citizen tracks updates and confirms or reopens resolution
```

## Security boundaries
- All clients communicate with the API over HTTPS in production.
- Passwords are hashed; they are never stored in plain text.
- JWT verifies authenticated requests.
- RBAC limits what each role can access or change.
- Secrets and database URLs belong only in local environment files, never in Git.
- The API, not the client app, makes authorization decisions.

## Repository ownership

```text
apps/mobile       React Native + Expo mobile application
apps/web          React.js web portal
services/api      Node.js + Express API
services/ml       Python + PyTorch service, introduced later
packages/shared   Shared types and reusable utilities, introduced later
docs              Requirements, architecture, and decisions
infra             Deployment and environment documentation, introduced later
```

## Build order
1. Define requirements and architecture.
2. Design database entities and API contracts.
3. Build authentication and role access in the API.
4. Build the citizen complaint flow.
5. Build staff and administrator workflows.
6. Add map integration.
7. Add ML assistance only after the core portal works.