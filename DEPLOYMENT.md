# 🚀 Guía de Deployment - VHS Analyzer Frontend

Esta guía te ayudará a deployar el frontend de VHS Analyzer en AWS EC2 Ubuntu junto con tu backend.

## 📋 Prerequisitos

### En tu Máquina Local

- Node.js 18+ instalado
- Git configurado
- Acceso SSH a tu instancia EC2

### En AWS

- Instancia EC2 Ubuntu 22.04 LTS (recomendado t2.medium o superior)
- Security Group configurado con los siguientes puertos abiertos:
  - Puerto 22 (SSH)
  - Puerto 80 (HTTP)
  - Puerto 443 (HTTPS) - opcional, para SSL
  - Puerto 8000 (Backend API) - solo si necesitas acceso directo

## 🎯 Paso 1: Configurar la Instancia EC2

### 1.1. Conectarse a EC2

```bash
ssh -i tu-clave.pem ubuntu@TU_IP_PUBLICA_EC2
```

### 1.2. Ejecutar Script de Configuración Inicial

```bash
# Subir el script a EC2
scp -i tu-clave.pem setup-ec2.sh ubuntu@TU_IP_PUBLICA_EC2:~

# En EC2, ejecutar:
chmod +x setup-ec2.sh
./setup-ec2.sh
```

Este script instalará:

- Node.js 20.x LTS
- Nginx
- Git y herramientas esenciales
- Configurará el firewall (UFW)

## 🎯 Paso 2: Preparar el Código para Producción

### 2.1. Actualizar Variables de Entorno

Edita `src/environments/environment.ts` con los valores de producción:

```typescript
export const environment = {
  production: true,
  apiUrl: 'http://TU_IP_PUBLICA_EC2:8000', // Cambiar con tu IP
  apiVersion: 'v1',
  enableLogging: false,
  requestTimeout: 120000,
  retryAttempts: 2,
  retryDelay: 3000,
};
```

### 2.2. Agregar Script de Build de Producción

Edita `package.json` y agrega:

```json
{
  "scripts": {
    "build:prod": "ng build --configuration production --output-hashing=all"
  }
}
```

## 🎯 Paso 3: Build Local (Opcional)

Puedes hacer el build localmente y subir los archivos, o hacerlo directamente en EC2:

### Opción A: Build Local

```bash
# En tu máquina local
npm run build:prod

# Subir archivos a EC2
scp -i tu-clave.pem -r dist/vhs-analyzer-frontend/browser/* ubuntu@TU_IP_PUBLICA_EC2:/tmp/app/
```

### Opción B: Build en EC2 (Recomendado)

```bash
# En EC2, clonar el repositorio
git clone https://github.com/TU_USUARIO/TU_REPO.git
cd TU_REPO
```

## 🎯 Paso 4: Deployment en EC2

### 4.1. Subir Scripts de Deployment

```bash
# Desde tu máquina local
scp -i tu-clave.pem deploy.sh nginx.conf ubuntu@TU_IP_PUBLICA_EC2:~/TU_REPO/
```

### 4.2. Ejecutar Deployment

```bash
# En EC2
cd TU_REPO
chmod +x deploy.sh
./deploy.sh
```

El script automáticamente:

1. Instalará dependencias
2. Construirá la aplicación
3. Copiará archivos a `/var/www/vhs-analyzer`
4. Configurará Nginx
5. Recargará el servidor

### 4.3. Configurar Nginx

Edita la configuración de Nginx con tu dominio o IP:

```bash
sudo nano /etc/nginx/sites-available/vhs-analyzer
```

Cambia:

```nginx
server_name YOUR_DOMAIN_OR_IP;  # Por ejemplo: vhs.midominio.com o 54.123.45.67
```

Prueba y recarga Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 🎯 Paso 5: Configurar el Backend

Asegúrate de que tu backend FastAPI esté corriendo en el puerto 8000:

```bash
# Ejemplo con uvicorn
cd /ruta/a/tu/backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

Para mantenerlo corriendo, usa un process manager como PM2 o systemd.

## 🎯 Paso 6: Verificar el Deployment

### 6.1. Verificar Nginx

```bash
sudo systemctl status nginx
curl http://localhost
```

### 6.2. Verificar Backend

```bash
curl http://localhost:8000/health
```

### 6.3. Probar la Aplicación

Abre en tu navegador:

```
http://TU_IP_PUBLICA_EC2
```

## 🔒 Paso 7: Configurar HTTPS (Recomendado)

### 7.1. Instalar Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 7.2. Obtener Certificado SSL

```bash
sudo certbot --nginx -d tu-dominio.com
```

Certbot configurará automáticamente Nginx para usar HTTPS.

## 🔄 Actualizar la Aplicación

Para deployar cambios:

```bash
# En tu máquina local
git push origin main

# En EC2
cd TU_REPO
git pull origin main
./deploy.sh
```

## 🛠️ Troubleshooting

### El sitio no carga

```bash
# Verificar logs de Nginx
sudo tail -f /var/log/nginx/vhs-frontend-error.log

# Verificar estado de Nginx
sudo systemctl status nginx
```

### Error de API

```bash
# Verificar que el backend esté corriendo
curl http://localhost:8000/health

# Verificar logs del backend
```

### Error de permisos

```bash
# Arreglar permisos
sudo chown -R www-data:www-data /var/www/vhs-analyzer
sudo chmod -R 755 /var/www/vhs-analyzer
```

## 📊 Monitoreo

### Ver logs en tiempo real

```bash
# Logs de Nginx
sudo tail -f /var/log/nginx/vhs-frontend-access.log

# Logs del sistema
sudo journalctl -u nginx -f
```

## 🎯 Mejoras Recomendadas

1. **Process Manager**: Usa PM2 o systemd para mantener el backend corriendo
2. **HTTPS**: Configura SSL con Let's Encrypt
3. **CDN**: Usa CloudFront para servir assets estáticos
4. **Dominio**: Configura un dominio personalizado en Route 53
5. **Monitoreo**: Instala herramientas como New Relic o Datadog
6. **Backups**: Configura backups automáticos de la instancia
7. **Auto Scaling**: Configura Auto Scaling Groups para alta disponibilidad

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs de Nginx y del backend
2. Verifica el Security Group de EC2
3. Asegúrate de que todos los puertos necesarios estén abiertos
4. Verifica que el backend esté respondiendo en el puerto 8000

## 📝 Checklist de Deployment

- [ ] EC2 instancia creada y accesible
- [ ] Security Group configurado con puertos correctos
- [ ] Script `setup-ec2.sh` ejecutado
- [ ] Variables de entorno actualizadas
- [ ] Build de producción exitoso
- [ ] Nginx configurado correctamente
- [ ] Backend corriendo en puerto 8000
- [ ] Frontend accesible desde navegador
- [ ] API conectada correctamente
- [ ] (Opcional) HTTPS configurado
- [ ] (Opcional) Dominio configurado

¡Tu aplicación está lista para producción! 🎉
