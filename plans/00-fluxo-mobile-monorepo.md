# Estruturar o monorepo e iniciar o aplicativo Fluxo

Este ExecPlan é um documento vivo e deve ser mantido conforme `PLANS.md`.

## Purpose / Big Picture

Depois deste trabalho, o projeto terá uma estrutura inequívoca para a API existente e o novo aplicativo Fluxo. O aplicativo será planejado como um produto React Native para Android e iOS, com web opcional, e sua primeira implementação terá uma direção visual escolhida a partir de mockups. A pessoa desenvolvedora poderá entrar em `backend/` para executar a API e em `frontend/` para executar o app, sem misturar seus ecossistemas.

## Progress

- [x] (2026-10-05) Registrado o briefing funcional e visual fornecido para o Fluxo.
- [x] (2026-10-05) Criado o prompt de mockups em `plans/00-fluxo-mobile-monorepo/mockup-prompt.md`.
- [x] (2026-10-05) Verificada a ausência de credenciais Stitch; a geração real de opções está bloqueada até sua configuração.
- [x] (2026-10-05) Reorganizados os arquivos atuais da API em `backend/` e mantida a raiz como monorepo.
- [x] (2026-10-05) Atualizado o sistema visual e o prompt de mockups para a direção corporativa dark minimalista solicitada.
- [x] (2026-10-05) Configurado o comando de mockups para carregar automaticamente o `.env` local quando disponível.
- [x] (2026-10-05) Recebida autorização explícita da pessoa autora para reprodução visual fiel da referência de interface.
- [x] (2026-10-05) Registrada a direção visual selecionada em `mockups/decision.md`.
- [x] (2026-10-05) Instalado o projeto Expo/TypeScript em `frontend/`.
- [x] (2026-10-05) Implementadas telas de onboarding, login, cadastro, recuperação, início, registro, confirmação, histórico, resumo e perfil.
- [x] (2026-10-05) Validada a compilação TypeScript e exportada a versão web do Expo.
- [ ] Gerar quatro mockups em `plans/00-fluxo-mobile-monorepo/mockups/` com o Stitch e apresentar a matriz de opções.
- [x] (2026-10-05) Registrada a direção escolhida em `plans/00-fluxo-mobile-monorepo/mockups/decision.md` antes de escrever telas.
- [ ] Capturar e revisar screenshots: bloqueado porque o navegador integrado recusou acesso ao `localhost`.
- [x] (2026-10-05) Revisada a contagem de linhas; nenhum arquivo manual excede 600 linhas.

## Surprises & Discoveries

- Observation: a credencial necessária para criar mockups reais não está disponível no ambiente.
  Evidence: `STITCH_CREDENTIALS_CONFIGURED=False` em 2026-10-05.

## Decision Log

- Decision: adotar um monorepo com `backend/` e `frontend/`.
  Rationale: o produto compartilha contratos e documentação, mas Java/Spring e React Native/Expo têm dependências e comandos distintos.
  Date/Author: 2026-10-05 / Codex e Adryan.
- Decision: usar React Native com Expo e TypeScript no frontend.
  Rationale: entrega Android e iOS com uma única base de código e permite web opcional, sem tratar a web empacotada como produto principal.
  Date/Author: 2026-10-05 / Codex e Adryan.
- Decision: não implementar telas antes de selecionar a direção de mockup.
  Rationale: o briefing descreve um novo produto visual completo e a skill `ui-mockups` exige essa escolha prévia.
  Date/Author: 2026-10-05 / Codex.
- Decision: substituir a proposta clara e informativa por uma interface corporativa dark minimalista.
  Rationale: as referências aprovadas priorizam superfícies azul-marinho, poucos blocos, tipografia financeira forte e verde-limão apenas como acento. A tela inicial deve remover informações auxiliares, gráficos e cartões concorrentes.
  Date/Author: 2026-10-05 / Adryan e Codex.
- Decision: reproduzir fielmente a referência visual autoral enviada pela pessoa usuária.
  Rationale: a pessoa usuária declarou ter criado a arte no Photoshop e autorizou a cópia de sua linguagem, layout, cores e formatos. O conteúdo de investimentos será substituído por dados e ações do Fluxo.
  Date/Author: 2026-10-05 / Adryan.

## Outcomes & Retrospective

O monorepo foi estruturado e o aplicativo Expo foi implementado em `frontend/`. Ele possui navegação responsiva, fluxos locais de onboarding e autenticação, dashboard, registro textual ou por voz simulado, confirmação, histórico filtrável, resumo e perfil. A interface usa dados demonstrativos porque a API ainda não fornece autenticação, edição/exclusão de lançamento, detalhe de lançamento ou sincronização offline. A build web compilou com sucesso. A inspeção visual por navegador integrado ficou pendente porque o ambiente recusou a navegação a `localhost`.

## Context and Orientation

Hoje a API Spring Boot, o Maven Wrapper, scripts Python de áudio e seu arquivo de ambiente ficam na raiz do repositório. Eles serão movidos para `backend/`. A raiz também contém as skills em `.agents/`, as ferramentas de mockup em `scripts/`, e este plano.

