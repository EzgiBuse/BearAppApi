"use strict";
const ORMConfig = {
    type: 'postgres',
    database: 'postgres',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    host: 'localhost',
    synchronize: false,
    logging: false,
    entities: [
        __dirname + '/../**/*.entity{.ts,.js}'
    ],
    migrations: [__dirname + '/../persistence/migrations/*{.ts,.js}']
};
module.exports = ORMConfig;
//# sourceMappingURL=typeOrmConfig.js.map