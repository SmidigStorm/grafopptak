#!/bin/bash

# Production Setup Script for opptaksapp.smidigakademiet.no
# Setter opp produksjonsmiljø for hosting på hjemmePC

echo "🚀 Starter produksjonsoppsett for opptaksapp.smidigakademiet.no"

# 1. Installer PM2 for prosesshåndtering (lokalt)
echo "📦 Installerer PM2..."
npm install pm2

# 2. Bygg applikasjonen
echo "🔨 Bygger Next.js applikasjon..."
npm run build

# 3. Start Neo4j (hvis ikke allerede startet)
echo "🗄️ Starter Neo4j database..."
docker-compose up -d neo4j

# 4. Sett opp database
echo "📊 Setter opp database..."
npm run db:reset

# 5. Start applikasjon med PM2
echo "🚀 Starter applikasjon med PM2..."
npx pm2 start npm --name "grafopptak" -- start

# 6. Sett opp PM2 til å starte automatisk ved reboot
echo "⚙️ Setter opp autostart..."
npx pm2 startup
npx pm2 save

echo "✅ Produksjonsoppsett fullført!"
echo ""
echo "📋 Neste steg:"
echo "1. Sett opp portforwarding på ruter: Port 3000 -> din PC"
echo "2. Oppdater DNS: opptaksapp.smidigakademiet.no -> din offentlige IP"
echo "3. Vurder SSL-sertifikat (Let's Encrypt + nginx reverse proxy)"
echo ""
echo "🔧 Nyttige kommandoer:"
echo "  npx pm2 status           - Se status på applikasjon"
echo "  npx pm2 logs grafopptak  - Se logger"
echo "  npx pm2 restart grafopptak - Restart applikasjon"
echo "  npx pm2 stop grafopptak  - Stopp applikasjon"