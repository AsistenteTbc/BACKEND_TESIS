import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1770930992781 implements MigrationInterface {
    name = 'Init1770930992781'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "laboratorio" ADD "latitude" numeric(10,6)`);
        await queryRunner.query(`ALTER TABLE "laboratorio" ADD "longitude" numeric(10,6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "laboratorio" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "laboratorio" DROP COLUMN "latitude"`);
    }

}
