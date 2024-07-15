import { IsNotEmpty } from "class-validator";
import { Color } from "../color.entity";

export class CreateBearDto {
  
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  size: number;

  @IsNotEmpty()
  colors: Color[];
}