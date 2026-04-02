import { Bell, Search } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useLocation } from 'react-router-dom';

const TITLES: Record<string, string> = {
  '/': 'דשבורד',
  '/projects': 'פרויקטים',
  '/moodboard': 'לוח השראה',
  '/materials': 'ספריית חומרים',
  '/budget': 'תקציב',
  '/clients': 'פורטל לקוח',
  '/calendar': 'לוח זמנים',
  '/settings': 'הגדרות',
};

export default function Header() {
  const { projects, activeProjectId } = useStore();
  const loc = useLocation();
  const project = projects.find(p => p.id === activeProjectId);

  return (
    <header className="h-14 bg-surface border-b border-border flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="font-semibold text-ink text-base">{TITLES[loc.pathname] ?? 'דשבורד'}</h1>
        {project && loc.pathname !== '/projects' && (
          <p className="text-xs text-ink-muted">{project.name}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input placeholder="חיפוש..." className="input w-52 pr-9 py-1.5 text-xs" />
        </div>
        <button className="relative w-8 h-8 rounded border border-border flex items-center justify-center hover:bg-surface-2 transition-colors">
          <Bell size={15} className="text-ink-muted" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-accent rounded-full" />
        </button>
      </div>
    </header>
  );
}
