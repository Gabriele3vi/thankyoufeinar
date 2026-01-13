# Grazie Feinar

A SvelteKit application for managing time tracking (timbrature) via the Feinar employee portal API.

## Features

- **Secure Authentication**: Login with username/password, JWT token-based sessions
- **Dashboard View**: Display last 7 days of time tracking entries in a table
- **Clock In/Out**: Manual time entry with custom timestamps
- **Auto-Refresh**: Table updates automatically after new entries
- **Protected Routes**: Automatic redirects based on authentication state
- **Responsive UI**: Clean interface using DaisyUI and TailwindCSS
- **Proper Error Handling**: Loading states and error messages

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── Input.svelte           # Reusable input component with icon support
│   │   ├── TimbratureTable.svelte # Table component for displaying time entries
│   │   └── icons.js                # SVG icon definitions
│   ├── services/
│   │   └── api.js                  # API service for all backend interactions
│   └── stores/
│       ├── auth.svelte.js          # Authentication state management
│       └── notification.svelte.js  # Notification state management
└── routes/
    ├── +layout.svelte              # Root layout
    ├── +page.svelte                # Landing page (redirects)
    ├── login/
    │   └── +page.svelte            # Login page
    └── dashboard/
        └── +page.svelte            # Main dashboard with table and clock in/out
```

## User Flow

1. User visits `/` → Redirects to `/login` or `/dashboard` based on auth state
2. Login at `/login` → Stores JWT token in localStorage → Redirects to `/dashboard`
3. Dashboard shows:
   - Last 7 days of time entries in a table
   - Form to clock in/out with custom timestamp
   - Logout button
4. After clocking in/out → Table automatically refreshes with new data

## Architecture

### Services Layer - [api.js](src/lib/services/api.js)
- `login(username, password)`: Authenticate and get JWT token
- `fetchTimbrature(token, startDate, endDate)`: Get time entries for date range
- `clockInOut(direction, token, timestamp)`: Submit new time entry (E=entry, U=exit)

### Components
- **Input.svelte**: Reusable form input with validation and icon support
- **TimbratureTable.svelte**: Table display for time tracking entries
  - Formats dates and times in Italian locale
  - Shows badges for entry/exit types
  - Displays anomaly and status indicators
- **icons.js**: Centralized SVG icon definitions

### State Management
- **auth.svelte.js**: JWT token storage and authentication state using Svelte 5 runes
  - `setToken()`: Store token in state and localStorage
  - `clearToken()`: Remove token (logout)
  - `getToken()`: Retrieve current token
- **notification.svelte.js**: Success/error message display

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## API Endpoints

- **Login**: `POST /api/v1/Auth/web/login`
- **Fetch Timbrature**: `GET /api/v1/Presenze?da=YYYY-MM-DD&a=YYYY-MM-DD`
- **Clock In/Out**: `POST /api/v1/Presenze/web/timbra`

## Response Format

The `/Presenze` endpoint returns:
```json
{
  "giornate": [
    {
      "data": "2026-01-13T00:00:00",
      "coloreSfondo": "#E6FEFE",
      "anomalia": false,
      "giornataChiusa": false,
      "timbrature": [
        {
          "dataOra": "2026-01-13T08:25:28",
          "verso": "E",
          "tipo": "T",
          "timbratore": "OROLOGIO WEB"
        }
      ]
    }
  ]
}
```

## Technologies

- SvelteKit 2.x
- Svelte 5 (using new runes syntax: `$state`, `$derived`, `$effect`)
- TailwindCSS 4.x
- DaisyUI 5.x
