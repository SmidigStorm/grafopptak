#!/bin/bash

# Show information about dev and prod environments

echo "🔍 Grafopptak Environment Overview"
echo "=================================="
echo ""

echo "📦 Development Environment:"
echo "  - App URL: http://localhost:3000"
echo "  - Neo4j Bolt: bolt://localhost:7687"
echo "  - Neo4j Browser: http://localhost:7474"
echo "  - Container: grafopptak-neo4j"
echo "  - Commands:"
echo "    • npm run dev:start    (start dev server)"
echo "    • npm run dev:stop     (stop dev server)"
echo "    • npm run dev:status   (check status)"
echo ""

echo "🚀 Production Environment (Local):"
echo "  - App URL: http://localhost:3001"
echo "  - Neo4j Bolt: bolt://localhost:7688"
echo "  - Neo4j Browser: http://localhost:7475"
echo "  - Containers: grafopptak-neo4j-prod, grafopptak-app-prod"
echo "  - Commands:"
echo "    • npm run prod:start   (start prod stack)"
echo "    • npm run prod:stop    (stop prod stack)"
echo "    • npm run prod:status  (check status)"
echo ""

echo "🔑 Environment Files:"
echo "  - .env                 (dev environment)"
echo "  - .env.prod.local      (prod local testing)"
echo "  - .env.production      (real production)"
echo ""

echo "📊 Current Status:"
echo -n "  Dev Neo4j: "
docker ps | grep -q "grafopptak-neo4j[^-]" && echo "✅ Running" || echo "❌ Stopped"

echo -n "  Dev App: "
lsof -i :3000 >/dev/null 2>&1 && echo "✅ Running" || echo "❌ Stopped"

echo -n "  Prod Stack: "
docker ps | grep -q "grafopptak-neo4j-prod" && echo "✅ Running" || echo "❌ Stopped"

echo ""
echo "💡 Tips:"
echo "  - Dev and prod can run simultaneously"
echo "  - Dev uses ports 3000/7687/7474"
echo "  - Prod uses ports 3001/7688/7475"
echo "  - Each has separate Neo4j database"