# Data Model — NMC Smart Civic Complaint & Resolution Portal

## Main entities

### User
Stores every citizen, staff member, field worker, and administrator.

- name
- email
- phone number
- password hash
- role
- department reference (staff and field workers only)
- account status
- created date

### Department
Represents the municipal team responsible for a group of issues.

- name
- description
- contact email
- active status

Examples: Sanitation, Roads, Water Supply, Streetlights.

### Complaint Category
Classifies a complaint.

- name
- description
- default department reference
- active status

### Complaint
The central record created by a citizen.

- complaint reference number
- citizen reference
- category reference
- title
- description
- location coordinates
- address or landmark
- image references
- current status
- priority
- assigned department reference
- assigned field worker reference
- submitted date
- resolved date
- closed date

### Complaint Update
Creates a visible timeline of progress.

- complaint reference
- author reference
- status after update
- note
- optional image references
- created date

### Assignment
Records who is responsible for a complaint.

- complaint reference
- department reference
- field worker reference
- assigned by reference
- assigned date
- assignment status

## Roles

```text
Citizen        Submits and tracks own complaints
Staff          Reviews and manages department complaints
Field Worker   Updates assigned work
Administrator  Manages users, departments, categories, and reports
```

## Complaint statuses

```text
Submitted
Under Review
Assigned
In Progress
Resolved
Closed
Reopened
Rejected
```

## Key relationships

```text
User (Citizen) ── creates ──> Complaint
Complaint ── belongs to ──> Complaint Category
Complaint ── handled by ──> Department
Complaint ── assigned to ──> Field Worker
Complaint ── has many ──> Complaint Updates
Complaint ── has many ──> Assignments
```

## Important rules
- A citizen may access only their own complaints.
- Staff may access complaints for their department.
- A field worker may update only complaints assigned to them.
- An administrator can manage all records.
- Every status change must create a Complaint Update timeline entry.
- Complaint reference numbers must be unique.