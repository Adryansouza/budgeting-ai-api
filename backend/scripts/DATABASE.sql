-- Esquema para uma instalação nova.
-- Em bancos existentes, use MIGRATION_USUARIOS.sql em vez de executar este arquivo
-- esperando que CREATE TABLE altere tabelas que já existem.

CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT NOT NULL AUTO_INCREMENT,
    email VARCHAR(254) NOT NULL,
    senha VARCHAR(255) NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_usuarios_email UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS contas (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    saldo_inicial DECIMAL(10, 2) NOT NULL,
    data_criacao DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    data_atualizacao DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    usuario_id BIGINT NULL,
    PRIMARY KEY (id),
    INDEX idx_contas_usuario_id (usuario_id),
    CONSTRAINT fk_contas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
);

CREATE TABLE IF NOT EXISTS transacoes (
    id BIGINT NOT NULL AUTO_INCREMENT,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    tipo ENUM('DESPESA', 'RECEITA') NOT NULL DEFAULT 'DESPESA',
    categoria VARCHAR(255) NOT NULL,
    data_ocorrencia DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    data_criacao DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    usuario_id BIGINT NULL,
    PRIMARY KEY (id),
    INDEX idx_transacoes_usuario_id (usuario_id),
    CONSTRAINT fk_transacoes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
);
