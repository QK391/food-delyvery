// Map: userId -> Set of response objects
const clients = new Map();

export const addClient = (userId, res) => {
  if (!clients.has(userId)) clients.set(userId, new Set());
  clients.get(userId).add(res);
};

export const removeClient = (userId, res) => {
  if (clients.has(userId)) {
    clients.get(userId).delete(res);
    if (clients.get(userId).size === 0) clients.delete(userId);
  }
};

export const sendToUser = (userId, data) => {
  if (!clients.has(userId)) return;
  const message = `data: ${JSON.stringify(data)}\n\n`;
  for (const res of clients.get(userId)) {
    try { res.write(message); } catch {}
  }
};
