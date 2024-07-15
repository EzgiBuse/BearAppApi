import { integrationTestModule, integrationTestTeardown } from "../integration-test.module";
import { BearRepository } from "../persistence/repository/bear.repository";
import { AppDataSource } from "../config/data-source";
import { TransactionalTestContext } from "typeorm-transactional-tests";
import { BearController } from "./bear.controller";
import { Bear } from "../persistence/entity/bear.entity";
import { BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { BearService } from "../service/bear.service";
import { Color } from "../persistence/entity/color.entity";
import { CreateBearDto } from '../persistence/entity/dto/create-bear.dto';
import { UpdateBearDto } from '../persistence/entity/dto/update-bear.dto';
import { IBearService } from "../service/iservice/bear-service.interface";

jest.setTimeout(60000);

let transactionalContext: TransactionalTestContext;
let testModule;
let bearRepository: BearRepository;
let bearController: BearController;
let bearService: IBearService;

describe('BearController', () => {
  beforeAll(async () => {
    testModule = await integrationTestModule();
    bearRepository = testModule.get<BearRepository>(BearRepository);
    bearController = testModule.get<BearController>(BearController);
    bearService = testModule.get<IBearService>('IBearService');
  });

  afterAll(async () => {
    await integrationTestTeardown();
  });

  beforeEach(async () => {
    if (AppDataSource.isInitialized) {
      transactionalContext = new TransactionalTestContext(AppDataSource);
      await transactionalContext.start();
    }
  });

  afterEach(async () => {
    if (transactionalContext) {
      await transactionalContext.finish();
    }
  });

  it('Should run', async () => {
    expect(bearRepository).toBeDefined();
  });

  it('size-in-range wrong parameters should raise error', async () => {
    try {
      await bearController.getBearBySizeInRange(10, 0)
    } catch (error) {
      const exception = error as BadRequestException;
      expect(exception.getStatus()).toEqual(400);
    }
  });

  it('size-in-range should return proper values', async () => {
    const gummyBear = new Bear();
    gummyBear.name = 'Gummybear';
    gummyBear.size = 5;
    const grizzlyBear = new Bear();
    grizzlyBear.name = 'Grizzly';
    grizzlyBear.size = 320;
    await bearRepository.save(gummyBear);
    await bearRepository.save(grizzlyBear);

    let bears = await bearController.getBearBySizeInRange(0, 4);
    expect(bears.length).toEqual(0);

    bears = await bearController.getBearBySizeInRange(5, 320);
    expect(bears.length).toEqual(2);

    bears = await bearController.getBearBySizeInRange(100, 500);
    expect(bears.length).toEqual(1);
    expect(bears[0]).toEqual('Grizzly');
  });

  //Tests for by-color
  it('by-color with empty color parameter should raise error', async () => {
    try {
      await bearController.getBearsByColor(' ');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect((error as BadRequestException).getStatus()).toEqual(400);
      expect((error as BadRequestException).message).toEqual('Color parameter is required.');
    }
  });

  it('by-color with correct color should return proper values', async () => {
    const brownColor = new Color();
    brownColor.name = 'Brown';
    await AppDataSource.manager.save(brownColor);

    const brownBear = new Bear();
    brownBear.name = 'Brown Bear';
    brownBear.size = 250;
    brownBear.colors = [brownColor];
    await bearRepository.save(brownBear);

    const bears = await bearController.getBearsByColor('Brown');
    expect(bears.length).toEqual(1);
    expect(bears[0]).toEqual('Brown Bear');
  });


  it('by-color should return empty array for non-existing color', async () => {
    const bears = await bearController.getBearsByColor('NonExistentColor');
    expect(bears.length).toEqual(0);
  });


  it('by-color should handle InternalServerErrorException', async () => {
    // Unexpected error in the service layer
    jest.spyOn(bearService, 'findBearsByColor').mockImplementation(async () => {
      throw new Error('Some unexpected error');
    });

    try {
      await bearController.getBearsByColor('SomeColor');
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect((error as InternalServerErrorException).getStatus()).toEqual(500);
    }
  });

  //getBearById tests
  it('getBearById should return a bear for a valid ID', async () => {
    const bear = new Bear();
    bear.name = 'Polar Bear';
    bear.size = 300;
    await bearRepository.save(bear);

    const result = await bearController.getBearById(bear.id);
    expect(result.name).toEqual('Polar Bear');
  });

  it('getBearById should throw NotFoundException for an invalid ID', async () => {
    try {
      await bearController.getBearById(999);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect((error as NotFoundException).getStatus()).toEqual(404);
    }
  });

  //createBear tests
  it('createBear should create and return a new bear', async () => {
    const createBearDto: CreateBearDto = {
      name: 'Black Bear', size: 200,
      colors: []
    };
    const result = await bearController.createBear(createBearDto);

    expect(result.name).toEqual('Black Bear');
    expect(result.size).toEqual(200);
  });

  // updateBear tests
  it('updateBear should update and return an existing bear', async () => {
    const bear = new Bear();
    bear.name = 'Sun Bear';
    bear.size = 150;
    await bearRepository.save(bear);

    const updateBearDto: UpdateBearDto = {
      name: 'Updated Sun Bear', size: 160,
      colors: []
    };
    const result = await bearController.updateBear(bear.id, updateBearDto);

    expect(result.name).toEqual('Updated Sun Bear');
    expect(result.size).toEqual(160);
  });

  it('updateBear should throw NotFoundException for an invalid ID', async () => {
    const updateBearDto: UpdateBearDto = {
      name: 'Nonexistent Bear', size: 160,
      colors: []
    };
    try {
      await bearController.updateBear(999, updateBearDto);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  // deleteBear tests
  it('deleteBear should delete an existing bear', async () => {
    const bear = new Bear();
    bear.name = 'Panda Bear';
    bear.size = 120;
    await bearRepository.save(bear);

    await bearController.deleteBear(bear.id);

    try {
      await bearController.getBearById(bear.id);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  it('deleteBear should throw NotFoundException for an invalid ID', async () => {
    try {
      await bearController.deleteBear(999);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });
  //getBearsWithMultipleColors tests
  it('getBearsWithMultipleColors should return bears with multiple colors', async () => {
    const brownColor = new Color();
    brownColor.name = 'Brown';
    const whiteColor = new Color();
    whiteColor.name = 'White';
    await AppDataSource.manager.save([brownColor, whiteColor]);

    const multiColoredBear = new Bear();
    multiColoredBear.name = 'Multicolored Bear';
    multiColoredBear.size = 220;
    multiColoredBear.colors = [brownColor, whiteColor];
    await bearRepository.save(multiColoredBear);

    const bears = await bearController.getBearsWithMultipleColors();
    expect(bears.length).toEqual(1);
    expect(bears[0].name).toEqual('Multicolored Bear');
  });
  
  it('getBearsWithMultipleColors should handle InternalServerErrorException', async () => {
    jest.spyOn(bearService, 'findBearsWithMultipleColors').mockImplementation(async () => {
      throw new Error('error');
    });

    try {
      await bearController.getBearsWithMultipleColors();
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
     
    }
  });
});
