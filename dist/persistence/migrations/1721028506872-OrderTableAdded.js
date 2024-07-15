"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderTableAdded1721028506872 = void 0;
class OrderTableAdded1721028506872 {
    constructor() {
        this.name = 'OrderTableAdded1721028506872';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "bearId" integer NOT NULL, "colorId" integer NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "order"`);
    }
}
exports.OrderTableAdded1721028506872 = OrderTableAdded1721028506872;
//# sourceMappingURL=1721028506872-OrderTableAdded.js.map