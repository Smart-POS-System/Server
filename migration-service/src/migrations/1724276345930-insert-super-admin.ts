import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertSuperAdmin1724276345930 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO employee(name, email, password, role, is_active, temporary)
                VALUES(
                    'admin1234', 
                    'admin@pos.com',
                    'admin1234',
                    'General Manager', 
                    TRUE, 
                    TRUE
                );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM employee WHERE email = 'admin@pos.com';`
    );
  }
}
