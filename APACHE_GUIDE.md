# 🌐 Guía de Deployment con Apache

Esta guía es específica para deployment en Apache (en lugar de Nginx).

---

## 📋 Diferencias con Nginx

Tu servidor ya tiene Apache configurado. Esta guía usa Apache en lugar de Nginx.

---

## 🚀 Quick Start - Apache Version

### Paso 1: Habilitar módulos de Apache necesarios

```bash
# En tu EC2
sudo a2enmod rewrite
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod headers
sudo systemctl restart apache2
```

### Paso 2: Deploy automático

```bash
# Subir el script desde tu máquina local
scp -i tu-clave.pem deploy-apache.sh ubuntu@YOUR_EC2_IP:~/veterinaryAnalyzer/

# En EC2
cd /var/www/html/veterinaryAnalyzer
chmod +x deploy-apache.sh
./deploy-apache.sh
```

Este script automáticamente:

- ✅ Verifica e instala módulos de Apache
- ✅ Hace el build de producción
- ✅ Copia archivos a `/var/www/vhs-analyzer`
- ✅ Configura Apache con tu IP pública
- ✅ Habilita el sitio
- ✅ Recarga Apache

---

## 📝 Deployment Manual (si prefieres hacerlo paso a paso)

### 1. Build del proyecto (ya lo hiciste)

```bash
npm run build:prod
```

### 2. Copiar archivos

```bash
# Crear directorio
sudo mkdir -p /var/www/vhs-analyzer

# Copiar archivos del build
sudo cp -r dist/vhs-analyzer-frontend/browser/* /var/www/vhs-analyzer/

# Configurar permisos
sudo chown -R www-data:www-data /var/www/vhs-analyzer
sudo chmod -R 755 /var/www/vhs-analyzer
```

### 3. Configurar Apache

```bash
# Copiar configuración
sudo cp apache.conf /etc/apache2/sites-available/vhs-analyzer.conf

# Editar para poner tu IP
sudo nano /etc/apache2/sites-available/vhs-analyzer.conf
# Busca: ServerName YOUR_IP_OR_DOMAIN
# Cambia a: ServerName 3.134.5.42  (o tu IP)

# Habilitar el sitio
sudo a2ensite vhs-analyzer.conf

# Probar configuración
sudo apache2ctl configtest

# Recargar Apache
sudo systemctl reload apache2
```

---

## 🔧 Configuración del Backend

Tu backend FastAPI debe correr en el puerto 8000 (localhost):

```bash
# Verificar que el backend esté corriendo
curl http://localhost:8000/health

# Si no está corriendo, iniciarlo
cd ~/backend
source venv/bin/activate
uvicorn main:app --host 127.0.0.1 --port 8000
```

### Configurar como servicio systemd

```bash
# Crear archivo de servicio
sudo nano /etc/systemd/system/vhs-backend.service
```

Contenido:

```ini
[Unit]
Description=VHS Analyzer Backend API
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/backend
Environment="PATH=/home/ubuntu/backend/venv/bin"
ExecStart=/home/ubuntu/backend/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Luego:

```bash
sudo systemctl daemon-reload
sudo systemctl enable vhs-backend
sudo systemctl start vhs-backend
sudo systemctl status vhs-backend
```

---

## 🔍 Verificación

### 1. Verificar que Apache está corriendo

```bash
sudo systemctl status apache2
```

### 2. Verificar archivos del frontend

```bash
ls -la /var/www/vhs-analyzer
# Deberías ver: index.html y carpetas como assets/
```

### 3. Verificar el backend

```bash
curl http://localhost:8000/health
# Debería retornar: {"status":"healthy"}
```

### 4. Probar desde el navegador

```
http://3.134.5.42
```

### 5. Ver logs en tiempo real

```bash
# Logs de Apache
sudo tail -f /var/log/apache2/vhs-frontend-error.log

# Logs del backend
sudo journalctl -u vhs-backend -f
```

---

## 🌐 Convivencia con tu API existente

Veo que ya tienes `prompt-gallery-api.conf` configurado en el puerto 80. Tienes dos opciones:

### Opción A: Usar un puerto diferente para VHS Analyzer

Editar `apache.conf` para usar puerto 8080:

```apache
<VirtualHost *:8080>
    ServerName 3.134.5.42
    # ... resto de la configuración
</VirtualHost>
```

Luego habilitar el puerto 8080:

```bash
# Editar ports.conf
sudo nano /etc/apache2/ports.conf
# Añadir: Listen 8080

