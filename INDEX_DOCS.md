# 📚 Índice de Documentación - VHS Analyzer Frontend

## 🚀 Para Empezar

| Documento | Descripción | Cuando Usar |
|-----------|-------------|-------------|
| **[README.md](README.md)** | Documentación principal del proyecto | Primero que todo - overview general |
| **[QUICKSTART.md](QUICKSTART.md)** | Guía rápida de deployment (30 min) | Quieres deployar AHORA |
| **[CONFIG_GUIDE.md](CONFIG_GUIDE.md)** | Configuración de variables de entorno | Antes de hacer el build de producción |

## 📖 Deployment Completo

| Documento | Descripción | Cuando Usar |
|-----------|-------------|-------------|
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Guía completa paso a paso | Deployment detallado con explicaciones |
| **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** | Checklist de deployment | Durante el deployment para no olvidar nada |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | Arquitectura e infraestructura | Entender cómo funciona todo |

## 🛠️ Operaciones

| Documento | Descripción | Cuando Usar |
|-----------|-------------|-------------|
| **[COMMANDS.md](COMMANDS.md)** | Comandos útiles del día a día | Referencia rápida de comandos |
| **[CONTRIBUTING.md](CONTRIBUTING.md)** | Guía de contribución | Vas a contribuir al proyecto |

## 📁 Scripts

| Script | Descripción | Cuando Ejecutar |
|--------|-------------|-----------------|
| **setup-ec2.sh** | Configura EC2 inicial (Node, Nginx, etc) | Una vez, al crear nueva EC2 |
| **deploy.sh** | Deploy automático del frontend | Cada vez que actualizas el frontend |
| **create-backend-service.sh** | Crea servicio systemd para backend | Una vez, después de subir backend |
| **test-deployment.sh** | Verifica que todo funcione | Después de cada deployment |

## 🎯 Flujo de Trabajo Recomendado

### Primera Vez (Setup Inicial)

```
1. Lee: README.md
2. Lee: CONFIG_GUIDE.md
3. Sigue: QUICKSTART.md
4. Usa: DEPLOYMENT_CHECKLIST.md
```

### Deployment Subsecuente

```
1. Actualiza código
2. git push origin main
3. En EC2: git pull + ./deploy.sh
4. Ejecuta: test-deployment.sh
```

### Troubleshooting

```
1. Revisa: COMMANDS.md (sección troubleshooting)
2. Revisa logs según COMMANDS.md
3. Consulta: DEPLOYMENT.md (sección troubleshooting)
```

## 📋 Archivos de Configuración

| Archivo | Ubicación | Propósito |
|---------|-----------|-----------|
| **environment.ts** | `src/environments/` | Config de producción del frontend |
| **nginx.conf** | Raíz del proyecto → `/etc/nginx/sites-available/` | Config de Nginx |
| **.env.production** | Raíz del proyecto | Template de variables de entorno |
| **environment.prod.ts** | Raíz del proyecto | Backup/template de environment |

## 🎓 Guías por Rol

### Desarrollador Frontend

```
📖 README.md → Desarrollo local
📖 COMMANDS.md → Comandos de desarrollo
📖 CONTRIBUTING.md → Guías de código
```

### DevOps / SysAdmin

```
📖 QUICKSTART.md → Setup rápido
📖 DEPLOYMENT.md → Deployment detallado
📖 ARCHITECTURE.md → Infraestructura
📖 COMMANDS.md → Operaciones diarias
```

### Product Owner / Manager

```
📖 README.md → Features y capacidades
📖 ARCHITECTURE.md → Arquitectura general
📖 DEPLOYMENT_CHECKLIST.md → Proceso de deployment
```

## 🔍 Búsqueda Rápida

### "¿Cómo hago...?"

| Pregunta | Documento |
|----------|-----------|
| Deployar por primera vez | QUICKSTART.md |
| Ver logs del servidor | COMMANDS.md → "Monitoreo y Debugging" |
| Actualizar la aplicación | QUICKSTART.md → "Actualizar la Aplicación" |
| Configurar HTTPS | DEPLOYMENT.md → "Paso 7" |
| Cambiar URL del backend | CONFIG_GUIDE.md |
| Ver comandos de Nginx | COMMANDS.md → "Nginx" |
| Troubleshoot errores | COMMANDS.md → "Troubleshooting Rápido" |
| Hacer backup | COMMANDS.md → "Backups" |
| Configurar dominio | CONFIG_GUIDE.md → "Si tienes un dominio" |
| Entender la arquitectura | ARCHITECTURE.md |

### "¿Qué es...?"

| Término | Documento |
|---------|-----------|
| VHS Score | README.md → "Características" |
| Environment | CONFIG_GUIDE.md |
| Security Group | CONFIG_GUIDE.md → "Security Group AWS" |
| Systemd Service | DEPLOYMENT.md → "Paso 5" |
| Nginx Reverse Proxy | ARCHITECTURE.md |
| AMI Snapshot | COMMANDS.md → "Backups" |
| Certbot | DEPLOYMENT.md → "Paso 7" |

## 🆘 Problemas Comunes

| Problema | Solución en |
|----------|-------------|
| Frontend no carga | COMMANDS.md → "Troubleshooting Rápido" |
| Error 502 Bad Gateway | COMMANDS.md → "Backend no responde" |
| CORS errors | README.md → "Troubleshooting" |
| Build falla | README.md → "Troubleshooting" |
| Out of memory | COMMANDS.md → "Out of Memory" |
| Port already in use | COMMANDS.md → "Puerto en uso" |
| SSL not working | DEPLOYMENT.md → "Paso 7" |

## 📞 Orden de Lectura Sugerido

### Para Desarrollo Local
1. README.md (completo)
2. CONTRIBUTING.md (si vas a contribuir)

### Para Deployment
1. README.md (overview)
2. CONFIG_GUIDE.md (configurar variables)
3. QUICKSTART.md (deployment rápido)
4. DEPLOYMENT_CHECKLIST.md (verificar)
5. COMMANDS.md (referencia continua)

### Para Mantenimiento
1. COMMANDS.md (comandos del día a día)
2. ARCHITECTURE.md (entender la infra)
3. DEPLOYMENT.md (consulta avanzada)

## 🔄 Actualización de Documentación

Este índice se actualiza cuando:
- Se añade nueva documentación
- Se reorganiza la estructura
- Se añaden nuevos scripts

**Última actualización**: $(date +"%d/%m/%Y")

---

## 💡 Tips

- ⭐ **Marca como favorito** este archivo para acceso rápido
- 📑 **Usa Ctrl+F** para buscar términos específicos
- 🔖 **Lee README.md primero** para contexto general
- 📝 **Sigue QUICKSTART.md** para tu primer deployment
- 🛠️ **Usa COMMANDS.md** como referencia diaria

---

**¿No encuentras lo que buscas?** Revisa el [README.md](README.md) o crea un issue en el repositorio.
