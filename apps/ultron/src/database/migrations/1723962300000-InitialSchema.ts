import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1723962300000 implements MigrationInterface {
  name = 'InitialSchema1723962300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ensure required extension for UUID generation exists
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "users" (
      "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      "username" character varying(20) NOT NULL,
      "active" boolean NOT NULL DEFAULT false,
      "email" character varying(30) NOT NULL,
      "password" character varying(60) NOT NULL,
      "refreshToken" character varying,
      CONSTRAINT "UQ_users_username" UNIQUE ("username"),
      CONSTRAINT "UQ_users_email" UNIQUE ("email"),
      CONSTRAINT "PK_users_uuid" PRIMARY KEY ("uuid")
    )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "files" (
      "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      "url" character varying NOT NULL,
      "key" character varying NOT NULL,
      "size" integer NOT NULL DEFAULT 0,
      "name" character varying,
      "userUuid" uuid,
      CONSTRAINT "PK_files_uuid" PRIMARY KEY ("uuid"),
      CONSTRAINT "FK_files_userUuid" FOREIGN KEY ("userUuid")
        REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION
    )`);

    // Indexes could be added here if needed
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "files"');
    await queryRunner.query('DROP TABLE IF EXISTS "users"');
  }
}
