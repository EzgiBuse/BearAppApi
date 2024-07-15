import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../persistence/entity/order.entity';
import { User } from '../persistence/entity/user.entity';
import { Bear } from '../persistence/entity/bear.entity';
import { Color } from '../persistence/entity/color.entity';
import { CreateOrderDto } from '../persistence/entity/dto/create-order.dto';
import { IOrderService } from './iservice/order-service.interface';

@Injectable()
export class OrderService implements IOrderService {
    private readonly logger = new Logger(OrderService.name);


    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Bear)
        private bearRepository: Repository<Bear>,
        @InjectRepository(Color)
        private colorRepository: Repository<Color>,
    ) { }

    async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {

        const userId = createOrderDto.userId;
        const bearId = createOrderDto.bearId;
        const colorId = createOrderDto.colorId;
        try {
            const user = await this.userRepository.findOneBy({ id: userId });
            if (!user) {
              throw new NotFoundException('User not found');
            }
      
            const bear = await this.bearRepository.findOneBy({ id: bearId });
            if (!bear) {
              throw new NotFoundException('Bear not found');
            }
      
            const color = await this.colorRepository.findOneBy({ id: colorId });
            if (!color) {
              throw new NotFoundException('Color not found');
            }
      
            const order = new Order();
            order.userId = user.id;
            order.bearId = bear.id;
            order.colorId = color.id;
            order.status = 'Pending';
      
            return await this.orderRepository.save(order);
          } catch (error) {
            if (error instanceof NotFoundException) {
              this.logger.error(error);
              throw error;
            }
            this.logger.error(` Failed to create order`, error);
            throw new InternalServerErrorException('Failed to create order');
          }
        }
      
        async getOrderById(orderId: number): Promise<Order> {
          try {
            const order = await this.orderRepository.findOneBy({ id: orderId });
            if (!order) {
              throw new NotFoundException('Order not found');
            }
            return order;
          } catch (error) {
            if (error instanceof NotFoundException) {
              this.logger.error(error);
              throw error;
            }
            this.logger.error(`Failed to get order`, error);
            throw new InternalServerErrorException('Failed to get order');
          }
        }
      
        async getOrdersByUser(userId: number): Promise<Order[]> {
          try {
            const orders = await this.orderRepository.find({ where: { userId } });
            if (!orders.length) {
              throw new NotFoundException('No orders found');
            }
            return orders;
          } catch (error) {
            if (error instanceof NotFoundException) {
              this.logger.error(error);
              throw error;
            }
            this.logger.error(`Failed to get orders for user.`, error);
            throw new InternalServerErrorException('Failed to get orders for user');
          }
        }
      
       
}
