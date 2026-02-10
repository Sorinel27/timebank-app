# TimeBank Server (Status Overview)

This folder contains a minimal Express + MongoDB API scaffold for the TimeBank app. It currently provides a database connection and a single health route.

## What is done

- Express server with JSON body parsing.
- CORS enabled for local development.
- MongoDB connection using Mongoose via `MONGO_URI`.
- Health/test route at `/`.

## Environment variables

Create `server/.env` with:
- `MONGO_URI` (MongoDB connection string)
- `PORT` (server port; defaults to 5000)

Do not commit secrets or credentials to source control.

## Run the server

```bash
npm install
npm run dev
```

The server will listen on `PORT` (default 5000).

## Current limitations

- No auth, users, or sessions.
- No business routes or controllers.
- No models beyond the DB connection.
- No validation, logging, or error handling layers.

## Suggested next steps

- Add Mongoose models (User, Service, Transaction).
- Create REST routes and controllers.
- Add JWT auth + bcrypt password hashing.
- Add centralized error handling and request validation.
- Configure environment-specific settings.
