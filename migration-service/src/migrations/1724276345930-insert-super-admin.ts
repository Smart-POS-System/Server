import { MigrationInterface, QueryRunner } from "typeorm";
import encryptPassword from "../../helpers/encryptPassword";

export class InsertSuperAdmin1724276345930 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hashedPassword = await encryptPassword("admin1234");

    await queryRunner.query(`INSERT INTO employee(name, email, password, role, is_active, temporary)
                VALUES(
                    'admin1234', 
                    'admin@pos.com',
                    '${hashedPassword}',
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
