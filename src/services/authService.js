import { API_KEY } from '../config/firebase';

const ERRORS = {
  EMAIL_EXISTS: 'Este e-mail já está cadastrado.',
  INVALID_EMAIL: 'E-mail inválido.',
  INVALID_LOGIN_CREDENTIALS: 'E-mail ou senha incorretos.',
  EMAIL_NOT_FOUND: 'Usuário não encontrado.',
  INVALID_PASSWORD: 'Senha incorreta.',
  OPERATION_NOT_ALLOWED: 'Ative o login por e-mail/senha no console do Firebase.',
  TOO_MANY_ATTEMPTS_TRY_LATER: 'Muitas tentativas. Tente de novo mais tarde.',
};

const translate = (msg = '') =>
  msg.startsWith('WEAK_PASSWORD') ? 'A senha precisa ter ao menos 6 caracteres.' : ERRORS[msg] || msg;

const toSession = (j) => ({
  uid: j.localId || j.user_id,
  email: j.email,
  idToken: j.idToken || j.id_token,
  refreshToken: j.refreshToken || j.refresh_token,
  expiresAt: Date.now() + Number(j.expiresIn || j.expires_in) * 1000 - 60000,
});

async function authCall(endpoint, email, password) {
  const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:${endpoint}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(translate(j.error?.message) || 'Erro de autenticação');
  return toSession(j);
}

export const signIn = (email, password) => authCall('signInWithPassword', email, password);
export const signUp = (email, password) => authCall('signUp', email, password);

export async function refreshSession(session) {
  const r = await fetch(`https://securetoken.googleapis.com/v1/token?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(session.refreshToken)}`,
  });
  const j = await r.json();
  if (!r.ok) throw new Error('Sessão expirada. Entre novamente.');
  return { ...toSession(j), email: session.email };
}
