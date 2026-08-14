# API Inteligente de Controle Financeiro com Spring Boot e Spring AI

## Descricao do Projeto

Este projeto foi desenvolvido como parte do desafio de projeto da trilha de Spring Boot com Inteligencia Artificial da Digital Innovation One (DIO) em parceria com o Santander.

A proposta do desafio é criar uma API de orcamento inteligente utilizando Spring Boot, Spring AI e recursos de audio. A aplicacao permite que uma pessoa usuaria registre e consulte transacoes financeiras por meio de comandos em linguagem natural, conectando uma inteligencia artificial a funcoes reais do sistema.

Na pratica, a API consegue receber mensagens por texto ou audio, interpretar a intencao da pessoa usuaria, executar operacoes financeiras e salvar os dados em um banco MySQL hospedado no Railway.

Exemplo de uso:

```text
Gastei 25 reais hoje no mercado, adiciona nas despesas pra mim.
```

A aplicacao interpreta o comando, identifica que se trata de uma despesa, infere a categoria `alimentacao` e registra a transacao no banco de dados.

## Objetivo do Desafio

O objetivo principal e demonstrar como integrar recursos de Inteligencia Artificial a uma aplicacao Java real, mantendo uma arquitetura organizada e pronta para evolucao.

O fluxo principal da API e:

1. Receber uma mensagem de texto ou arquivo de audio.
2. Transformar audio em texto, quando necessario.
3. Enviar o texto para um modelo de IA usando Spring AI.
4. Interpretar a intencao do comando financeiro.
5. Executar uma funcao real da aplicacao usando Tool Calling.
6. Criar ou consultar transacoes financeiras.
7. Retornar uma resposta final para a pessoa usuaria.

## Minha Evolucao no Projeto

Alem da base proposta no desafio, implementei melhorias para deixar a API mais completa e mais proxima de um uso real.

Principais evolucoes:

- Persistencia de transacoes financeiras em banco MySQL no Railway.
- Criacao da tabela `transacoes` com nomes em portugues.
- Registro automatico de despesas a partir de frases naturais.
- Inferencia simples de categorias, como `mercado` para `alimentacao` e `uber` para `transporte`.
- Consultas de total geral de despesas.
- Consultas de total por categoria.
- Consultas de gastos do mes atual.
- Consultas por periodo.
- Soma de varias categorias no mesmo periodo.
- Endpoints REST para texto, transcricao de audio, geracao de audio e fluxo completo de audio com IA.
- Uso de scripts Python para transcricao e geracao de fala.

## Tecnologias Utilizadas

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring AI
- Ollama
- MySQL
- Railway
- Maven
- Lombok
- Python
- Faster Whisper
- Insomnia para testes de API

## Arquitetura do Projeto

A aplicacao foi organizada em camadas para separar responsabilidades:

```text
controller  -> recebe as requisicoes HTTP
dto         -> representa os dados de entrada e saida da API
model       -> representa as entidades persistidas no banco
repository  -> faz a comunicacao com o banco de dados
services    -> concentra as regras de negocio
tools       -> expoe funcoes reais para a IA usar com Tool Calling
resources   -> contem configuracoes e prompt do assistente financeiro
scripts     -> contem scripts auxiliares de audio e banco de dados
```

## Estrutura do Banco de Dados

O banco foi estruturado com nomes em portugues para facilitar o entendimento do projeto.

Tabela principal: `transacoes`

```sql
CREATE TABLE IF NOT EXISTS transacoes (
    id BIGINT NOT NULL AUTO_INCREMENT,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    tipo ENUM('DESPESA', 'RECEITA') NOT NULL DEFAULT 'DESPESA',
    categoria VARCHAR(255) NOT NULL,
    data_ocorrencia DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    data_criacao DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id)
);
```

O mesmo comando tambem esta disponivel em:

```text
scripts/DATABASE.sql
```

### Campos da Tabela

| Campo | Descricao |
| --- | --- |
| `id` | Identificador unico da transacao |
| `descricao` | Descricao curta da despesa ou receita |
| `valor` | Valor financeiro da transacao |
| `tipo` | Tipo da transacao: `DESPESA` ou `RECEITA` |
| `categoria` | Categoria financeira, como `alimentacao`, `transporte` ou `lazer` |
| `data_ocorrencia` | Data em que a transacao aconteceu |
| `data_criacao` | Data em que o registro foi criado no sistema |

## Endpoints da API

### 1. Conversa por Texto

```http
POST /chat
```

Envia uma mensagem de texto para o assistente financeiro.

Exemplo de body:

```json
{
  "message": "Gastei 25 reais hoje no mercado"
}
```

Exemplo de resposta:

```json
{
  "message": "Despesa registrada com sucesso: Mercado | Categoria: alimentacao | Valor: R$ 25"
}
```

### 2. Transcricao de Audio

```http
POST /transcriptions
```

Recebe um arquivo de audio e retorna o texto transcrito.

Tipo de body:

