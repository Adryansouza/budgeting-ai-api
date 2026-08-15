# 💰 Budgeting AI API

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1-brightgreen)
![Spring AI](https://img.shields.io/badge/Spring%20AI-2.0-green)
![MySQL](https://img.shields.io/badge/MySQL-Database-blue)
![Python](https://img.shields.io/badge/Python-Audio-yellow)
![Projeto educacional](https://img.shields.io/badge/projeto-educacional-lightgrey)

## 📖 Descrição do projeto

API inteligente de controle financeiro desenvolvida com **Java, Spring Boot e Spring AI**, como parte do desafio de projeto da **Digital Innovation One (DIO)**, no programa realizado em parceria com o **Santander**.

A aplicação permite registrar e consultar despesas usando comandos em linguagem natural enviados por texto ou áudio. A inteligência artificial interpreta a solicitação, executa operações reais por meio de **Tool Calling** e armazena as transações em um banco de dados MySQL.

Na prática, a API conecta recursos de IA a funções reais da aplicação, preservando a separação de responsabilidades entre controllers, serviços, ferramentas financeiras e persistência.

Exemplo de uso:

```text
Gastei 25 reais hoje no mercado, adiciona nas despesas pra mim.
```

A aplicacao interpreta o comando, identifica que se trata de uma despesa, infere a categoria `alimentacao` e registra a transacao no banco de dados.

## 🎯 Sobre o desafio

O objetivo principal e demonstrar como integrar recursos de Inteligencia Artificial a uma aplicacao Java real, mantendo uma arquitetura organizada e pronta para evolucao.

O fluxo principal da API e:

1. Receber uma mensagem de texto ou arquivo de audio.
2. Transformar audio em texto, quando necessario.
3. Enviar o texto para um modelo de IA usando Spring AI.
4. Interpretar a intencao do comando financeiro.
5. Executar uma funcao real da aplicacao usando Tool Calling.
6. Criar ou consultar transacoes financeiras.
7. Retornar uma resposta final para a pessoa usuaria.

## 🚀 Minha evolução no projeto

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

> O Spring AI e usado no ChatClient e no Tool Calling. Nesta versao, a transcricao e a sintese de voz sao feitas por integracoes Python com Faster Whisper e Edge TTS, como uma evolucao propria do projeto base.

## 🛠️ Tecnologias utilizadas

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

## 🏗️ Arquitetura do projeto

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

## 🗄️ Estrutura do banco de dados

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

## 🔌 Endpoints da API

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
  "text": "gastei 25 reais no mercado"
}
```

Este endpoint apenas transcreve o arquivo. Ele nao envia a mensagem para a IA nem altera o banco de dados.

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

## 💬 Exemplos de comandos aceitos

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

## ▶️ Como executar o projeto

### 1. Clonar o repositorio

```bash
git clone https://github.com/Adryansouza/budgeting-ai-api.git
cd budgeting-ai-api
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

Copie esse arquivo como `src/main/resources/application.properties`. O arquivo real fica fora do Git para evitar o vazamento de credenciais.

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

Mantenha o Ollama em execucao enquanto estiver usando os endpoints `/chat` e `/audio-chat`.

### 5. Preparar o ambiente Python

O Python e usado na transcricao e na geracao de voz.

No Windows (PowerShell):

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Em Linux ou macOS:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
export PYTHON_EXECUTABLE=.venv/bin/python
```

Na primeira transcricao, o Faster Whisper baixa o modelo `small`. A geracao de voz com Edge TTS precisa de conexao com a internet.

### 6. Executar a aplicacao

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

## 🧪 Como testar no Insomnia

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

### Teste do fluxo completo por audio

Crie uma requisicao `POST` para:

```text
http://localhost:8080/audio-chat
```

Use `multipart/form-data`, com o arquivo no campo `audioMessage`. A resposta sera um MP3 e os headers `X-Transcription` e `X-Assistant-Message` mostrarao a transcricao e a resposta da IA.

### Testes automatizados

No Windows:

```powershell
mvnw.cmd test
```

Em Linux ou macOS:

```bash
./mvnw test
```

Os testes automatizados cobrem o carregamento da aplicacao, a normalizacao das transacoes, consultas por periodo e validacoes das ferramentas financeiras. O teste de integracao com Ollama e opcional e pode ser habilitado com `OLLAMA_ENABLED=true`.

## 🎓 Aprendizados

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

## ✅ Conclusão

Este projeto demonstra uma aplicacao pratica de Inteligencia Artificial integrada a uma API Java. Mais do que apenas conversar com um modelo, a aplicacao executa acoes reais, registra dados financeiros, consulta informacoes persistidas e permite interacao por texto e audio.

A evolucao implementada mostra como uma API simples pode se tornar um assistente financeiro inteligente, mantendo uma base organizada para futuras melhorias, como autenticacao, controle por usuario, dashboards, metas financeiras e categorias personalizadas.

## 📚 Créditos

Projeto desenvolvido como parte do desafio da **Digital Innovation One (DIO)**, no programa realizado em parceria com o **Santander**.

O projeto foi baseado nos conteúdos apresentados na trilha de Spring Boot e evoluído com implementações próprias relacionadas a consultas financeiras, persistência, validações, processamento de áudio e testes automatizados.

- [Digital Innovation One](https://www.dio.me/)
- [Repositório da trilha Spring Boot](https://github.com/digitalinnovationone/dio-spring-boot-learning-track)
- [Projeto de referência com Spring AI](https://github.com/digitalinnovationone/dio-spring-boot-learning-track/tree/main/05-spring-ai)

## 👨‍💻 Autor

Desenvolvido por **Adryan Albuquerque**.

- [GitHub — Adryansouza](https://github.com/Adryansouza)
