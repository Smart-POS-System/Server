import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertRoles1721035825917 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO role(role_name) VALUES 
            ('Generel Manager'),
            ('Regional Manager'),
            ('Store Manager'), 
            ('Inventory Manager'),
            ('Store Cashier');`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM role;`);
    }

}
