# Guia do projeto Fluxo

Este projeto e o backend do aplicativo financeiro. Ele recebe mensagens por texto ou audio, entende pedidos financeiros e salva os lancamentos no MySQL.

## O que ele faz hoje

- Registra despesas por texto, por exemplo: `Paguei 35 reais no Uber`.
- Classifica despesas simples, por exemplo Uber como transporte.
- Lista despesas e calcula totais por categoria, mes ou periodo.
- Transcreve audio e pode responder em MP3.
- Salva os dados na tabela `transacoes` do MySQL.

## O que ainda nao faz

- Cadastro e login de usuarios.
- Separar lancamentos por pessoa.
- Registrar receitas, saldo mensal ou dashboard.
- Editar e excluir lancamentos pela API.

## Caminho de uma mensagem

```text
Insomnia ou aplicativo
        ↓
POST /chat
        ↓
ControladorConversa
        ↓
ServicoConversa
        ↓
FerramentasFinanceiras
        ↓
ServicoLancamento
        ↓
RepositorioLancamento
        ↓
MySQL: tabela transacoes
```

Exemplo: `Paguei 35 reais no Uber`.

1. O controlador recebe o JSON.
2. O servico de conversa envia a frase para o modelo de IA.
3. A IA chama `registrarDespesas`.
4. As ferramentas financeiras validam os dados.
5. O servico de lancamento salva `Uber`, `35.00` e `transporte` no banco.
6. A API devolve uma mensagem de confirmacao.

## Pastas principais

| Pasta | Significado simples |
| --- | --- |
| `controller` | Portas de entrada da API, como `/chat`. |
| `services` | Regras do projeto e integracoes. |
| `tools` | Acoes que a IA pode executar. |
| `repository` | Consultas e gravacao no banco. |
| `model` | Formato dos dados que viram tabelas no banco. |
| `dto` | Formato do JSON recebido e devolvido. |
| `resources/prompts` | Instrucoes para a IA. |
| `scripts` | Scripts Python para transcricao e voz. |

Os nomes `controller`, `service`, `repository` e `dto` foram mantidos porque sao padroes do Spring Boot. Os nomes financeiros dentro deles foram traduzidos.

## Arquivos financeiros importantes

| Arquivo | Responsabilidade |
| --- | --- |
| `model/Lancamento.java` | Representa uma linha da tabela `transacoes`. |
| `model/TipoLancamento.java` | Define se o lancamento e `DESPESA` ou `RECEITA`. |
| `repository/RepositorioLancamento.java` | Busca e soma os lancamentos no MySQL. |
| `services/ServicoLancamento.java` | Regras para registrar, listar e calcular despesas. |
| `tools/FerramentasFinanceiras.java` | Funcoes que a IA usa para registrar e consultar. |
| `services/ChatService.java` | Conversa com o modelo do Ollama. |

## Rotas atuais

| Metodo | Rota | Uso |
| --- | --- | --- |
| `POST` | `/chat` | Envia um texto para o assistente financeiro. |
| `POST` | `/transcriptions` | Transcreve um arquivo de audio. |
| `POST` | `/speech` | Converte texto em MP3. |
| `POST` | `/audio-chat` | Audio completo: transcreve, processa e responde em MP3. |

## Como iniciar localmente

1. Preencha o arquivo `.env` com os dados do MySQL e `OLLAMA_MODEL`.
2. Inicie o Ollama com `ollama serve`.
3. Rode `mvnw.cmd spring-boot:run`.
4. Teste `POST http://localhost:8080/chat` com:

```json
{
  "message": "Paguei 35 reais no Uber"
}
```

## Proximo passo recomendado

Criar `Usuario`, cadastro e login. Depois, vincular cada `Lancamento` ao usuario logado. So entao vale adicionar receitas, saldo e as telas do aplicativo.
