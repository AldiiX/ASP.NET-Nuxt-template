#!/bin/sh

# Start the backend in the background
dotnet server.dll &

# Start the frontend in the background
node /app/client/.output/server/index.mjs &

# Start Nginx
nginx -g 'daemon off;'
