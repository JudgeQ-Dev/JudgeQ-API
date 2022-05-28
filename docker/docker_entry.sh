#! /bin/bash

set -e -x

export NODE_ENV=production
export JUDGEQ_CONFIG_FILE=/root/config.yaml

if [[ X"${1}" = X"judgeq-server" ]]; then
  exec node /root/dist/main.js
else
  exec "$@"
fi
