# Design System: Fluxo

O Fluxo é um aplicativo financeiro pessoal brasileiro para registrar gastos e receitas sem formulários demorados. Esta é a fonte de verdade visual do produto. A interface deve transmitir o padrão de um produto financeiro corporativo premium, sem parecer uma planilha, um banco copiado ou um produto de inteligência artificial.

If the product evolves, update this document when the visual language changes in a durable way. Do not try to catalog every one-off screen detail.

## 1. Visual Theme & Atmosphere

O tom é sóbrio, corporativo, minimalista e confiante. A experiência é prioritariamente escura: azul-marinho quase preto, superfícies em camadas sutis e contraste alto para valores financeiros. A primeira leitura da tela deve mostrar somente o saldo e uma forma direta de registrar algo. Uma tela inicial não deve tentar resumir a vida financeira inteira; cada seção posterior existe apenas quando a pessoa precisa dela.

O verde-limão é uma assinatura pequena e deliberada: ação primária, seleção e confirmação positiva. Nunca ocupa o fundo completo da tela, nem concorre com os valores. O vermelho é reservado exclusivamente para despesas, erros e alertas. A composição privilegia blocos amplos, cantos arredondados, tipografia numérica expressiva e poucas divisórias.

O Fluxo nunca usa robôs, cérebros, circuitos, varinhas, brilhos, estrelas, balões de IA ou linguagem que exponha a tecnologia por trás do registro. O produto é orientado ao fluxo de vida financeira da pessoa, não à conversa com uma IA.

Cover the following:
- The overall mood and tone.
- Whether the interface should feel dense, airy, editorial, playful, utilitarian, luxurious, technical, calm, etc.
- What should stand out first when a user lands on the product.
- What the interface should never feel like.

Prompting questions:
- What should a first-time user feel within five seconds?
- Is the product image-first, data-first, form-first, or workflow-first?
- Does the design rely on restraint, bold contrast, ornament, or motion?

## 2. Color Palette & Roles

List colors by descriptive name, exact value, and functional role.

### Foundation
- **Noite executiva** (`#090E1A`) - Fundo principal de todas as telas.
- **Grafite elevado** (`#151C2B`) - Cartões e superfícies interativas.
- **Grafite discreto** (`#20293A`) - Campos, abas e superfícies secundárias.

### Accent & Interactive
- **Lima Fluxo** (`#C7FA4B`) - Ação primária, seleção, foco e sinal positivo. Usar com moderação.
- **Verde ganho** (`#72D89A`) - Receita e indicadores positivos, sem substituir a Lima Fluxo como ação.

### Typography & Structure
- **Branco névoa** (`#F5F7FB`) - Texto principal e valores.
- **Cinza aço** (`#98A4B5`) - Metadados e texto secundário.
- **Contorno profundo** (`#2A3447`) - Bordas finas e divisores.

### Functional States
- **Sucesso** (`#C7FA4B`) - Confirmações e ações concluídas.
- **Despesa suave** (`#FF7D8D`) - Despesas, erros e alertas críticos.
- **Aviso** (`#E6B85C`) - Atenção sem urgência.
- **Informação** (`#8AB4F8`) - Sincronização e estados neutros.

Guidance:
- Name colors by character and job, not only hue.
- Explain where each color belongs and where it should not be used.
- If gradients are part of the system, describe their direction, intensity, and purpose.

## 3. Typography Rules

Document the typography system in terms a designer or prompting agent can reuse.

Include:
- Primary font family and any secondary or monospace families.
- Tone of the typeface choices.
- Weight and size rules for display text, headings, body text, labels, captions, and buttons.
- Letter-spacing, line-height, and casing conventions.
- Any constraints, such as "never use all caps for body copy" or "numbers should align cleanly in tables".

- **Primary font family:** Inter ou equivalente sans-serif geométrica disponível em Android e iOS.
- **Secondary font family:** nenhuma.
- **Display text:** 34–40 px, semibold, tabular numbers; saldo e valores-chave.
- **Headings:** 20–24 px, semibold; títulos de tela sem frases promocionais.
- **Body text:** 15–16 px, regular; frases curtas e conteúdo principal.
- **Labels / metadata:** 12–13 px, medium; tom Cinza aço, nunca em caixa alta contínua.
- Valores monetários devem preservar alinhamento e leitura imediata.

## 4. Component Stylings

Describe recurring component patterns in human-readable, reusable terms.

