import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class Users1736184249919 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "users",
            columns: [
                {
                    name: "id",
                    type: "int",
                    generationStrategy: "increment",
                    isPrimary: true,
                    isGenerated: true,
                },
                {
                    name: "username",
                    type: "varchar"
                },
                {
                    name: "password",
                    type: "varchar",
                },
                {
                    name: "salt",
                    type: "varchar",
                },
                {
                    name: "full_name",
                    type: "varchar",
                },
                {
                    name: "email",
                    type: "varchar",
                },
                {
                    name: "role",
                    type: "int",
                    comment: "1 => Admin, 2 => Editor, 3 => Viewer"
                },
                {
                	name: "created_at",
                	type: "int",
                    isNullable: true,
                    default: null
                },
                {
                	name: "updated_at",
                	type: "int",
                    isNullable: true,
                    default: null
                },
                {
                	name: "deleted_at",
                	type: "int",
                    isNullable: true,
                    default: null
                }
            ]
        }), true)

        await queryRunner.createIndices("users", [
            new TableIndex({
                columnNames: ['username'],
                isUnique: true
            }),
            new TableIndex({
                columnNames: ['email'],
                isUnique: true
            })
        ]); 
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
