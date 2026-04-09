Call Taking Form React — Future Expansion TODO
Phase 0 — Planning and structure
Goal

Prepare the project structure for expansion beyond the call form.

 Define the name of the new module
Suggested main option: Crew Planner
Alternatives: Shift Builder, Crew & Schedule, Unit Assignment Board
 Define the MVP scope of the new module
MVP should include:
employee storage
license tracking
crew assignment
next-day schedule planning
 Define what is not part of MVP yet
Excluded for now:
payroll
full overtime engine
advanced permissions
email/SMS notifications
historical analytics
export to PDF/Excel
full backend persistence
 Decide initial data strategy
Suggested order:
mock/local state
localStorage
backend API later
 Review current project structure and decide where new pages/components should live
Phase 1 — App structure and navigation
Goal

Convert the current single-purpose app into a multi-page operational tool.

 Add routing if not already structured for module expansion
 Create top-level pages:
 CallFormPage
 EmployeesPage
 CrewPlannerPage
 Add top navigation bar
 Link to Call Form
 Link to Employees
 Link to Crew Planner
 Organize folders for future scalability
Suggested structure:
 src/pages/
 src/components/employees/
 src/components/crew/
 src/utils/
 src/data/ or src/mock/
 Keep current Call Taking Form isolated from future staffing features
Phase 2 — Employee management foundation
Goal

Create the employee entity as the base for all future scheduling logic.

Employee basic fields
 Add employee model structure for frontend state
 Include basic fields:
 id
 firstName
 lastName
 phone
 isActive
 notes
Employee page
 Create Employees page layout
 Add employee creation form
 Add employee list/table
 Add edit employee functionality
 Add deactivate/remove functionality
 Add employee search by name
 Add filter by active/inactive status
Optional early useful fields
 Add email field
 Add preferred shift field
 Add availability status field
 Add internal comments field
Phase 3 — License and certification system
Goal

Build assignment rules based on certifications instead of a single flat role.

License model design
 Add separate license objects instead of one generic role field

Suggested structure per employee:

 evoc
 emt
 paramedic

Each license should include:

 hasLicense
 licenseName
 expirationDate
Employee form changes
 Add license section to employee form
 Add EVOC input block
 Has EVOC checkbox
 License name field
 Expiration date field
 Add EMT input block
 Has EMT checkbox
 License name field
 Expiration date field
 Add Paramedic input block
 Has Paramedic checkbox
 License name field
 Expiration date field
License status helpers
 Create helper: getLicenseStatus(expirationDate)
 Support status values:
 active
 expiringSoon
 expired
 missing
 Decide “expiring soon” threshold
Suggested default: 30 days
Employee list display
 Show license summary in employee table
 Add visual status badges for each license
 Highlight expired licenses in red
 Highlight expiring-soon licenses in yellow
 Show exact expiration date in employee details
Phase 4 — Position eligibility rules
Goal

Translate licenses into allowed assignment positions.

Assignment rules
 Create helper: getAllowedPositions(employee)
Required behavior
 If employee has no licenses → allow Assist only
 If employee has EVOC only → allow Driver and Assist
 If employee has EMT only → allow EMT and Assist
 If employee has EMT + EVOC → allow Driver, EMT, and Assist
 If employee has Paramedic only → allow Paramedic and Assist
 If employee has Paramedic + EVOC → allow Driver, Paramedic, and Assist
Preferred roles
 Add helper: getPreferredPositions(employee)
 Prioritize Driver for EVOC holders
 Prioritize EMT for EMT-only workers
 Prioritize Paramedic for Paramedic-only workers
 Keep Assist as fallback for everyone
Important rule
 Do not hard-block expired licenses yet
 Allow assignment but show warning
 Keep system operational instead of over-restrictive
Phase 5 — Assignment warnings and validation
Goal

Prevent obvious scheduling mistakes and show actionable warnings.

 Create helper: getAssignmentWarnings(employee, targetPosition)
Warning logic
 If Driver slot is selected and EVOC is expired → show warning
 If EMT slot is selected and EMT license is expired → show warning
 If Paramedic slot is selected and Paramedic license is expired → show warning
 If relevant license is expiring soon → show softer warning
 If employee lacks required license entirely → either hide from slot options or show as invalid option
Assignment safeguards
 Prevent assigning the same employee to two places at the same time
 Prevent duplicate assignment inside the same day plan
 Mark crew as incomplete if required slots are empty
 Show conflict state if employee is already assigned elsewhere
UI warnings
 Show warning message with exact expired license and expiration date
 Highlight risky assignment cards visually
 Add badge such as:
 Expired License
 Expiring Soon
 Conflict
 Incomplete Crew
Phase 6 — Crew Planner MVP
Goal

Create the actual scheduling workspace for next-day staffing.

Page layout
 Create Crew Planner page
 Design page with two main sections:
 available employees
 crew/unit assignment area
Unit structure
 Define unit model
Suggested fields:
 id
 unitName
 crewType
 date
 slots
Slot structure
 Define assignable slot types
Suggested initial slot types:
 Driver
 EMT
 Paramedic
 Assist
Unit templates
 Allow creating standard unit cards manually first
 Add common unit examples such as:
 Standard crew
 Assist crew
 Bari crew
 Wheelchair unit
Assignment UX
 Add employee selection into slots
 Show only eligible employees for each slot when possible
 Display warnings without breaking assignment flow
 Allow removing employee from slot
 Allow quick reassignment
Crew state
 Mark crew as:
 Ready
 Incomplete
 Risky
 Off / Standby
