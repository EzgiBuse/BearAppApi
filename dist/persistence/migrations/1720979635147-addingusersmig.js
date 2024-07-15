"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Addingusersmig1720979635147 = void 0;
class Addingusersmig1720979635147 {
    constructor() {
        this.name = 'Addingusersmig1720979635147';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
exports.Addingusersmig1720979635147 = Addingusersmig1720979635147;
//# sourceMappingURL=1720979635147-addingusersmig.js.map