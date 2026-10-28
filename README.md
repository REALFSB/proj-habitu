# 🌿 Habitu

App mobile de controle de hábitos diários, feito com React Native + Expo.

## 📱 Funcionalidades

- Criar hábitos
- Marcar/desmarcar um hábito como concluído **hoje**
- Sequência (streak) de dias consecutivos de cada hábito
- Excluir hábitos junto com o histórico (segurando o item)

> Nesta versão os dados ficam apenas em memória: ao recarregar o app, a lista é perdida.

## 🗂️ Como funciona o histórico

Cada conclusão é guardada com a data (`AAAA-MM-DD`) e o ID dela é *data + hábito*, garantindo no máximo um registro por hábito por dia. "Concluído hoje" e "sequência" são calculados a partir desse histórico (`src/utils/habitStats.js`).

## 🚀 Como executar

```bash
npm install
npx expo start
```

Depois, abra no Expo Go (celular) ou em um emulador.
