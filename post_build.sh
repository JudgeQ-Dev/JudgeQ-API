#! /bin/bash

TOP_DIR="$(dirname "$(realpath "${BASH_SOURCE[0]}")")"

SRC_DIR="${TOP_DIR}"/src
DIST_DIR="${TOP_DIR}"/dist

DIR_LIST=(
  "auth/scripts"
  "mail/templates"
  "redis/scripts"
)

# ensure that the required resource files are copied
for dir in "${DIR_LIST[@]}"; do
  if [[ ! -d "${DIST_DIR}/${dir}" ]]; then
    mkdir -p "${DIST_DIR}/${dir}"
  fi

  cp -a "${SRC_DIR}/${dir}"/* "${DIST_DIR}/${dir}/"
done
