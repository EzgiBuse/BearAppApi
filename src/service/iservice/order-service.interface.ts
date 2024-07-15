import { Order } from "../../persistence/entity/order.entity";
import { CreateOrderDto } from "../../persistence/entity/dto/create-order.dto";

export interface IOrderService {
    createOrder(createOrderDto: CreateOrderDto): Promise<Order>;
    getOrderById(orderId: number): Promise<Order>;
    getOrdersByUser(userId: number): Promise<Order[]>;
}
