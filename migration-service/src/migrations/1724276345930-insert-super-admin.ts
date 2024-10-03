import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertSuperAdmin1724276345930 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO employee(name, email, password, role, is_active, temporary)
                VALUES(
                    'admin1234', 
                    'admin@pos.com',
                    '$2b$12$qLQjuD/ReU4DU2E5Q.BnW.kCjQIA5qS7I8SeprgAm8Fv/gsORnZm.',
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
