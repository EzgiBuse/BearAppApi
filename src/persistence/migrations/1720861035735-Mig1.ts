import { MigrationInterface, QueryRunner } from "typeorm";

export class Mig11720861035735 implements MigrationInterface {
    name = 'Mig11720861035735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "color" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_d15e531d60a550fbf23e1832343" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bear_colors_color" ("bearId" integer NOT NULL, "colorId" integer NOT NULL, CONSTRAINT "PK_c6ad751ab6260888370a4bb02a0" PRIMARY KEY ("bearId", "colorId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fa67c3f51613a6dfcfcfc8b362" ON "bear_colors_color" ("bearId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1f130baa577e1d9502e84276f1" ON "bear_colors_color" ("colorId") `);
        await queryRunner.query(`ALTER TABLE "bear_colors_color" ADD CONSTRAINT "FK_fa67c3f51613a6dfcfcfc8b362f" FOREIGN KEY ("bearId") REFERENCES "bear"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "bear_colors_color" ADD CONSTRAINT "FK_1f130baa577e1d9502e84276f16" FOREIGN KEY ("colorId") REFERENCES "color"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bear_colors_color" DROP CONSTRAINT "FK_1f130baa577e1d9502e84276f16"`);
        await queryRunner.query(`ALTER TABLE "bear_colors_color" DROP CONSTRAINT "FK_fa67c3f51613a6dfcfcfc8b362f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1f130baa577e1d9502e84276f1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fa67c3f51613a6dfcfcfc8b362"`);
        await queryRunner.query(`DROP TABLE "bear_colors_color"`);
        await queryRunner.query(`DROP TABLE "color"`);
    }

}
