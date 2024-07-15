import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { JwtStrategy } from './service/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './persistence/entity/user.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([User]),
      PassportModule,
      JwtModule.register({
        secret: 'secret-bear', 
        signOptions: { expiresIn: '1h' },
      }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
  })
  export class AuthModule {}
