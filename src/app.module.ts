import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BearController } from './controller/bear.controller';
import { BearService } from './service/bear.service';
import { IBearService } from './service/iservice/bear-service.interface';
import { IOrderService } from './service/iservice/order-service.interface';
import ORMConfig = require("./config/typeOrmConfig");
import { BearRepositoryProvider } from "./persistence/repository/bear.repository";
import { AuthModule } from './auth.module';
import { OrderController } from './controller/order.controller';
import { OrderService } from './service/order.service';
import { User } from './persistence/entity/user.entity';
import { Bear } from './persistence/entity/bear.entity';
import { Color } from './persistence/entity/color.entity';
import { Order } from './persistence/entity/order.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(ORMConfig),
    TypeOrmModule.forFeature([Order, User, Bear, Color]),
    AuthModule,
  ],
  controllers: [
    BearController,
    OrderController,
  ],
  providers: [
    BearRepositoryProvider,
    {
      provide: 'IBearService',
      useClass: BearService,
    },
    {
      provide: 'IOrderService',
      useClass: OrderService,
    },
    OrderService,
  ],
})
export class AppModule {}
