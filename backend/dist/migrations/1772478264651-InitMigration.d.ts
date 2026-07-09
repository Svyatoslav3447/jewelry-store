import { MigrationInterface, QueryRunner } from "typeorm";
export declare class InitMigration1772478264651 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
