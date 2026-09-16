# MVP Requirements — NMC Smart Civic Complaint & Resolution Portal

## Purpose
Enable residents to report civic issues, track resolution progress, and help municipal teams manage complaints transparently.

## User roles
- **Citizen:** registers, submits complaints, views updates, and marks a resolved complaint as satisfactory or reopened.
- **Department Staff:** views and updates complaints assigned to their department.
- **Field Worker:** receives assigned work and updates progress.
- **Administrator:** manages users, departments, assignments, categories, and reports.

## Citizen MVP features
1. Register and sign in securely.
2. Submit a complaint with:
   - title
   - description
   - category
   - location on a map
   - optional image
3. Receive a complaint reference number.
4. View all personal complaints and their current status.
5. View the complaint timeline and assigned department.
6. Confirm resolution or reopen a complaint.

## Complaint categories
- Roads and potholes
- Streetlights
- Garbage and sanitation
- Water supply
- Drainage and sewage
- Public safety
- Other civic issues

## Complaint lifecycle
```text
Submitted → Under Review → Assigned → In Progress → Resolved
                                      ↘ Rejected
Resolved → Closed
Resolved → Reopened → Assigned
```

## Staff MVP features
1. View complaints relevant to the user’s department.
2. Review, accept, reject, or assign complaints.
3. Change complaint status and add progress notes.
4. Assign field workers.
5. View basic department complaint counts.

## Administrator MVP features
1. Manage users and roles.
2. Manage departments and complaint categories.
3. View overall complaint statistics.
4. Monitor unresolved and overdue complaints.

## Out of scope for the first MVP
- AI/PyTorch complaint classification
- Advanced analytics dashboards
- Push notifications
- Multiple languages
- Public social-media integration
- Payment features

## Future phases
- Map-based complaint discovery with OpenStreetMap
- ML-assisted category and priority suggestions using Python and PyTorch
- Notification system
- Analytics and performance reports
- Multilingual support

## Security rules
- Use JWT-based authentication.
- Enforce role-based access control.
- A user may view or edit only data allowed for their role.
- Never store passwords as plain text.
- Do not expose secret keys, tokens, or database connection strings.