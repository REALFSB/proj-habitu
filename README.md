# 🌿 Habitu

App mobile de controle de hábitos diários, feito com React Native + Expo.

## 📱 Funcionalidades

- Tela de boas-vindas e login/cadastro com e-mail e senha (Firebase Authentication)
- Criar hábitos (salvos na nuvem, por usuário, no Cloud Firestore)
- Marcar/desmarcar um hábito como concluído **hoje**
- Sequência (streak) de dias consecutivos de cada hábito
- Excluir hábitos junto com o histórico (segurando o item)
- Puxar a lista para baixo para atualizar
- **Dashboard** com a taxa de conclusão (7, 30 ou 90 dias), comparação com o período anterior, total de conclusões, dias perfeitos, sequência atual e melhor sequência
- Perfil com os dados da conta e botão **Sair**

> Os hábitos persistem na conta do usuário. Já o login ainda não persiste: ao recarregar o app, é preciso entrar de novo.

## 🔥 Configuração do Firebase

O login usa a API REST do Firebase Authentication (sem SDK).

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com).
2. Em **Authentication > Método de login**, ative **E-mail/senha**.
3. Em **Configurações do projeto > Seus apps > Web**, copie `apiKey` e `projectId` para `src/config/firebase.js`.
4. Em **Firestore Database**, crie o banco e use estas regras (cada usuário só acessa os próprios dados):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

## 🗄️ Modelo de dados (Firestore)

```
users/{uid}/habits/{habitId}                  → { name }
users/{uid}/completions/{AAAA-MM-DD_habitId}  → { habitId, date, completedAt }
```

O ID da conclusão é *data + hábito*, garantindo no máximo um registro por hábito por dia. "Concluído hoje" e "sequência" são calculados a partir desse histórico (`src/utils/habitStats.js`).

O acesso ao Firestore é feito pela API REST, em `src/services/` (`firestoreClient.js` e `habitsService.js`), sem o SDK do Firebase.

## 📊 Como o dashboard calcula

- **Esperado:** para cada dia do período, quantos hábitos já existiam naquela data. Um hábito novo não penaliza os dias anteriores à sua criação.
- **Taxa de conclusão:** conclusões ÷ esperado. A tendência compara com o período imediatamente anterior, de mesmo tamanho (em pontos percentuais).
- **Dia perfeito:** todos os hábitos ativos do dia foram concluídos.

As regras ficam em `src/utils/metrics.js`, separadas das telas.

## 🚀 Como executar

```bash
npm install
npx expo start
```

Depois, abra no Expo Go (celular) ou em um emulador.

## ⚠️ Limitações

- A lista não atualiza em tempo real (recarrega ao abrir, ao criar e ao puxar para atualizar).
- O login não persiste ao recarregar o app.
