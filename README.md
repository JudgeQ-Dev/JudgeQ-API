# JudgeQ Server

[![Build](https://github.com/judgeq-dev/server/actions/workflows/build.yml/badge.svg)](https://github.com/judgeq-dev/server/actions/workflows/build.yml)
[![Lint](https://github.com/judgeq-dev/server/actions/workflows/lint.yml/badge.svg)](https://github.com/judgeq-dev/server/actions/workflows/lint.yml)
[![Test](https://github.com/judgeq-dev/server/actions/workflows/test.yml/badge.svg)](https://github.com/judgeq-dev/server/actions/workflows/test.yml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![License](https://img.shields.io/github/license/JudgeQ-Dev/server?style=flat-square)](LICENSE)

## Deploying

Create a `config.yaml` file based on `config-example.yaml`:

```bash
$ cp config-example.yaml config.yaml
```

## Database

### Create database

```sql
CREATE DATABASE `judgeq` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Create User

In MariaDB/MySQL 5.7:

```sql
GRANT ALL PRIVILEGES ON `judgeq`.* TO "judgeq"@"localhost" IDENTIFIED BY "PASSWORD";
```

In MySQL 8.0:

```sql
CREATE USER 'judgeq'@'localhost' IDENTIFIED BY 'PASSWORD';
GRANT ALL PRIVILEGES ON `judgeq`.* TO 'judgeq'@'localhost';
```

After granting permission, remember to refresh:

```sql
FLUSH PRIVILEGES;
```

Then fill the database connection information in the configuration file.

## Run

By default this app listens on `127.0.0.1:3000`. You can change this in the configuration file. You can use nginx as reversed proxy to access the app with a domain name like `judgeq.ac`.

```bash
$ JUDGEQ_CONFIG_FILE=./config.yaml pnpm start
```

Add `JUDGEQ_LOG_SQL` to enable TypeORM logging:

```bash
$ JUDGEQ_LOG_SQL=1 JUDGEQ_CONFIG_FILE=./config.yaml pnpm start
```

Add `:debug` to enable Hot Module Replacement.

```bash
$ JUDGEQ_LOG_SQL=1 JUDGEQ_CONFIG_FILE=./config.yaml pnpm start:debug
```

## Migration DB

```bash
pnpm typeorm migration:generate -n ${name}

# up
pnpm typeorm migration:run

# down
pnpm typeorm migration:revert
```

## Use Docker

### Build

```bash
docker build -t judgeq/server:latest -f docker/Dockerfile ./
```

### Run

```bash
docker run \
  -d \
  --restart=always \
  --name=judgeq-server \
  -p 3000:3000 \
  -v "${PWD}"/config.yaml:/root/config.yaml \
  judgeq/server
```
