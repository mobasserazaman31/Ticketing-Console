# Ticketing Console

React, TypeScript, and Vite client with Keycloak authentication, Axios token refresh, and a responsive CSS interface.

## Run locally

```sh
npm install
cp .env.example .env.local
npm run dev
```

Set `VITE_KEYCLOAK_URL`, `VITE_KEYCLOAK_REALM`, and `VITE_KEYCLOAK_CLIENT_ID` in `.env.local` for your Keycloak deployment. The defaults target `http://localhost:8081`, realm `ticketing-realm`, and client `postman-client`.

Configure the Keycloak client as a public client with Standard Flow enabled and PKCE method `S256`. Add `http://localhost:5173/*` as a valid redirect URI and `http://localhost:5173` as a web origin. The API client targets `http://localhost:8080`.

## UI styling

Styles are authored in `src/index.css` and `src/App.css`. The palette is defined with CSS custom properties in `src/index.css` and used throughout the responsive layout.
