# syntax=docker/dockerfile:1.7

ARG BUILD_CONFIGURATION=Release
ARG NODE_VERSION=24-bookworm-slim

FROM node:${NODE_VERSION} AS node-runtime

FROM node:${NODE_VERSION} AS client-build
WORKDIR /src/client

ARG DEPLOY_ENVIRONMENT
ENV DEPLOY_ENVIRONMENT=$DEPLOY_ENVIRONMENT

COPY ["client/package.json", "client/package-lock.json", "./"]
RUN --mount=type=cache,target=/root/.npm npm ci

COPY ["client/", "./"]
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

ARG BUILD_CONFIGURATION

COPY ["server/server.csproj", "server/"]
RUN --mount=type=cache,target=/root/.nuget/packages \
    dotnet restore "./server/server.csproj" /p:SkipClientProjectReference=true

COPY . .
WORKDIR "/src/server"

RUN --mount=type=secret,id=ENV_B64 \
    sh -c 'set -eu; \
      if [ -f .env ] && [ -s .env ]; then echo ".env uz existuje, preskakuju envb64"; \
      elif [ -f /run/secrets/ENV_B64 ] && [ -s /run/secrets/ENV_B64 ]; then echo "vytvarim .env z ENV_B64"; \
        base64 -d /run/secrets/ENV_B64 > .env; chmod 600 .env; \
      else echo "neni .env a neni secret, vytvarim prazdny .env"; : > .env; chmod 600 .env; fi'

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN --mount=type=cache,target=/root/.nuget/packages \
    dotnet publish "./server.csproj" -c $BUILD_CONFIGURATION -o /app/publish --no-restore /p:UseAppHost=false /p:SkipClientProjectReference=true

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

ARG DEPLOY_ENVIRONMENT
ENV DEPLOY_ENVIRONMENT=$DEPLOY_ENVIRONMENT
ENV DEBIAN_FRONTEND=noninteractive

USER root
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libgssapi-krb5-2 \
        nginx \
    && rm -rf /var/lib/apt/lists/*

# Nuxt Nitro output is self-contained, but SSR still needs a Node runtime.
COPY --from=node-runtime /usr/local/bin/node /usr/local/bin/node

COPY --from=publish /app/publish ./
COPY --from=client-build /src/client/.output /app/client/.output
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
COPY --chmod=0755 start.sh .
CMD ["./start.sh"]
