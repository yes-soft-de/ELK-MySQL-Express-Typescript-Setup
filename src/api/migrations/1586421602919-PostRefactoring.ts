import {MigrationInterface, QueryRunner} from "typeorm";

export class PostRefactoring1586421602919 implements MigrationInterface {
    name = 'PostRefactoring1586421602919'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `note_model` (`id` varchar(36) NOT NULL, `writer` varchar(255) NOT NULL, `note` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `note_model`", undefined);
    }

}
