# Ticketing Console

Requires Node.js and npm.

```sh
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:5173. The app expects Keycloak at `http://localhost:8081` and the API at `http://localhost:8080`; override the Keycloak settings in `.env.local` if needed.
