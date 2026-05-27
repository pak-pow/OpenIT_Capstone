# Frontend File Walkthrough: `UserDashboard.jsx`

This is the main student dashboard orchestration file. It composes the layout, widgets, modals, and scholarship actions.

## Helper functions

### `daysUntil(dateStr)`

Returns the number of days between now and a deadline date.

### `urgencyDotClass(days)`

Maps the number of days remaining into a color class for deadline urgency.

## `DeadlineAlertBar`

Displays a warning bar for scholarships closing within 30 days.

It sorts urgent scholarships, picks the nearest deadline, and lets the user dismiss the banner.

## `WelcomeBanner`

Shows a personalized greeting using `currentUser.firstName` and, when available, the user’s course.

## `QuickActionsPanel`

Renders the main shortcuts:

- apply for scholarship
- check application status

It delegates actions back up through props.

## `CurrentScholarshipWidget`

Displays the currently approved scholarship, amount, status, and a computed renewal date.

Important calculation:

```jsx
const renewalDate = new Date(appliedDate);
renewalDate.setMonth(renewalDate.getMonth() + 6);
```

This gives the dashboard a clear “next renewal” target.

## `FeaturedScholarshipsWidget`

Shows up to two urgent scholarship opportunities when the student does not already have an active scholarship.

It:

- filters out expired scholarships
- excludes already interacted-with scholarships
- opens `ApplyModal` when a card is selected

## `NextStepsChecklist`

Provides a simple onboarding checklist when the student has no applications yet.

## `DashboardSidebar`

Builds the mini calendar and deadline list.

It calculates:

- calendar cells for the selected month
- deadline dots per day
- a list of deadlines for that month

The previous/next month buttons adjust `calMonth` and `calYear`.

## `UserDashboard`

This is the coordinator component.

### State and refs

```jsx
const [view, setView] = useState('dashboard');
const statusRef = useRef(null);
```

The `view` state toggles between the dashboard and the all-scholarships browse screen.

### App state from context

```jsx
const { applications, activeScholarship, simulateApproval, simulateRejection, simulateEnded, clearJustApproved, clearJustRejected, clearJustEnded } = useScholarships();
```

This pulls in scholarship data, active-award state, and the demo simulation helpers.

### Keyboard shortcuts

The `useEffect` block listens for:

- `Shift + 3` -> simulate approval
- `Shift + 4` -> simulate rejection
- `Shift + 5` -> simulate end/completion

### `handleApply(scholarship, result)`

This interprets the result of `applyToScholarship` and shows the correct toast message for each outcome.

### `scrollToStatus()`

Smooth-scrolls to the application status section so users can jump straight to their tracking table.

### Render flow

When `view === 'dashboard'`, the page shows:

1. deadline alert
2. welcome banner
3. quick actions
4. current scholarship or featured scholarships
5. smart-match section
6. application status list
7. right sidebar with the calendar

When `view !== 'dashboard'`, the page shows `AllScholarshipsView` instead.

### Modal handling

The component conditionally renders:

- `PaldoModal` for approvals
- `NotPaldoModal` for rejections
- `EndedModal` for completed scholarships

Those modal states are cleared through the `clearJust*` helpers.