### Buttons
- Shape: cápsula ou retângulo de raio 16 px; alvo mínimo de 48 px.
- Primary style: Lima Fluxo com texto Noite executiva, usada somente para a próxima ação principal.
- Secondary style: Grafite elevado com contorno profundo e texto Branco névoa.
- Hover e pressed: reduzir discretamente luminosidade e escala; sem brilho ou sombra colorida.
- Focus treatment: anel Lima Fluxo de 2 px com contraste alto.
- Disabled treatment: Grafite discreto e texto Cinza aço.

### Cards / Containers
- Corner treatment: 20–24 px em blocos principais; 14–16 px em itens de lista.
- Background treatment: Grafite elevado, com cartões apenas quando agruparem informação ou ação útil.
- Border and shadow strategy: borda de 1 px em Contorno profundo; sombra quase imperceptível.
- Internal padding: 20–24 px em blocos principais; ritmo baseado em 8 px.
- A tela inicial tem apenas um cartão dominante de saldo; registros recentes podem ser linhas sem card individual.

### Inputs / Forms
- Campo de registro: superfície Grafite discreto, uma linha de texto e ação de microfone circular; sem campos visíveis em excesso.
- Formulários de autenticação: um campo por linha, rótulo curto acima, nunca mais de uma ação primária por tela.
- Erro: texto Despesa suave abaixo do campo e borda da mesma cor, sem modal agressivo.
- Espaçamento: 16 px entre controles e 24 px entre blocos.

### Navigation
- Navegação inferior fixa, escura e minimalista: Início, Histórico, Resumo e Perfil.
- O registro é uma ação central circular ou em cápsula com Lima Fluxo, separada dos itens de navegação.
- Estado ativo: ícone e rótulo em Lima Fluxo; inativo em Cinza aço. Não usar cinco ou mais itens.

### Data Display or Domain-Specific Components

### Componentes financeiros

- **Saldo:** bloco dominante, grande valor em Branco névoa e variação menor logo abaixo. Deve caber sem rolagem na primeira dobra.
- **Registro rápido:** aparece imediatamente abaixo do saldo; recebe linguagem natural e abre gravação em uma folha inferior, não em uma tela pesada.
- **Lançamentos recentes:** no máximo três linhas na inicial, com descrição, horário/categoria e valor. Receita em Verde ganho e despesa em Despesa suave.
- **Resumo:** gráficos somente na tela Resumo; usar um gráfico de rosca ou linha simples e nunca diversos gráficos concorrentes.
- Tables
- Charts
- Editors
- Sidebars
- Media galleries
- Search results
- Pricing cards
- Timelines

For each one, describe:
- Its job in the interface.
- Its visual hierarchy.
- Its default and interactive states.
- Any rules that should stay stable across screens.

## 5. Layout Principles

O layout mobile é de uma coluna com margens de 20 px e blocos separados por 24–32 px. A primeira dobra prioriza saldo, registro rápido e até três lançamentos. Histórico, filtros, categorias e análises ficam em telas dedicadas. O web é uma adaptação responsiva do app, não um dashboard corporativo lotado.

Cover:
- Maximum content widths.
- Grid strategy.
- Spacing scale or base unit.
- Section-to-section rhythm.
- Mobile, tablet, and desktop behavior.
- How the design handles empty space.
- How visual emphasis should be distributed across a screen.

Template prompts:
- What is the default page frame and padding?
- How many columns does the layout typically use?
- What collapses or stacks first on smaller screens?
- Should pages feel centered, edge-to-edge, dashboard-like, editorial, or app-like?

## 6. Motion & Interaction Notes

Movimento é breve e utilitário: 160–220 ms para entrada de folhas, confirmação de lançamento e seleção da navegação. Gravação de voz pode usar barras ou onda minimalista; não usar animações decorativas. Estados vazios usam texto conciso e ícone linear simples.

Include:
- Transition style and duration ranges.
- Whether motion should feel crisp, soft, playful, or restrained.
- Loading, skeleton, and empty-state behavior.
- Rules for hover, focus, drag, selection, expansion, and page transitions.

If motion is intentionally minimal, say that explicitly.

## 7. Professional UI/UX Review Pass

