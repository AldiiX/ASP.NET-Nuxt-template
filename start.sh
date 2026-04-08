#!/bin/sh

# Start the backend in the background
dotnet server.dll &

# Start the frontend (vite preview) in the background
cd /app/client/.output
node server/index.mjs &

# Start Nginx
nginx -g 'daemon off;'