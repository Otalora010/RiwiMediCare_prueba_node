#!/bin/bash
# Levanta Docker en el primer puerto libre (evita "address already in use")
# Uso: bash scripts/docker-up.sh  |  npm run docker:up  |  make up
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

# Si HOST_PORT ya viene exportado y está libre, respetarlo
if [ -n "$HOST_PORT" ]; then
  if ! ss -tln 2>/dev/null | grep -q ":$HOST_PORT "; then
    echo "→ HOST_PORT=$HOST_PORT ya exportado y libre, usándolo."
  else
    echo "⚠ HOST_PORT=$HOST_PORT ocupado, buscando alternativo..."
    unset HOST_PORT
  fi
fi

# Si el contenedor ya está corriendo, respetar su puerto actual (evita migrar de 3003 a 3001 al re-ejecutar)
RUNNING_PORT=$(docker compose port api 3000 2>/dev/null | cut -d: -f2 | tr -d '[:space:]' || true)
if [ -n "$RUNNING_PORT" ] && [ -z "$HOST_PORT" ]; then
  HOST_PORT=$RUNNING_PORT
  echo "→ Contenedor riwimedicare-api ya corre en $HOST_PORT, manteniéndolo."
fi

# Si no hay HOST_PORT (o estaba ocupado), buscar libre entre candidatos
if [ -z "$HOST_PORT" ]; then
  # también intentar leer HOST_PORT del .env si existe
  if [ -f .env ]; then
    ENV_HOST_PORT=$(grep -E "^HOST_PORT=" .env | cut -d= -f2 | tr -d '[:space:]' | tr -d '"\x27')
    if [ -n "$ENV_HOST_PORT" ]; then
      # Si el puerto del .env es el mismo que el RUNNING_PORT ya lo manejamos arriba
      if ! ss -tln 2>/dev/null | grep -q ":$ENV_HOST_PORT "; then
        HOST_PORT=$ENV_HOST_PORT
        echo "→ Usando HOST_PORT=$HOST_PORT del .env (libre)."
      elif [ "$ENV_HOST_PORT" = "$RUNNING_PORT" ]; then
        HOST_PORT=$ENV_HOST_PORT
        echo "→ Usando HOST_PORT=$HOST_PORT del .env (ya en uso por este proyecto)."
      else
        echo "→ HOST_PORT=$ENV_HOST_PORT del .env ocupado por otro proceso, buscando alternativo..."
      fi
    fi
  fi
fi

if [ -z "$HOST_PORT" ]; then
  for p in 3003 3001 3004 3005 3006 3007 3008 3009 3010 4000 8000 8080 9000; do
    if ! ss -tln 2>/dev/null | grep -q ":$p "; then
      HOST_PORT=$p
      echo "→ HOST_PORT del .env ocupado o no definido, usando primer libre: $HOST_PORT"
      break
    fi
  done
fi

if [ -z "$HOST_PORT" ]; then
  echo "✗ No se encontró puerto libre entre candidatos. Exporta HOST_PORT manualmente."
  exit 1
fi

export HOST_PORT
echo "→ Levantando Docker con HOST_PORT=$HOST_PORT ..."
echo "   Swagger: http://localhost:$HOST_PORT/api/docs/ (con / final)"
echo "   Health:  http://localhost:$HOST_PORT/health"
echo "   API:     http://localhost:$HOST_PORT/api"
echo ""

HOST_PORT=$HOST_PORT docker compose up --build -d

echo ""
echo "Esperando a que postgres esté healthy..."
sleep 3
docker compose ps
echo ""
echo "Logs api (últimas líneas):"
docker compose logs api --tail=20 || true
echo ""
echo "✅ Listo. Abre en el navegador:"
echo "   http://localhost:$HOST_PORT/api/docs/"
echo ""
echo "Si quieres otro puerto: HOST_PORT=4000 bash scripts/docker-up.sh"
