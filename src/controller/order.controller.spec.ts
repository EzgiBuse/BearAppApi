import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from '../service/order.service';
import { CreateOrderDto } from '../persistence/entity/dto/create-order.dto';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { IOrderService } from '../service/iservice/order-service.interface';

describe('OrderController', () => {
    let orderController: OrderController;
    let orderService: IOrderService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrderController],
            providers: [
                {
                    // mock implementation of IOrderService
                    provide: 'IOrderService',
                    useValue: {
                        createOrder: jest.fn(),
                        getOrderById: jest.fn(),
                        getOrdersByUser: jest.fn(),
                    },
                },
            ],
        }).compile();

        orderController = module.get<OrderController>(OrderController);
        orderService = module.get<IOrderService>('IOrderService');
    });

    it('should be defined', () => {
        expect(orderController).toBeDefined();
    });

    describe('createOrder', () => {
        it('should create a new order', async () => {
            const createOrderDto: CreateOrderDto = { userId: 1, bearId: 1, colorId: 1 };
            const result = { id: 1, ...createOrderDto, status: 'Pending', createdAt: new Date() };


            jest.spyOn(orderService, 'createOrder').mockResolvedValue(result);

            expect(await orderController.createOrder(createOrderDto)).toBe(result);
        });

        it('should throw NotFoundException if order creation fails', async () => {
            const createOrderDto: CreateOrderDto = { userId: 1, bearId: 1, colorId: 1 };


            jest.spyOn(orderService, 'createOrder').mockRejectedValue(new NotFoundException('User not found'));

            try {
                await orderController.createOrder(createOrderDto);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);

            }
        });

        it('should throw InternalServerErrorException for other errors', async () => {
            const createOrderDto: CreateOrderDto = { userId: 1, bearId: 1, colorId: 1 };

            jest.spyOn(orderService, 'createOrder').mockRejectedValue(new Error('error'));

            try {
                await orderController.createOrder(createOrderDto);
            } catch (error) {
                expect(error).toBeInstanceOf(InternalServerErrorException);
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

            jest.spyOn(orderService, 'getOrderById').mockRejectedValue(new NotFoundException('Order not found'));

            try {
                await orderController.getOrderById(1);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);

            }
        });

        it('should throw InternalServerErrorException for other errors', async () => {

            jest.spyOn(orderService, 'getOrderById').mockRejectedValue(new Error('error'));

            try {
                await orderController.getOrderById(1);
            } catch (error) {
                expect(error).toBeInstanceOf(InternalServerErrorException);

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

            jest.spyOn(orderService, 'getOrdersByUser').mockRejectedValue(new NotFoundException('No orders found for this user'));

            try {
                await orderController.getOrdersByUser(1);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);

            }
        });

        it('should throw InternalServerErrorException for other errors', async () => {

            jest.spyOn(orderService, 'getOrdersByUser').mockRejectedValue(new Error('error'));

            try {
                await orderController.getOrdersByUser(1);
            } catch (error) {
                expect(error).toBeInstanceOf(InternalServerErrorException);

            }
        });
    });
});
