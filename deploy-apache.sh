#!/bin/bash

###############################################################################
# Script de deployment para VHS Analyzer Frontend en AWS EC2 Ubuntu con Apache
# 
# PREREQUISITOS EN EC2:
# - Node.js 18+ instalado
# - Apache2 instalado
# - Git instalado
# - Módulos de Apache: rewrite, proxy, proxy_http, headers
#
# USO:
#   chmod +x deploy-apache.sh
#   ./deploy-apache.sh
###############################################################################

set -e  # Detener en caso de error

echo "🚀 Iniciando deployment de VHS Analyzer Frontend con Apache..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Variables de configuración
APP_DIR="/var/www/vhs-analyzer"
APACHE_CONFIG="/etc/apache2/sites-available/vhs-analyzer.conf"
BUILD_DIR="dist/vhs-analyzer-frontend/browser"

# Verificar módulos de Apache
echo -e "${YELLOW}🔍 Verificando módulos de Apache...${NC}"
REQUIRED_MODULES=("rewrite" "proxy" "proxy_http" "headers")
for mod in "${REQUIRED_MODULES[@]}"; do
    if ! apache2ctl -M 2>/dev/null | grep -q "${mod}_module"; then
        echo -e "${YELLOW}Habilitando módulo: $mod${NC}"
        sudo a2enmod $mod
    else
        echo -e "${GREEN}✓ Módulo $mod ya está habilitado${NC}"
    fi
done

echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
npm ci --legacy-peer-deps

echo -e "${YELLOW}🔨 Construyendo aplicación para producción...${NC}"
npm run build:prod

# Verificar que el build existe
if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}❌ Error: No se encontró el directorio de build en $BUILD_DIR${NC}"
    exit 1
fi

echo -e "${YELLOW}📂 Creando directorio de aplicación...${NC}"
sudo mkdir -p $APP_DIR

echo -e "${YELLOW}🗑️  Limpiando archivos antiguos...${NC}"
sudo rm -rf $APP_DIR/*

echo -e "${YELLOW}📋 Copiando archivos al servidor...${NC}"
sudo cp -r $BUILD_DIR/* $APP_DIR/

echo -e "${YELLOW}🔐 Configurando permisos...${NC}"
sudo chown -R www-data:www-data $APP_DIR
sudo chmod -R 755 $APP_DIR

echo -e "${YELLOW}⚙️  Configurando Apache...${NC}"
if [ ! -f "$APACHE_CONFIG" ]; then
    echo "Copiando configuración de Apache..."
    sudo cp apache.conf $APACHE_CONFIG
    
    # Obtener IP pública
    PUBLIC_IP=$(curl -s ifconfig.me)
    
    # Actualizar IP en el archivo de configuración
    echo -e "${YELLOW}Actualizando IP pública en la configuración...${NC}"
    sudo sed -i "s/YOUR_IP_OR_DOMAIN/$PUBLIC_IP/g" $APACHE_CONFIG
    
    # Habilitar el sitio
    sudo a2ensite vhs-analyzer.conf
    
    echo -e "${GREEN}✓ Configuración de Apache creada${NC}"
else
    echo -e "${YELLOW}⚠️  Configuración de Apache ya existe, actualizando archivos...${NC}"
fi

echo -e "${YELLOW}🧪 Probando configuración de Apache...${NC}"
sudo apache2ctl configtest

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Configuración de Apache válida${NC}"
else
    echo -e "${RED}❌ Error en la configuración de Apache${NC}"
    exit 1
fi

echo -e "${YELLOW}🔄 Recargando Apache...${NC}"
sudo systemctl reload apache2

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Deployment completado exitosamente!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}📍 Tu aplicación está disponible en:${NC}"
echo -e "${GREEN}   http://$(curl -s ifconfig.me)${NC}"
echo ""
echo -e "${YELLOW}📝 Siguientes pasos:${NC}"
echo "1. ✓ Frontend deployado en /var/www/vhs-analyzer"
echo "2. ⚠️  Verifica que tu backend esté corriendo en el puerto 8000"
echo "   - Comando: sudo systemctl status vhs-backend"
echo "3. ⚠️  Asegúrate de que el Security Group de EC2 permite:"
echo "   - Puerto 80 (HTTP)"
echo "   - Puerto 443 (HTTPS) - si vas a usar SSL"
echo "   - Puerto 8000 debe ser SOLO interno (localhost)"
echo "4. 💡 Para HTTPS, configura Let's Encrypt con certbot:"
echo "   - sudo apt install certbot python3-certbot-apache"
echo "   - sudo certbot --apache -d tu-dominio.com"
echo ""
echo -e "${YELLOW}🔍 Comandos útiles:${NC}"
echo "- Ver logs Apache: sudo tail -f /var/log/apache2/vhs-frontend-error.log"
echo "- Estado Apache: sudo systemctl status apache2"
echo "- Reiniciar Apache: sudo systemctl restart apache2"
echo "- Ver sitios habilitados: ls -la /etc/apache2/sites-enabled/"
echo ""
echo -e "${GREEN}🎉 ¡Deployment completado!${NC}"
