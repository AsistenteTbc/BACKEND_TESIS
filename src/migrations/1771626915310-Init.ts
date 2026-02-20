import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1771626915310 implements MigrationInterface {
    name = 'Init1771626915310'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultation_log" DROP COLUMN "province_name"`);
        await queryRunner.query(`ALTER TABLE "consultation_log" DROP COLUMN "city_name"`);
        await queryRunner.query(`ALTER TABLE "consultation_log" ADD "province_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "consultation_log" ADD "city_id" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultation_log" DROP COLUMN "city_id"`);
        await queryRunner.query(`ALTER TABLE "consultation_log" DROP COLUMN "province_id"`);
        await queryRunner.query(`ALTER TABLE "consultation_log" ADD "city_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "consultation_log" ADD "province_name" character varying NOT NULL`);
    }

}
