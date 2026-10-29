# 🌿 Habitu

App mobile de controle de hábitos diários, feito com React Native + Expo.

## 📱 Funcionalidades

- Tela de boas-vindas e login/cadastro com e-mail e senha (Firebase Authentication)
- Criar hábitos
- Marcar/desmarcar um hábito como concluído **hoje**
- Sequência (streak) de dias consecutivos de cada hábito
- Excluir hábitos junto com o histórico (segurando o item)

> Nesta versão os hábitos e a sessão ficam apenas em memória: ao recarregar o app, tudo é perdido.
> Ainda não há botão para sair da conta.

## 🗂️ Como funciona o histórico

Cada conclusão é guardada com a data (`AAAA-MM-DD`) e o ID dela é *data + hábito*, garantindo no máximo um registro por hábito por dia. "Concluído hoje" e "sequência" são calculados a partir desse histórico (`src/utils/habitStats.js`).

## 🔥 Configuração do Firebase

O login usa a API REST do Firebase Authentication (sem SDK).

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com).
2. Em **Authentication > Método de login**, ative **E-mail/senha**.
3. Em **Configurações do projeto > Seus apps > Web**, copie `apiKey` e `projectId` para `src/config/firebase.js`.

## 🚀 Como executar

```bash
npm install
npx expo start
```

Depois, abra no Expo Go (celular) ou em um emulador.
