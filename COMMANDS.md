# 🛠️ Comandos Útiles - VHS Analyzer

## 📝 Desarrollo Local

### Iniciar Aplicación

```bash
# Desarrollo con hot reload
npm start

# Desarrollo con puerto específico
ng serve --port 4300

# Abrir automáticamente en navegador
ng serve -o

# Modo verbose (más logs)
ng serve --verbose
```

### Build

```bash
# Build de desarrollo
ng build

# Build de producción
npm run build:prod

# Build con análisis de bundle
npm run build:stats
npx webpack-bundle-analyzer dist/vhs-analyzer-frontend/stats.json
```

### Linting y Formateo

```bash
# Lint
ng lint

# Lint con auto-fix
ng lint --fix
```

### Testing

```bash
# Tests en watch mode
npm test

# Tests single run
ng test --watch=false

# Tests con cobertura
ng test --code-coverage

# Tests de un componente específico
ng test --include='**/upload.component.spec.ts'
```

## 🚀 Deployment en EC2

### Conectar a EC2

```bash
# SSH básico
ssh -i tu-clave.pem ubuntu@TU_IP_EC2

# SSH con forwarding de puertos
ssh -i tu-clave.pem -L 8000:localhost:8000 ubuntu@TU_IP_EC2

# Copiar archivos a EC2
scp -i tu-clave.pem archivo.txt ubuntu@TU_IP_EC2:~/
scp -r -i tu-clave.pem carpeta/ ubuntu@TU_IP_EC2:~/
```

### Deployment

```bash
# Deployment automático
./deploy.sh

# Deployment manual paso a paso
npm ci
npm run build:prod
sudo cp -r dist/vhs-analyzer-frontend/browser/* /var/www/vhs-analyzer/
sudo systemctl reload nginx
```

### Actualizar Código

```bash
# En EC2
cd ~/tu-proyecto
git pull origin main
./deploy.sh
```

## 🔧 Nginx

### Comandos Básicos

```bash
# Probar configuración
sudo nginx -t

# Recargar configuración
sudo systemctl reload nginx

# Reiniciar Nginx
sudo systemctl restart nginx

# Ver estado
sudo systemctl status nginx

# Stop/Start
sudo systemctl stop nginx
sudo systemctl start nginx
```

### Logs

```bash
# Logs en tiempo real
sudo tail -f /var/log/nginx/vhs-frontend-access.log
sudo tail -f /var/log/nginx/vhs-frontend-error.log

# Últimas 100 líneas
sudo tail -n 100 /var/log/nginx/vhs-frontend-error.log

# Buscar errores
sudo grep "error" /var/log/nginx/vhs-frontend-error.log

# Limpiar logs
sudo truncate -s 0 /var/log/nginx/vhs-frontend-access.log
```

### Configuración

```bash
# Editar configuración
sudo nano /etc/nginx/sites-available/vhs-analyzer

# Verificar sintaxis
sudo nginx -t

# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/vhs-analyzer /etc/nginx/sites-enabled/

# Deshabilitar sitio
sudo rm /etc/nginx/sites-enabled/vhs-analyzer
```

## 🐍 Backend (FastAPI)

### Systemd Service

```bash
# Ver estado del backend
sudo systemctl status vhs-backend

# Iniciar backend
sudo systemctl start vhs-backend

# Detener backend
sudo systemctl stop vhs-backend

# Reiniciar backend
sudo systemctl restart vhs-backend

# Ver logs en tiempo real
sudo journalctl -u vhs-backend -f

# Últimas 50 líneas de logs
sudo journalctl -u vhs-backend -n 50

# Logs de hoy
sudo journalctl -u vhs-backend --since today
```

### Manual (sin systemd)

```bash
# Activar virtualenv
cd ~/backend
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor
uvicorn main:app --host 0.0.0.0 --port 8000

# Con hot reload (desarrollo)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Con múltiples workers (producción)
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 🔍 Monitoreo y Debugging

### Sistema

```bash
# CPU y Memoria
htop
top

# Uso de disco
df -h
du -sh /var/www/vhs-analyzer

# Procesos de Node.js
ps aux | grep node

# Procesos de Python
ps aux | grep python

# Network
netstat -tulpn | grep LISTEN
ss -tulpn | grep :8000
```

### Logs del Sistema

```bash
# Logs generales del sistema
sudo journalctl -xe

# Logs de un servicio específico
sudo journalctl -u nginx -n 100

# Logs desde una hora específica
sudo journalctl --since "1 hour ago"

# Logs con prioridad error
sudo journalctl -p err
```

### Health Checks

```bash
# Frontend
curl http://localhost

# Backend
curl http://localhost:8000/health

# API
curl -X POST http://localhost:8000/v1/vhs/analyze \
  -F "file=@test-image.jpg" \
  -F "includeOverlay=true"
```

## 🔒 Seguridad y Firewall

### UFW (Uncomplicated Firewall)

```bash
# Ver estado
sudo ufw status

# Ver reglas numeradas
sudo ufw status numbered

# Habilitar puerto
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Deshabilitar puerto
sudo ufw delete allow 80/tcp

# Habilitar/Deshabilitar firewall
sudo ufw enable
sudo ufw disable

