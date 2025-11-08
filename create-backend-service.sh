#!/bin/bash

###############################################################################
# Script para crear un servicio systemd para el backend FastAPI
# 
# USO:
#   1. Edita las variables APP_DIR y USER
#   2. chmod +x create-backend-service.sh
#   3. ./create-backend-service.sh
###############################################################################

set -e

echo "🔧 Creando servicio systemd para el backend..."

# Variables - EDITAR SEGÚN TU CONFIGURACIÓN
APP_DIR="/home/ubuntu/backend"  # Ruta a tu backend
USER="ubuntu"                    # Usuario que ejecutará el servicio
PYTHON_BIN="$APP_DIR/venv/bin/python"  # Ruta al Python del virtualenv
APP_MODULE="main:app"            # Módulo de tu aplicación FastAPI

# Crear archivo de servicio
sudo tee /etc/systemd/system/vhs-backend.service > /dev/null <<EOF
[Unit]
Description=VHS Analyzer Backend API
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$APP_DIR
Environment="PATH=$APP_DIR/venv/bin"
ExecStart=$APP_DIR/venv/bin/uvicorn $APP_MODULE --host 0.0.0.0 --port 8000 --workers 2
Restart=always
RestartSec=10

# Logs
StandardOutput=journal
StandardError=journal
SyslogIdentifier=vhs-backend

[Install]
WantedBy=multi-user.target
EOF

echo "✅ Archivo de servicio creado: /etc/systemd/system/vhs-backend.service"

# Recargar systemd
sudo systemctl daemon-reload

# Habilitar el servicio
sudo systemctl enable vhs-backend

# Iniciar el servicio
sudo systemctl start vhs-backend

# Verificar estado
sudo systemctl status vhs-backend

echo ""
echo "✅ Servicio configurado exitosamente!"
echo ""
echo "📝 Comandos útiles:"
echo "  - Ver status: sudo systemctl status vhs-backend"
echo "  - Reiniciar: sudo systemctl restart vhs-backend"
echo "  - Detener: sudo systemctl stop vhs-backend"
echo "  - Ver logs: sudo journalctl -u vhs-backend -f"
