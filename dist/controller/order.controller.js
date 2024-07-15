"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var OrderController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("../service/order.service");
const create_order_dto_1 = require("../persistence/entity/dto/create-order.dto");
let OrderController = OrderController_1 = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
        this.logger = new common_1.Logger(OrderController_1.name);
    }
    async createOrder(createOrderDto) {
        try {
            return await this.orderService.createOrder(createOrderDto);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                this.logger.error(error);
                throw error;
            }
            this.logger.error(`Failed to create order`, error);
            throw new common_1.InternalServerErrorException('Failed to create order');
        }
    }
    async getOrderById(id) {
        try {
            return await this.orderService.getOrderById(id);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                this.logger.error(error);
                throw error;
            }
            this.logger.error(`Failed to get order`, error);
            throw new common_1.InternalServerErrorException('Failed to get order');
        }
    }
    async getOrdersByUser(userId) {
        try {
            return await this.orderService.getOrdersByUser(userId);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                this.logger.error(error);
                throw error;
            }
            this.logger.error(`Failed to get orders for user`, error);
            throw new common_1.InternalServerErrorException('Failed to get orders for user');
        }
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrderById", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrdersByUser", null);
exports.OrderController = OrderController = OrderController_1 = __decorate([
    (0, common_1.Controller)('order'),
    __param(0, (0, common_1.Inject)('IOrderService')),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map