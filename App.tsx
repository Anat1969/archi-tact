import { useState } from 'react';
import { Check, User, Bell, Palette, Database, Shield } from 'lucide-react';

const SECTIONS = [
  { id: 'profile', icon: User, label: 'פרופיל' },
  { id: 'notifications', icon: Bell, label: 'התראות' },
  { id: 'appearance', icon: Palette, label: 'מראה' },
  { id: 'data', icon: Database, label: 'נתונים' },
  { id: 'security', icon: Shield, label: 'אבטחה' },
];

export default function Settings() {
  const [section, setSection] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({ name: 'אדריכל כהן', email: 'cohen@studio.co.il', firm: 'כהן אדריכלים בע"מ', phone: '052-1234567', vat: '123456789' });
  const [notifs, setNotifs] = useState({ email: true, budget: true, tasks: true, client: false });

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="max-w-4xl flex gap-6">
      {/* Sidebar */}
      <div className="w-48 shrink-0">
        <div className="card p-2 space-y-0.5">
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setSection(s.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors text-right
                ${section === s.id ? 'bg-accent/10 text-accent font-medium' : 'text-ink-muted hover:text-ink hover:bg-surface-2'}`}>
              <s.icon size={15} />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 card space-y-5">
        {section === 'profile' && (
          <>
            <h2 className="font-semibold border-b border-border pb-3">פרטי פרופיל</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center text-accent text-2xl font-bold">
                {profile.name[0]}
              </div>
              <div>
                <div className="font-semibold">{profile.name}</div>
                <div className="text-sm text-ink-muted">{profile.firm}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { l: 'שם מלא', k: 'name' as const },
                { l: 'אימייל', k: 'email' as const },
                { l: 'שם משרד', k: 'firm' as const },
                { l: 'טלפון', k: 'phone' as const },
                { l: 'מספר עוסק', k: 'vat' as const },
              ].map(f => (
                <div key={f.k} className={f.k === 'firm' || f.k === 'vat' ? 'col-span-2' : ''}>
                  <label className="label">{f.l}</label>
                  <input className="input" value={profile[f.k]} onChange={e => setProfile(p => ({ ...p, [f.k]: e.target.value }))} />
                </div>
              ))}
            </div>
          </>
        )}

        {section === 'notifications' && (
          <>
            <h2 className="font-semibold border-b border-border pb-3">העדפות התראות</h2>
            <div className="space-y-4">
              {[
                { k: 'email' as const, l: 'התראות מייל', d: 'קבל עדכוני פרויקט במייל' },
                { k: 'budget' as const, l: 'חריגות תקציב', d: 'התראה כשהוצאה עוברת 80% מהתקציב' },
                { k: 'tasks' as const, l: 'משימות שעומדות לפוג', d: 'תזכורת 48 שעות לפני תאריך יעד' },
                { k: 'client' as const, l: 'פעילות לקוח', d: 'כשלקוח צופה בפורטל או מגיב' },
              ].map(n => (
                <div key={n.k} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <div className="text-sm font-medium">{n.l}</div>
                    <div className="text-xs text-ink-muted">{n.d}</div>
                  </div>
                  <button
                    onClick={() => setNotifs(nf => ({ ...nf, [n.k]: !nf[n.k] }))}
                    className={`relative w-10 h-5 rounded-full transition-colors ${notifs[n.k] ? 'bg-accent' : 'bg-border-strong'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${notifs[n.k] ? 'right-0.5' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {section === 'appearance' && (
          <>
            <h2 className="font-semibold border-b border-border pb-3">מראה ועיצוב</h2>
            <div className="space-y-4">
              <div>
                <label className="label mb-2">ערכת צבעים</label>
                <div className="flex gap-3">
                  {[
                    { name: 'ברונזה', color: '#C8906A' },
                    { name: 'ינשוף', color: '#7B68EE' },
                    { name: 'ים', color: '#20B2AA' },
                  ].map(c => (
                    <button key={c.name} className="flex flex-col items-center gap-2 group">
                      <div className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-ink-muted transition-colors" style={{ background: c.color }} />
                      <span className="text-xs text-ink-muted">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">שפה</label>
                <select className="input w-48">
                  <option>עברית</option>
                  <option>English</option>
                  <option>Русский</option>
                </select>
              </div>
            </div>
          </>
        )}

        {section === 'data' && (
          <>
            <h2 className="font-semibold border-b border-border pb-3">גיבוי ונתונים</h2>
            <div className="space-y-4">
              <div className="p-4 bg-surface-2 rounded-lg">
                <div className="text-sm font-medium mb-1">גיבוי אוטומטי</div>
                <div className="text-xs text-ink-muted mb-3">הנתונים נשמרים אוטומטית ב-LocalStorage</div>
                <button className="btn-outline text-xs" onClick={() => { localStorage.removeItem('archi-tact-store'); location.reload(); }}>
                  איפוס נתונים (מחיקה)
                </button>
              </div>
              <div className="p-4 bg-surface-2 rounded-lg">
                <div className="text-sm font-medium mb-1">ייצוא נתונים</div>
                <div className="text-xs text-ink-muted mb-3">הורד את כל הפרויקטים כ-JSON</div>
                <button className="btn-outline text-xs" onClick={() => {
                  const data = localStorage.getItem('archi-tact-store') ?? '{}';
                  const a = document.createElement('a');
                  a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(data);
                  a.download = 'archi-tact-backup.json';
                  a.click();
                }}>ייצא JSON</button>
              </div>
            </div>
          </>
        )}

        {section === 'security' && (
          <>
            <h2 className="font-semibold border-b border-border pb-3">אבטחה</h2>
            <div className="space-y-4">
              <div>
                <label className="label">סיסמה נוכחית</label>
                <input type="password" className="input" placeholder="••••••••" />
              </div>
              <div>
                <label className="label">סיסמה חדשה</label>
                <input type="password" className="input" placeholder="••••••••" />
              </div>
              <div>
                <label className="label">אימות סיסמה</label>
                <input type="password" className="input" placeholder="••••••••" />
              </div>
            </div>
          </>
        )}

        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <button onClick={save} className="btn-accent">שמור שינויים</button>
          {saved && <span className="flex items-center gap-1 text-sm text-green-600"><Check size={14} /> נשמר!</span>}
        </div>
      </div>
    </div>
  );
}
