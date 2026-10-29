import { createFirestoreClient } from './firestoreClient';

// Modelo de dados:
//  users/{uid}/habits/{habitId}                  -> { name }
//  users/{uid}/completions/{AAAA-MM-DD_habitId}  -> { habitId, date, completedAt }
// O ID da conclusão é "data + hábito": só existe UMA por hábito por dia.
export const completionId = (date, habitId) => `${date}_${habitId}`;

const parseHabit = (d) => ({
  id: d.name.split('/').pop(),
  name: d.fields?.name?.stringValue ?? '',
  createTime: d.createTime || '',
});

const parseCompletion = (d) => ({
  id: d.name.split('/').pop(),
  habitId: d.fields?.habitId?.stringValue ?? '',
  date: d.fields?.date?.stringValue ?? '',
});

export function createHabitsService(session) {
  const db = createFirestoreClient(session);
  const base = `users/${session.uid}`;

  return {
    async fetchAll() {
      const [h, c] = await Promise.all([db.listAll(`${base}/habits`), db.listAll(`${base}/completions`)]);
      return {
        habits: h.map(parseHabit).sort((a, b) => a.createTime.localeCompare(b.createTime)),
        completions: c.map(parseCompletion),
      };
    },

    createHabit(name) {
      return db.request(`${base}/habits`, 'POST', { fields: { name: { stringValue: name } } });
    },

    deleteHabit(id, completionIds = []) {
      return Promise.all([
        db.request(`${base}/habits/${id}`, 'DELETE'),
        ...completionIds.map((cid) => db.request(`${base}/completions/${cid}`, 'DELETE')),
      ]);
    },

    async addCompletion(habitId, date) {
      try {
        await db.request(`${base}/completions?documentId=${completionId(date, habitId)}`, 'POST', {
          fields: {
            habitId: { stringValue: habitId },
            date: { stringValue: date },
            completedAt: { timestampValue: new Date().toISOString() },
          },
        });
      } catch (e) {
        if (e.status !== 'ALREADY_EXISTS') throw e; // já registrado = tudo certo
      }
    },

    removeCompletion(id) {
      return db.request(`${base}/completions/${id}`, 'DELETE');
    },
  };
}
