# Jambo Travel Planner

## Project Overview
Jambo Travel Planner is a small full-stack assessment project allows user to check the weather of the selected city. A user logs in with demo credentials, the frontend loads a protected city list from the backend, and the planner shows destination details that combine local city metadata with external weather and encyclopedia data. The project is intentionally scoped to a small supported city list so the architecture and code quality are easy to evaluate.

## Tech Stack
- Frontend: Angular, TypeScript, HttpClient
- Backend: Node.js, Express, TypeScript
- Auth: JWT
- Testing: Jest, ts-jest
- External APIs: OpenWeatherMap, Wikipedia, IP geolocation API

## Architecture

- The project is split into two applications:
  - an Angular frontend (`frontend/`)
  - an Express + TypeScript backend (`backend/`)

- The frontend is responsible for:
  - rendering UI
  - handling login state
  - storing the JWT locally
  - calling backend APIs  

- The backend is responsible for:
  - authentication and JWT validation
  - protecting API routes
  - serving the fixed city catalog
  - aggregating external data sources

- All third-party integrations are handled in the backend.  
  The main travel endpoint combines:
  - weather data from OpenWeatherMap
  - city summaries from Wikipedia
  - internal fixed city metadata

- This design provides:
  - a single, stable API surface for the frontend
  - better security (API keys never exposed to the browser)
  - easier evolution of backend integrations without affecting the UI

## Features
- Demo login backed by JWT authentication
- Protected backend endpoints for user info, city list, travel info, and current-city detection
- Planner flow that loads supported cities, auto-selects a likely default city from IP geolocation, and displays travel details
- Travel data response that combines:
  fixed supported city metadata,
  live weather data,
  and a real encyclopedia summary
- Minimal unit test coverage for core backend services (`AuthService`, `TravelService`, `LocationService`)

## Project Structure
```text
.
|-- backend/
|   |-- src/
|   |   |-- clients/
|   |   |-- config/
|   |   |-- constants/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- routes/
|   |   |-- services/
|   |   `-- utils/
|   `-- tests/
`-- frontend/
    `-- src/
        `-- app/
```

## Backend Setup
1. Open a terminal in `backend/`
2. Install dependencies: `npm install`
3. Configure `backend/.env`
4. Start the API: `npm run dev`

Default backend URL: `http://localhost:3001`

## Frontend Setup
1. Open a terminal in `frontend/`
2. Install dependencies: `npm install`
3. Start the Angular app: `npm start`

Default frontend URL: `http://localhost:4200`

## Environment Variables
Backend `.env`:

```env
PORT=3001
JWT_SECRET=your_jwt_secret
DEMO_USERNAME=demo
DEMO_PASSWORD=demo123
WEATHER_API_KEY=openweathermap_key
```

Frontend:
- No frontend environment file is required yet for the current assessment scope.

## Running Tests
Backend tests:

```bash
cd backend
npm test
```

Current unit tests cover:
- `AuthService`
- `TravelService`
- `LocationService`

## API Endpoints
Authentication:
- `POST /api/auth/login`  
  Validates demo credentials and returns a JWT plus a simple user object.

User:
- `GET /api/user/me`  
  Returns the decoded JWT payload for the current authenticated user.

Cities:
- `GET /api/cities`  
  Returns the fixed list of supported cities available in the planner.

Travel:
- `GET /api/travel/cities/:cityId`  
  Returns city details, a short description, current weather, and a 5-day forecast summary for a supported city.

Location:
- `GET /api/location/current-city`  
  Detects the likely city from IP, maps it to the closest supported city, and returns the matched city id.

Health:
- `GET /health`  
  Simple health check for local development.

## Trade-offs and Design Decisions

- **Fixed city list**  
  A predefined set of supported cities was used to keep the scope focused on system design and data flow rather than open-ended search, validation, and content management.

- **No database**  
  The application does not persist user data or travel plans, so introducing a database would add unnecessary complexity. Keeping state in code makes the project easier to run and review.

- **Mock-first development**  
  The project started with mock travel data to quickly establish and validate the frontend-backend contract.  
  Once the API shape was stable, mock data was replaced with real integrations (weather and Wikipedia).

- **Backend aggregation layer**  
  The backend acts as an orchestration layer that combines multiple external APIs into a single normalized response.  
  This simplifies frontend logic and isolates third-party dependencies.

- **Graceful fallback strategy**  
  External API failures do not break the user experience:
  - weather failures fall back to mock weather data
  - wiki failures fall back to a default description
  - geolocation failures fall back to a default supported city  
  This ensures the application remains usable even under partial outages.

- **JWT storage strategy**  
  JWT is stored in `localStorage` to keep the authentication flow simple for this demo.  
  In production, a more secure approach (e.g., httpOnly cookies with refresh tokens) would be preferred.

## Future Improvements
- Add API integration tests for key routes in addition to current service-level unit tests
- Add caching for weather, wiki, and geolocation lookups to reduce latency and third-party API usage
- Add a city search instead of a short list of selections
- Add centralized request validation and error handling for backend routes
- Move frontend API URLs into environment-specific configuration
- Add stylesheet instead of hardcoded color, spacing and font to ensure style consistency

## AI Usage

### Tools
- Codex

### How I used AI

I used AI tools to assist with development efficiency, mainly for scaffolding, boilerplate generation, and refining documentation. 

My overall workflow was:

1. I first reviewed the requirements and defined the project scope.
2. I made all key decisions around:
   - technology stack
   - system architecture
   - folder structure
   - API design
   - authentication flow
3. I used AI to help initialize parts of the frontend and backend setup.
4. I broke the implementation into smaller, well-defined tasks.
5. For each task, I used AI with structured prompts based on my design to generate initial implementations.
6. I reviewed and adjusted all AI-generated code to ensure it met my expectations, especially for core logic such as:
   - API responses
   - error handling
   - authentication
7. I used AI to help refine README, comments, and JSDoc for clarity.

Overall, AI was used as a productivity tool, while all design decisions and final implementations were validated and owned by me.

### Example Prompt

Below is an example of how I used structured prompts to guide AI for a specific feature:
Work only in the frontend folder.

Goal: Use the backend geolocation endpoint to auto-select the default city on the Planner page.

Tasks:
1. Create a LocationService
   - Use HttpClient
   - Add getCurrentCity() that calls GET /api/location/current-city

2. Update the Planner page component
   - On init, after confirming a token exists:
     - load cities first
     - then call the location endpoint
   - If response contains a matchedCityId that exists in the city list:
     - set it as selectedCityId
     - load travel info for that city
   - If the request fails or no match is found:
     - fall back to selecting the first city

Constraints:
- Do not modify backend
- Do not change login flow
- Keep changes minimal
- Do not refactor unrelated files
- Show a summary of changed files before finishing

This approach helped ensure changes were incremental, controlled, and aligned with the overall system design.
I avoided over-reliance on AI for critical logic to ensure I fully understood and could explain all parts of the system during technical discussions.
