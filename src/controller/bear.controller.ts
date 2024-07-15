import {BadRequestException, Body, Controller, Delete, Get, Inject, InternalServerErrorException, Logger, NotFoundException, Param, Post, Put, UseGuards} from '@nestjs/common';
import { BearService } from '../service/bear.service';
import { Bear } from '../persistence/entity/bear.entity';
import { CreateBearDto } from '../persistence/entity/dto/create-bear.dto';
import { UpdateBearDto } from '../persistence/entity/dto/update-bear.dto';
import { IBearService } from '../service/iservice/bear-service.interface';
import { JwtAuthGuard } from '../config/jwt-auth.guard';


@Controller('bear')
export class BearController {
    
    private readonly logger = new Logger(BearController.name);

    constructor(@Inject('IBearService') private readonly bearService: IBearService) {}

    @Get()
    async getAllBears(): Promise<Bear[]> {
        try {
            const bears = await this.bearService.getAll();
            return bears;
        } catch (error) {
            this.logger.error('Failed to retrieve bears.', error);
            throw new InternalServerErrorException('Failed to retrieve bears.');
        }
    }

    @Get('with-multiple-colors')
    async getBearsWithMultipleColors(): Promise<Bear[]> {
    try {
      const bears = await this.bearService.findBearsWithMultipleColors();
      return bears;
    } catch (error) {
      this.logger.error('Failed to retrieve bears with multiple colors', error);
      throw new InternalServerErrorException('Failed to retrieve bears with multiple colors.');
    }
  }

    @Get(':id')
    async getBearById(@Param('id') id: number): Promise<Bear> {
    try {
      const bear = await this.bearService.getById(id);
      return bear;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to retrieve bear with ID `, error);
      throw new InternalServerErrorException('Failed to retrieve bear.');
    }
  }

    @Post()
    async createBear(@Body() createBearDto: CreateBearDto): Promise<Bear> {
        try {
            const bear = await this.bearService.create(createBearDto);
            return bear;
        } catch (error) {
            this.logger.error('Failed to create bear.', error);
            throw new InternalServerErrorException('Failed to create bear.');
        }
    }

    @Put(':id')
    async updateBear(@Param('id') id: number, @Body() updateBearDto: UpdateBearDto): Promise<Bear> {
        try {
            const bear = await this.bearService.update(id, updateBearDto);
            return bear;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
              }
            this.logger.error(`Failed to update bear.`, error);
            throw new InternalServerErrorException('Failed to update bear.');
        }
    }

    @Delete(':id')
    async deleteBear(@Param('id') id: number): Promise<void> {
        try {
            await this.bearService.remove(id);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
              }
            this.logger.error(`Failed to delete bear.`, error);
            throw new InternalServerErrorException('Failed to delete bear.');
        }
    }


    @Get('size-in-range/:start/:end')
    getBearBySizeInRange(
        @Param('start') start: number,
        @Param('end') end: number
    ): Promise<string[]> {

        if (start > end) {
            throw new BadRequestException(`Start ${start} is larger than end ${end}`);
        }

        return this.bearService.findBearBySizeInRange(start, end);
    }

    @UseGuards(JwtAuthGuard)
    @Get('by-color/:color')
    async getBearsByColor(@Param('color') color: string): Promise<string[]> {
    if (!color || color.trim() === '') {
        this.logger.error('Color parameter is required.');
        throw new BadRequestException('Color parameter is required.');
    }

    try {
        const bears = await this.bearService.findBearsByColor(color);
        this.logger.log(`Retrieved bears for color ${color}: ${bears.join(', ')}`);
        return bears;
    } catch (error) {
        this.logger.error(`InternalServerErrorException: ${error}`);
        throw new InternalServerErrorException('An unexpected error occurred while fetching bears by color.');
    }
}



  

}
