# Dockerfile para Sunstone Platform
# Multi-stage build para optimización

# Stage 1: Build stage (si necesitas compilar algo en el futuro)
FROM node:18-alpine AS builder

# Establece directorio de trabajo
WORKDIR /app

# Copia archivos de configuración
COPY package*.json ./

# Instala dependencias (si las hay en el futuro)
# RUN npm ci --only=production

# Copia código fuente
COPY . .

# Stage 2: Production stage con Nginx
FROM nginx:alpine

# Instala Node.js en la imagen final (si decides agregar funcionalidades SSR)
# RUN apk add --no-cache nodejs npm

# Elimina configuración por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia archivos HTML, CSS, JS
COPY --from=builder /app/*.html /usr/share/nginx/html/
COPY --from=builder /app/*.js /usr/share/nginx/html/
COPY --from=builder /app/*.css /usr/share/nginx/html/

# Copia configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Crea directorio para logs
RUN mkdir -p /var/log/nginx

# Establece permisos correctos
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Expone puerto 80 y 443
EXPOSE 80 443

# Usuario no-root para seguridad
USER nginx

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]