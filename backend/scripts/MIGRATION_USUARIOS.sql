-- Migração única para um banco que já possui as tabelas transacoes e/ou contas.
-- Não apaga nem altera os registros existentes. Os novos usuario_id ficam NULL
-- até serem associados manualmente ao usuário correto.
-- Faça backup do banco antes de executar.

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
    PRIMARY KEY (id)
);

ALTER TABLE contas ADD COLUMN usuario_id BIGINT NULL;
ALTER TABLE transacoes ADD COLUMN usuario_id BIGINT NULL;

CREATE INDEX idx_contas_usuario_id ON contas (usuario_id);
CREATE INDEX idx_transacoes_usuario_id ON transacoes (usuario_id);

ALTER TABLE contas
    ADD CONSTRAINT fk_contas_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id);

ALTER TABLE transacoes
    ADD CONSTRAINT fk_transacoes_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id);
