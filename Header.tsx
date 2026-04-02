import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project, Material } from '@/types';

const CLIENTS = [
  { id: 'c1', name: 'משפחת כהן', email: 'cohen@mail.com', phone: '050-1234567' },
  { id: 'c2', name: 'אדריכלות לוי בע"מ', email: 'levi@arch.co.il', phone: '052-9876543' },
  { id: 'c3', name: 'שרה גולדברג', email: 'sara.g@gmail.com', phone: '054-5555555' },
];

const SEED_PROJECTS: Project[] = [
  {
    id: 'p1', name: 'וילה פרטית — שיכון דן', client: CLIENTS[0],
    status: 'בביצוע', phase: 'עיצוב', startDate: '2025-01-15', endDate: '2025-09-30',
    address: 'שיכון דן, תל אביב', area: 320, budget: 1800000, spent: 620000,
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    description: 'עיצוב וילה פרטית 6 חדרים עם בריכה ואזורי בילוי חיצוניים.',
    progress: 38, tags: ['מגורים', 'יוקרה', 'בריכה'],
    tasks: [
      { id: 't1', title: 'אישור תוכניות בנין', done: true, phase: 'תיאום', dueDate: '2025-02-01' },
      { id: 't2', title: 'בחירת חיפויים סלון', done: true, phase: 'עיצוב', dueDate: '2025-03-15' },
      { id: 't3', title: 'הזמנת ריהוט מיטות', done: false, phase: 'עיצוב', dueDate: '2025-05-10' },
      { id: 't4', title: 'פיקוח יציקת בריכה', done: false, phase: 'ביצוע', dueDate: '2025-06-01' },
    ],
    budgetItems: [
      { id: 'b1', category: 'ריהוט', description: 'ריהוט סלון יטלייאני', estimated: 180000, actual: 195000, paid: true },
      { id: 'b2', category: 'חיפויים', description: 'אבן טרוורטין — כל הדירה', estimated: 220000, actual: 0, paid: false },
      { id: 'b3', category: 'תאורה', description: 'גופי תאורה + בקר', estimated: 85000, actual: 82000, paid: true },
      { id: 'b4', category: 'מטבח', description: 'מטבח Bulthaup B3', estimated: 340000, actual: 343000, paid: false },
    ],
    moodBoard: [
      { id: 'm1', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80', note: 'סלון — גוון חמים', x: 0, y: 0, w: 2, h: 2, tag: 'סלון' },
      { id: 'm2', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80', note: 'מטבח מינימל', x: 2, y: 0, w: 1, h: 1, tag: 'מטבח' },
      { id: 'm3', url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&q=80', note: 'חדר שינה ראשי', x: 2, y: 1, w: 1, h: 1, tag: 'שינה' },
    ],
    materials: [],
  },
  {
    id: 'p2', name: 'משרדים — Tower 37', client: CLIENTS[1],
    status: 'תכנון', phase: 'תיאום', startDate: '2025-03-01', endDate: '2025-12-31',
    address: 'רחוב הברזל 37, תל אביב', area: 1200, budget: 3500000, spent: 120000,
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    description: 'עיצוב מחדש של קומה 12 — Open Space ל-150 עובדים.',
    progress: 12, tags: ['מסחרי', 'משרדים', 'Open Space'],
    tasks: [
      { id: 't5', title: 'בריף עם מנהל הפרויקט', done: true, phase: 'תיאום', dueDate: '2025-03-10' },
      { id: 't6', title: 'תוכנית פריסה ראשונית', done: false, phase: 'תיאום', dueDate: '2025-04-15' },
    ],
    budgetItems: [
      { id: 'b5', category: 'פרטיציות', description: 'קירות זכוכית מחיצה', estimated: 280000, actual: 0, paid: false },
      { id: 'b6', category: 'ריהוט', description: 'תחנות עבודה — 150 יחידות', estimated: 600000, actual: 120000, paid: true },
    ],
    moodBoard: [
      { id: 'm4', url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&q=80', note: 'Open Space מודרני', x: 0, y: 0, w: 2, h: 2, tag: 'כללי' },
    ],
    materials: [],
  },
  {
    id: 'p3', name: 'דירת מגורים — פלורנטין', client: CLIENTS[2],
    status: 'הושלם', phase: 'גמר', startDate: '2024-08-01', endDate: '2025-02-28',
    address: 'פלורנטין, תל אביב', area: 95, budget: 480000, spent: 471000,
    coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    description: 'עיצוב דירת 3 חדרים בסגנון סקנדינבי-ים תיכוני.',
    progress: 100, tags: ['מגורים', 'סקנדינבי'],
    tasks: [],
    budgetItems: [
      { id: 'b7', category: 'הכל', description: 'גמר פרויקט', estimated: 480000, actual: 471000, paid: true },
    ],
    moodBoard: [],
    materials: [],
  },
];

const SEED_MATERIALS: Material[] = [
  { id: 'mat1', name: 'טרוורטין לבן', category: 'אבן', supplier: 'אבן וגבס בע"מ', price: 280, unit: 'מ"ר', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80', inStock: true },
  { id: 'mat2', name: 'פרקט אלון טבעי', category: 'רצפה', supplier: 'פרקט ישראל', price: 320, unit: 'מ"ר', imageUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=300&q=80', inStock: true },
  { id: 'mat3', name: 'בטון מוחלק אפור', category: 'חיפוי', supplier: 'בטון אמנות', price: 180, unit: 'מ"ר', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80', inStock: false },
  { id: 'mat4', name: 'זכוכית לקד שחורה', category: 'חיפוי', supplier: 'כיתת זכוכית', price: 420, unit: 'מ"ר', imageUrl: 'https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=300&q=80', inStock: true },
  { id: 'mat5', name: 'נחושת גולמית', category: 'מתכות', supplier: 'מתכות דיזיין', price: 850, unit: 'מ"ר', imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80', inStock: true },
  { id: 'mat6', name: 'עץ אגוז טבעי', category: 'עץ', supplier: 'עצים נדירים', price: 680, unit: 'מ"ר', imageUrl: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=300&q=80', inStock: false },
];

interface Store {
  projects: Project[];
  materials: Material[];
  activeProjectId: string | null;
  setActiveProject: (id: string | null) => void;
  addProject: (p: Omit<Project, 'id' | 'tasks' | 'budgetItems' | 'moodBoard' | 'materials' | 'progress'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTask: (projectId: string, task: Omit<Project['tasks'][0], 'id'>) => void;
  toggleTask: (projectId: string, taskId: string) => void;
  addBudgetItem: (projectId: string, item: Omit<Project['budgetItems'][0], 'id'>) => void;
  updateBudgetItem: (projectId: string, itemId: string, updates: Partial<Project['budgetItems'][0]>) => void;
  deleteBudgetItem: (projectId: string, itemId: string) => void;
  addMoodBoardItem: (projectId: string, item: Omit<Project['moodBoard'][0], 'id'>) => void;
  removeMoodBoardItem: (projectId: string, itemId: string) => void;
  addMaterial: (m: Omit<Material, 'id'>) => void;
}

const uid = () => Math.random().toString(36).slice(2, 9);
const calcProgress = (tasks: Project['tasks']) => {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter(t => t.done).length / tasks.length) * 100);
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      projects: SEED_PROJECTS,
      materials: SEED_MATERIALS,
      activeProjectId: 'p1',

      setActiveProject: (id) => set({ activeProjectId: id }),

      addProject: (p) => set((s) => ({
        projects: [...s.projects, { ...p, id: uid(), tasks: [], budgetItems: [], moodBoard: [], materials: [], progress: 0 }]
      })),

      updateProject: (id, updates) => set((s) => ({
        projects: s.projects.map(p => p.id === id ? { ...p, ...updates } : p)
      })),

      deleteProject: (id) => set((s) => ({
        projects: s.projects.filter(p => p.id !== id),
        activeProjectId: s.activeProjectId === id ? null : s.activeProjectId,
      })),

      addTask: (projectId, task) => set((s) => ({
        projects: s.projects.map(p => {
          if (p.id !== projectId) return p;
          const tasks = [...p.tasks, { ...task, id: uid() }];
          return { ...p, tasks, progress: calcProgress(tasks) };
        })
      })),

      toggleTask: (projectId, taskId) => set((s) => ({
        projects: s.projects.map(p => {
          if (p.id !== projectId) return p;
          const tasks = p.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t);
          return { ...p, tasks, progress: calcProgress(tasks) };
        })
      })),

      addBudgetItem: (projectId, item) => set((s) => ({
        projects: s.projects.map(p => {
          if (p.id !== projectId) return p;
          const budgetItems = [...p.budgetItems, { ...item, id: uid() }];
          const spent = budgetItems.filter(b => b.paid).reduce((acc, b) => acc + b.actual, 0);
          return { ...p, budgetItems, spent };
        })
      })),

      updateBudgetItem: (projectId, itemId, updates) => set((s) => ({
        projects: s.projects.map(p => {
          if (p.id !== projectId) return p;
          const budgetItems = p.budgetItems.map(b => b.id === itemId ? { ...b, ...updates } : b);
          const spent = budgetItems.filter(b => b.paid).reduce((acc, b) => acc + b.actual, 0);
          return { ...p, budgetItems, spent };
        })
      })),

      deleteBudgetItem: (projectId, itemId) => set((s) => ({
        projects: s.projects.map(p => p.id !== projectId ? p : {
          ...p, budgetItems: p.budgetItems.filter(b => b.id !== itemId)
        })
      })),

      addMoodBoardItem: (projectId, item) => set((s) => ({
        projects: s.projects.map(p => p.id !== projectId ? p : {
          ...p, moodBoard: [...p.moodBoard, { ...item, id: uid() }]
        })
      })),

      removeMoodBoardItem: (projectId, itemId) => set((s) => ({
        projects: s.projects.map(p => p.id !== projectId ? p : {
          ...p, moodBoard: p.moodBoard.filter(m => m.id !== itemId)
        })
      })),

      addMaterial: (m) => set((s) => ({
        materials: [...s.materials, { ...m, id: uid() }]
      })),
    }),
    { name: 'archi-tact-store' }
  )
);
