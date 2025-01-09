import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class Documents1736359167338 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "documents",
            columns: [
                {
                    name: "id",
                    type: "int",
                    generationStrategy: "increment",
                    isPrimary: true,
                    isGenerated: true,
                },
                {
                    name: "title",
                    type: "varchar"
                },
                {
                    name: "description",
                    type: "text",
                },
                {
                    name: "document_image",
                    type: "varchar",
                },
                {
                    name: "status",
                    type: "int",
                    comment: "1 => Active, 0 => Inactive"
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

        await queryRunner.createIndices("documents", [
            new TableIndex({
                columnNames: ['title'],
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
