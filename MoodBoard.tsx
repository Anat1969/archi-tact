import { useStore } from '@/store/useStore';
import { fmt, pct } from '@/lib/utils';
import { CheckCircle2, Clock, AlertTriangle, TrendingUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function KPICard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="card">
      <div className="text-xs text-ink-muted mb-3">{label}</div>
      <div className={`text-2xl font-bold ${color ?? 'text-ink'}`}>{value}</div>
      {sub && <div className="text-xs text-ink-muted mt-1">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const { projects, activeProjectId, setActiveProject, toggleTask } = useStore();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === activeProjectId);

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0);
  const active = projects.filter(p => p.status === 'בביצוע').length;
  const allTasks = project?.tasks ?? [];
  const pending = allTasks.filter(t => !t.done);

  const statusColor: Record<string, string> = {
    'בביצוע': 'bg-blue-50 text-blue-700',
    'תכנון': 'bg-amber-50 text-amber-700',
    'בהמתנה': 'bg-gray-100 text-gray-600',
    'הושלם': 'bg-green-50 text-green-700',
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard label="פרויקטים פעילים" value={String(active)} sub={`מתוך ${projects.length} סה"כ`} />
        <KPICard label="תקציב כולל" value={fmt(totalBudget)} sub="כל הפרויקטים" />
        <KPICard label="הוצאות עד היום" value={fmt(totalSpent)} sub={`${pct(totalSpent, totalBudget)}% מהתקציב`} color={pct(totalSpent, totalBudget) > 85 ? 'text-red-600' : 'text-ink'} />
        <KPICard label="משימות פתוחות" value={String(pending.length)} sub={project ? `ב${project.name}` : 'בחר פרויקט'} color={pending.length > 5 ? 'text-amber-600' : 'text-ink'} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Project list */}
        <div className="col-span-2 card space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-semibold text-sm">כל הפרויקטים</h2>
            <button onClick={() => navigate('/projects')} className="btn-outline text-xs py-1">
              <Plus size={13} /> פרויקט חדש
            </button>
          </div>
          {projects.map(p => (
            <div
              key={p.id}
              onClick={() => { setActiveProject(p.id); navigate('/'); }}
              className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-surface-2 transition-colors ${p.id === activeProjectId ? 'bg-surface-3 ring-1 ring-accent/20' : ''}`}
            >
              <img src={p.coverImage} alt={p.name} className="w-12 h-12 rounded object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{p.name}</div>
                <div className="text-xs text-ink-muted">{p.client.name} · {p.address}</div>
                <div className="mt-1.5 h-1.5 bg-border rounded-full overflow-hidden w-40">
                  <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${p.progress}%` }} />
                </div>
              </div>
              <div className="text-left shrink-0 space-y-1">
                <span className={`badge ${statusColor[p.status]}`}>{p.status}</span>
                <div className="text-xs text-ink-muted">{p.progress}% הושלם</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tasks */}
        <div className="card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm">משימות — {project?.name ?? 'בחר פרויקט'}</h2>
            <TrendingUp size={15} className="text-ink-muted" />
          </div>
          {!project ? (
            <p className="text-xs text-ink-muted text-center py-8">בחר פרויקט מהרשימה</p>
          ) : allTasks.length === 0 ? (
            <p className="text-xs text-ink-muted text-center py-8">אין משימות עדיין</p>
          ) : (
            <div className="flex flex-col gap-2 flex-1">
              {allTasks.map(t => (
                <button
                  key={t.id}
                  onClick={() => toggleTask(project.id, t.id)}
                  className="flex items-start gap-3 p-2.5 rounded hover:bg-surface-2 transition-colors text-right w-full"
                >
                  {t.done
                    ? <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                    : t.dueDate && new Date(t.dueDate) < new Date()
                      ? <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" />
                      : <Clock size={16} className="text-amber-400 mt-0.5 shrink-0" />
                  }
                  <div className="flex-1">
                    <div className={`text-xs font-medium ${t.done ? 'line-through text-ink-muted' : ''}`}>{t.title}</div>
                    <div className="text-xs text-ink-muted">{t.phase} {t.dueDate ? `· ${t.dueDate}` : ''}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
