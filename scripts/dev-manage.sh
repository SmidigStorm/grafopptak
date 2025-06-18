#!/bin/bash

# Dev environment manager
PROJECT_DIR="/home/storm/grafopptak"
cd "$PROJECT_DIR"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
check_and_stop_existing() {
    echo -e "${YELLOW}🔍 Checking for existing processes...${NC}"
    
    # Check for existing Next.js processes on port 3000/3001
    NEXT_PIDS=$(lsof -ti:3000,3001 2>/dev/null || true)
    if [ ! -z "$NEXT_PIDS" ]; then
        echo -e "${RED}⚠️  Found existing Next.js processes, stopping them...${NC}"
        echo "$NEXT_PIDS" | xargs -r kill -9
    fi
    
    # Check for existing node processes running Next.js
    NODE_PIDS=$(pgrep -f "node.*next" 2>/dev/null || true)
    if [ ! -z "$NODE_PIDS" ]; then
        echo -e "${RED}⚠️  Found existing Node.js processes, stopping them...${NC}"
        echo "$NODE_PIDS" | xargs -r kill -9
    fi
    
    
    # Wait a moment for processes to stop
    sleep 2
    
    echo -e "${GREEN}✅ Existing processes cleaned up${NC}"
}

start_dev() {
    echo -e "${GREEN}🚀 Starting development environment...${NC}"
    
    # First check and stop any existing processes
    check_and_stop_existing
    
    # Start Neo4j dev database
    echo -e "${YELLOW}Starting Neo4j dev database...${NC}"
    docker-compose -f docker-compose.dev.yml up -d
    
    # Wait for Neo4j to be ready
    echo -e "${YELLOW}Waiting for Neo4j to be ready...${NC}"
    sleep 10
    
    # Seed the database
    echo -e "${YELLOW}Seeding database...${NC}"
    npm run db:reset
    
    # Start Next.js dev server
    echo -e "${YELLOW}Starting Next.js dev server...${NC}"
    npm run dev:start
    
    echo -e "${GREEN}✅ Development environment is ready!${NC}"
    echo -e "${GREEN}🔗 Application: http://localhost:3000${NC}"
    echo -e "${GREEN}🔗 Neo4j Browser: http://localhost:7474${NC}"
}

stop_dev() {
    echo -e "${RED}⏹️  Stopping development environment...${NC}"
    
    # Stop Next.js
    npm run dev:stop
    
    # Stop Neo4j
    docker-compose -f docker-compose.dev.yml down
    
    echo -e "${GREEN}✅ Development environment stopped${NC}"
}

restart_dev() {
    stop_dev
    sleep 2
    start_dev
}

status_dev() {
    echo -e "${YELLOW}📊 Development environment status:${NC}"
    
    # Check Next.js
    npm run dev:status
    
    # Check Neo4j
    echo -e "\n${YELLOW}Neo4j status:${NC}"
    docker ps --filter "name=grafopptak-neo4j-dev" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

clean_all() {
    echo -e "${RED}🧹 Cleaning up all processes...${NC}"
    
    # Use the comprehensive check function
    check_and_stop_existing
    
    # Stop all grafopptak containers
    echo -e "${YELLOW}Stopping all Docker containers...${NC}"
    docker ps -q --filter "name=grafopptak" | xargs -r docker stop
    
    # Clean up PID files
    rm -f /tmp/grafopptak-dev.pid
    
    echo -e "${GREEN}✅ Cleanup complete${NC}"
}

# Main script
case "$1" in
    start)
        start_dev
        ;;
    stop)
        stop_dev
        ;;
    restart)
        restart_dev
        ;;
    status)
        status_dev
        ;;
    clean)
        clean_all
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|clean}"
        echo ""
        echo "Commands:"
        echo "  start   - Start dev environment (Neo4j + Next.js)"
        echo "  stop    - Stop dev environment"
        echo "  restart - Restart dev environment"
        echo "  status  - Show status of all services"
        echo "  clean   - Clean up all processes and containers"
        exit 1
        ;;
esac