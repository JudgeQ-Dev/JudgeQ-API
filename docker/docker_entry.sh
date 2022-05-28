#! /bin/sh

set -e -x

export NODE_ENV=production
export JUDGEQ_CONFIG_FILE=/app/config/config.yaml

if [ X"${1}" = X"primary" ]; then
  exec node /app/dist/main.js
else
  exec "$@"
fi
