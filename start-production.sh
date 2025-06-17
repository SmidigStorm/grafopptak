#!/bin/bash

echo "🚀 Starter produksjonsmiljø med Docker..."

# Stopp og fjern gamle containers
echo "🧹 Rydder opp gamle containers..."
docker-compose -f docker-compose.simple.yml down

# Bygg og start
echo "🔨 Bygger og starter containers..."
docker-compose -f docker-compose.simple.yml up -d --build

# Vent på at Neo4j starter
echo "⏳ Venter på at Neo4j starter..."
sleep 10

# Seed database
echo "🌱 Seeder database..."
docker-compose -f docker-compose.simple.yml exec app npm run seed

echo "✅ Ferdig! Applikasjonen kjører på:"
echo "   - http://localhost:3000"
echo "   - http://localhost:80" 
echo "   - http://localhost:8080"
echo ""
echo "📊 Se status: docker-compose -f docker-compose.simple.yml ps"
echo "📜 Se logger: docker-compose -f docker-compose.simple.yml logs -f"