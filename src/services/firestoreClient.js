import { FIRESTORE_BASE } from '../config/firebase';
import { refreshSession } from './authService';

// Cliente HTTP do Firestore: injeta o token do usuário e renova quando expira.
export function createFirestoreClient(initialSession) {
  let session = initialSession;

  async function request(path, method = 'GET', body) {
    if (Date.now() > session.expiresAt) session = await refreshSession(session);
    const r = await fetch(`${FIRESTORE_BASE}/${path}`, {
      method,
      headers: { Authorization: `Bearer ${session.idToken}`, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await r.text();
    const j = text ? JSON.parse(text) : {};
    if (!r.ok) {
      const e = new Error(j.error?.message || `Erro ${r.status}`);
      e.status = j.error?.status;
      throw e;
    }
    return j;
  }

  // Lista todos os documentos de uma coleção, percorrendo as páginas
  async function listAll(path) {
    let docs = [];
    let token = '';
    do {
      const j = await request(`${path}?pageSize=300${token ? `&pageToken=${encodeURIComponent(token)}` : ''}`);
      docs = docs.concat(j.documents || []);
      token = j.nextPageToken || '';
    } while (token);
    return docs;
  }

  return { request, listAll };
}
