import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { ChevronRight, ChevronLeft, Plus, X } from 'lucide-react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth, isToday, isSameDay, getDay } from 'date-fns';
import { he } from 'date-fns/locale';

const PHASE_COLOR: Record<string, string> = {
  'תיאום': 'bg-purple-100 text-purple-700',
  'עיצוב': 'bg-blue-100 text-blue-700',
  'ביצוע': 'bg-amber-100 text-amber-700',
  'גמר': 'bg-green-100 text-green-700',
};

export default function CalendarPage() {
  const { projects, activeProjectId, addTask } = useStore();
  const project = projects.find(p => p.id === activeProjectId);
  const [current, setCurrent] = useState(new Date());
  const [selected, setSelected] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', phase: 'עיצוב' as const });

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  // pad start — Sunday = 0, but RTL so we pad from end (Saturday)
  const startPad = (getDay(monthStart) + 1) % 7; // shift so Saturday = 0
  const blanks = Array.from({ length: startPad });

  const allTasks = projects.flatMap(p => (p.tasks ?? []).map(t => ({ ...t, projectName: p.name, projectId: p.id })));
  const tasksOnDay = (d: Date) => allTasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), d));

  const prev = () => setCurrent(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const next = () => setCurrent(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !selected) return;
    addTask(project.id, { title: form.title, done: false, phase: form.phase as any, dueDate: format(selected, 'yyyy-MM-dd') });
    setShowForm(false);
    setForm({ title: '', phase: 'עיצוב' });
  };

  const DAYS_HE = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">לוח זמנים</h2>
          <p className="text-xs text-ink-muted">{format(current, 'MMMM yyyy', { locale: he })}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prev} className="btn-outline p-2"><ChevronRight size={16} /></button>
          <button onClick={() => setCurrent(new Date())} className="btn-outline text-xs px-3">היום</button>
          <button onClick={next} className="btn-outline p-2"><ChevronLeft size={16} /></button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {DAYS_HE.map(d => (
            <div key={d} className="text-center text-xs font-medium text-ink-muted py-3">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {blanks.map((_, i) => <div key={`b${i}`} className="min-h-[100px] border-b border-r border-border bg-surface-2" />)}
          {days.map(day => {
            const dayTasks = tasksOnDay(day);
            const isSelected = selected && isSameDay(day, selected);
            return (
              <div
                key={day.toISOString()}
                onClick={() => setSelected(day)}
                className={`min-h-[100px] border-b border-r border-border p-2 cursor-pointer transition-colors
                  ${isSelected ? 'bg-accent/5 ring-1 ring-inset ring-accent/30' : 'hover:bg-surface-2'}
                  ${!isSameMonth(day, current) ? 'opacity-40' : ''}`}
              >
                <div className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1
                  ${isToday(day) ? 'bg-accent text-white' : 'text-ink-muted'}`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-0.5">
                  {dayTasks.slice(0, 3).map(t => (
                    <div key={t.id} className={`text-xs px-1.5 py-0.5 rounded truncate ${PHASE_COLOR[t.phase] ?? 'bg-gray-100 text-gray-600'} ${t.done ? 'opacity-50 line-through' : ''}`}>
                      {t.title}
                    </div>
                  ))}
                  {dayTasks.length > 3 && <div className="text-xs text-ink-muted">+{dayTasks.length - 3} עוד</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected day detail */}
      {selected && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">{format(selected, 'EEEE, d בMMMM', { locale: he })}</h3>
            <div className="flex gap-2">
              {project && (
                <button onClick={() => setShowForm(true)} className="btn-accent text-xs py-1.5">
                  <Plus size={13} /> הוסף משימה
                </button>
              )}
              <button onClick={() => setSelected(null)} className="text-ink-muted hover:text-ink"><X size={16} /></button>
            </div>
          </div>
          {tasksOnDay(selected).length === 0 ? (
            <p className="text-sm text-ink-muted">אין משימות ביום זה</p>
          ) : (
            <div className="space-y-2">
              {tasksOnDay(selected).map(t => (
                <div key={t.id} className="flex items-center gap-3 p-2 rounded bg-surface-2">
                  <span className={`badge text-xs ${PHASE_COLOR[t.phase]}`}>{t.phase}</span>
                  <span className={`text-sm flex-1 ${t.done ? 'line-through text-ink-muted' : ''}`}>{t.title}</span>
                  <span className="text-xs text-ink-muted">{t.projectName}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-4 flex-wrap">
        {Object.entries(PHASE_COLOR).map(([phase, cls]) => (
          <div key={phase} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded ${cls.split(' ')[0]}`} />
            <span className="text-xs text-ink-muted">{phase}</span>
          </div>
        ))}
      </div>

      {/* Add task modal */}
      {showForm && selected && project && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-xl w-full max-w-sm">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-semibold text-sm">משימה חדשה — {format(selected, 'd/M/yyyy')}</h3>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-ink-muted" /></button>
            </div>
            <form onSubmit={submit} className="p-5 space-y-4">
              <div>
                <label className="label">כותרת המשימה</label>
                <input required className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="פגישה עם ספק..." />
              </div>
              <div>
                <label className="label">שלב</label>
                <select className="input" value={form.phase} onChange={e => setForm(f => ({ ...f, phase: e.target.value as any }))}>
                  {['תיאום', 'עיצוב', 'ביצוע', 'גמר'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-accent flex-1">הוסף</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1">ביטול</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
