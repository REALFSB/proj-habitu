// Credenciais do projeto Firebase (Console > Configurações do projeto > Seus apps > Web)
export const firebaseConfig = {
  apiKey: 'AIzaSyCvMndugD7bWHQE7AMuZDcf8KJGe9Ha8js',
  projectId: 'proj-habitu',
};

export const API_KEY = firebaseConfig.apiKey;
export const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;
