import "reflect-metadata";
// require("reflect-metadata");
import express from 'express';
// import { AppDataSource } from "./ormconfig";
import AppDataSource from "./data-source";
// import * as AppDataSource from './data-source';
// import { Migration } from './entities/Migrations';

const app = express();
const port = parseInt(process.env.PG_PORT || "10");

// const appDataSource = require('./data-source');

AppDataSource.initialize().then(() => {
    console.log("Data Source has been initialized!");
}).catch((err: any) => {
    console.error("Error during Data Source initialization", err);
});



app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});



// public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(`INSERT INTO role(role_name) VALUES 
//         ('general_manager'),
//         ('regional_manager'),
//         ('store_manager'), 
//         ('inventory_manager'),
//         ('store_supervisor'),
//         ('inventory_supervisor'),
//         ('store_cashier');`);
// }

// public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(`DELETE FROM role;`);
// }

// public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(`INSERT INTO employees (employee_name, email, password, role_id) VALUES(
//         'Super Admin',
//         'admin.pos@gmail.com',
//         'admin123',
//         'general_manager');`)
// }

// public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(`DELETE FROM employees WHERE email = 'admin.pos@gmail.com';`);
// }