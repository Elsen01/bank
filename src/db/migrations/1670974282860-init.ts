import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1670974282860 implements MigrationInterface {
  name = 'init1670974282860';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "client" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "document" text NOT NULL, "birth_date" date NOT NULL, CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" double precision NOT NULL, "transaction_date" TIMESTAMP NOT NULL DEFAULT now(), "account_id" uuid, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "balance" double precision NOT NULL DEFAULT '0', "daily_withdrawal_limit" double precision NOT NULL DEFAULT '1000', "active" boolean NOT NULL DEFAULT true, "account_type" integer NOT NULL, "create_date" TIMESTAMP NOT NULL DEFAULT now(), "person_id" uuid, CONSTRAINT "REL_73b5a14ecc8f5529ea98a746d5" UNIQUE ("person_id"), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_e2652fa8c16723c83a00fb9b17e" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_73b5a14ecc8f5529ea98a746d51" FOREIGN KEY ("person_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_73b5a14ecc8f5529ea98a746d51"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_e2652fa8c16723c83a00fb9b17e"`,
    );
    await queryRunner.query(`DROP TABLE "account"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(`DROP TABLE "client"`);
  }
}
