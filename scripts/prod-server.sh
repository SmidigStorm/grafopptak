#!/bin/bash

# Production server management script (for local testing)

ACTION=$1
PROJECT_NAME="grafopptak-prod"
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}$1${NC}"
}

print_warning() {
    echo -e "${YELLOW}$1${NC}"
}

print_error() {
    echo -e "${RED}$1${NC}"
}

start_prod() {
    print_status "🚀 Starting production environment..."
    
    # Check if dev is running on same ports
    if lsof -i :3000 >/dev/null 2>&1; then
        print_warning "⚠️  Port 3000 is in use (probably dev server)"
        print_warning "   Production will run on port 3001 instead"
    fi
    
    # Load environment
    if [ -f "$ENV_FILE" ]; then
        export $(cat $ENV_FILE | grep -v '^#' | xargs)
    fi
    
    # Start services
    docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME up -d
    
    # Wait for services to be ready
    print_status "⏳ Waiting for services to start..."
    sleep 5
    
    # Check status
    if docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME ps | grep -q "Up"; then
        print_status "✅ Production environment started!"
        print_status "🔗 Application: http://localhost:3001"
        print_status "🔗 Neo4j Browser: http://localhost:7475"
        print_status "📊 Neo4j Bolt: bolt://localhost:7688"
    else
        print_error "❌ Failed to start production environment"
        docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME logs --tail=50
        return 1
    fi
}

stop_prod() {
    print_status "⏹️  Stopping production environment..."
    docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME down
    print_status "✅ Production environment stopped"
}

status_prod() {
    print_status "📊 Production environment status:"
    echo ""
    docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME ps
    
    echo ""
    print_status "🔍 Port usage:"
    echo "  App (3001): $(lsof -i :3001 >/dev/null 2>&1 && echo "✅ In use" || echo "❌ Not in use")"
    echo "  Neo4j HTTP (7475): $(lsof -i :7475 >/dev/null 2>&1 && echo "✅ In use" || echo "❌ Not in use")"
    echo "  Neo4j Bolt (7688): $(lsof -i :7688 >/dev/null 2>&1 && echo "✅ In use" || echo "❌ Not in use")"
}

logs_prod() {
    SERVICE=$2
    if [ -z "$SERVICE" ]; then
        docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME logs -f
    else
        docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME logs -f $SERVICE
    fi
}

build_prod() {
    print_status "🔨 Building production image..."
    docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME build
}

reset_prod_db() {
    print_warning "⚠️  This will reset the PRODUCTION database!"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "🗄️ Resetting production database..."
        
        # Check if production environment is running
        if ! docker-compose -f $COMPOSE_FILE -p $PROJECT_NAME ps | grep -q "Up"; then
            print_error "❌ Production environment is not running!"
            print_status "   Start it first with: npm run prod:start"
            return 1
        fi
        
        # Load env and run reset with production environment
        if [ -f "$ENV_FILE" ]; then
            print_status "📋 Loading production environment variables..."
            export $(cat $ENV_FILE | grep -v '^#' | xargs)
        else
            print_error "❌ Production environment file not found: $ENV_FILE"
            return 1
        fi
        
        # Run database reset with production environment
        npm run db:reset
        
        if [ $? -eq 0 ]; then
            print_status "✅ Production database reset complete"
        else
            print_error "❌ Database reset failed"
            return 1
        fi
    else
        print_status "❌ Reset cancelled"
    fi
}

case "$ACTION" in
    start)
        start_prod
        ;;
    stop)
        stop_prod
        ;;
    status)
        status_prod
        ;;
    logs)
        logs_prod
        ;;
    build)
        build_prod
        ;;
    reset-db)
        reset_prod_db
        ;;
    restart)
        stop_prod
        sleep 2
        start_prod
        ;;
    *)
        echo "Usage: $0 {start|stop|status|restart|logs|build|reset-db}"
        echo ""
        echo "Commands:"
        echo "  start     - Start production environment"
        echo "  stop      - Stop production environment"
        echo "  status    - Show status of services"
        echo "  restart   - Restart all services"
        echo "  logs      - Show logs (optionally specify service)"
        echo "  build     - Build production Docker image"
        echo "  reset-db  - Reset production database (careful!)"
        echo ""
        echo "Examples:"
        echo "  $0 start"
        echo "  $0 logs app-prod"
        echo "  $0 logs neo4j-prod"
        exit 1
        ;;
esac