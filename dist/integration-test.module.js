"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.integrationTestModule = integrationTestModule;
exports.integrationTestTeardown = integrationTestTeardown;
const testing_1 = require("@nestjs/testing");
const testcontainers_1 = require("testcontainers");
const typeorm_1 = require("typeorm");
const data_source_1 = require("./config/data-source");
const bear_repository_1 = require("./persistence/repository/bear.repository");
const bear_controller_1 = require("./controller/bear.controller");
const bear_service_1 = require("./service/bear.service");
let dbContainer;
let dataSource;
async function integrationTestModule() {
    jest.setTimeout(60000);
    const integrationTestModule = await testing_1.Test.createTestingModule({
        imports: [],
        providers: [
            bear_repository_1.BearRepositoryProvider,
            {
                provide: 'IBearService',
                useClass: bear_service_1.BearService,
            },
            bear_controller_1.BearController,
            bear_service_1.BearService,
            {
                provide: typeorm_1.DataSource,
                useFactory: setupTestContainer
            }
        ],
        exports: [typeorm_1.DataSource]
    }).compile();
    dataSource = integrationTestModule.get(typeorm_1.DataSource);
    await runTypeOrmMigrations(dataSource);
    return integrationTestModule;
}
async function integrationTestTeardown() {
    await dataSource.dropDatabase();
    await dataSource.destroy();
    await dbContainer.stop();
}
async function setupTestContainer() {
    dbContainer = await new testcontainers_1.GenericContainer('postgres')
        .withEnvironment({
        POSTGRES_USER: 'test',
        POSTGRES_PASSWORD: 'test',
        POSTGRES_DB: 'test'
    })
        .withExposedPorts(5432)
        .withWaitStrategy(testcontainers_1.Wait.forLogMessage(/.*database system is ready to accept connections.*/, 2))
        .start();
    data_source_1.AppDataSource.setOptions({
        host: dbContainer.getHost(),
        port: dbContainer.getMappedPort(5432),
        username: 'test',
        password: 'test',
        database: 'test',
        ssl: false,
        synchronize: false,
        logging: false
    });
    return await data_source_1.AppDataSource.initialize();
}
async function runTypeOrmMigrations(dataSource) {
    await dataSource.runMigrations();
}
//# sourceMappingURL=integration-test.module.js.map