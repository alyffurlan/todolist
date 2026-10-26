function todayStr() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// 'YYYY-MM-DD' -> 'DD/MM/YYYY'
function formatDate(str) {
  const [y, m, d] = str.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const dueDate = task.due_date ? task.due_date.slice(0, 10) : null;
  const completed = Boolean(task.completed);
  const overdue = !completed && dueDate && dueDate < todayStr();

  return (
    <li className={`task ${completed ? 'is-done' : ''} ${overdue ? 'is-overdue' : ''}`}>
      <div className="task__info">
        <span className="task__title">{task.title}</span>
        {(dueDate || overdue) && (
          <span className="task__meta">
            {dueDate && <span className="task__date">{formatDate(dueDate)}</span>}
            {overdue && <span className="badge">Em atraso</span>}
          </span>
        )}
      </div>

      <div className="task__actions">
        <button className="icon-btn" onClick={() => onEdit(task)} aria-label="Editar tarefa" title="Editar">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </button>
        <button className="icon-btn icon-btn--danger" onClick={() => onDelete(task)} aria-label="Excluir tarefa" title="Excluir">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v5M14 11v5" />
          </svg>
        </button>
      </div>

      <label className="check">
        <input type="checkbox" checked={completed} onChange={() => onToggle(task)} aria-label="Concluir tarefa" />
        <span className="check__box">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
      </label>
    </li>
  );
}
