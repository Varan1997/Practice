# PeopleDesk — Employee Management Frontend

Premium responsive React dashboard connected to the Express API.

## Requirements
- Node.js and npm
- Your backend running at `http://localhost:5000`
- Backend endpoints:
  - `GET /employees` — returns an array
  - `POST /employees` — accepts `{ "name": "...", "role": "..." }`

## Run the frontend

Open a terminal in this folder and run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Backend reminder

Your Express backend must include:

```js
app.use(express.json());
```

For local development, if the browser reports a CORS error, install and enable CORS in the backend:

```bash
npm install cors
```

Then near the top of `server.js`:

```js
const cors = require("cors");
app.use(cors());
app.use(express.json());
```

Restart the backend after changing `server.js`.

## Notes
- This frontend currently uses your Day 2/Day 3 GET and POST endpoints.
- Edit and delete controls are intentionally disabled until we build the PUT and DELETE backend routes in the next tasks.
- Employee data stored in a JavaScript array on the backend is temporary and resets when the server restarts. MongoDB will make it persistent later.
