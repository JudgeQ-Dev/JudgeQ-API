# HZNUOJ V3 API


[![Build Status](https://img.shields.io/github/workflow/status/HZNU-OJ/HZNUOJ-V3-API/Build?style=flat-square)](https://github.com/HZNU-OJ/HZNUOJ-V3-API/actions?query=workflow%3ACI)
[![Dependencies](https://img.shields.io/david/HZNU-OJ/HZNUOJ-V3-API?style=flat-square)](https://david-dm.org/HZNU-OJ/HZNUOJ-V3-API)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![License](https://img.shields.io/github/license/syzoj/syzoj-ng?style=flat-square)](LICENSE)

The 3th generation HZNUOJ API Server.

# Deploying

Create a `config.yaml` file based on `config-example.yaml`:

```bash
$ cp config-example.yaml config.yaml
```

## Database

Create a database and user in MySQL or MariaDB:

```mysql
CREATE DATABASE `hznuoj-v3` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON `hznuoj_v3`.* TO "hznuoj-v3"@"localhost" IDENTIFIED BY "hznuoj-v3-password";
```

Then fill the database connection information in the configuration file.

## Run

By default this app listens on `127.0.0.1:3000`. You can change this in the configuration file. You can use nginx as reversed proxy to access the app with a domain name like `hznuoj-v3.ac`.

```bash
$ HZNUOJ_V3_CONFIG_FILE=./config.yaml yarn start
```

Add `HZNUOJ_V3_LOG_SQL` to enable TypeORM logging:

```bash
$ HZNUOJ_V3_LOG_SQL=1 HZNUOJ_V3_CONFIG_FILE=./config.yaml yarn start
```

Add `:debug` to enable Hot Module Replacement.

```bash
$ HZNUOJ_V3_LOG_SQL=1 HZNUOJ_V3_CONFIG_FILE=./config.yaml yarn start:debug 
```

## License

Nest is [MIT licensed](LICENSE).