# Reset completo
sudo ufw reset
```

### Permisos

```bash
# Ver permisos
ls -la /var/www/vhs-analyzer

# Cambiar dueño
sudo chown -R www-data:www-data /var/www/vhs-analyzer

# Cambiar permisos
sudo chmod -R 755 /var/www/vhs-analyzer

# Ver quién está usando un archivo
sudo lsof /var/www/vhs-analyzer
```

## 🗄️ Git

### Comandos Básicos

```bash
# Estado
git status

# Ver cambios
git diff

# Agregar archivos
git add .
git add archivo.txt

# Commit
git commit -m "Mensaje del commit"

# Push
git push origin main

# Pull
git pull origin main

# Ver historial
git log --oneline --graph --all
```

### Ramas

```bash
# Crear rama
git checkout -b feature/nueva-feature

# Cambiar de rama
git checkout main

# Ver todas las ramas
git branch -a

# Eliminar rama
git branch -d feature/vieja-feature
```

### Deployment desde Git

```bash
# En EC2
cd ~/proyecto
git fetch origin
git reset --hard origin/main  # CUIDADO: borra cambios locales
./deploy.sh
```

## 📦 Node.js y npm

### npm

```bash
# Instalar dependencias
npm install
npm ci  # Más rápido y determinístico

# Actualizar paquetes
npm update

# Auditar seguridad
npm audit
npm audit fix

# Limpiar cache
npm cache clean --force

# Ver paquetes instalados
npm list --depth=0

# Ver paquetes outdated
npm outdated
```

### Node.js

```bash
# Ver versión
node --version
npm --version

# Cambiar versión (con nvm)
nvm install 20
nvm use 20
nvm list
```

## 🔄 SSL/HTTPS con Let's Encrypt

### Certbot

```bash
# Instalar certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com

# Renovar certificado
sudo certbot renew

# Probar renovación
sudo certbot renew --dry-run

# Ver certificados
sudo certbot certificates

# Revocar certificado
sudo certbot revoke --cert-path /path/to/cert
```

## 💾 Backups

### AMI Snapshot (desde AWS CLI)

```bash
# Crear AMI
aws ec2 create-image \
  --instance-id i-1234567890abcdef0 \
  --name "VHS Analyzer Backup $(date +%Y-%m-%d)" \
  --description "Backup automático"

# Listar AMIs
aws ec2 describe-images --owners self
```

### Backup Manual

```bash
# Backup del frontend
tar -czf frontend-backup-$(date +%Y%m%d).tar.gz /var/www/vhs-analyzer

# Backup del backend
tar -czf backend-backup-$(date +%Y%m%d).tar.gz ~/backend

# Backup de configuración de Nginx
sudo tar -czf nginx-backup-$(date +%Y%m%d).tar.gz /etc/nginx

# Descargar backup a local
scp -i tu-clave.pem ubuntu@TU_IP_EC2:~/frontend-backup-*.tar.gz .
```

## 🧹 Limpieza y Mantenimiento

### Limpiar Disco

```bash
# Ver uso de disco
df -h
du -sh /* | sort -h

# Limpiar paquetes
sudo apt autoremove
sudo apt autoclean

# Limpiar logs antiguos
sudo journalctl --vacuum-time=7d
sudo journalctl --vacuum-size=100M

# Limpiar cache de npm
npm cache clean --force

# Limpiar node_modules
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
```

### Actualizar Sistema

```bash
# Actualizar lista de paquetes
sudo apt update

# Actualizar paquetes
sudo apt upgrade -y

# Actualizar todo (incluye kernel)
sudo apt full-upgrade -y

# Reiniciar si es necesario
sudo reboot
```

## 🆘 Troubleshooting Rápido

### Frontend no carga

```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/vhs-frontend-error.log
ls -la /var/www/vhs-analyzer
```

### Backend no responde

```bash
sudo systemctl status vhs-backend
sudo journalctl -u vhs-backend -n 50
curl http://localhost:8000/health
```

### Out of Memory

```bash
free -h
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Puerto en uso

```bash
# Ver qué está usando el puerto 8000
sudo lsof -i :8000
sudo netstat -tulpn | grep :8000

# Matar proceso
sudo kill -9 <PID>
```

## 📊 Métricas y Performance

### Análisis de Bundle

```bash
npm run build:stats
npx webpack-bundle-analyzer dist/vhs-analyzer-frontend/stats.json
```

### Lighthouse

```bash
# Instalar
npm install -g lighthouse

# Ejecutar
lighthouse http://tu-sitio.com --view
```

### Performance Testing

```bash
# Apache Bench
ab -n 1000 -c 10 http://tu-sitio.com/

# Curl timing
curl -w "@curl-format.txt" -o /dev/null -s http://tu-sitio.com/
```

## 🔍 Debugging

### Angular DevTools

- Instalar extensión en Chrome/Firefox
- Ver component tree
- Inspeccionar signals
- Profiler de performance

### Network Debugging

```bash
# Capturar tráfico
sudo tcpdump -i any port 8000 -w capture.pcap

# Ver request/response headers
curl -v http://localhost:8000/health
```

---

**💡 Tip**: Guarda este archivo como referencia rápida y añade tus propios comandos frecuentes.
