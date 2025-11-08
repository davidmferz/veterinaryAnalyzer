# VHS Analyzer - AWS Deployment Checklist

## ✅ Pre-Deployment

### Cuenta AWS

- [ ] Cuenta de AWS creada
- [ ] Billing alerts configuradas
- [ ] IAM user con permisos adecuados

### Repositorio

- [ ] Código en GitHub/GitLab
- [ ] Variables de entorno actualizadas
- [ ] .gitignore configurado correctamente

## ✅ Configuración EC2

### Lanzar Instancia

- [ ] Instancia EC2 creada (Ubuntu 22.04 LTS)
- [ ] Tipo de instancia: t2.medium o superior
- [ ] Par de claves (.pem) descargado y guardado
- [ ] Security Group configurado:
  - [ ] Puerto 22 (SSH)
  - [ ] Puerto 80 (HTTP)
  - [ ] Puerto 443 (HTTPS)
  - [ ] Puerto 8000 (Backend - solo localhost)

### IP y DNS

- [ ] IP Elástica asignada (recomendado)
- [ ] Dominio configurado (opcional)
- [ ] DNS A record apuntando a la IP (si aplica)

## ✅ Configuración Inicial

### Conectar a EC2

```bash
ssh -i tu-clave.pem ubuntu@TU_IP_EC2
```

- [ ] Conexión SSH exitosa
- [ ] Ejecutar `setup-ec2.sh`
- [ ] Node.js instalado
- [ ] Nginx instalado
- [ ] Git instalado
- [ ] UFW configurado

## ✅ Backend Setup

### Subir Backend

- [ ] Código del backend subido a EC2
- [ ] Virtual environment creado
- [ ] Dependencias instaladas (`pip install -r requirements.txt`)
- [ ] Modelo ML disponible
- [ ] Backend probado manualmente (`uvicorn main:app`)

### Systemd Service

- [ ] Ejecutar `create-backend-service.sh`
- [ ] Servicio habilitado
- [ ] Servicio iniciado
- [ ] Health check exitoso: `curl http://localhost:8000/health`

## ✅ Frontend Setup

### Build y Deploy

- [ ] Variables de entorno actualizadas en `environment.ts`
- [ ] Build de producción ejecutado localmente (opcional)
- [ ] Código subido a EC2
- [ ] Dependencias instaladas (`npm ci`)
- [ ] Script `deploy.sh` ejecutado
- [ ] Archivos copiados a `/var/www/vhs-analyzer`

### Nginx

- [ ] Archivo `nginx.conf` copiado a `/etc/nginx/sites-available/`
- [ ] `server_name` actualizado con IP o dominio
- [ ] Symlink creado en `sites-enabled/`
- [ ] Configuración probada: `sudo nginx -t`
- [ ] Nginx recargado: `sudo systemctl reload nginx`

## ✅ Testing

### Pruebas Básicas

- [ ] Frontend carga en navegador: `http://TU_IP_EC2`
- [ ] No hay errores 404 en assets
- [ ] API health check: `http://TU_IP_EC2/v1/health`
- [ ] Subir y analizar una imagen de prueba
- [ ] Verificar respuesta de la API

### Pruebas de Performance

- [ ] Tiempo de carga < 3 segundos
- [ ] Análisis de imagen completa en < 2 minutos
- [ ] Sin memory leaks
- [ ] CPU usage normal

## ✅ SSL/HTTPS (Opcional pero Recomendado)

### Certbot

- [ ] Certbot instalado
- [ ] Certificado SSL obtenido
- [ ] Nginx configurado para HTTPS
- [ ] HTTP redirect a HTTPS
- [ ] Auto-renewal configurado

## ✅ Monitoreo

### Logs

- [ ] Logs de Nginx configurados
- [ ] Logs de Backend accesibles
- [ ] Log rotation configurado

### Alertas

- [ ] CloudWatch alarms (opcional)
- [ ] Email notifications (opcional)
- [ ] Uptime monitoring (opcional)

## ✅ Security

### Firewall

- [ ] UFW activo
- [ ] Solo puertos necesarios abiertos
- [ ] SSH key-based auth (no passwords)

### Updates

- [ ] Sistema actualizado: `sudo apt update && sudo apt upgrade`
- [ ] Automatic security updates configurado

### Backups

- [ ] AMI snapshot creado
- [ ] Backup schedule configurado

## ✅ Documentation

- [ ] README actualizado
- [ ] Variables de entorno documentadas
- [ ] Proceso de deployment documentado
- [ ] Troubleshooting guide creado

## ✅ Post-Deployment

### Monitoring

- [ ] Revisar logs las primeras 24 horas
- [ ] Verificar uso de recursos (CPU, RAM, Disk)
- [ ] Confirmar que backups automáticos funcionan

### Communication

- [ ] Notificar a stakeholders
- [ ] Compartir URL de producción
- [ ] Documentar credenciales (en lugar seguro)

## 🔴 En Caso de Problemas

### Frontend no carga

```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/vhs-frontend-error.log
```

### API no responde

```bash
sudo systemctl status vhs-backend
sudo journalctl -u vhs-backend -f
```

### Sin conexión SSH

- Verificar Security Group
- Verificar que la instancia está running
- Verificar la IP pública

### Out of Memory

- Aumentar swap: `sudo fallocate -l 2G /swapfile`
- Upgrade instancia EC2
- Optimizar código

## 📞 Contactos de Emergencia

- AWS Support: [Link]
- DevOps Team: [Email/Slack]
- On-Call Engineer: [Phone]

## 📝 Notas Adicionales

- Fecha del deployment: ******\_\_\_******
- Versión deployada: ******\_\_\_******
- Deploy realizado por: ******\_\_\_******
- Incidentes durante deploy: ******\_\_\_******

---

**Última actualización**: $(date)
**Status**: [ ] Pre-Production [ ] Production [ ] Staging