# Abrir en Security Group de AWS
# - Puerto 8080 TCP desde 0.0.0.0/0
```

### Opción B: Usar subdominios/paths diferentes (Recomendado)

Mantener ambas aplicaciones en puerto 80 pero con paths diferentes:

```apache
# En tu configuración existente de prompt-gallery-api.conf
# Añadir ANTES de la configuración de /api:

# VHS Analyzer Frontend
ProxyPass /vhs-analyzer/ http://localhost:8080/
ProxyPassReverse /vhs-analyzer/ http://localhost:8080/

# Servir archivos estáticos del VHS
Alias /vhs-analyzer /var/www/vhs-analyzer
<Directory /var/www/vhs-analyzer>
    Options -Indexes +FollowSymLinks
    AllowOverride All
    Require all granted

    RewriteEngine On
    RewriteBase /vhs-analyzer/
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /vhs-analyzer/index.html [L]
</Directory>
```

### Opción C: Usar un dominio/subdominio diferente (Más limpio)

Si tienes un dominio:

- `api.tudominio.com` → prompt-gallery-api
- `vhs.tudominio.com` → VHS Analyzer

---

## 🚨 Troubleshooting

### Apache no arranca

```bash
# Ver errores
sudo apache2ctl configtest
sudo systemctl status apache2
sudo tail -f /var/log/apache2/error.log
```

### Frontend carga pero API no responde

```bash
# Verificar que el backend esté corriendo
sudo systemctl status vhs-backend
curl http://localhost:8000/health

# Ver logs del backend
sudo journalctl -u vhs-backend -n 50
```

### Error 403 Forbidden

```bash
# Verificar permisos
ls -la /var/www/vhs-analyzer
sudo chown -R www-data:www-data /var/www/vhs-analyzer
sudo chmod -R 755 /var/www/vhs-analyzer
```

### Conflicto de puertos

```bash
# Ver qué está usando el puerto 80
sudo netstat -tulpn | grep :80

# Ver sitios habilitados
ls -la /etc/apache2/sites-enabled/
```

---

## 🔐 Security Group de AWS

Asegúrate de tener estos puertos abiertos en tu Security Group:

| Puerto | Protocolo | Origen    | Descripción          |
| ------ | --------- | --------- | -------------------- |
| 22     | TCP       | Tu IP     | SSH                  |
| 80     | TCP       | 0.0.0.0/0 | HTTP                 |
| 443    | TCP       | 0.0.0.0/0 | HTTPS (opcional)     |
| 8000   | TCP       | NO ABRIR  | Backend (solo local) |

**⚠️ IMPORTANTE:** El puerto 8000 NO debe estar abierto públicamente. El backend solo debe ser accesible desde localhost.

---

## 📚 Comandos Útiles

```bash
# Reiniciar Apache
sudo systemctl restart apache2

# Recargar configuración (más rápido)
sudo systemctl reload apache2

# Ver estado
sudo systemctl status apache2

# Ver sitios disponibles
ls /etc/apache2/sites-available/

# Ver sitios habilitados
ls /etc/apache2/sites-enabled/

# Habilitar un sitio
sudo a2ensite nombre-del-sitio.conf

# Deshabilitar un sitio
sudo a2dissite nombre-del-sitio.conf

# Probar configuración
sudo apache2ctl configtest

# Ver módulos habilitados
apache2ctl -M

# Logs en tiempo real
sudo tail -f /var/log/apache2/vhs-frontend-error.log
sudo tail -f /var/log/apache2/vhs-frontend-access.log
```

---

## 🎯 Next Steps

1. ✅ Deploy del frontend con `./deploy-apache.sh`
2. ⚠️ Configurar el backend como servicio systemd
3. ⚠️ Decidir cómo convivir con tu API existente (paths, subdominios, o puerto diferente)
4. ✅ Verificar en el navegador
5. 💡 Opcional: Configurar HTTPS con Let's Encrypt

---

## 📞 Ayuda Adicional

Si tienes problemas:

1. Revisa los logs de Apache: `sudo tail -f /var/log/apache2/vhs-frontend-error.log`
2. Revisa los logs del backend: `sudo journalctl -u vhs-backend -f`
3. Verifica los módulos de Apache: `apache2ctl -M`
4. Prueba la configuración: `sudo apache2ctl configtest`

---

**¿Prefieres usar paths diferentes en el mismo VirtualHost o configurar un puerto/dominio separado?**
