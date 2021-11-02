# JudgeQ API

[![Build Status](https://img.shields.io/github/workflow/status/JudgeQ-Dev/JudgeQ-API/Build?style=flat-square)](https://github.com/JudgeQ-Dev/JudgeQ-API/actions?query=workflow%3ACI)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![License](https://img.shields.io/github/license/JudgeQ-Dev/JudgeQ-API?style=flat-square)](LICENSE)

# Deploying

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

In MySQL 5.7:

```sql
GRANT ALL PRIVILEGES ON `acnow`.* TO "acnow"@"localhost" IDENTIFIED BY "acnow-password";
```

In MySQL 8.0:

```sql
CREATE USER 'acnow'@'localhost' IDENTIFIED BY 'acnow-password';
GRANT ALL PRIVILEGES ON `acnow`.* TO 'acnow'@'localhost';
```

After granting permission, remember to refresh:

```sql
FLUSH PRIVILEGES;
```

Then fill the database connection information in the configuration file.

## Run

By default this app listens on `127.0.0.1:3000`. You can change this in the configuration file. You can use nginx as reversed proxy to access the app with a domain name like `judgeq.ac`.

```bash
$ JUDGEQ_CONFIG_FILE=./config.yaml yarn start
```

Add `JUDGEQ_LOG_SQL` to enable TypeORM logging:

```bash
$ JUDGEQ_LOG_SQL=1 JUDGEQ_CONFIG_FILE=./config.yaml yarn start
```

Add `:debug` to enable Hot Module Replacement.

```bash
$ JUDGEQ_LOG_SQL=1 JUDGEQ_CONFIG_FILE=./config.yaml yarn start:debug 
```

## Migration DB

```bash
yarn typeorm migration:generate -n ${name}

# up
yarn typeorm migration:run

# down
yarn typeorm migration:revert
```
