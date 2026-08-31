#!/bin/bash
# Starts Docker on first free port (avoids "address already in use")
# Usage: bash scripts/docker-up.sh | npm run docker:up | make up
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

if [ -n "$HOST_PORT" ]; then
  if ! ss -tln 2>/dev/null | grep -q ":$HOST_PORT "; then
    echo "→ HOST_PORT=$HOST_PORT already exported and free, using it."
  else
    echo "⚠ HOST_PORT=$HOST_PORT busy, searching alternative..."
    unset HOST_PORT
  fi
fi

RUNNING_PORT=$(docker compose port api 3000 2>/dev/null | cut -d: -f2 | tr -d '[:space:]' || true)
if [ -n "$RUNNING_PORT" ] && [ -z "$HOST_PORT" ]; then
  HOST_PORT=$RUNNING_PORT
  echo "→ Container riwimedicare-api already running on $HOST_PORT, keeping it."
fi

if [ -z "$HOST_PORT" ]; then
  if [ -f .env ]; then
    ENV_HOST_PORT=$(grep -E "^HOST_PORT=" .env | cut -d= -f2 | tr -d '[:space:]' | tr -d '"\x27')
    if [ -n "$ENV_HOST_PORT" ]; then
      if ! ss -tln 2>/dev/null | grep -q ":$ENV_HOST_PORT "; then
        HOST_PORT=$ENV_HOST_PORT
        echo "→ Using HOST_PORT=$HOST_PORT from .env (free)."
      elif [ "$ENV_HOST_PORT" = "$RUNNING_PORT" ]; then
        HOST_PORT=$ENV_HOST_PORT
        echo "→ Using HOST_PORT=$HOST_PORT from .env (already used by this project)."
      else
        echo "→ HOST_PORT=$ENV_HOST_PORT from .env busy by another process, searching alternative..."
      fi
    fi
  fi
fi

if [ -z "$HOST_PORT" ]; then
  for p in 3003 3001 3004 3005 3006 3007 3008 3009 3010 4000 8000 8080 9000; do
    if ! ss -tln 2>/dev/null | grep -q ":$p "; then
      HOST_PORT=$p
      echo "→ HOST_PORT from .env busy or not set, using first free: $HOST_PORT"
      break
    fi
  done
fi

if [ -z "$HOST_PORT" ]; then
  echo "✗ No free port found. Export HOST_PORT manually."
  exit 1
fi

export HOST_PORT
echo "→ Starting Docker with HOST_PORT=$HOST_PORT ..."
echo "   Swagger: http://localhost:$HOST_PORT/api/docs/ (with /)"
echo "   Health:  http://localhost:$HOST_PORT/health"
echo "   API:     http://localhost:$HOST_PORT/api"
echo ""

HOST_PORT=$HOST_PORT docker compose up --build -d

echo ""
echo "Waiting for postgres to be healthy..."
sleep 3
docker compose ps
echo ""
echo "Api logs (tail):"
docker compose logs api --tail=20 || true
echo ""
echo "✅ Ready. Open:"
echo "   http://localhost:$HOST_PORT/api/docs/"
echo ""
echo "For custom port: HOST_PORT=4000 bash scripts/docker-up.sh"
