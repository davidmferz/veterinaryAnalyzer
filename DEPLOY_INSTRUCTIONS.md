# 🚀 Instrucciones Finales de Deployment

## ✅ Estado Actual

- ✅ Build completado en EC2
- ✅ Archivos en `/var/www/html/veterinaryAnalyzer/dist/`
- ⚠️ Necesita configuración de Apache

---

## 📍 URLs de Acceso

Después de completar estos pasos:

- **Frontend VHS Analyzer**: `https://3.134.5.42/vhs`
- **API VHS Backend**: `https://3.134.5.42/vhs-api` (proxy a localhost:8000)
- **API Prompt Gallery** (existente): `https://3.134.5.42/api`

---

## 🔧 Pasos Restantes en EC2

### 1. Copiar archivos del build

```bash
sudo mkdir -p /var/www/vhs-analyzer
sudo cp -r /var/www/html/veterinaryAnalyzer/dist/vhs-analyzer-frontend/browser/* /var/www/vhs-analyzer/
sudo chown -R www-data:www-data /var/www/vhs-analyzer
sudo chmod -R 755 /var/www/vhs-analyzer
```

### 2. Habilitar módulo rewrite

```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### 3. Editar configuración de Apache

```bash
sudo nano /etc/apache2/sites-available/prompt-gallery-api.conf
```

**Añade esto dentro del `<VirtualHost *:443>` (ANTES de las líneas de ProxyPass /api):**

```apache
    # ========================================
    # VHS ANALYZER - FRONTEND Y API
    # ========================================

    # VHS Analyzer Frontend
    Alias /vhs /var/www/vhs-analyzer
    <Directory /var/www/vhs-analyzer>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted

        # Fallback para Angular routing (SPA)
        RewriteEngine On
        RewriteBase /vhs/
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /vhs/index.html [L]
    </Directory>

    # Backend API de VHS (FastAPI en puerto 8000)
    ProxyPass /vhs-api http://localhost:8000
    ProxyPassReverse /vhs-api http://localhost:8000
    ProxyTimeout 120

    <Location /vhs-api>
        Header always set Access-Control-Allow-Origin "*"
        Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
        Header always set Access-Control-Allow-Headers "Content-Type, Authorization"
    </Location>
```

**Si también tienes un `<VirtualHost *:80>`, añade lo mismo (sin SSL):**

```apache
    # VHS Analyzer Frontend
    Alias /vhs /var/www/vhs-analyzer
    <Directory /var/www/vhs-analyzer>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted

        RewriteEngine On
        RewriteBase /vhs/
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /vhs/index.html [L]
    </Directory>

    # Backend API de VHS
    ProxyPass /vhs-api http://localhost:8000
    ProxyPassReverse /vhs-api http://localhost:8000
```

### 4. Probar y recargar Apache

```bash
sudo apache2ctl configtest
sudo systemctl reload apache2
```

---

## 🔍 Verificación

### 1. Verificar archivos

```bash
ls -la /var/www/vhs-analyzer/
# Deberías ver: index.html, favicon.ico, y carpetas como chunk-*, main-*, etc.
```

### 2. Verificar configuración de Apache

```bash
sudo apache2ctl -S
# Deberías ver tu VirtualHost en puerto 443 y 80
```

### 3. Probar en el navegador

```
https://3.134.5.42/vhs
```

Deberías ver tu aplicación Angular cargando.

---

## 🐛 Troubleshooting

### Error 404 en `/vhs`

```bash
# Verificar que los archivos existen
ls -la /var/www/vhs-analyzer/index.html

# Verificar permisos
sudo chown -R www-data:www-data /var/www/vhs-analyzer
sudo chmod -R 755 /var/www/vhs-analyzer
```

### Error 500 en Apache

```bash
# Ver logs
sudo tail -f /var/log/apache2/error.log
sudo tail -f /var/log/apache2/prompt-api-error.log
```

### Módulo rewrite no está habilitado

```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### El frontend carga pero no puede conectar con el API

```bash
# Verificar que el backend esté corriendo
curl http://localhost:8000/health

# Si no está corriendo, iniciarlo
cd ~/backend  # o donde esté tu backend
source venv/bin/activate
uvicorn main:app --host 127.0.0.1 --port 8000
```

---

## 🚀 Rebuild y Redeploy (cuando hagas cambios)

**En tu máquina local:**

```bash
# 1. Hacer rebuild
npm run build:prod

# 2. Subir los archivos (desde el directorio frontEnd)
scp -r dist/vhs-analyzer-frontend/browser/* ubuntu@3.134.5.42:/tmp/vhs-build/

# 3. En EC2, copiar archivos
sudo rm -rf /var/www/vhs-analyzer/*
sudo cp -r /tmp/vhs-build/* /var/www/vhs-analyzer/
sudo chown -R www-data:www-data /var/www/vhs-analyzer
sudo chmod -R 755 /var/www/vhs-analyzer
```

---

## 📊 Estructura Final

```
EC2 Server (3.134.5.42)
│
├── Puerto 443 (HTTPS con SSL)
│   ├── /api → Prompt Gallery API (puerto 4000)
│   ├── /vhs → VHS Analyzer Frontend (/var/www/vhs-analyzer)
│   └── /vhs-api → VHS Backend API (puerto 8000)
│
├── /var/www/vhs-analyzer/ → Angular build
│   ├── index.html
│   ├── favicon.ico
│   ├── main-*.js
│   └── ...
│
└── ~/backend/ → FastAPI backend (puerto 8000 localhost)
    ├── main.py
    ├── venv/
    └── ...
```

---

## 🎯 Checklist Final

- [ ] Archivos copiados a `/var/www/vhs-analyzer/`
- [ ] Permisos configurados (www-data:www-data)
- [ ] Módulo rewrite habilitado
- [ ] Configuración de Apache actualizada
- [ ] Apache reloadeado sin errores
- [ ] Frontend accesible en `https://3.134.5.42/vhs`
- [ ] Backend corriendo en localhost:8000
- [ ] API funcionando a través de `/vhs-api`

---

## 💡 Próximos Pasos Opcionales

1. **Configurar el backend como servicio systemd** (para que arranque automáticamente)
2. **Configurar logs específicos** para VHS Analyzer
3. **Añadir rate limiting** si es necesario
4. **Configurar backups automáticos**

¿Necesitas ayuda con alguno de estos pasos?
