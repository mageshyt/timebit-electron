# TimeBit Electron Agent Notes

## Local Sync Server
- The Electron main process starts a local REST + WebSocket sync server.
- Port: `5719`
- mDNS/Bonjour advertises the service as:
  - Name: `TimeBit`
  - Type: `http`

## Service Endpoints
- `GET /health`
- `GET /bootstrap`

## Notes
- The server is created in `src/server/sync-server.ts` and started from `src/main.ts`.
- Use TanStack Query in the renderer for data fetching and mutations (invalidate query caches after writes).
