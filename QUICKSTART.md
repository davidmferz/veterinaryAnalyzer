# 🚀 Quick Start - Deploy en AWS EC2

Esta es la guía más rápida para poner tu aplicación en producción en AWS EC2.

## ⏱️ Tiempo Estimado: 30-45 minutos

---

## 📋 Antes de Empezar

### Necesitas tener:

- ✅ Una cuenta de AWS
- ✅ Una instancia EC2 Ubuntu 22.04 corriendo
- ✅ La clave SSH (.pem) de tu instancia
- ✅ Tu código del backend FastAPI listo

---

## 🎯 Paso 1: Preparar EC2 (10 min)

### 1.1 Conectar a EC2

```bash
ssh -i tu-clave.pem ubuntu@TU_IP_PUBLICA_EC2
```

### 1.2 Subir y ejecutar setup

```bash
# Desde tu máquina local, subir el script
scp -i tu-clave.pem setup-ec2.sh ubuntu@TU_IP_EC2:~

# En EC2, ejecutar
chmod +x setup-ec2.sh
./setup-ec2.sh
```

Esto instalará: Node.js, Nginx, Git, y configurará el firewall.

---

## 🎯 Paso 2: Configurar el Backend (10 min)

### 2.1 Subir tu código del backend

```bash
# Opción A: Con Git
git clone https://github.com/TU_USUARIO/tu-backend-repo.git ~/backend

# Opción B: Con SCP
scp -r -i tu-clave.pem ./mi-backend ubuntu@TU_IP_EC2:~/backend
```

### 2.2 Instalar dependencias del backend

```bash
cd ~/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2.3 Probar el backend

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

Abre otra terminal y verifica:

```bash
curl http://localhost:8000/health
```

Si funciona, presiona Ctrl+C y configura como servicio:

```bash
# Volver al home
cd ~
# Subir el script
# (desde tu máquina local)
scp -i tu-clave.pem create-backend-service.sh ubuntu@TU_IP_EC2:~

# En EC2
chmod +x create-backend-service.sh
# Edita las variables en el script primero
nano create-backend-service.sh
# Ejecuta
./create-backend-service.sh
```

---

## 🎯 Paso 3: Configurar el Frontend (15 min)

### 3.1 Actualizar variables de entorno

**En tu máquina local**, edita `src/environments/environment.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'http://TU_IP_PUBLICA_EC2:8000', // ⚠️ CAMBIAR ESTO
  apiVersion: 'v1',
  enableLogging: false,
  requestTimeout: 120000,
  retryAttempts: 2,
  retryDelay: 3000,
};
```

### 3.2 Subir el código frontend

```bash
# Opción A: Con Git (recomendado)
# En EC2:
cd ~
git clone https://github.com/TU_USUARIO/tu-frontend-repo.git

# Opción B: Build local y subir dist
# En tu máquina:
npm run build:prod
scp -r -i tu-clave.pem dist/vhs-analyzer-frontend/browser/* ubuntu@TU_IP_EC2:/tmp/frontend/
```

### 3.3 Deployar

```bash
# En EC2
cd ~/tu-frontend-repo
chmod +x deploy.sh
./deploy.sh
```

### 3.4 Configurar Nginx

```bash
# Editar el archivo de configuración
sudo nano /etc/nginx/sites-available/vhs-analyzer
```

Busca y cambia:

```nginx
server_name YOUR_DOMAIN_OR_IP;
```

Por:

```nginx
server_name TU_IP_PUBLICA_EC2;  # Ejemplo: 54.123.45.67
```

Guarda (Ctrl+X, Y, Enter) y prueba:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🎯 Paso 4: Probar (5 min)

### 4.1 Desde tu navegador

```
http://TU_IP_PUBLICA_EC2
```

Deberías ver la aplicación cargando.

### 4.2 Probar el análisis

1. Sube una imagen de prueba
2. Activa "Incluir overlay"
3. Click en "Analizar radiografía"
4. Espera el resultado

### 4.3 Verificar con script

```bash
# En EC2
cd ~/tu-frontend-repo
./test-deployment.sh TU_IP_PUBLICA_EC2
```

---

## ✅ Checklist Final

- [ ] ¿El frontend carga en el navegador?
- [ ] ¿Puedes subir una imagen?
- [ ] ¿El análisis funciona correctamente?
- [ ] ¿Los resultados se muestran?
- [ ] ¿Puedes descargar el overlay?
- [ ] ¿El backend service está corriendo? (`sudo systemctl status vhs-backend`)
- [ ] ¿Nginx está corriendo? (`sudo systemctl status nginx`)

---

## 🆘 Si algo falla

### Frontend no carga

```bash
# Ver logs
sudo tail -f /var/log/nginx/vhs-frontend-error.log

# Verificar archivos
ls -la /var/www/vhs-analyzer

# Verificar Nginx
sudo systemctl status nginx
```

### Backend no responde

```bash
# Ver logs
sudo journalctl -u vhs-backend -f

# Verificar servicio
sudo systemctl status vhs-backend

# Reiniciar
sudo systemctl restart vhs-backend
```

### Error de conexión

```bash
# Verificar puertos
sudo netstat -tulpn | grep LISTEN

# Verificar firewall
sudo ufw status
```

---

## 🎉 ¡Listo!

Tu aplicación está en producción. Ahora puedes:

### Próximos pasos recomendados:

1. **Configurar un dominio** (opcional)

   ```bash
   # En Nginx config
   server_name tu-dominio.com;
   ```

2. **Añadir HTTPS** (muy recomendado)

   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d tu-dominio.com
   ```

3. **Configurar monitoreo**

   - CloudWatch para métricas
   - UptimeRobot para disponibilidad
   - Logs centralizados

4. **Hacer backup**
   ```bash
   # Crear AMI desde consola AWS
   # O configurar backups automáticos
   ```

---

## 📚 Recursos Adicionales

- **Guía completa**: Lee [`DEPLOYMENT.md`](DEPLOYMENT.md)
- **Comandos útiles**: Ve [`COMMANDS.md`](COMMANDS.md)
- **Arquitectura**: Lee [`ARCHITECTURE.md`](ARCHITECTURE.md)
- **Checklist detallado**: [`DEPLOYMENT_CHECKLIST.md`](DEPLOYMENT_CHECKLIST.md)

---

## 💡 Tips Pro

1. **Siempre revisa los logs** si algo no funciona
2. **Haz backups** antes de cambios importantes
3. **Prueba localmente** antes de deployar
4. **Usa Git tags** para versionar releases
5. **Documenta** cualquier cambio de configuración

---

## 🚀 Actualizar la Aplicación

Cuando hagas cambios:

```bash
# 1. Commit y push tu código
git add .
git commit -m "Feature X agregada"
git push origin main

# 2. En EC2, actualizar
cd ~/tu-frontend-repo
git pull origin main
./deploy.sh

# 3. Si hay cambios en backend
cd ~/backend
git pull origin main
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart vhs-backend
```

---

**¡Felicidades! Tu aplicación VHS Analyzer está en producción** 🎊

¿Problemas? Revisa la sección de [Troubleshooting](#-si-algo-falla) o consulta [`COMMANDS.md`](COMMANDS.md).
