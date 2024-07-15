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
var OrderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../persistence/entity/order.entity");
const user_entity_1 = require("../persistence/entity/user.entity");
const bear_entity_1 = require("../persistence/entity/bear.entity");
const color_entity_1 = require("../persistence/entity/color.entity");
let OrderService = OrderService_1 = class OrderService {
    constructor(orderRepository, userRepository, bearRepository, colorRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.bearRepository = bearRepository;
        this.colorRepository = colorRepository;
        this.logger = new common_1.Logger(OrderService_1.name);
    }
    async createOrder(createOrderDto) {
        const userId = createOrderDto.userId;
        const bearId = createOrderDto.bearId;
        const colorId = createOrderDto.colorId;
        try {
            const user = await this.userRepository.findOneBy({ id: userId });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            const bear = await this.bearRepository.findOneBy({ id: bearId });
            if (!bear) {
                throw new common_1.NotFoundException('Bear not found');
            }
            const color = await this.colorRepository.findOneBy({ id: colorId });
            if (!color) {
                throw new common_1.NotFoundException('Color not found');
            }
            const order = new order_entity_1.Order();
            order.userId = user.id;
            order.bearId = bear.id;
            order.colorId = color.id;
            order.status = 'Pending';
            return await this.orderRepository.save(order);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                this.logger.error(error);
                throw error;
            }
            this.logger.error(` Failed to create order`, error);
            throw new common_1.InternalServerErrorException('Failed to create order');
        }
    }
    async getOrderById(orderId) {
        try {
            const order = await this.orderRepository.findOneBy({ id: orderId });
            if (!order) {
                throw new common_1.NotFoundException('Order not found');
            }
            return order;
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
            const orders = await this.orderRepository.find({ where: { userId } });
            if (!orders.length) {
                throw new common_1.NotFoundException('No orders found');
            }
            return orders;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                this.logger.error(error);
                throw error;
            }
            this.logger.error(`Failed to get orders for user.`, error);
            throw new common_1.InternalServerErrorException('Failed to get orders for user');
        }
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = OrderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(bear_entity_1.Bear)),
    __param(3, (0, typeorm_1.InjectRepository)(color_entity_1.Color)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrderService);
//# sourceMappingURL=order.service.js.map