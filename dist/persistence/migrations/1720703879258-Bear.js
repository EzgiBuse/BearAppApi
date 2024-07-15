"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bear1720703879258 = void 0;
class Bear1720703879258 {
    constructor() {
        this.name = 'Bear1720703879258';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "bear" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "size" integer NOT NULL, CONSTRAINT "PK_cd1fb70b1a6d730ad8276551e36" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "bear"`);
    }
}
exports.Bear1720703879258 = Bear1720703879258;
//# sourceMappingURL=1720703879258-Bear.js.map