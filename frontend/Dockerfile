# AmazoniaCrop — frontend (React + Vite, servido por nginx)
# Contexto de build: frontend/
#   docker build -f frontend/Dockerfile \
#     --build-arg VITE_API_URL=https://mi-backend.up.railway.app \
#     -t amazonia-frontend ./frontend

# ── Stage 1: build estático ──────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# La URL del backend se incrusta en el bundle en tiempo de build. Pasarla como
# --build-arg en Railway sobreescribe el placeholder de .env.production.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Stage 2: servir con nginx ────────────────────────────────────────────
FROM nginx:alpine
# Railway inyecta $PORT; el entrypoint de la imagen nginx procesa el template
# (envsubst de ${PORT}). En local cae a 80.
ENV PORT=80
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
