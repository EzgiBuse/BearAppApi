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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BearRepositoryProvider = exports.BearRepository = void 0;
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const bear_entity_1 = require("./bear.entity");
let BearRepository = class BearRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(bear_entity_1.Bear, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async findBearBySizeInRange(start, end) {
        return this.find({
            where: {
                size: (0, typeorm_1.Between)(start, end)
            }
        });
    }
    async findBearsByColor(colorName) {
        try {
            return await this.find({
                relations: ['colors'],
                where: {
                    colors: {
                        name: colorName
                    }
                }
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to find bears by color.');
        }
    }
};
exports.BearRepository = BearRepository;
exports.BearRepository = BearRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], BearRepository);
exports.BearRepositoryProvider = {
    provide: BearRepository,
    useFactory: (dataSource) => new BearRepository(dataSource),
    inject: [typeorm_1.DataSource]
};
//# sourceMappingURL=bear.repository.js.map