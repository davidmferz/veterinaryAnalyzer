#!/bin/bash

###############################################################################
# Script de configuración inicial para AWS EC2 Ubuntu
# Ejecuta esto UNA VEZ en tu instancia EC2 nueva
#
# USO:
#   chmod +x setup-ec2.sh
#   ./setup-ec2.sh
###############################################################################

set -e

echo "🔧 Configurando EC2 Ubuntu para VHS Analyzer..."

# Actualizar sistema
echo "📦 Actualizando sistema..."
sudo apt update
sudo apt upgrade -y

# Instalar Node.js 20.x (LTS)
echo "📦 Instalando Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Instalar Nginx
echo "📦 Instalando Nginx..."
sudo apt install -y nginx

# Iniciar y habilitar Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

echo "✅ Nginx instalado y ejecutándose"

# Instalar Git (si no está instalado)
echo "📦 Instalando Git..."
sudo apt install -y git

# Instalar herramientas adicionales útiles
echo "📦 Instalando herramientas adicionales..."
sudo apt install -y curl wget unzip

# Configurar firewall (UFW)
echo "🔥 Configurando firewall..."
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 8000/tcp  # Backend API
echo "y" | sudo ufw enable

echo "✅ Firewall configurado"

# Crear directorio para la aplicación
echo "📂 Creando directorio de aplicación..."
sudo mkdir -p /var/www/vhs-analyzer
sudo chown -R $USER:$USER /var/www/vhs-analyzer

# Configurar límites de sistema para Node.js
echo "⚙️  Configurando límites del sistema..."
echo "fs.inotify.max_user_watches=524288" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

echo ""
echo "✅ ¡Configuración completada!"
echo ""
echo "📝 Siguientes pasos:"
echo "1. Clona tu repositorio: git clone <tu-repo-url>"
echo "2. Ve al directorio del proyecto frontend"
echo "3. Ejecuta: ./deploy.sh"
echo ""
echo "🔍 Información del sistema:"
echo "  - IP Pública: $(curl -s ifconfig.me)"
echo "  - Node.js: $(node --version)"
echo "  - npm: $(npm --version)"
echo "  - Nginx: $(nginx -v 2>&1)"
