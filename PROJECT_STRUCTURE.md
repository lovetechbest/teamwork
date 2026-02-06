# Money Spinner - Project Structure

## New Feature-Based Architecture

The project has been reorganized into a clean, feature-based structure for better maintainability and readability.

```
src/
├── features/                    # Feature modules (self-contained)
│   ├── dailyReport/
│   │   ├── components/         # Feature-specific components
│   │   │   ├── ReportForm.jsx
│   │   │   ├── ReportItem.jsx
│   │   │   └── ReportList.jsx
│   │   ├── hooks/              # Custom hooks
│   │   │   └── useDailyReport.js
│   │   ├── DailyReportPage.jsx # Main page component
│   │   └── *.css               # Feature styles
│   │
│   ├── clients/
│   │   ├── components/
│   │   │   ├── ClientForm.jsx
│   │   │   ├── ClientCard.jsx
│   │   │   └── ClientList.jsx
│   │   ├── hooks/
│   │   │   └── useClients.js
│   │   ├── ClientsPage.jsx
│   │   └── *.css
│   │
│   ├── projects/
│   │   ├── components/
│   │   │   ├── ProjectForm.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   └── ProjectList.jsx
│   │   ├── hooks/
│   │   │   └── useProjects.js
│   │   ├── ProjectsPage.jsx
│   │   └── *.css
│   │
│   └── profit/
│       ├── ProfitPage.jsx
│       └── ProfitPage.css
│
├── store/                      # Redux store (organized by domain)
│   ├── auth/
│   │   ├── authActions.js
│   │   └── authReducer.js
│   ├── reports/
│   │   └── reportActions.js
│   └── index.js
│
├── shared/                     # Shared/reusable components
│   └── components/
│       ├── PageTitle.jsx
│       └── ErrorMessage.jsx
│
├── components/                 # Global UI components
│   ├── Header.jsx
│   ├── FooterCards.jsx
│   ├── Login.jsx
│   ├── SignIn.jsx
│   └── ProtectedRoute.jsx
│
├── pages/                      # Page routing
│   ├── dashBoard/
│   │   ├── DashBoard.jsx
│   │   └── eachElement/
│   └── index.jsx              # Main router
│
├── styles/                     # Global styles
│   ├── basic-styles/
│   └── page-styles/
│
├── api.js                      # API configuration
├── App.jsx                     # Root component
└── main.jsx                    # Entry point
```

## Key Improvements

### 1. **Feature-Based Organization**
- Each feature (dailyReport, clients, projects) is self-contained
- Components, hooks, and styles are co-located with their feature
- Easier to find and modify related code

### 2. **Component Splitting**
- Large components split into smaller, focused components
- Better reusability and testability
- Improved readability

### 3. **Custom Hooks**
- Business logic extracted into reusable hooks
- Cleaner component code
- Easier to test and maintain

### 4. **Store Organization**
- Redux store organized by domain (auth, reports)
- Actions and reducers grouped together
- Clearer separation of concerns

### 5. **Shared Components**
- Common UI components in `shared/`
- Reusable across features
- Consistent design patterns

## Component Breakdown

### Daily Report Feature
- **ReportForm**: Form for submitting reports
- **ReportItem**: Individual report display
- **ReportList**: List of all reports
- **useDailyReport**: Hook managing report state and logic

### Clients Feature
- **ClientForm**: Form for adding/editing clients
- **ClientCard**: Individual client card display
- **ClientList**: Grid of client cards
- **useClients**: Hook managing client CRUD operations

### Projects Feature
- **ProjectForm**: Form for adding projects
- **ProjectCard**: Individual project display
- **ProjectList**: Grid of project cards
- **useProjects**: Hook managing project state

## Benefits

1. **Better Readability**: Smaller files, focused responsibilities
2. **Easier Maintenance**: Find related code in one place
3. **Improved Scalability**: Easy to add new features
4. **Better Testing**: Smaller components are easier to test
5. **Team Collaboration**: Clear structure reduces conflicts