`ARCHITECTURE.md` define os limites entre aplicativo e API. `DESIGN.md` será atualizado com a linguagem do Fluxo. O briefing exige interface em português brasileiro, minimalista e acolhedora, sem referências visuais a IA, com verde para ação e vermelho suave apenas para despesas e alertas. O fluxo mais importante é registrar uma frase ou áudio e receber uma confirmação curta.

## Plan of Work

Primeiro, mover os artefatos Java existentes para `backend/`: Maven Wrapper, `.mvn/`, `pom.xml`, `src/`, requisitos e scripts Python de áudio. O conteúdo de ferramentas de design permanecerá na raiz. Atualizar o README de raiz para explicar o monorepo e preservar a documentação detalhada da API em `backend/README.md`.

Com `STITCH_API_KEY` no `.env` local da raiz, gerar uma tela fiel à referência usando `npm run stitch:mockups -- --plan 00-fluxo-mobile-monorepo --prompt-file plans/00-fluxo-mobile-monorepo/mockup-prompt.md --reference <imagem-autoral> --variants 1 --device MOBILE`. O script carrega esse arquivo automaticamente quando ele existe. A direção visual já foi escolhida pela pessoa usuária; o mockup confirma a adaptação do conteúdo financeiro.

Somente após a decisão, criar o Expo app em `frontend/`, configurar uma URL de API por ambiente e implementar as telas priorizadas: início e registro rápido, confirmação, histórico, resumo, perfil e fluxos de autenticação. As funções offline e autenticação dependem de novas capacidades no backend; suas telas podem ser preparadas, mas não devem prometer persistência que a API ainda não oferece.

## Concrete Steps

Na raiz do repositório, criar as pastas do monorepo e mover os componentes Spring para `backend/`. Em seguida, executar a API com:

    cd backend
    .\mvnw.cmd spring-boot:run

Depois que a direção visual for aprovada, criar o app Expo dentro de `frontend/`, apontar a variável de ambiente para a API e testar o registro pelo endpoint `/chat`.

Para mockups reais, após configurar a credencial e instalar dependências:

    npm ci
    npm run stitch:mockups -- --plan 00-fluxo-mobile-monorepo --prompt-file plans/00-fluxo-mobile-monorepo/mockup-prompt.md --variants 4 --device MOBILE

Ao fim de cada mudança de código, executar um comando de contagem que exclua `node_modules`, lockfiles e build output; reportar arquivos manuais acima de 600 linhas e não fazer refatoração não planejada sem aprovação.

## Validation and Acceptance

O repositório estará corretamente estruturado quando `backend/pom.xml` existir, `frontend/README.md` explicar o app mobile e os comandos Maven forem executados a partir de `backend/`. O plano estará pronto para implementação visual quando o diretório de mockups contiver quatro opções e houver uma decisão registrada. O app só poderá ser aceito após registrar uma despesa por texto, exibir confirmação, mostrar os lançamentos recebidos da API e passar revisão de screenshots em telas móveis.

## Visual Evidence

Ainda não existe uma superfície mobile executável, portanto não há screenshots de referência. Os mockups serão armazenados em `plans/00-fluxo-mobile-monorepo/mockups/`. Após o Expo app existir, capturar a tela inicial e o fluxo de confirmação nas larguras de 390 px, 768 px e desktop web, quando suportado, em `plans/00-fluxo-mobile-monorepo/screenshots/`. A revisão final examinará esses arquivos seção por seção com `.agents/skills/review-ui-screenshots/SKILL.md`.

## Idempotence and Recovery

Movimentos de arquivos devem ser executados somente após confirmar que `backend/` está livre de arquivos de aplicação. Eles podem ser revertidos com `git mv` ou `Move-Item` para a raiz caso a reorganização seja interrompida. A geração de mockups pode ser repetida e escreve apenas sob a pasta do plano.

## Interfaces and Dependencies

O backend continua Java 21, Spring Boot, MySQL, Spring AI/Ollama e Python. O frontend adotará Expo, React Native, TypeScript e Expo Router. O frontend consumirá REST por HTTPS e será responsável por interface, armazenamento local de estado e experiência offline; o backend é responsável por dados persistentes, interpretação financeira e áudio.

Revision 2026-10-05: plano criado a partir do briefing do Fluxo e da decisão de transformar o repositório em monorepo.

Revision 2026-10-05: concluída a reorganização da API em `backend/`; o plano foi atualizado para refletir a estrutura criada.

Revision 2026-10-05: a direção visual passou a ser dark, corporativa e minimalista, guiada por referências visuais fornecidas pela pessoa usuária; nenhuma referência foi copiada para o repositório.

Revision 2026-10-05: o comando de mockups passou a carregar `.env` local automaticamente para reduzir erro de configuração em terminais novos.

Revision 2026-10-05: a pessoa usuária declarou autoria e autorizou reprodução visual fiel de uma referência enviada; o plano passou a permitir a cópia direta de sua linguagem visual, com conteúdo adaptado ao Fluxo.

Revision 2026-10-05: o aplicativo Expo foi criado e a primeira implementação visual foi concluída. A revisão por screenshot foi registrada como pendente devido à recusa de acesso ao localhost pelo navegador integrado.
