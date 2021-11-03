#! /bin/bash

set -e -x

export NODE_ENV=production
export JUDGEQ_CONFIG_FILE=/root/config.yaml

node /root/dist/main.js
