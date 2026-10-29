// Autenticação SIMULADA: aceita qualquer e-mail válido com senha de 6+ caracteres.
// Será substituída pela autenticação real (Firebase) mantendo as mesmas funções exportadas.

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const toSession = (email) => ({ uid: email.toLowerCase(), email });

async function authCall(email, password) {
  await wait(400); // simula o tempo de resposta de um servidor
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('E-mail inválido.');
  if (password.length < 6) throw new Error('A senha precisa ter ao menos 6 caracteres.');
  return toSession(email);
}

export const signIn = (email, password) => authCall(email, password);
export const signUp = (email, password) => authCall(email, password);
