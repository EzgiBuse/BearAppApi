"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const order_controller_1 = require("./order.controller");
const common_1 = require("@nestjs/common");
describe('OrderController', () => {
    let orderController;
    let orderService;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [order_controller_1.OrderController],
            providers: [
                {
                    provide: 'IOrderService',
                    useValue: {
                        createOrder: jest.fn(),
                        getOrderById: jest.fn(),
                        getOrdersByUser: jest.fn(),
                    },
                },
            ],
        }).compile();
        orderController = module.get(order_controller_1.OrderController);
        orderService = module.get('IOrderService');
    });
    it('should be defined', () => {
        expect(orderController).toBeDefined();
    });
    describe('createOrder', () => {
        it('should create a new order', async () => {
            const createOrderDto = { userId: 1, bearId: 1, colorId: 1 };
            const result = Object.assign(Object.assign({ id: 1 }, createOrderDto), { status: 'Pending', createdAt: new Date() });
            jest.spyOn(orderService, 'createOrder').mockResolvedValue(result);
            expect(await orderController.createOrder(createOrderDto)).toBe(result);
        });
        it('should throw NotFoundException if order creation fails', async () => {
            const createOrderDto = { userId: 1, bearId: 1, colorId: 1 };
            jest.spyOn(orderService, 'createOrder').mockRejectedValue(new common_1.NotFoundException('User not found'));
            try {
                await orderController.createOrder(createOrderDto);
            }
            catch (error) {
                expect(error).toBeInstanceOf(common_1.NotFoundException);
            }
        });
        it('should throw InternalServerErrorException for other errors', async () => {
            const createOrderDto = { userId: 1, bearId: 1, colorId: 1 };
            jest.spyOn(orderService, 'createOrder').mockRejectedValue(new Error('error'));
            try {
                await orderController.createOrder(createOrderDto);
            }
            catch (error) {
                expect(error).toBeInstanceOf(common_1.InternalServerErrorException);
            }
        });
    });
    describe('getOrderById', () => {
        it('should return the order for the given ID', async () => {
            const result = { id: 1, userId: 1, bearId: 1, colorId: 1, status: 'Pending', createdAt: new Date() };
            jest.spyOn(orderService, 'getOrderById').mockResolvedValue(result);
            expect(await orderController.getOrderById(1)).toBe(result);
        });
        it('should throw NotFoundException if order is not found', async () => {
            jest.spyOn(orderService, 'getOrderById').mockRejectedValue(new common_1.NotFoundException('Order not found'));
            try {
                await orderController.getOrderById(1);
            }
            catch (error) {
                expect(error).toBeInstanceOf(common_1.NotFoundException);
            }
        });
        it('should throw InternalServerErrorException for other errors', async () => {
            jest.spyOn(orderService, 'getOrderById').mockRejectedValue(new Error('error'));
            try {
                await orderController.getOrderById(1);
            }
            catch (error) {
                expect(error).toBeInstanceOf(common_1.InternalServerErrorException);
            }
        });
    });
    describe('getOrdersByUser', () => {
        it('should return orders for the given user ID', async () => {
            const result = [
                { id: 1, userId: 1, bearId: 1, colorId: 1, status: 'Pending', createdAt: new Date() },
                { id: 2, userId: 1, bearId: 2, colorId: 2, status: 'Pending', createdAt: new Date() },
            ];
            jest.spyOn(orderService, 'getOrdersByUser').mockResolvedValue(result);
            expect(await orderController.getOrdersByUser(1)).toBe(result);
        });
        it('should throw NotFoundException if no orders are found', async () => {
            jest.spyOn(orderService, 'getOrdersByUser').mockRejectedValue(new common_1.NotFoundException('No orders found for this user'));
            try {
                await orderController.getOrdersByUser(1);
            }
            catch (error) {
                expect(error).toBeInstanceOf(common_1.NotFoundException);
            }
        });
        it('should throw InternalServerErrorException for other errors', async () => {
            jest.spyOn(orderService, 'getOrdersByUser').mockRejectedValue(new Error('error'));
            try {
                await orderController.getOrdersByUser(1);
            }
            catch (error) {
                expect(error).toBeInstanceOf(common_1.InternalServerErrorException);
            }
        });
    });
});
//# sourceMappingURL=order.controller.spec.js.map