import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertSuperAdmin1721035929446 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO employee(employee_name, email, password, role_id, is_active, temporary)
        VALUES(
            'admin1234', 
            'admin@pos.com',
            'admin1234',
            (SELECT role_id FROM role WHERE role_name = 'General Manager'), 
            TRUE, 
            FALSE
        );`
    );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM employee WHERE email = 'admin@pos.com';`);
    }

}
