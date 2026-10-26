import { useCallback, useEffect, useState } from 'react';
import { createTask, deleteTask, listTasks, updateTask } from './api.js';
import useDebounce from './hooks/useDebounce.js';
import TaskItem from './components/TaskItem.jsx';
import TaskModal from './components/TaskModal.jsx';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [counts, setCounts] = useState({ total: 0, completed: 0 });
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // null | { task: null | objeto }

  const search = useDebounce(searchInput, 400);

  const load = useCallback(async () => {
    try {
      const data = await listTasks(search.trim());
      setTasks(data.tasks);
      setCounts({ total: data.total, completed: data.completed });
      setError('');
    } catch {
      setError('Não foi possível carregar as tarefas. O backend está rodando na porta 3333?');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  async function handleSave(data) {
    if (modal.task) await updateTask(modal.task.id, data);
    else await createTask(data);
    setModal(null);
    await load();
  }

  async function handleToggle(task) {
    try {
      await updateTask(task.id, { completed: !task.completed });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(task) {
    if (!window.confirm(`Excluir a tarefa "${task.title}"?`)) return;
    try {
      await deleteTask(task.id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </div>
        <h1>TO DO LIST<span>.</span></h1>
        <div className="counters">
          <div><strong>{counts.total}</strong> total</div>
          <div><strong>{counts.completed}</strong> completed</div>
        </div>
      </header>

      <div className="search">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {error && <p className="alert">{error}</p>}

      <main className="list-area">
        {loading ? (
          <p className="empty">Loading...</p>
        ) : tasks.length === 0 ? (
          <div className="empty">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12.5l3 3 5-6" />
            </svg>
            <p>You have no pending tasks.</p>
          </div>
        ) : (
          <ul className="list">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onEdit={(t) => setModal({ task: t })}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </main>

      <button className="fab" onClick={() => setModal({ task: null })} aria-label="Criar tarefa">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      {modal && (
        <TaskModal task={modal.task} onClose={() => setModal(null)} onSave={handleSave} />
      )}
    </div>
  );
}
