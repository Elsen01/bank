import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIpColumnInClientTable1671104642008
  implements MigrationInterface
{
  name = 'addIpColumnInClientTable1671104642008';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_73b5a14ecc8f5529ea98a746d51"`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD "ip" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_73b5a14ecc8f5529ea98a746d51" FOREIGN KEY ("person_id") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_73b5a14ecc8f5529ea98a746d51"`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "ip"`);
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_73b5a14ecc8f5529ea98a746d51" FOREIGN KEY ("person_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
