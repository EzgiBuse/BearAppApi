import {BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException} from '@nestjs/common';
import {BearRepository} from "../persistence/repository/bear.repository";
import { Bear } from '../persistence/entity/bear.entity';
import { CreateBearDto } from '../persistence/entity/dto/create-bear.dto';
import { UpdateBearDto } from '../persistence/entity/dto/update-bear.dto';
import { IBearService } from './iservice/bear-service.interface';


@Injectable()
export class BearService implements IBearService {
    private readonly logger = new Logger(BearService.name);


    constructor(private readonly bearRepository: BearRepository) {
    }

    async getAll(): Promise<Bear[]> {
      try {
        return await this.bearRepository.find();
      } catch (error) {
        this.logger.error('Failed to retrieve bears', error);
        throw new InternalServerErrorException('Failed to retrieve bears.');
      }
    }
  
    async getById(id: number): Promise<Bear> {
      try {
        const bear = await this.bearRepository.findOneBy({ id });
        if (!bear) {
          this.logger.warn(`Bear with ID not found.`);
          throw new NotFoundException(`Bear with ID not found.`);
        }
        return bear;
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error; 
        }
        this.logger.error(`Failed to retrieve bear with ID.`, error);
        throw new InternalServerErrorException('Failed to retrieve the bear.');
      }
    }
  
    async create(createBearDto: CreateBearDto): Promise<Bear> {
      try {
        const bear = this.bearRepository.create(createBearDto);
        return await this.bearRepository.save(bear);
      } catch (error) {
        this.logger.error('Failed to create bear', error);
        throw new InternalServerErrorException('Failed to create bear.');
      }
    }
  
    async update(id: number, updateBearDto: UpdateBearDto): Promise<Bear> {
      try {
        const bear = await this.bearRepository.findOne({
          where: { id },
          relations: ['colors'], 
        });
        if (!bear) {
          this.logger.warn(`Bear with ID not found.`);
          throw new NotFoundException(`Bear with ID not found.`);
        }
    
        Object.assign(bear, updateBearDto);
    
        await this.bearRepository.save(bear);
    
        return bear;
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        this.logger.error(`Failed to update bear with ID ${id}`, error);
        throw new InternalServerErrorException('Failed to update bear.');
      }
    }
  
    async remove(id: number): Promise<void> {
      try {
        
        const bear = await this.bearRepository.findOneBy({ id });
    
        if (!bear) {
          this.logger.warn(`Bear with ID not found.`);
          throw new NotFoundException(`Bear not found.`);
        }
        await this.bearRepository.delete(id);

      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error; 
        }
        this.logger.error(`Failed to delete bear with ID `, error);
        throw new InternalServerErrorException('Failed to delete bear.');
      }
    }

    async findBearBySizeInRange(start: number, end: number): Promise<string[]> {
        const bears = await this.bearRepository.findBearBySizeInRange(start, end);
        return bears.map(bear => bear.name);
    }

    async findBearsByColor(colorName: string): Promise<string[]> {
        
        try {
          const bears = await this.bearRepository.findBearsByColor(colorName);
          if (!bears.length) {
            return [];
          }
          //to return a string[] of the bears' names
          return bears.map(bear => bear.name);
        } catch (error) {
          this.logger.error(`Failed to find bears by color ${colorName}: ${error.message}`);
          throw new InternalServerErrorException('An unexpected error occurred while finding bears by color.');
        }
      }

      async findBearsWithMultipleColors(): Promise<Bear[]> {
        try {
          const bears = await this.bearRepository.findBearsWithMultipleColors();
          return bears;
        } catch (error) {
          this.logger.error('Failed to find bears with multiple colors', error);
          throw new InternalServerErrorException('Failed to find bears with multiple colors.');
        }
      }
      
}
