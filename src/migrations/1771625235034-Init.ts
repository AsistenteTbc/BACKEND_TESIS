import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1771625235034 implements MigrationInterface {
    name = 'Init1771625235034'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "step" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "code" character varying NOT NULL, "content" text, "is_end" boolean NOT NULL DEFAULT false, "variant" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_70d386ace569c3d265e05db0cc7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "option" ("id" SERIAL NOT NULL, "label" character varying NOT NULL, "next_step_id" integer NOT NULL, "step_id" integer NOT NULL, CONSTRAINT "PK_e6090c1c6ad8962eea97abdbe63" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "laboratorio" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "address" character varying NOT NULL, "latitude" numeric(12,8), "longitude" numeric(12,8), "phone" character varying, "horario" character varying, "province_id" integer NOT NULL, "deleted_at" TIMESTAMP, CONSTRAINT "PK_0da9d571d9f912a3329aa4bdbda" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "city" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "zip_code" character varying, "province_id" integer NOT NULL, "laboratorio_id" integer, "deleted_at" TIMESTAMP, CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "province" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "deleted_at" TIMESTAMP, CONSTRAINT "PK_4f461cb46f57e806516b7073659" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "consultation_log" ("id" SERIAL NOT NULL, "province_name" character varying NOT NULL, "city_name" character varying NOT NULL, "diagnosis_type" character varying, "is_risk_group" boolean NOT NULL DEFAULT false, "patient_weight_range" character varying, "result_variant" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3043dc1d20fbdf16a49cac40a99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "fullName" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "option" ADD CONSTRAINT "FK_14a28d6003e52a3bb78105c83d9" FOREIGN KEY ("step_id") REFERENCES "step"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "laboratorio" ADD CONSTRAINT "FK_e85805832e5b1c5d478bf471b0e" FOREIGN KEY ("province_id") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "city" ADD CONSTRAINT "FK_efa45f1f32db90d7c6554a353ed" FOREIGN KEY ("province_id") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "city" ADD CONSTRAINT "FK_a714ffa4f33b9b6222e104a2172" FOREIGN KEY ("laboratorio_id") REFERENCES "laboratorio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "city" DROP CONSTRAINT "FK_a714ffa4f33b9b6222e104a2172"`);
        await queryRunner.query(`ALTER TABLE "city" DROP CONSTRAINT "FK_efa45f1f32db90d7c6554a353ed"`);
        await queryRunner.query(`ALTER TABLE "laboratorio" DROP CONSTRAINT "FK_e85805832e5b1c5d478bf471b0e"`);
        await queryRunner.query(`ALTER TABLE "option" DROP CONSTRAINT "FK_14a28d6003e52a3bb78105c83d9"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "consultation_log"`);
        await queryRunner.query(`DROP TABLE "province"`);
        await queryRunner.query(`DROP TABLE "city"`);
        await queryRunner.query(`DROP TABLE "laboratorio"`);
        await queryRunner.query(`DROP TABLE "option"`);
        await queryRunner.query(`DROP TABLE "step"`);
    }

}
