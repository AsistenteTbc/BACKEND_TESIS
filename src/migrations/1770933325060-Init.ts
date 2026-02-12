import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1770933325060 implements MigrationInterface {
    name = 'Init1770933325060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "laboratorio" ALTER COLUMN "latitude" TYPE numeric(12,8)`);
        await queryRunner.query(`ALTER TABLE "laboratorio" ALTER COLUMN "longitude" TYPE numeric(12,8)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "laboratorio" ALTER COLUMN "longitude" TYPE numeric(10,6)`);
        await queryRunner.query(`ALTER TABLE "laboratorio" ALTER COLUMN "latitude" TYPE numeric(10,6)`);
    }

}
