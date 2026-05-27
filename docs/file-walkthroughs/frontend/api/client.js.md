# Frontend File Walkthrough: `api/client.js`

This is the primary frontend API helper used by contexts and services.

## `API_BASE_URL`

```js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:5001";
```

The base URL comes from Vite env vars and falls back to the local backend port.

## `buildUrl(path)`

This function normalizes a relative path into a usable API URL.

What it handles:

- preserves full `http://` or `https://` URLs
- prepends `/api` when needed
- avoids double `/api` when the base URL already ends with `/api`

This keeps call sites simple: callers can pass `/students/me` instead of manually building URLs.

## `parseResponseBody(response)`

This helper reads the body safely.

Behavior:

- parses JSON when the response content type is JSON
- falls back to plain text when the server returns text
- returns `null` for empty responses

## `apiRequest(path, options)`

This is the main request helper.

Supported options:

- `method`
- `token`
- `body`
- `headers`

What it does:

1. Builds request headers.
2. Adds `Authorization: Bearer <token>` when a token exists.
3. Sends the request.
4. Returns `null` for `204 No Content`.
5. Throws a JavaScript `Error` for non-OK responses.

This is used by the auth, scholarship, application, and admin contexts.

## `apiUpload(path, options)`

This helper posts `FormData` uploads.

It behaves like `apiRequest`, but it does not force JSON headers and sends multipart/file payloads instead.

This is the function to use for document upload flows.
