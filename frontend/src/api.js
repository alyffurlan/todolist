// Camada de serviço: todas as chamadas ao backend ficam aqui.
const BASE = '/api/tasks';

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    let message = 'Erro ao comunicar com o servidor.';
    try {
      const data = await res.json();
      if (data.message) message = data.message;
    } catch {
      /* resposta sem corpo JSON */
    }
    throw new Error(message);
  }

  return res.status === 204 ? null : res.json();
}

// -> { tasks, total, completed }
export function listTasks(search = '') {
  return request(`${BASE}?search=${encodeURIComponent(search)}`);
}

export function createTask({ title, dueDate }) {
  return request(BASE, {
    method: 'POST',
    body: JSON.stringify({ title, dueDate: dueDate || null }),
  });
}

// data: { completed?, title?, dueDate? } (dueDate null remove o prazo)
export function updateTask(id, data) {
  return request(`${BASE}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteTask(id) {
  return request(`${BASE}/${id}`, { method: 'DELETE' });
}
