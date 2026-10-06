# Fluxo Mobile

Aplicativo React Native criado com Expo e TypeScript.

## Executar

    npm install
    npm start

No terminal do Expo, pressione `w` para abrir a versão web, `a` para Android ou leia o QR code pelo Expo Go em um celular.

## Conectar ao backend

Copie `.env.example` para `.env.local` e configure `EXPO_PUBLIC_API_URL`.
No iPhone físico, use o IPv4 do computador na mesma rede Wi-Fi, por exemplo
`http://192.168.0.10:8080` (não use `localhost`, que apontaria para o próprio iPhone).
Reinicie o Expo depois de alterar a variável. O backend deve estar acessível na porta 8080.

## Estado atual

Histórico e saldo geral consultam o backend; o texto de registro é enviado ao endpoint `/chat`. Se a API estiver indisponível, o app informa a falha e mostra estados vazios ou valores indisponíveis, sem preencher lançamentos ou valores de demonstração. O gráfico semanal e os totais por categoria são derivados dos lançamentos reais retornados pela API.

Gravação de áudio, transcrição, síntese de voz, gestão de contas financeiras e autenticação ainda não estão conectadas à interface. O backend atual também não possui edição/exclusão de lançamentos nem sincronização offline. Nenhuma alteração no backend é necessária para os fluxos já conectados.
