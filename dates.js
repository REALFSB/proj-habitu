const pad = (n) => String(n).padStart(2, '0');

// Chave de data AAAA-MM-DD no fuso do aparelho: identifica "o dia" de cada conclusão
export const dateKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

export const prettyDate = (key) => {
  if (key === dateKey()) return 'Hoje';
  if (key === dateKey(addDays(new Date(), -1))) return 'Ontem';
  const [y, m, d] = key.split('-');
  return `${d}/${m}/${y}`;
};
