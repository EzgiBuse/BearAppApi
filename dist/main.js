"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const data_source_1 = require("./config/data-source");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    try {
        await data_source_1.AppDataSource.initialize();
        logger.log('Data Source has been initialized!');
        await data_source_1.AppDataSource.runMigrations();
        logger.log('Migrations have been run successfully.');
    }
    catch (error) {
        logger.error('Error during Data Source initialization or running migrations', error);
    }
    await app.listen(3000);
    logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap().then();
//# sourceMappingURL=main.js.map