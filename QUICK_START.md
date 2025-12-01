# Quick Start - Sunstone Platform Deployment

## 🚀 Opciones de Despliegue Rápido

### Nivel 1: Principiante (5 minutos)

#### Opción A: Netlify (RECOMENDADA)

1. **Prepara tus archivos**
   ```bash
   # Crea una carpeta con todos los archivos
   mkdir sunstone-platform
   cp *.html sunstone-platform/
   cp *.js sunstone-platform/
   ```

2. **Sube a Netlify**
   - Ve a [netlify.com](https://netlify.com)
   - Arrastra tu carpeta a la zona de drag & drop
   - ¡Listo! Tu sitio estará en línea en segundos

3. **Configura tu dominio (opcional)**
   - Ve a Domain Settings
   - Add custom domain
   - Sigue las instrucciones de DNS

#### Opción B: Vercel

1. **Instala Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Despliega**
   ```bash
   cd tu-carpeta-sunstone
   vercel --prod
   ```

### Nivel 2: Intermedio (30 minutos)

#### GitHub Pages + Custom Domain

1. **Crea repositorio en GitHub**
   ```bash
   # Inicializa git
   git init
   
   # Crea .gitignore
   echo "node_modules/" > .gitignore
   echo ".env" >> .gitignore
   
   # Commitea
   git add .
   git commit -m "Initial commit"
   
   # Agrega remote y sube
   git remote add origin https://github.com/tuusuario/sunstone-platform.git
   git push -u origin main
   ```

2. **Activa GitHub Pages**
   - Ve a Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Save

3. **Configura dominio personalizado**
   - Crea archivo `CNAME` en tu repo
   - Agrega tu dominio: `sunstone-platform.com`
   - Configura DNS en tu proveedor

### Nivel 3: Avanzado (2 horas)

#### VPS con Nginx (Digital Ocean)

1. **Crea droplet**
   - Ubuntu 20.04
   - $10/month (2GB RAM)
   - SSH keys

2. **Conecta por SSH**
   ```bash
   ssh root@tu-ip
   ```

3. **Instala Nginx**
   ```bash
   apt update && apt upgrade -y
   apt install nginx -y
   
   # Configura firewall
   ufw allow 'Nginx Full'
   ufw allow ssh
   ufw enable
   ```

4. **Sube archivos**
   ```bash
   # En tu máquina local
   scp -r * root@tu-ip:/var/www/html/
   ```

5. **Configura Nginx**
   ```bash
   # Edita configuración
   nano /etc/nginx/sites-available/default
   
   # Agrega configuración SPA
   location / {
       try_files $uri $uri/ /index.html;
   }
   ```

6. **Reinicia Nginx**
   ```bash
   nginx -t
   systemctl reload nginx
   ```

### Nivel 4: Enterprise (1 día)

#### Docker + AWS/GCP

1. **Dockerfile**
   ```dockerfile
   FROM nginx:alpine
   COPY . /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Construye y despliega**
   ```bash
   docker build -t sunstone-platform .
   docker run -d -p 80:80 sunstone-platform
   ```

3. **En la nube**
   - AWS ECS / EKS
   - Google Cloud Run / GKE
   - Azure Container Instances

## 🛠️ Configuraciones Recomendadas

### 1. Variables de Entorno

Crea archivo `.env` para configuraciones:

```bash
# .env
VITE_API_URL=https://api.sunstone-platform.com
VITE_ANALYTICS_ID=GA_XXXXXX
VITE_SENTRY_DSN=https://sentry.io/xxxx
```

### 2. Analytics

Agrega en `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 3. Error Tracking

En `main.js`:

```javascript
// Sentry para error tracking
import * as Sentry from '@sentry/browser';

Sentry.init({
    dsn: 'tu-dsn-de-sentry',
    tracesSampleRate: 0.1
});
```

## 📊 Monitoreo Básico

### 1. Uptime Monitoring
- [UptimeRobot](https://uptimerobot.com/) - Gratis
- [Pingdom](https://pingdom.com/) - Pago

### 2. Performance
- Google Lighthouse
- GTmetrix
- WebPageTest

### 3. Seguridad
- [SSL Labs Test](https://www.ssllabs.com/ssltest/)
- [Security Headers](https://securityheaders.com/)

## 🔧 Solución de Problemas

### Error 404 al refrescar
**Problema**: SPA routing no funciona
**Solución**: Configura fallback en servidor:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Mixed Content
**Problema**: Recursos HTTP en HTTPS
**Solución**: Usa HTTPS para todo:

```html
<!-- Cambia -->
<script src="http://example.com/script.js"></script>
<!-- Por -->
<script src="https://example.com/script.js"></script>
```

### CORS Issues
**Problema**: Problemas con API
**Solución**: Configura headers:

```javascript
// Backend
app.use(cors({
    origin: ['https://sunstone-platform.com'],
    credentials: true
}));
```

## 💰 Costos Estimados

### Opción Budget
- **Dominio**: $12/año
- **Hosting**: $0 (GitHub Pages)
- **Total**: $12/año

### Opción Profesional
- **Dominio**: $12/año
- **VPS**: $240/año
- **Total**: $252/año

### Opción Enterprise
- **Dominio**: $12/año
- **Cloud**: $600-1200/año
- **Total**: $612-1212/año

## 🎉 ¡Tu Sitio Está en Producción!

Una vez completados estos pasos, tu aplicación Sunstone estará disponible en tu dominio personalizado. Recuerda:

1. **Testea todas las funcionalidades**
2. **Configura monitoreo**
3. **Establece backups**
4. **Documenta para tu equipo**

## 📞 Soporte

Si encuentras problemas:
1. Revisa esta guía
2. Consulta la documentación completa en `DEPLOYMENT_GUIDE.md`
3. Contacta soporte técnico

---

**¡Buena suerte con tu despliegue! 🚀**