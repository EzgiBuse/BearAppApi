"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const bear_controller_1 = require("./controller/bear.controller");
const bear_service_1 = require("./service/bear.service");
const ORMConfig = require("./config/typeOrmConfig");
const bear_repository_1 = require("./persistence/repository/bear.repository");
const auth_module_1 = require("./auth.module");
const order_controller_1 = require("./controller/order.controller");
const order_service_1 = require("./service/order.service");
const user_entity_1 = require("./persistence/entity/user.entity");
const bear_entity_1 = require("./persistence/entity/bear.entity");
const color_entity_1 = require("./persistence/entity/color.entity");
const order_entity_1 = require("./persistence/entity/order.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot(ORMConfig),
            typeorm_1.TypeOrmModule.forFeature([order_entity_1.Order, user_entity_1.User, bear_entity_1.Bear, color_entity_1.Color]),
            auth_module_1.AuthModule,
        ],
        controllers: [
            bear_controller_1.BearController,
            order_controller_1.OrderController,
        ],
        providers: [
            bear_repository_1.BearRepositoryProvider,
            {
                provide: 'IBearService',
                useClass: bear_service_1.BearService,
            },
            {
                provide: 'IOrderService',
                useClass: order_service_1.OrderService,
            },
            order_service_1.OrderService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map