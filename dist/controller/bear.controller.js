"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var BearController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BearController = void 0;
const common_1 = require("@nestjs/common");
const create_bear_dto_1 = require("../persistence/entity/dto/create-bear.dto");
const update_bear_dto_1 = require("../persistence/entity/dto/update-bear.dto");
const jwt_auth_guard_1 = require("../config/jwt-auth.guard");
let BearController = BearController_1 = class BearController {
    constructor(bearService) {
        this.bearService = bearService;
        this.logger = new common_1.Logger(BearController_1.name);
    }
    async getAllBears() {
        try {
            const bears = await this.bearService.getAll();
            return bears;
        }
        catch (error) {
            this.logger.error('Failed to retrieve bears.', error);
            throw new common_1.InternalServerErrorException('Failed to retrieve bears.');
        }
    }
    async getBearsWithMultipleColors() {
        try {
            const bears = await this.bearService.findBearsWithMultipleColors();
            return bears;
        }
        catch (error) {
            this.logger.error('Failed to retrieve bears with multiple colors', error);
            throw new common_1.InternalServerErrorException('Failed to retrieve bears with multiple colors.');
        }
    }
    async getBearById(id) {
        try {
            const bear = await this.bearService.getById(id);
            return bear;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Failed to retrieve bear with ID `, error);
            throw new common_1.InternalServerErrorException('Failed to retrieve bear.');
        }
    }
    async createBear(createBearDto) {
        try {
            const bear = await this.bearService.create(createBearDto);
            return bear;
        }
        catch (error) {
            this.logger.error('Failed to create bear.', error);
            throw new common_1.InternalServerErrorException('Failed to create bear.');
        }
    }
    async updateBear(id, updateBearDto) {
        try {
            const bear = await this.bearService.update(id, updateBearDto);
            return bear;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Failed to update bear.`, error);
            throw new common_1.InternalServerErrorException('Failed to update bear.');
        }
    }
    async deleteBear(id) {
        try {
            await this.bearService.remove(id);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Failed to delete bear.`, error);
            throw new common_1.InternalServerErrorException('Failed to delete bear.');
        }
    }
    getBearBySizeInRange(start, end) {
        if (start > end) {
            throw new common_1.BadRequestException(`Start ${start} is larger than end ${end}`);
        }
        return this.bearService.findBearBySizeInRange(start, end);
    }
    async getBearsByColor(color) {
        if (!color || color.trim() === '') {
            this.logger.error('Color parameter is required.');
            throw new common_1.BadRequestException('Color parameter is required.');
        }
        try {
            const bears = await this.bearService.findBearsByColor(color);
            this.logger.log(`Retrieved bears for color ${color}: ${bears.join(', ')}`);
            return bears;
        }
        catch (error) {
            this.logger.error(`InternalServerErrorException: ${error}`);
            throw new common_1.InternalServerErrorException('An unexpected error occurred while fetching bears by color.');
        }
    }
};
exports.BearController = BearController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BearController.prototype, "getAllBears", null);
__decorate([
    (0, common_1.Get)('with-multiple-colors'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BearController.prototype, "getBearsWithMultipleColors", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BearController.prototype, "getBearById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bear_dto_1.CreateBearDto]),
    __metadata("design:returntype", Promise)
], BearController.prototype, "createBear", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_bear_dto_1.UpdateBearDto]),
    __metadata("design:returntype", Promise)
], BearController.prototype, "updateBear", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BearController.prototype, "deleteBear", null);
__decorate([
    (0, common_1.Get)('size-in-range/:start/:end'),
    __param(0, (0, common_1.Param)('start')),
    __param(1, (0, common_1.Param)('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], BearController.prototype, "getBearBySizeInRange", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('by-color/:color'),
    __param(0, (0, common_1.Param)('color')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BearController.prototype, "getBearsByColor", null);
exports.BearController = BearController = BearController_1 = __decorate([
    (0, common_1.Controller)('bear'),
    __param(0, (0, common_1.Inject)('IBearService')),
    __metadata("design:paramtypes", [Object])
], BearController);
//# sourceMappingURL=bear.controller.js.map