Any ExecPlan that creates, changes, or can indirectly affect a browser UI,
Electron UI, rendered documentation surface, empty/loading/error state, layout,
copy, navigation, or frontend data presentation must include a final UI/UX
review pass before the work is called complete. This pass is not a casual visual
check. Judge the result against UX-professional-grade standards: the interface
should look intentional, support the user's real workflow, communicate hierarchy
clearly, behave predictably across states, and avoid rough edges that a product
designer or frontend lead would send back for revision.

The review must inspect screenshots or recordings captured after
implementation, and it should compare them to before evidence when the ExecPlan
changed an existing surface. The ExecPlan should make visual evidence capture
explicit by listing baseline screenshot capture before implementation,
matching after-implementation screenshot capture, and a screenshot UX review
using `.agents/skills/review-ui-screenshots/SKILL.md` before final acceptance
as separate execution steps. Cover desktop and mobile viewports, plus tablet or
narrow-desktop widths when layout behavior changes at intermediate sizes.
Inspect each screenshot section by section rather than judging the whole image
at a glance: headers, navigation, sidebars, dense panels, forms, buttons,
modals, tables, cards, canvas HUDs, selected-object menus, and footer regions
all need local attention. Look for interaction and presentation issues
including:

- unclear primary actions or weak visual hierarchy
- cramped, drifting, or inconsistent spacing
- text overflow, clipped controls, awkward wrapping, or illegible type
- inaccessible contrast, missing focus states, undersized touch targets, or
  keyboard-hostile flows
- confusing empty, loading, disabled, validation, and error states
- inconsistent component styling, icon use, copy tone, or affordances
- layout breakage at responsive boundaries
- unnecessary friction in the main workflow, including extra clicks, unclear
  recovery paths, or state changes that surprise the user

Make in-scope corrections immediately. If a remaining issue needs a product,
design, or technical decision outside the current ExecPlan, document it in the
ExecPlan's `Outcomes & Retrospective` section with the evidence path and the
reason it was deferred. The final review note should name the evidence paths,
viewports, interaction states, findings, fixes, and deferred concerns. If no
runnable visual target exists, state that the professional UI/UX pass is not
applicable and explain what validation replaced it.

## 8. Pre-Implementation UI Mockups

For substantial UI additions, UI refactors, major responsive/layout changes, or
new design directions, use `.agents/skills/ui-mockups/SKILL.md` during planning
before implementation begins. This workflow creates several Google
Stitch-backed mockup options under `plans/<plan-stem>/mockups/` so the user can
choose a direction before UI code is written. Open the generated
`index.html` preview page from the command's printed `file://` link to compare
the options in a browser before presenting a recommendation.

When a supplied sample is available, treat it as a style reference by default.
The sample may be a local image or a local Google Stitch export bundle with PNG
and HTML/CSS artifacts. Copy approved samples into
`plans/<plan-stem>/mockups/reference/` only after confirming they contain no
secrets or restricted third-party material. Use the sample to preserve design
language: palette, typography, spacing rhythm, density, corner radius, shadows,
icon feel, and component treatment. Do not copy the sample's layout or content
unless the user explicitly requests that.

The selected mockup direction should be recorded in the ExecPlan before
implementation starts. This does not replace the professional UI/UX review pass
above. After implementation, still capture before/after screenshots and review
the rendered result with `.agents/skills/review-ui-screenshots/SKILL.md` when a
runnable visual target exists.

## 9. Prompting Notes

Capture short phrases that future contributors can reuse when asking an AI tool to extend the interface.

### Reusable Descriptions
- "Aplicativo financeiro corporativo, dark premium e silencioso, com foco absoluto no saldo."
- "Ação principal em verde-limão controlado sobre superfícies azul-marinho profundas."
- "Uma coluna arejada, poucos blocos e apenas informação necessária à decisão atual."

### Good Prompt Patterns
- "Create a [screen/component] that matches the existing [atmosphere] and uses [primary color name] for primary actions."
- "Keep the layout [descriptor] with [spacing descriptor] and [component descriptor]."

### Anti-Patterns
- Evitar painéis claros, grades densas de cartões e múltiplos resumos concorrentes.
- Evitar verde-limão como fundo dominante, gradientes chamativos e sombras pesadas.
- Evitar estética de IA, ilustrações genéricas e qualquer marca ou layout copiado das referências.

## 10. Open Questions

Track unresolved design decisions that are stable enough to deserve visibility but not yet settled.

- O primeiro lançamento será realizado sem autenticação enquanto o backend não tiver usuários?
- A sincronização offline será implementada no primeiro ciclo do app ou preparada visualmente para uma etapa posterior?
