#!/bin/bash

# Dev server management script

ACTION=$1
PID_FILE="/tmp/grafopptak-dev.pid"
LOG_FILE="/tmp/grafopptak-dev.log"

start_server() {
    echo "🚀 Starting development server..."
    
    # Check if already running
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID > /dev/null 2>&1; then
            echo "⚠️  Server already running (PID: $PID)"
            echo "   Use './scripts/dev-server.sh stop' to stop it"
            return 1
        fi
    fi
    
    # Start the server
    nohup npm run dev > "$LOG_FILE" 2>&1 &
    PID=$!
    echo $PID > "$PID_FILE"
    
    echo "✅ Server started (PID: $PID)"
    echo "📝 Logs: tail -f $LOG_FILE"
    echo "🔗 URL: http://localhost:3000"
    
    # Wait a bit and check if it's actually running
    sleep 3
    if ps -p $PID > /dev/null 2>&1; then
        echo "✅ Server is running!"
    else
        echo "❌ Server failed to start. Check logs: $LOG_FILE"
        rm -f "$PID_FILE"
        return 1
    fi
}

stop_server() {
    echo "⏹️  Stopping development server..."
    
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID > /dev/null 2>&1; then
            kill $PID
            rm -f "$PID_FILE"
            echo "✅ Server stopped"
        else
            echo "⚠️  Server not running"
            rm -f "$PID_FILE"
        fi
    else
        echo "⚠️  No PID file found"
    fi
}

status_server() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID > /dev/null 2>&1; then
            echo "✅ Server is running (PID: $PID)"
            echo "🔗 URL: http://localhost:3000"
            echo "📝 Logs: tail -f $LOG_FILE"
        else
            echo "❌ Server is not running (stale PID file)"
            rm -f "$PID_FILE"
        fi
    else
        echo "❌ Server is not running"
    fi
}

restart_server() {
    stop_server
    sleep 2
    start_server
}

logs_server() {
    if [ -f "$LOG_FILE" ]; then
        tail -f "$LOG_FILE"
    else
        echo "❌ No log file found"
    fi
}

case "$ACTION" in
    start)
        start_server
        ;;
    stop)
        stop_server
        ;;
    status)
        status_server
        ;;
    restart)
        restart_server
        ;;
    logs)
        logs_server
        ;;
    *)
        echo "Usage: $0 {start|stop|status|restart|logs}"
        exit 1
        ;;
esac