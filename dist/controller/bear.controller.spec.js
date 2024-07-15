"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const integration_test_module_1 = require("../integration-test.module");
const bear_repository_1 = require("../persistence/repository/bear.repository");
const data_source_1 = require("../config/data-source");
const typeorm_transactional_tests_1 = require("typeorm-transactional-tests");
const bear_controller_1 = require("./bear.controller");
const bear_entity_1 = require("../persistence/entity/bear.entity");
const common_1 = require("@nestjs/common");
const color_entity_1 = require("../persistence/entity/color.entity");
jest.setTimeout(60000);
let transactionalContext;
let testModule;
let bearRepository;
let bearController;
let bearService;
describe('BearController', () => {
    beforeAll(async () => {
        testModule = await (0, integration_test_module_1.integrationTestModule)();
        bearRepository = testModule.get(bear_repository_1.BearRepository);
        bearController = testModule.get(bear_controller_1.BearController);
        bearService = testModule.get('IBearService');
    });
    afterAll(async () => {
        await (0, integration_test_module_1.integrationTestTeardown)();
    });
    beforeEach(async () => {
        if (data_source_1.AppDataSource.isInitialized) {
            transactionalContext = new typeorm_transactional_tests_1.TransactionalTestContext(data_source_1.AppDataSource);
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
            await bearController.getBearBySizeInRange(10, 0);
        }
        catch (error) {
            const exception = error;
            expect(exception.getStatus()).toEqual(400);
        }
    });
    it('size-in-range should return proper values', async () => {
        const gummyBear = new bear_entity_1.Bear();
        gummyBear.name = 'Gummybear';
        gummyBear.size = 5;
        const grizzlyBear = new bear_entity_1.Bear();
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
    it('by-color with empty color parameter should raise error', async () => {
        try {
            await bearController.getBearsByColor(' ');
        }
        catch (error) {
            expect(error).toBeInstanceOf(common_1.BadRequestException);
            expect(error.getStatus()).toEqual(400);
            expect(error.message).toEqual('Color parameter is required.');
        }
    });
    it('by-color with correct color should return proper values', async () => {
        const brownColor = new color_entity_1.Color();
        brownColor.name = 'Brown';
        await data_source_1.AppDataSource.manager.save(brownColor);
        const brownBear = new bear_entity_1.Bear();
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
        jest.spyOn(bearService, 'findBearsByColor').mockImplementation(async () => {
            throw new Error('Some unexpected error');
        });
        try {
            await bearController.getBearsByColor('SomeColor');
        }
        catch (error) {
            expect(error).toBeInstanceOf(common_1.InternalServerErrorException);
            expect(error.getStatus()).toEqual(500);
        }
    });
    it('getBearById should return a bear for a valid ID', async () => {
        const bear = new bear_entity_1.Bear();
        bear.name = 'Polar Bear';
        bear.size = 300;
        await bearRepository.save(bear);
        const result = await bearController.getBearById(bear.id);
        expect(result.name).toEqual('Polar Bear');
    });
    it('getBearById should throw NotFoundException for an invalid ID', async () => {
        try {
            await bearController.getBearById(999);
        }
        catch (error) {
            expect(error).toBeInstanceOf(common_1.NotFoundException);
            expect(error.getStatus()).toEqual(404);
        }
    });
    it('createBear should create and return a new bear', async () => {
        const createBearDto = {
            name: 'Black Bear', size: 200,
            colors: []
        };
        const result = await bearController.createBear(createBearDto);
        expect(result.name).toEqual('Black Bear');
        expect(result.size).toEqual(200);
    });
    it('updateBear should update and return an existing bear', async () => {
        const bear = new bear_entity_1.Bear();
        bear.name = 'Sun Bear';
        bear.size = 150;
        await bearRepository.save(bear);
        const updateBearDto = {
            name: 'Updated Sun Bear', size: 160,
            colors: []
        };
        const result = await bearController.updateBear(bear.id, updateBearDto);
        expect(result.name).toEqual('Updated Sun Bear');
        expect(result.size).toEqual(160);
    });
    it('updateBear should throw NotFoundException for an invalid ID', async () => {
        const updateBearDto = {
            name: 'Nonexistent Bear', size: 160,
            colors: []
        };
        try {
            await bearController.updateBear(999, updateBearDto);
        }
        catch (error) {
            expect(error).toBeInstanceOf(common_1.NotFoundException);
        }
    });
    it('deleteBear should delete an existing bear', async () => {
        const bear = new bear_entity_1.Bear();
        bear.name = 'Panda Bear';
        bear.size = 120;
        await bearRepository.save(bear);
        await bearController.deleteBear(bear.id);
        try {
            await bearController.getBearById(bear.id);
        }
        catch (error) {
            expect(error).toBeInstanceOf(common_1.NotFoundException);
        }
    });
    it('deleteBear should throw NotFoundException for an invalid ID', async () => {
        try {
            await bearController.deleteBear(999);
        }
        catch (error) {
            expect(error).toBeInstanceOf(common_1.NotFoundException);
        }
    });
    it('getBearsWithMultipleColors should return bears with multiple colors', async () => {
        const brownColor = new color_entity_1.Color();
        brownColor.name = 'Brown';
        const whiteColor = new color_entity_1.Color();
        whiteColor.name = 'White';
        await data_source_1.AppDataSource.manager.save([brownColor, whiteColor]);
        const multiColoredBear = new bear_entity_1.Bear();
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
        }
        catch (error) {
            expect(error).toBeInstanceOf(common_1.InternalServerErrorException);
        }
    });
});
//# sourceMappingURL=bear.controller.spec.js.map