```text
multipart/form-data
```

Campo esperado:

```text
audioMessage
```

Exemplo de resposta:

```json
{
  "transcription": "gastei 25 reais no mercado",
  "message": "gastei 25 reais no mercado"
}
```

### 3. Geracao de Audio

```http
POST /speech
```

Recebe um texto e retorna um arquivo de audio no formato MP3.

Exemplo de body:

```json
{
  "text": "Despesa registrada com sucesso"
}
```

Resposta:

```text
audio/mpeg
```

### 4. Fluxo Completo por Audio

```http
POST /audio-chat
```

Recebe um audio, transcreve a mensagem, envia o texto para o assistente financeiro, executa a acao necessaria e retorna uma resposta em audio.

Tipo de body:

```text
multipart/form-data
```

Campo esperado:

```text
audioMessage
```

Resposta:

```text
audio/mpeg
```

A resposta tambem inclui os headers:

```text
X-Transcription
X-Assistant-Message
```

## Exemplos de Comandos Aceitos

Registro de despesa:

```text
Gastei 80 reais na farmacia.
Paguei 35 no uber.
Fui no mercado e deixei 120 reais.
Comprei uma pizza e deu 45 reais.
```

Consultas financeiras:

```text
Quanto gastei no total?
Qual meu gasto desse mes com lazer?
Quanto gastei com alimentacao?
Soma lazer com alimentacao este mes.
Quanto gastei entre 2026-08-01 e 2026-08-31?
```

## Como Executar o Projeto

### 1. Clonar o repositorio

```bash
git clone <url-do-repositorio>
cd ProjetoIA
```

### 2. Configurar o banco de dados

Crie um banco MySQL no Railway e configure as variaveis de ambiente:

```text
MYSQLHOST
MYSQLPORT
MYSQLDATABASE
MYSQLUSER
MYSQLPASSWORD
```

O arquivo de exemplo da aplicacao fica em:

```text
src/main/resources/application-example.properties
```

### 3. Criar a tabela no Railway

Execute o SQL disponivel em:

```text
scripts/DATABASE.sql
```

Ou use diretamente:

```sql
CREATE TABLE IF NOT EXISTS transacoes (
    id BIGINT NOT NULL AUTO_INCREMENT,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    tipo ENUM('DESPESA', 'RECEITA') NOT NULL DEFAULT 'DESPESA',
    categoria VARCHAR(255) NOT NULL,
    data_ocorrencia DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    data_criacao DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id)
);
```

### 4. Subir o Ollama

O projeto usa o Ollama como modelo local de IA.

Exemplo de modelo configurado:

```text
qwen2.5:1.5b
```

Comando para baixar o modelo:

```bash
ollama pull qwen2.5:1.5b
```

### 5. Executar a aplicacao

No Windows:

```bash
mvnw.cmd spring-boot:run
```

Em Linux ou macOS:

```bash
./mvnw spring-boot:run
```

A API ficara disponivel em:

```text
http://localhost:8080
```

## Como Testar no Insomnia

### Teste de registro por texto

Metodo:

```text
POST
```

URL:

```text
http://localhost:8080/chat
```

Body JSON:

```json
{
  "message": "Gastei 25 reais hoje no mercado, adiciona nas despesas pra mim"
}
```

### Teste de transcricao de audio

Metodo:

```text
POST
```

URL:

```text
http://localhost:8080/transcriptions
```

Body:

```text
multipart/form-data
```

Campo:

```text
audioMessage
```

### Teste de texto para audio

Metodo:

```text
POST
```

URL:

```text
http://localhost:8080/speech
```

Body JSON:

```json
{
  "text": "Despesa registrada com sucesso"
}
```

## Aprendizados

Durante o desenvolvimento deste projeto, pratiquei conceitos importantes de desenvolvimento backend com Java e Spring Boot.

Os principais aprendizados foram:

- Como estruturar uma API REST com Spring Boot.
- Como integrar uma aplicacao Java com um modelo de IA usando Spring AI.
- Como usar ChatClient para enviar mensagens ao modelo.
- Como expor funcoes reais da aplicacao para a IA por meio de Tool Calling.
- Como persistir dados financeiros em MySQL usando Spring Data JPA.
- Como conectar a aplicacao a um banco hospedado no Railway.
- Como trabalhar com transcricao de audio e geracao de voz.
- Como organizar responsabilidades entre controller, service, repository, model e DTO.
- Como documentar uma API para facilitar testes e avaliacao.

## Conclusao

Este projeto demonstra uma aplicacao pratica de Inteligencia Artificial integrada a uma API Java. Mais do que apenas conversar com um modelo, a aplicacao executa acoes reais, registra dados financeiros, consulta informacoes persistidas e permite interacao por texto e audio.

A evolucao implementada mostra como uma API simples pode se tornar um assistente financeiro inteligente, mantendo uma base organizada para futuras melhorias, como autenticacao, controle por usuario, dashboards, metas financeiras e categorias personalizadas.
