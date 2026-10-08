/*
  Warnings:

  - You are about to drop the `activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aluno` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `atividadeconclusao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cargo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `empresa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `eventofolha` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `folhapagamento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `funcionario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `itemfolha` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notificacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `registroaso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `registroponto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `setor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `turma` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `activity` DROP FOREIGN KEY `Activity_turmaId_fkey`;

-- DropForeignKey
ALTER TABLE `aluno` DROP FOREIGN KEY `Aluno_turmaId_fkey`;

-- DropForeignKey
ALTER TABLE `atividadeconclusao` DROP FOREIGN KEY `AtividadeConclusao_activityId_fkey`;

-- DropForeignKey
ALTER TABLE `atividadeconclusao` DROP FOREIGN KEY `AtividadeConclusao_alunoId_fkey`;

-- DropForeignKey
ALTER TABLE `folhapagamento` DROP FOREIGN KEY `FolhaPagamento_funcionarioId_fkey`;

-- DropForeignKey
ALTER TABLE `funcionario` DROP FOREIGN KEY `Funcionario_cargoId_fkey`;

-- DropForeignKey
ALTER TABLE `funcionario` DROP FOREIGN KEY `Funcionario_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `itemfolha` DROP FOREIGN KEY `ItemFolha_codigoEvento_fkey`;

-- DropForeignKey
ALTER TABLE `itemfolha` DROP FOREIGN KEY `ItemFolha_folhaId_fkey`;

-- DropForeignKey
ALTER TABLE `notificacao` DROP FOREIGN KEY `Notificacao_alunoId_fkey`;

-- DropForeignKey
ALTER TABLE `registroaso` DROP FOREIGN KEY `RegistroASO_funcionarioId_fkey`;

-- DropForeignKey
ALTER TABLE `registroponto` DROP FOREIGN KEY `RegistroPonto_funcionarioId_fkey`;

-- DropForeignKey
ALTER TABLE `setor` DROP FOREIGN KEY `Setor_empresaId_fkey`;

-- DropTable
DROP TABLE `activity`;

-- DropTable
DROP TABLE `aluno`;

-- DropTable
DROP TABLE `atividadeconclusao`;

-- DropTable
DROP TABLE `cargo`;

-- DropTable
DROP TABLE `empresa`;

-- DropTable
DROP TABLE `eventofolha`;

-- DropTable
DROP TABLE `folhapagamento`;

-- DropTable
DROP TABLE `funcionario`;

-- DropTable
DROP TABLE `itemfolha`;

-- DropTable
DROP TABLE `notificacao`;

-- DropTable
DROP TABLE `registroaso`;

-- DropTable
DROP TABLE `registroponto`;

-- DropTable
DROP TABLE `setor`;

-- DropTable
DROP TABLE `turma`;

-- CreateTable
CREATE TABLE `Marca` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Marca_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Modelo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `marcaId` INTEGER NOT NULL,

    UNIQUE INDEX `Modelo_marcaId_nome_key`(`marcaId`, `nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Localizacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Localizacao_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Posicao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `localizacaoId` INTEGER NOT NULL,

    UNIQUE INDEX `Posicao_localizacaoId_nome_key`(`localizacaoId`, `nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `serviceTag` VARCHAR(191) NOT NULL,
    `ni` VARCHAR(191) NOT NULL,
    `status` ENUM('EM_ESTOQUE', 'SAIU') NOT NULL DEFAULT 'EM_ESTOQUE',
    `modeloId` INTEGER NOT NULL,
    `posicaoId` INTEGER NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Produto_serviceTag_key`(`serviceTag`),
    UNIQUE INDEX `Produto_ni_key`(`ni`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Movimentacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` ENUM('ENTRADA', 'SAIDA', 'MOVIMENTACAO') NOT NULL,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `produtoId` INTEGER NOT NULL,
    `origemPosicaoId` INTEGER NULL,
    `destinoPosicaoId` INTEGER NULL,
    `responsavel` VARCHAR(191) NOT NULL,
    `observacao` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Modelo` ADD CONSTRAINT `Modelo_marcaId_fkey` FOREIGN KEY (`marcaId`) REFERENCES `Marca`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Posicao` ADD CONSTRAINT `Posicao_localizacaoId_fkey` FOREIGN KEY (`localizacaoId`) REFERENCES `Localizacao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produto` ADD CONSTRAINT `Produto_modeloId_fkey` FOREIGN KEY (`modeloId`) REFERENCES `Modelo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produto` ADD CONSTRAINT `Produto_posicaoId_fkey` FOREIGN KEY (`posicaoId`) REFERENCES `Posicao`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Movimentacao` ADD CONSTRAINT `Movimentacao_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `Produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Movimentacao` ADD CONSTRAINT `Movimentacao_origemPosicaoId_fkey` FOREIGN KEY (`origemPosicaoId`) REFERENCES `Posicao`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Movimentacao` ADD CONSTRAINT `Movimentacao_destinoPosicaoId_fkey` FOREIGN KEY (`destinoPosicaoId`) REFERENCES `Posicao`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