Phase 7 — Next-day scheduling logic
Goal

Make the planner useful for real operations, not just as a visual toy.

 Add date selector to planner
 Add quick actions:
 Today
 Tomorrow
 Next Day
 Build the planner around daily schedules, not generic unsaved cards
 Support drafting tomorrow’s plan
 Add schedule notes field for each unit
 Add notes for employee assignment if needed
Helpful actions
 Add “Clear schedule” function
 Add “Duplicate previous day” function
 Add “Duplicate last similar weekday” later if useful
 Add “Swap employees” convenience logic later
Plan states
 Add draft mode
 Add confirmed mode
 Show clear distinction between unfinished draft and final next-day plan
Phase 8 — Employee availability and operational statuses
Goal

Support real-life scheduling situations.

 Add employee availability field
 Support statuses such as:
 Available
 Off
 PTO
 Sick
 Training
 Restricted
 Unknown
 Filter employee list by availability
 Exclude unavailable workers from quick assignment lists
 Allow manual override if needed
Good future extension
 Add “can drive today” quick filter
 Add “EMT available” quick filter
 Add “Paramedic available” quick filter
Phase 9 — Local persistence
Goal

Keep data between sessions without jumping into backend too early.

 Save employee records to localStorage
 Save crew templates to localStorage
 Save daily schedule drafts to localStorage
 Restore saved data on page load
 Add version-safe parsing to avoid crashes from broken stored data
 Add reset/clear saved planner data option
Safety
 Keep storage structure separated:
 employees
 units/templates
 schedules
 Avoid one giant storage blob
Because giant JSON blobs are how projects quietly become corpses.
Phase 10 — Dashboard and admin visibility
Goal

Surface the most useful operational information fast.

 Add summary block to Employees or Crew Planner page
 Show counts:
 Active employees
 Available employees
 Active drivers
 Active EMTs
 Active paramedics
 Add expiration summary:
 expired licenses count
 expiring soon count
 Add quick warning list:
 employees with expired EVOC
 employees with expired EMT
 employees with expired Paramedic
Nice upgrade
 Add mini dashboard cards with color-coded status
Phase 11 — Print and daily operations support
Goal

Make the new module operationally usable, not just technically present.

 Add print-friendly version of next-day schedule
 Format schedule for quick review
 Show:
 unit name
 assigned personnel
 slot/position
 warnings
 notes
 Make printed schedule readable on one page if possible
 Keep bootstrap-based styling consistent with the rest of the app
Phase 12 — Backend preparation
Goal

Prepare for future real persistence and scalability.

Data models to prepare for backend later
 Employee
 License / Certification
 UnitTemplate
 DailySchedule
 Assignment
Suggested future API groups
Employees
 GET /api/employees
 POST /api/employees
 PUT /api/employees/:id
 DELETE /api/employees/:id
Schedules
 GET /api/schedules?date=YYYY-MM-DD
 POST /api/schedules
 PUT /api/schedules/:id
 DELETE /api/schedules/:id
Units
 GET /api/units
 POST /api/units
 PUT /api/units/:id
 DELETE /api/units/:id
Important future design decision
 Store employees separately from schedules
 Store unit templates separately from daily assignments
 Do not store entire days as one giant monolithic object unless absolutely necessary
Phase 13 — Hours tracking (future, not MVP)
Goal

Build time tracking only after scheduling works reliably.

 Define how work hours are calculated
 Add shift time fields:
 start time
 end time
 break duration if needed
 Calculate total hours per shift
 Calculate total hours per employee per week
 Calculate total hours per pay period
 Add overtime warning logic later
Future reports
 Employee hours summary page
 Weekly hours table
 Overtime alerts
 Over-assignment warnings
 Too little rest between shifts warning
Explicitly postpone for now
 payroll export
 complex labor rule engine
 automatic pay rate math
 union/contract logic
Suggested development order

Вот это — самый важный кусок.
Если идти не по порядку, проект быстро начнет расползаться.

Recommended build order
Step 1
 Add routing
 Add navbar
 Create empty Employees page
 Create empty Crew Planner page
Step 2
 Build employee CRUD on frontend only
 Add employee form
 Add employee list
 Add edit/deactivate
Step 3
 Add license fields
 Add license status helpers
 Show license badges in UI
Step 4
 Implement allowed position logic
 Implement preferred position logic
 Implement assignment warning logic
Step 5
 Build Crew Planner page
 Add units
 Add slots
 Add employee assignment
 Add crew validation
Step 6
 Add date-based daily planning
 Add duplicate previous day
 Add clear schedule
 Add draft/confirmed state
Step 7
 Add localStorage persistence
 Stabilize UX
 Test workflow manually
Step 8
 Add dashboard / warning summaries
 Add print support for next-day plan
Step 9
 Prepare backend API design
 Move employees and schedules to Flask later
Step 10
 Add hours tracking only after planner becomes stable
Ideas to add later

Вот что реально может усилить проект, но потом, не сейчас.

Useful future additions
 Crew templates
 Copy yesterday’s plan
 Weekly schedule view
 Certification expiration dashboard
 Quick filters for available drivers/EMTs/paramedics
 Employee detail modal
 Assignment notes
 Shift notes
 Change log / audit trail
 Role-based access later
 Backend persistence
 PDF export
 Hours reports
 Overtime alerts
What should NOT be done early
 Do not start with payroll
 Do not build drag-and-drop first
 Do not build complex overtime rules first
 Do not overcomplicate permissions before the planner works
 Do not mix schedule logic directly into the call form page
 Do not store everything in one oversized object
