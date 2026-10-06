# Fluxo

O Fluxo é um aplicativo brasileiro de controle financeiro pessoal. A pessoa registra gastos e receitas por texto ou voz, recebe confirmações simples e acompanha seu dinheiro sem planilhas complicadas.

Este repositório é um monorepo: API e aplicativo vivem juntos, mas com dependências e comandos separados.

```text
budgeting-ai/
├── backend/       # Spring Boot, MySQL, Ollama e áudio
├── frontend/      # React Native + Expo para Android, iOS e web
├── docs/          # documentação compartilhada
├── plans/         # planos e evidências de design
├── .agents/       # skills locais do Codex
└── scripts/       # ferramentas de design do repositório
```

## Backend

Entre em `backend/` para executar a API:

    cd backend
    .\mvnw.cmd spring-boot:run

A documentação detalhada da API está em [backend/README.md](backend/README.md).

## Aplicativo mobile

O aplicativo React Native será criado em `frontend/` com Expo e TypeScript. A primeira implementação espera a seleção de uma direção visual a partir do plano [00-fluxo-mobile-monorepo](plans/00-fluxo-mobile-monorepo.md).

## Design

O produto usa uma linguagem minimalista e financeira, sem estética de IA. Consulte [DESIGN.md](DESIGN.md) e o plano de mockups antes de criar telas.
