import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { fmt } from '@/lib/utils';
import { Plus, X, Search, Package } from 'lucide-react';
import type { Material } from '@/types';

const CATS = ['הכל', 'אבן', 'עץ', 'רצפה', 'חיפוי', 'מתכות', 'זכוכית', 'טקסטיל', 'אחר'];

export default function Materials() {
  const { materials, addMaterial } = useStore();
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('הכל');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Material | null>(null);
  const [form, setForm] = useState<Omit<Material, 'id'>>({ name: '', category: 'אבן', supplier: '', price: 0, unit: 'מ"ר', imageUrl: '', inStock: true, notes: '' });

  const filtered = materials.filter(m => {
    const matchCat = cat === 'הכל' || m.category === cat;
    const matchSearch = m.name.includes(search) || m.supplier.includes(search);
    return matchCat && matchSearch;
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addMaterial(form);
    setShowForm(false);
    setForm({ name: '', category: 'אבן', supplier: '', price: 0, unit: 'מ"ר', imageUrl: '', inStock: true, notes: '' });
  };

  return (
    <div className="max-w-7xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">ספריית חומרים</h2>
          <p className="text-xs text-ink-muted">{materials.length} חומרים</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-accent"><Plus size={15} /> חומר חדש</button>
      </div>

      {/* Search + filter */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input className="input pr-9" placeholder="חיפוש חומר או ספק..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${cat === c ? 'bg-accent text-white' : 'bg-surface border border-border text-ink-muted hover:border-accent hover:text-accent'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16 text-ink-muted space-y-2">
          <Package size={32} className="mx-auto opacity-30" />
          <p className="text-sm">לא נמצאו חומרים</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {filtered.map(m => (
            <div key={m.id} onClick={() => setSelected(m)}
              className="card p-0 overflow-hidden cursor-pointer hover:shadow-md transition-shadow group">
              <div className="relative aspect-square overflow-hidden bg-surface-3">
                {m.imageUrl
                  ? <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  : <div className="w-full h-full flex items-center justify-center text-ink-muted"><Package size={32} /></div>
                }
                <span className={`absolute top-2 right-2 badge text-xs ${m.inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                  {m.inStock ? 'במלאי' : 'אזל'}
                </span>
              </div>
              <div className="p-3">
                <div className="font-medium text-sm truncate">{m.name}</div>
                <div className="text-xs text-ink-muted">{m.supplier}</div>
                <div className="text-xs font-semibold text-accent mt-1">{fmt(m.price)} / {m.unit}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-semibold">{selected.name}</h3>
              <button onClick={() => setSelected(null)}><X size={18} className="text-ink-muted" /></button>
            </div>
            {selected.imageUrl && (
              <div className="h-56 overflow-hidden">
                <img src={selected.imageUrl} alt={selected.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-5 space-y-3">
              {[
                { l: 'קטגוריה', v: selected.category },
                { l: 'ספק', v: selected.supplier },
                { l: 'מחיר', v: `${fmt(selected.price)} / ${selected.unit}` },
                { l: 'מלאי', v: selected.inStock ? 'במלאי' : 'אזל' },
              ].map(r => (
                <div key={r.l} className="flex justify-between text-sm">
                  <span className="text-ink-muted">{r.l}</span>
                  <span className="font-medium">{r.v}</span>
                </div>
              ))}
              {selected.notes && <div className="text-sm text-ink-muted border-t border-border pt-3">{selected.notes}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-semibold">חומר חדש</h3>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-ink-muted" /></button>
            </div>
            <form onSubmit={submit} className="p-5 space-y-4">
              <div><label className="label">שם החומר</label>
                <input required className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">קטגוריה</label>
                  <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATS.filter(c => c !== 'הכל').map(c => <option key={c}>{c}</option>)}
                  </select></div>
                <div><label className="label">ספק</label>
                  <input className="input" value={form.supplier} onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))} /></div>
                <div><label className="label">מחיר (₪)</label>
                  <input type="number" className="input" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} /></div>
                <div><label className="label">יחידה</label>
                  <select className="input" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}>
                    {['מ"ר', 'מ"א', 'יח\'', 'ק"ג', 'ליטר'].map(u => <option key={u}>{u}</option>)}
                  </select></div>
              </div>
              <div><label className="label">URL תמונה</label>
                <input className="input" type="url" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." /></div>
              <div><label className="label">הערות</label>
                <textarea rows={2} className="input resize-none" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.inStock} onChange={e => setForm(f => ({ ...f, inStock: e.target.checked }))} />
                <span className="text-sm">במלאי</span>
              </label>
              <div className="flex gap-3">
                <button type="submit" className="btn-accent flex-1">הוסף לספרייה</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1">ביטול</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
