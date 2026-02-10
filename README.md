# TimeBank App (Status Overview)

This repository contains a simple full-stack starter for a TimeBank-style app. The project currently includes a Vite + React client and a minimal Express + MongoDB server. Most of the business features are not implemented yet; this is an initial scaffold.

## What is done

### Server (Express + MongoDB)
- Node/Express server with CORS and JSON body parsing.
- MongoDB connection via Mongoose using `MONGO_URI` from `.env`.
- A single health/test route at `/` that returns a short message.
- Start scripts for dev (`nodemon`) and production (`node`).

### Client (Vite + React)
- Custom multi-page UI with React Router and hardcoded demo flows.
- Marketplace with search + filters, empty state, and clear-filters action.
- Service detail, request flow, profiles list, and profile pages.
- Hardcoded data moved to JSON at `client/src/data/demoData.json`.
- Cursor-following background glow and custom styling.
- Dependencies installed for future work: `axios` and `react-router-dom`.

## Folder structure

- client/   React frontend (Vite)
- server/   Express API server

## Environment variables

Create `server/.env` with:
- `MONGO_URI` (MongoDB connection string)
- `PORT` (server port; defaults to 5000)

Do not commit secrets or credentials to source control.

## Run the project

### Server

```bash
cd server
npm install
npm run dev
```

### Client

```bash
cd client
npm install
npm run dev
```

The client runs on Vite's dev server, and the API runs on the configured `PORT`.

## Current limitations

- No user authentication or authorization.
- No API routes beyond the test route.
- No database models or schemas beyond the MongoDB connection.
- All frontend data is hardcoded (no API integration).
- No persistence for requests, balances, or profiles.

## Suggested next steps

- Add Mongoose models (User, Service, Transaction).
- Build REST API routes and controllers.
- Add auth (JWT + bcrypt) and middleware.
- Add an API layer (axios instance) in the client and wire to backend.
- Replace hardcoded JSON data with real API calls.

## Notes

If you come back later and want a deeper audit, scan `client/src` for any extra components or prior experiments, and expand this README accordingly.
