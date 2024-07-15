import { Controller, Post, Get, Param, Body, Patch, Logger, InternalServerErrorException, NotFoundException, Inject } from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { CreateOrderDto } from '../persistence/entity/dto/create-order.dto';

@Controller('order')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);
  
  constructor(@Inject('IOrderService') private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
     
      return await this.orderService.createOrder(createOrderDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.error(error);
        throw error;
      }
      this.logger.error(`Failed to create order`, error);
      throw new InternalServerErrorException('Failed to create order');
    }
  }

  @Get(':id')
  async getOrderById(@Param('id') id: number) {
    try {
     
      return await this.orderService.getOrderById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.error(error);
        throw error;
      }
      this.logger.error(`Failed to get order`, error);
      throw new InternalServerErrorException('Failed to get order');
    }
  }

  @Get('user/:userId')
  async getOrdersByUser(@Param('userId') userId: number) {
    try {
      return await this.orderService.getOrdersByUser(userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.error(error);
        throw error;
      }
      this.logger.error(`Failed to get orders for user`, error);
      throw new InternalServerErrorException('Failed to get orders for user');
    }
  }

 
}
