const migrationsDir = `./src/migration`;

module.exports = {
  type: "mysql",
  host: "127.0.0.1",
  port: 3306,
  username: "root",
  password: "root",
  database: "judgeq",
  entities: [`${__dirname}/src/**/*.entity{.ts,.js}`],
  migrations: [`${migrationsDir}/*{.ts,*.js}`],
  cli: {
    migrationsDir: `${migrationsDir}`,
  },
};
