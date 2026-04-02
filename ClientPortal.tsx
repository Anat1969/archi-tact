import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, Image, Package, DollarSign, Users, Calendar, Settings, Plus, ChevronDown } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'דשבורד' },
  { to: '/projects', icon: FolderOpen, label: 'פרויקטים' },
  { to: '/moodboard', icon: Image, label: 'לוח השראה' },
  { to: '/materials', icon: Package, label: 'ספריית חומרים' },
  { to: '/budget', icon: DollarSign, label: 'תקציב' },
  { to: '/clients', icon: Users, label: 'פורטל לקוח' },
  { to: '/calendar', icon: Calendar, label: 'לוח זמנים' },
];

export default function Sidebar() {
  const { projects, activeProjectId, setActiveProject } = useStore();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const active = projects.find(p => p.id === activeProjectId);

  return (
    <aside className="w-60 min-h-screen bg-sidebar flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/8">
        <div className="text-white font-bold text-lg tracking-widest">
          ARCHI<span className="text-accent">-TACT</span>
        </div>
        <div className="text-white/40 text-xs mt-0.5">סביבת עבודה מקצועית</div>
      </div>

      {/* Active project selector */}
      <div className="px-3 py-3 border-b border-white/8">
        <div className="text-white/30 text-xs uppercase tracking-wider mb-2 px-2">פרויקט פעיל</div>
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between px-3 py-2 rounded bg-white/5 hover:bg-white/8 transition-colors"
        >
          <span className="text-white text-sm truncate">{active?.name ?? 'בחר פרויקט'}</span>
          <ChevronDown size={14} className={cn('text-white/40 transition-transform', open && 'rotate-180')} />
        </button>
        {open && (
          <div className="mt-1 flex flex-col gap-0.5">
            {projects.map(p => (
              <button
                key={p.id}
                onClick={() => { setActiveProject(p.id); navigate('/'); setOpen(false); }}
                className={cn(
                  'w-full text-right px-3 py-1.5 rounded text-xs truncate transition-colors',
                  p.id === activeProjectId ? 'text-accent bg-accent/10' : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                )}
              >{p.name}</button>
            ))}
            <button
              onClick={() => { navigate('/projects'); setOpen(false); }}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-accent/70 hover:text-accent transition-colors"
            >
              <Plus size={12} /> פרויקט חדש
            </button>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => cn('sidebar-item', isActive && 'active')}
          >
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-white/8">
        <NavLink to="/settings" className={({ isActive }) => cn('sidebar-item', isActive && 'active')}>
          <Settings size={16} /><span>הגדרות</span>
        </NavLink>
        <div className="mt-3 px-3 flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">א</div>
          <div>
            <div className="text-white/70 text-xs font-medium">אדריכל כהן</div>
            <div className="text-white/30 text-xs">Studio Plan</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
