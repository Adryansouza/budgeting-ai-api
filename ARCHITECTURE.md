# Arquitetura do Fluxo

O repositório `budgeting-ai` é um monorepo: um único repositório que abriga o aplicativo móvel e a API que ele consome. A separação impede que dependências Java e JavaScript se misturem, mas mantém contratos, documentação e decisões de produto próximos.

## Estrutura

```text
budgeting-ai/
├── backend/       # API Spring Boot, MySQL, Ollama e processamento de áudio
├── frontend/      # aplicativo React Native + Expo (Android, iOS e web)
├── docs/          # decisões e documentação transversal, quando necessária
├── plans/         # planos de execução e evidências de UX
├── .agents/       # skills locais do Codex
└── scripts/       # ferramentas de repositório, incluindo geração de mockups
```

## Limites de responsabilidade

O `backend/` continua sendo a fonte de verdade dos lançamentos, contas, totais, interpretação de linguagem natural e áudio. O `frontend/` nunca acessa MySQL ou Ollama diretamente; ele usa HTTPS e os endpoints REST da API.

O aplicativo será criado com React Native, TypeScript e Expo. Expo gera binários próprios para Android e iOS a partir da mesma base TypeScript e também permite uma versão web. A versão web não substitui os aplicativos nativos; é uma distribuição complementar.

## Contrato inicial entre aplicativo e API

O frontend consumirá os endpoints existentes: `POST /chat`, `POST /audio-chat`, `POST /transcriptions`, `POST /speech`, `GET /lancamentos`, `GET /resumo`, `GET /contas` e `POST /contas`. O desenvolvimento do aplicativo não deve assumir autenticação até que o backend a implemente.

## Regra de configuração

Segredos e URLs locais pertencem a arquivos de ambiente de cada aplicação: `backend/.env` para a API e `frontend/.env` (não versionado) para a URL pública da API. Nenhuma chave deve aparecer em código ou documentação versionada.
