# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Instalar dependencias congelando el lockfile para consistencia
RUN pnpm install --no-frozen-lockfile

# Copiar el código fuente y compilar
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN pnpm run build

# Stage 2: Runtime
FROM nginx:1.25-alpine

# Copiar los artefactos estáticos generados en el build
COPY --from=build /app/dist /usr/share/nginx/html

# Configuración personalizada de Nginx para soportar SPA routing (React Router)
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    location / { \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    try_files $uri $uri/ /index.html; \
    } \
    error_page 500 502 503 504 /50x.html; \
    location = /50x.html { \
    root /usr/share/nginx/html; \
    } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
