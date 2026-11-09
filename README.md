# 🌿 Habitu

App mobile de controle de hábitos diários (React Native + Expo) com **Firebase Authentication** e **Cloud Firestore**, acessados via API REST (sem o SDK do Firebase), o que permite rodar também no [Snack](https://snack.expo.dev).

## 📱 Funcionalidades

- Cadastro e login com e-mail e senha
- Criar hábitos, salvos na nuvem por usuário
- Marcar/desmarcar um hábito como concluído **hoje**
- Sequência (streak) de dias consecutivos de cada hábito
- Excluir hábitos junto com o histórico (segurando o item)
- Puxar a lista para baixo para atualizar
- **Dashboard** com análises por período (7, 30 ou 90 dias):
  - taxa de conclusão e comparação com o período anterior
  - total de conclusões, dias perfeitos, sequência atual e melhor sequência
  - insights em texto (hábito mais consistente, melhor e pior dia da semana, tendência)
  - calendário de atividade (mapa de calor), desempenho por dia da semana e ranking de hábitos
  - histórico por data, com os hábitos concluídos em cada dia
- Perfil com os dados da conta e botão **Sair**

## 🗂️ Arquitetura

```
App.js                      # Ponto de entrada: só monta os providers e a navegação
src/
├── config/
│   └── firebase.js         # Credenciais e URL base do Firebase
├── theme/
│   └── index.js            # Cores e estilos compartilhados
├── utils/                  # Regras de negócio (sem React)
│   ├── dates.js            # Chave de data AAAA-MM-DD, "Hoje/Ontem"
│   ├── habitStats.js       # Sequência (streak), "feito hoje", agrupamento por data
│   └── metrics.js          # Métricas do dashboard (taxa, ranking, dias da semana, insights)
├── services/               # Camada de acesso a dados (sem React)
│   ├── authService.js      # Login, cadastro e renovação de token
│   ├── firestoreClient.js  # Cliente HTTP do Firestore (token, erros, paginação)
│   └── habitsService.js    # CRUD de hábitos e conclusões
├── context/                # Estado global
│   ├── AuthContext.js      # Sessão do usuário (signIn / signUp / signOut)
│   └── HabitsContext.js    # Hábitos, conclusões e ações (toggle, add, remove)
├── components/             # Peças visuais reutilizáveis
│   ├── Button.js · HabitItem.js
│   └── PeriodSelector.js · StatCard.js · Heatmap.js · WeekdayBars.js · RateBar.js · HistoryDay.js
├── navigation/
│   ├── AppNavigator.js     # Decide: deslogado → login | logado → abas
│   └── Tabs.js             # Barra de abas
└── screens/                # As 6 telas
    ├── WelcomeScreen.js · LoginScreen.js · HomeScreen.js
    └── AddHabitScreen.js · DashboardScreen.js · ProfileScreen.js
```

**Fluxo das camadas:** `screens → context → services → Firebase`. Telas não conhecem a API; os services não conhecem React; as regras de negócio ficam em `utils`.

## 📲 Telas

1. **Boas-vindas** · 2. **Login/Cadastro** · 3. **Início** (marcar/excluir hábitos) · 4. **Novo hábito** · 5. **Dashboard** (análises por período) · 6. **Perfil**

## 🗄️ Modelo de dados (Firestore)

```
users/{uid}/habits/{habitId}                  → { name }
users/{uid}/completions/{AAAA-MM-DD_habitId}  → { habitId, date, completedAt }
```

O ID da conclusão é *data + hábito*, garantindo no máximo um registro por hábito por dia. "Concluído hoje" e "sequência" são calculados a partir desse histórico.

## 📊 Como o dashboard calcula

- **Esperado:** para cada dia do período, quantos hábitos já existiam naquela data. Um hábito novo não penaliza os dias anteriores à sua criação.
- **Taxa de conclusão:** conclusões ÷ esperado. A tendência compara com o período imediatamente anterior, de mesmo tamanho (em pontos percentuais).
- **Dia perfeito:** todos os hábitos ativos do dia foram concluídos.
- **Dia da semana:** a taxa de cada dia (dom a sáb) soma o que foi concluído e o que era esperado naquele dia da semana, dentro do período.
- **Mapa de calor:** a cor de cada dia é a fração de hábitos concluídos. Dias anteriores ao primeiro hábito aparecem esmaecidos.
- **Ranking:** hábitos ordenados pela taxa no período, com a sequência atual e a melhor sequência de todo o histórico.

## 🚀 Como executar

### 1. Configurar o Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com) e registre um app **Web**.
2. Em **Authentication > Método de login**, ative **E-mail/senha**.
3. Em **Firestore Database**, crie o banco e use estas regras (cada usuário só acessa os próprios dados):

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

4. Em `src/config/firebase.js`, informe o `apiKey` e o `projectId` do seu projeto.

### 2. Rodar o app

```bash
npm install
npx expo start
```

Depois, abra no Expo Go (celular) ou em um emulador.

### No Snack

Crie os arquivos com os mesmos caminhos e adicione as dependências `@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`, `react-native-screens` e `react-native-safe-area-context`. **Não** adicione o pacote `firebase`.

## ⚠️ Limitações

- A lista não atualiza em tempo real (recarrega ao abrir, ao criar e ao puxar para atualizar).
- O login não persiste ao recarregar o app.
- O interruptor "Notificações diárias" do Perfil é apenas visual: ainda não agenda nenhuma notificação.

## 🔮 Próximos passos

Persistir o login com `AsyncStorage` · recuperação de senha · notificações de lembrete · testes unitários de `utils/`.
