# Sunstone Platform - Deployment Guide

## Overview
Sunstone Platform is a comprehensive web application for Discovery/Go-To-Market project management. This guide provides step-by-step instructions for deploying the application to production.

## Prerequisites
- Node.js 16+ and npm/yarn
- Web server (Apache, Nginx, or similar)
- Domain name (optional)
- SSL certificate (recommended)

## Deployment Options

### Option 1: Static Web Hosting (Recommended for most users)

#### 1.1 Prepare the files
```bash
# Create deployment directory
mkdir sunstone-deployment
cd sunstone-deployment

# Copy all HTML files
cp /path/to/sunstone/*.html ./

# Copy JavaScript files
cp /path/to/sunstone/*.js ./

# Copy configuration files
cp /path/to/sunstone/nginx.conf ./
cp /path/to/sunstone/Dockerfile ./
```

#### 1.2 Deploy to web server

**Using Nginx:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/sunstone;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Main application
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API routes (if needed)
    location /api/ {
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**Using Apache:**
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/sunstone
    
    # Security headers
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "no-referrer-when-downgrade"
    
    # Gzip compression
    LoadModule deflate_module modules/mod_deflate.so
    <Location />
        SetOutputFilter DEFLATE
        SetEnvIfNoCase Request_URI \
            \.(?:gif|jpe?g|png)$ no-gzip dont-vary
        SetEnvIfNoCase Request_URI \
            \.(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
    </Location>
    
    # Static files caching
    <FilesMatch "\.(jpg|jpeg|png|gif|ico|css|js)$">
        Header set Cache-Control "max-age=31536000, public"
    </FilesMatch>
    
    # SPA routing
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</VirtualHost>
```

### Option 2: Docker Deployment

#### 2.1 Build Docker image
```bash
docker build -t sunstone-platform .
```

#### 2.2 Run container
```bash
docker run -d -p 80:80 --name sunstone sunstone-platform
```

#### 2.3 Using docker-compose
```yaml
version: '3.8'
services:
  sunstone:
    build: .
    ports:
      - "80:80"
    volumes:
      - ./logs:/var/log/nginx
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

### Option 3: Cloud Deployment

#### 3.1 Vercel (Recommended for static sites)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### 3.2 Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

#### 3.3 AWS S3 + CloudFront
```bash
# Upload to S3
aws s3 sync . s3://your-bucket-name --exclude "*.md" --exclude "*.txt"

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Configuration Files

### nginx.conf
```nginx
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    keepalive_timeout 65;
    gzip on;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

        # Gzip compression
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

        # Static files caching
        location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Main application
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

### Dockerfile
```dockerfile
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy application files
COPY *.html /usr/share/nginx/html/
COPY *.js /usr/share/nginx/html/

# Create non-root user
RUN addgroup -g 1001 -S nginx && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx

# Set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

# Switch to non-root user
USER nginx

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  sunstone:
    build: .
    ports:
      - "80:80"
    volumes:
      - ./logs:/var/log/nginx
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## Environment Variables

### Production Environment
```bash
# Create .env file
NODE_ENV=production
VUE_APP_API_URL=https://api.yourdomain.com
VUE_APP_VERSION=1.0.0
```

### Development Environment
```bash
NODE_ENV=development
VUE_APP_API_URL=http://localhost:3000
VUE_APP_VERSION=1.0.0-dev
```

## Security Considerations

### 1. HTTPS Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
}
```

### 2. Security Headers
```nginx
# Add to server block
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### 3. Rate Limiting
```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req zone=api burst=20 nodelay;
```

## Performance Optimization

### 1. Enable Compression
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### 2. Optimize Static Assets
```nginx
# Static files caching
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Enable HTTP/2
```nginx
server {
    listen 443 ssl http2;
    # ... rest of configuration
}
```

## Monitoring and Logging

### 1. Access Logs
```nginx
access_log /var/log/nginx/access.log main;
```

### 2. Error Logs
```nginx
error_log /var/log/nginx/error.log warn;
```

### 3. Health Checks
```nginx
location /health {
    access_log off;
    return 200 "healthy\n";
    add_header Content-Type text/plain;
}
```

## Backup and Recovery

### 1. Data Backup
```bash
# Backup localStorage data
cp -r ~/.config/google-chrome/Default/Local\ Storage/ /backup/sunstone/

# Backup project data
tar -czf sunstone-backup-$(date +%Y%m%d).tar.gz /var/www/sunstone/
```

### 2. Recovery Procedures
```bash
# Restore from backup
tar -xzf sunstone-backup-20251126.tar.gz -C /var/www/

# Restart services
sudo systemctl restart nginx
sudo systemctl restart docker
```

## Troubleshooting

### Common Issues

#### 1. 404 Errors on Page Refresh
**Problem:** Refreshing page returns 404
**Solution:** Configure SPA routing in web server
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

#### 2. CORS Issues
**Problem:** API calls blocked by CORS
**Solution:** Configure CORS headers
```nginx
add_header Access-Control-Allow-Origin "*" always;
add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
```

#### 3. Slow Loading
**Problem:** Application loads slowly
**Solution:** Enable compression and caching
```nginx
gzip on;
expires 1y;
```

### Performance Monitoring

#### 1. Basic Monitoring
```bash
# Check server resources
top
free -h
df -h

# Check nginx status
sudo systemctl status nginx

# Check logs
sudo tail -f /var/log/nginx/error.log
```

#### 2. Advanced Monitoring
```bash
# Install monitoring tools
sudo apt-get install htop iotop

# Monitor network
sudo apt-get install nethogs

# Monitor disk usage
sudo apt-get install ncdu
```

## Maintenance

### Regular Tasks

#### 1. Update Dependencies
```bash
# Update system packages
sudo apt-get update && sudo apt-get upgrade

# Update Docker images
docker pull nginx:alpine
```

#### 2. Clean Up Logs
```bash
# Rotate logs
sudo logrotate -f /etc/logrotate.conf

# Clean old logs
sudo find /var/log -name "*.log.*" -mtime +30 -delete
```

#### 3. Security Updates
```bash
# Check for security updates
sudo apt-get update
sudo apt-get upgrade -s | grep -i security

# Apply security updates
sudo apt-get upgrade
```

## Support and Resources

### Documentation
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Web Security Best Practices](https://owasp.org/www-project-top-ten/)

### Community Support
- GitHub Issues
- Stack Overflow
- Developer Community Forums

### Professional Support
- Contact development team
- Schedule consultation
- Request custom features

## Conclusion

This deployment guide provides comprehensive instructions for deploying the Sunstone Platform. Choose the deployment option that best fits your needs and follow the security and performance recommendations for optimal results.

For additional support or custom deployment requirements, please contact the development team.