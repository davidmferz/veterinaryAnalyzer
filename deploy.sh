#!/bin/bash

###############################################################################
# Script de deployment para VHS Analyzer Frontend en AWS EC2 Ubuntu
# 
# PREREQUISITOS EN EC2:
# - Node.js 18+ instalado
# - Nginx instalado
# - Git instalado
#
# USO:
#   chmod +x deploy.sh
#   ./deploy.sh
###############################################################################

set -e  # Detener en caso de error

echo "🚀 Iniciando deployment de VHS Analyzer Frontend..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Variables de configuración
APP_DIR="/var/www/vhs-analyzer"
NGINX_CONFIG="/etc/nginx/sites-available/vhs-analyzer"
NGINX_ENABLED="/etc/nginx/sites-enabled/vhs-analyzer"

echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
npm ci --legacy-peer-deps

echo -e "${YELLOW}🔨 Construyendo aplicación para producción...${NC}"
npm run build:prod

echo -e "${YELLOW}📂 Creando directorio de aplicación...${NC}"
sudo mkdir -p $APP_DIR

echo -e "${YELLOW}🗑️  Limpiando archivos antiguos...${NC}"
sudo rm -rf $APP_DIR/*

echo -e "${YELLOW}📋 Copiando archivos al servidor...${NC}"
sudo cp -r dist/vhs-analyzer-frontend/browser/* $APP_DIR/

echo -e "${YELLOW}🔐 Configurando permisos...${NC}"
sudo chown -R www-data:www-data $APP_DIR
sudo chmod -R 755 $APP_DIR

echo -e "${YELLOW}⚙️  Configurando Nginx...${NC}"
if [ ! -f "$NGINX_CONFIG" ]; then
    echo "Copiando configuración de Nginx..."
    sudo cp nginx.conf $NGINX_CONFIG
    
    # Habilitar el sitio
    sudo ln -sf $NGINX_CONFIG $NGINX_ENABLED
    
    echo -e "${RED}⚠️  IMPORTANTE: Edita $NGINX_CONFIG y actualiza:${NC}"
    echo -e "${RED}   - server_name con tu dominio o IP${NC}"
    echo -e "${RED}   - Luego ejecuta: sudo nginx -t && sudo systemctl reload nginx${NC}"
else
    echo "Configuración de Nginx ya existe, saltando..."
fi

echo -e "${YELLOW}🧪 Probando configuración de Nginx...${NC}"
sudo nginx -t

echo -e "${YELLOW}🔄 Recargando Nginx...${NC}"
sudo systemctl reload nginx

echo -e "${GREEN}✅ Deployment completado exitosamente!${NC}"
echo -e "${GREEN}📍 Tu aplicación está disponible en: http://$(curl -s ifconfig.me)${NC}"
echo ""
echo -e "${YELLOW}📝 Siguientes pasos:${NC}"
echo "1. Verifica que tu backend esté corriendo en el puerto 8000"
echo "2. Asegúrate de que el Security Group de EC2 permite tráfico en puerto 80"
echo "3. Si necesitas HTTPS, configura Let's Encrypt con certbot"
