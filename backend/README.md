# Budgeting AI API 💰

![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring AI](https://img.shields.io/badge/Spring_AI-2.0-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Python](https://img.shields.io/badge/Python-Audio-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-IA_Local-black?style=for-the-badge)

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Fluxo principal](#fluxo-principal)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Como executar](#como-executar)
- [Endpoints](#endpoints)
- [Testes automatizados](#testes-automatizados)
- [Aprendizados](#aprendizados)
- [Créditos](#créditos)
- [Autor](#autor)

## Sobre o projeto

A **Budgeting AI API** é uma API inteligente de controle financeiro desenvolvida com Java, Spring Boot e Spring AI. O projeto foi criado como parte do desafio da **DIO**, no programa realizado em parceria com o **Santander**.

A aplicação recebe comandos financeiros em linguagem natural por texto ou áudio. A inteligência artificial interpreta a intenção da pessoa usuária, executa funções reais por meio de **Tool Calling** e registra ou consulta despesas armazenadas em um banco MySQL.

Exemplo:

```text
Gastei 25 reais no mercado, adiciona nas despesas para mim.
```

A IA identifica o valor, a descrição e a categoria `alimentacao`, chama a ferramenta financeira e registra a despesa no banco de dados.

> O Spring AI é utilizado no ChatClient e no Tool Calling. A transcrição e a síntese de voz são realizadas por integrações Python com Faster Whisper e Edge TTS.

## Fluxo principal

1. O cliente envia uma mensagem de texto ou um arquivo de áudio.
2. Quando necessário, o áudio é transcrito para texto.
3. O comando é enviado ao modelo de IA pelo Spring AI.
4. A IA identifica a intenção financeira.
5. Uma ferramenta da aplicação é chamada por Tool Calling.
6. A operação registra ou consulta informações no MySQL.
7. A resposta é devolvida em texto ou convertida em áudio.

## Funcionalidades

- Registro de despesas por linguagem natural.
- Inferência de categorias como alimentação, saúde e transporte.
- Consulta do total geral de despesas.
- Consulta de gastos por categoria, mês ou intervalo de datas.
- Soma de múltiplas categorias em um período.
- Transcrição de arquivos de áudio.
- Conversão de texto em áudio MP3.
- Fluxo completo de comando financeiro por voz.
- Persistência das transações no MySQL.
- Validação das entradas e tratamento de erros HTTP.
- Testes automatizados das regras financeiras.

## Tecnologias

- Java 21
- Spring Boot 4.1
- Spring Web, Spring Data JPA e Spring Validation
- Spring AI 2.0 e Ollama
- MySQL e Railway
- Maven e Lombok
- Python, Faster Whisper e Edge TTS
- JUnit, Mockito e AssertJ

## Arquitetura

```text
src/main/java/com/projeto/budgeting
├── controller   # Endpoints REST e tratamento de erros
├── dto          # Objetos de entrada e saída
├── model        # Entidades e tipos do domínio
├── repository   # Persistência com Spring Data JPA
├── services     # Regras de negócio e integrações
└── tools        # Funções disponibilizadas para Tool Calling

src/main/resources
└── prompts      # Personalidade e instruções do assistente

scripts
├── transcribe.py
├── speak.py
└── DATABASE.sql
```

## Como executar

### Pré-requisitos

- [Java 21](https://www.oracle.com/java/technologies/downloads/#java21)
- [Git](https://git-scm.com/)
- [Python 3](https://www.python.org/downloads/)
- [Ollama](https://ollama.com/)
- MySQL local ou uma instância no Railway

### Clonando o projeto

```bash
git clone https://github.com/Adryansouza/budgeting-ai-api.git
cd budgeting-ai-api
```

### Variáveis de ambiente

Use `src/main/resources/application-example.properties` como referência para criar `src/main/resources/application.properties`.

```text
MYSQLHOST=seu_host
MYSQLPORT=3306
MYSQLDATABASE=seu_banco
MYSQLUSER=seu_usuario
MYSQLPASSWORD=sua_senha
```

O `application.properties` real não deve ser enviado ao Git, pois pode conter credenciais.

### Banco de dados

Execute `scripts/DATABASE.sql` no MySQL para criar a tabela `transacoes`.

### Ollama

```bash
ollama pull qwen2.5:1.5b
```

Mantenha o Ollama em execução para utilizar `/chat` e `/audio-chat`.

### Ambiente Python

No Windows PowerShell:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

No Linux ou macOS:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
export PYTHON_EXECUTABLE=.venv/bin/python
```

Na primeira transcrição, o Faster Whisper baixa o modelo `small`. A geração de voz com Edge TTS precisa de conexão com a internet.

### Iniciando a aplicação

No Windows:

```powershell
mvnw.cmd spring-boot:run
```

No Linux ou macOS:

```bash
./mvnw spring-boot:run
```

A API estará disponível em `http://localhost:8080`.

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/chat` | Envia um comando textual para a IA |
| `POST` | `/transcriptions` | Transcreve um arquivo de áudio sem alterar o banco |
| `POST` | `/speech` | Converte um texto em arquivo MP3 |
| `POST` | `/audio-chat` | Executa o fluxo completo por áudio |

### POST `/chat`

REQUEST:

```json
{
  "message": "Gastei 25 reais no mercado"
}
```

RESPONSE:

```json
{
  "message": "Despesa registrada com sucesso: Mercado | Categoria: alimentacao | Valor: R$ 25"
}
```

### POST `/transcriptions`

Envie `multipart/form-data` com o arquivo no campo `audioMessage`.

```json
{
  "text": "Gastei 25 reais no mercado"
}
```

Esse endpoint somente transcreve o áudio. Ele não chama a IA nem modifica o banco.

### POST `/speech`

```json
{
  "text": "Despesa registrada com sucesso"
}
```

A resposta possui o tipo `audio/mpeg` e contém um arquivo MP3.

### POST `/audio-chat`

Envie `multipart/form-data` com o arquivo no campo `audioMessage`. O endpoint transcreve o áudio, envia o comando para a IA, executa a ferramenta financeira e devolve a resposta em MP3.

Headers retornados:

```text
X-Transcription
X-Assistant-Message
```

## Testes automatizados

```powershell
mvnw.cmd test
```

Em Linux ou macOS, execute `./mvnw test`.

Os testes cobrem o carregamento da aplicação, normalização das transações, consultas por período e validações das ferramentas financeiras. A integração com Ollama é opcional e pode ser habilitada com `OLLAMA_ENABLED=true`.

## Aprendizados

- Criação de APIs REST com Spring Boot.
- Integração de modelos de IA com Spring AI e Ollama.
- Uso do ChatClient e Tool Calling.
- Persistência com Spring Data JPA e MySQL.
- Processamento de áudio com Python.
- Validação de requisições e tratamento de erros.
- Organização de responsabilidades em camadas.
- Criação de testes automatizados.

## Créditos

Projeto desenvolvido como parte do desafio da **Digital Innovation One (DIO)**, no programa realizado em parceria com o **Santander**.

O projeto foi baseado nos conteúdos da trilha de Spring Boot e evoluído com implementações próprias de persistência, consultas financeiras, validações, áudio e testes.

- [Digital Innovation One](https://www.dio.me/)
- [Trilha de Spring Boot da DIO](https://github.com/digitalinnovationone/dio-spring-boot-learning-track)
- [Projeto de referência com Spring AI](https://github.com/digitalinnovationone/dio-spring-boot-learning-track/tree/main/05-spring-ai)
- [Modelo de README utilizado como referência](https://github.com/Fernanda-Kipper/Readme-Templates/blob/main/badges/backend.md)

## Autor

Desenvolvido por **Adryan Albuquerque**.

[![GitHub](https://img.shields.io/badge/GitHub-Adryansouza-181717?style=for-the-badge&logo=github)](https://github.com/Adryansouza)
