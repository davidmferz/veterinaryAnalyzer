# 🔧 Configuración Rápida de Producción

## Variables que DEBES cambiar antes del deployment

### 1. Frontend - src/environments/environment.ts

```typescript
export const environment = {
  production: true,

  // ⚠️ IMPORTANTE: Cambiar por tu IP pública de EC2 o dominio
  apiUrl: 'http://YOUR_EC2_PUBLIC_IP:8000',
  // Ejemplos:
  // - Con IP: 'http://54.123.45.67:8000'
  // - Con dominio: 'https://api.tu-dominio.com'

  apiVersion: 'v1',
  enableLogging: false, // false en producción
  requestTimeout: 120000,
  retryAttempts: 2,
  retryDelay: 3000,
};
```

### 2. Nginx - nginx.conf

```nginx
server {
    listen 80;

    # ⚠️ CAMBIAR: Tu IP pública o dominio
    server_name YOUR_DOMAIN_OR_IP;
    # Ejemplos:
    # - server_name 54.123.45.67;
    # - server_name vhs-analyzer.com www.vhs-analyzer.com;

    # ... resto de la configuración
}
```

### 3. Backend Service - create-backend-service.sh

```bash
# ⚠️ EDITAR estas variables
APP_DIR="/home/ubuntu/backend"      # Ruta a tu backend
USER="ubuntu"                        # Usuario de EC2
PYTHON_BIN="$APP_DIR/venv/bin/python"
APP_MODULE="main:app"                # Tu módulo de FastAPI
```

## 🔍 Cómo obtener tu IP pública de EC2

### Método 1: Desde la consola AWS

1. Ve a EC2 Dashboard
2. Selecciona tu instancia
3. Copia "Public IPv4 address"

### Método 2: Desde EC2 terminal

```bash
curl ifconfig.me
# o
curl https://api.ipify.org
```

### Método 3: Desde AWS CLI local

```bash
aws ec2 describe-instances \
  --instance-ids i-1234567890abcdef0 \
  --query 'Reservations[0].Instances[0].PublicIpAddress'
```

## 📝 Ejemplo Completo

Digamos que tu IP de EC2 es: `54.123.45.67`

### environment.ts

```typescript
export const environment = {
  production: true,
  apiUrl: 'http://54.123.45.67:8000', // ✅
  apiVersion: 'v1',
  enableLogging: false,
  requestTimeout: 120000,
  retryAttempts: 2,
  retryDelay: 3000,
};
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name 54.123.45.67;  # ✅
    # ...
}
```

## 🌐 Si tienes un dominio

Ejemplo con dominio `vhs-analyzer.com`:

### environment.ts

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://vhs-analyzer.com', // ✅ Con HTTPS
  // ...
};
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name vhs-analyzer.com www.vhs-analyzer.com;  # ✅
    # ...
}
```

### DNS (en tu proveedor de dominios)

```
A Record: vhs-analyzer.com → 54.123.45.67
A Record: www.vhs-analyzer.com → 54.123.45.67
```

## ⚠️ Security Group AWS

Asegúrate de que estos puertos estén abiertos:

```
Inbound Rules:
- SSH (22) from Your IP
- HTTP (80) from Anywhere (0.0.0.0/0)
- HTTPS (443) from Anywhere (0.0.0.0/0)  [si usas SSL]
- Custom TCP (8000) from 127.0.0.1 only  [solo localhost]
```

**IMPORTANTE**: El puerto 8000 NO debe estar abierto al público.
Solo Nginx debe acceder al backend internamente.

## 🔐 Habilitar HTTPS (Recomendado)

Después del deployment inicial con HTTP:

```bash
# 1. Instalar certbot
sudo apt install certbot python3-certbot-nginx

# 2. Obtener certificado
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# 3. Actualizar environment.ts
# Cambiar apiUrl de http:// a https://
```

## ✅ Verificación Rápida

Después de configurar, verifica:

```bash
# 1. Frontend carga
curl -I http://TU_IP_EC2
# Debe devolver 200 OK

# 2. Backend responde
curl http://TU_IP_EC2/health
# Debe devolver JSON con status

# 3. API funciona
curl http://TU_IP_EC2/v1/
# Debe devolver información de la API
```

## 🆘 Troubleshooting Config

### Error: "Failed to load resource"

➡️ Verifica que apiUrl en environment.ts sea correcto
➡️ Verifica que el backend esté corriendo

### Error: 502 Bad Gateway

➡️ El backend no está corriendo
➡️ Ejecuta: `sudo systemctl status vhs-backend`

### Error: Connection refused

➡️ Nginx no está corriendo
➡️ Ejecuta: `sudo systemctl status nginx`

### Error: net::ERR_CONNECTION_TIMED_OUT

➡️ Security Group no permite tráfico en puerto 80
➡️ Firewall UFW bloqueando el puerto

## 📚 Archivos de Configuración - Ubicaciones

```
Frontend compilado:
/var/www/vhs-analyzer/

Backend:
/home/ubuntu/backend/

Nginx config:
/etc/nginx/sites-available/vhs-analyzer
/etc/nginx/sites-enabled/vhs-analyzer

Backend service:
/etc/systemd/system/vhs-backend.service

Logs Frontend:
/var/log/nginx/vhs-frontend-access.log
/var/log/nginx/vhs-frontend-error.log

Logs Backend:
sudo journalctl -u vhs-backend
```

## 🎯 Checklist Pre-Deployment

- [ ] IP pública de EC2 conocida
- [ ] Security Group configurado correctamente
- [ ] environment.ts actualizado con IP correcta
- [ ] nginx.conf actualizado con server_name correcto
- [ ] Backend code listo en EC2
- [ ] create-backend-service.sh con rutas correctas
- [ ] Modelo ML disponible en backend
- [ ] Puerto 8000 solo accesible desde localhost

---

**Siguiente paso**: Sigue la [QUICKSTART.md](QUICKSTART.md) para el deployment.
