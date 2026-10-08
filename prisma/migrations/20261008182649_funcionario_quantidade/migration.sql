/*
  Warnings:

  - You are about to drop the column `responsavel` on the `movimentacao` table. All the data in the column will be lost.
  - Added the required column `funcionarioId` to the `Movimentacao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `movimentacao` DROP COLUMN `responsavel`,
    ADD COLUMN `funcionarioId` INTEGER NOT NULL,
    ADD COLUMN `quantidade` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `produto` ADD COLUMN `quantidade` INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `Funcionario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `matricula` VARCHAR(191) NULL,

    UNIQUE INDEX `Funcionario_matricula_key`(`matricula`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Movimentacao` ADD CONSTRAINT `Movimentacao_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `Funcionario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
