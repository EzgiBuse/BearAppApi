import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  
  @IsNotEmpty()
  userId: number;

  
  @IsNotEmpty()
  bearId: number;

 
  @IsNotEmpty()
  colorId: number;
}
