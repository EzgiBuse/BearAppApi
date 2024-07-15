import { Bear } from '../../persistence/entity/bear.entity';
import { CreateBearDto } from '../../persistence/entity/dto/create-bear.dto';
import { UpdateBearDto } from '../../persistence/entity/dto/update-bear.dto';

export interface IBearService {
  getAll(): Promise<Bear[]>;
  getById(id: number): Promise<Bear>;
  create(createBearDto: CreateBearDto): Promise<Bear>;
  update(id: number, updateBearDto: UpdateBearDto): Promise<Bear>;
  remove(id: number): Promise<void>;
  findBearBySizeInRange(start: number, end: number): Promise<string[]>;
  findBearsByColor(colorName: string): Promise<string[]>;
  findBearsWithMultipleColors(): Promise<Bear[]>;
}
