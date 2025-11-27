#!/bin/bash

# Check Market Cron Service status on VPS
# Usage: ./check-market-cron.sh [logs|status|restart|stop]

VPS_HOST="root@103.127.132.109"

ACTION=${1:-status}

case $ACTION in
  logs)
    echo "📋 Viewing market-cron logs..."
    ssh $VPS_HOST 'pm2 logs market-cron --lines 100'
    ;;
  
  status)
    echo "📊 Checking market-cron status..."
    ssh $VPS_HOST 'pm2 status market-cron'
    echo ""
    echo "📈 Recent activity:"
    ssh $VPS_HOST 'pm2 logs market-cron --lines 20 --nostream'
    ;;
  
  restart)
    echo "🔄 Restarting market-cron..."
    ssh $VPS_HOST 'pm2 restart market-cron'
    echo "✅ Service restarted"
    ;;
  
  stop)
    echo "🛑 Stopping market-cron..."
    ssh $VPS_HOST 'pm2 stop market-cron'
    echo "✅ Service stopped"
    ;;
  
  start)
    echo "🚀 Starting market-cron..."
    ssh $VPS_HOST 'pm2 start market-cron'
    echo "✅ Service started"
    ;;
  
  *)
    echo "Usage: $0 [logs|status|restart|stop|start]"
    echo ""
    echo "Commands:"
    echo "  logs    - View service logs"
    echo "  status  - Check service status"
    echo "  restart - Restart service"
    echo "  stop    - Stop service"
    echo "  start   - Start service"
    exit 1
    ;;
esac
