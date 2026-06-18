'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar, ArrowRight, ArrowLeft, Tag, Flame, CheckCircle2, Clock, Layers, Sparkles } from 'lucide-react';

const defaultKanbanCards = [
  {
    id: "k-1",
    title: "Why Connection Pooling is Mandatory in Modern Serverless App Routers",
    status: "published",
    keyword: "Connection pooling",
    priority: "High",
    date: "2026-06-15"
  },
  {
    id: "k-2",
    title: "Mastering PostgreSQL Row Level Security (RLS) in Community Web Applications",
    status: "published",
    keyword: "PostgreSQL RLS",
    priority: "High",
    date: "2026-06-14"
  },
  {
    id: "k-3",
    title: "High Fidelity Static Site Generation: Achieving Flawless Core Web Vitals",
    status: "scheduled",
    keyword: "Core Web Vitals",
    priority: "High",
    date: "2026-06-18"
  },
  {
    id: "k-4",
    title: "Migrating from WordPress to a Next.js 15 Community Ledger",
    status: "optimizing",
    keyword: "WordPress to Nextjs",
    priority: "High"
  },
  {
    id: "k-5",
    title: "10 Essential Database Tools Every Systems Architect Uses",
    status: "drafting",
    keyword: "Database tools",
    priority: "Medium"
  },
  {
    id: "k-6",
    title: "Structuring Multi-Tenant JWT Tokens in Supabase Auth",
    status: "drafting",
    keyword: "Supabase JWT",
    priority: "Medium"
  }
];

const swimlanes = [
  { id: "drafting", label: "✍️ 1. Concept Drafting", color: "border-indigo-500", bg: "bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400" },
  { id: "optimizing", label: "⚡ 2. Technical Optimizing", color: "border-amber-500", bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
  { id: "scheduled", label: "📅 3. Pipeline Scheduled", color: "border-purple-500", bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400" },
  { id: "published", label: "🚀 4. Live Published", color: "border-emerald-500", bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" }
];

export default function WorkflowKanban() {
  const [cards, setCards] = useState(defaultKanbanCards);
  const [addingTo, setAddingTo] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newPriority, setNewPriority] = useState('High');

  useEffect(() => {
    const saved = localStorage.getItem('apex_kanban_community');
    if (saved) {
      try { setCards(JSON.parse(saved)); } catch(e){}
    }
  }, []);

  const saveToLocal = (updated) => {
    setCards(updated);
    localStorage.setItem('apex_kanban_community', JSON.stringify(updated));
  };

  const handleCreateCard = (statusId) => {
    if (!newTitle.trim()) return;
    
    const nextCard = {
      id: 'k-' + Date.now(),
      title: newTitle.trim(),
      status: statusId,
      keyword: newKeyword.trim() || "Definitive topic",
      priority: newPriority,
      date: statusId === 'scheduled' || statusId === 'published' ? new Date().toISOString().split('T')[0] : undefined
    };

    const updated = [nextCard, ...cards];
    saveToLocal(updated);
    setNewTitle('');
    setNewKeyword('');
    setAddingTo(null);
  };

  const handleDeleteCard = (cardId) => {
    const updated = cards.filter(c => c.id !== cardId);
    saveToLocal(updated);
  };

  const handleMoveCard = (cardId, nextStatus) => {
    const updated = cards.map(c => {
      if (c.id === cardId) {
        return { 
          ...c, 
          status: nextStatus,
          date: nextStatus === 'scheduled' || nextStatus === 'published' ? (c.date || new Date().toISOString().split('T')[0]) : c.date
        };
      }
      return c;
    });
    saveToLocal(updated);
  };

  return (
    <main className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-24 pt-8 transition">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Kanban Head */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10 bg-white dark:bg-slate-900 p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-left">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-md shadow-indigo-500/25">📅</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">Workflow<span className="text-indigo-600 dark:text-indigo-400">Kanban</span> Board</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold mt-1">
              Visually plan long-tail keyword clusters, orchestrate your publishing pipelines, and synchronize peer topics.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => saveToLocal(defaultKanbanCards)}
              className="btn btn-secondary px-4 py-2 text-xs font-bold"
            >
              Reset Seed Cards
            </button>
            <a href="/studio" className="btn btn-primary px-5 py-2 text-xs font-black shadow-md shadow-indigo-600/25">
              ⚡ Open Writing Studio
            </a>
          </div>
        </div>

        {/* 4 Swimlanes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start text-left">
          {swimlanes.map((lane) => {
            const columnCards = cards.filter(c => c.status === lane.id);

            return (
              <div 
                key={lane.id} 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col min-h-[550px]"
              >
                
                {/* Lane Head */}
                <div className={`flex items-center justify-between pb-3.5 mb-4 border-b-2 ${lane.color}`}>
                  <span className={`font-black text-sm ${lane.text}`}>{lane.label}</span>
                  <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-black shadow-sm">
                    {columnCards.length}
                  </span>
                </div>

                {/* Quick Add Form Trigger */}
                {addingTo === lane.id ? (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 mb-4 animate-fadeIn">
                    <input 
                      type="text" 
                      placeholder="Article Headline..." 
                      value={newTitle} 
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="input text-xs font-black py-2 rounded-xl bg-white dark:bg-slate-900"
                    />
                    <input 
                      type="text" 
                      placeholder="Target Keyword..." 
                      value={newKeyword} 
                      onChange={(e) => setNewKeyword(e.target.value)}
                      className="input text-xs font-bold py-2 rounded-xl bg-white dark:bg-slate-900"
                    />
                    <div className="flex items-center justify-between gap-2">
                      <select 
                        value={newPriority} 
                        onChange={(e) => setNewPriority(e.target.value)}
                        className="input text-xs font-bold py-1.5 rounded-lg bg-white dark:bg-slate-900 w-auto px-2"
                      >
                        <option value="High">🔴 High Priority</option>
                        <option value="Medium">🟡 Medium Priority</option>
                        <option value="Low">🟢 Low Priority</option>
                      </select>
                      <div className="flex gap-1">
                        <button onClick={() => handleCreateCard(lane.id)} className="btn btn-primary px-3 py-1 text-xs font-black">Save</button>
                        <button onClick={() => setAddingTo(null)} className="btn btn-secondary px-2 py-1 text-xs">Cancel</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setAddingTo(lane.id)}
                    className="w-full py-2.5 px-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-extrabold text-xs flex items-center justify-center gap-1.5 mb-4 transition cursor-pointer bg-slate-50/50 dark:bg-slate-800/30"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Pipeline Dispatch</span>
                  </button>
                )}

                {/* Column Card Ledger */}
                <div className="space-y-4 flex-1 overflow-y-auto max-h-[600px] pr-1">
                  {columnCards.map((card) => (
                    <div 
                      key={card.id} 
                      className="card p-5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:border-indigo-500/80 transition flex flex-col justify-between shadow-sm group"
                    >
                      <div>
                        {/* Status Tags */}
                        <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm ${
                            card.priority === 'High' ? 'bg-rose-500 text-white' : (card.priority === 'Medium' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-white')
                          }`}>
                            {card.priority} Priority
                          </span>

                          <button onClick={() => handleDeleteCard(card.id)} className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-700 font-bold text-xs transition">
                            × Delete
                          </button>
                        </div>

                        {/* Title */}
                        <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white leading-snug mb-3">
                          {card.title}
                        </h4>

                        {/* Keyword Hub */}
                        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 mb-4 shadow-2xl">
                          <Tag className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{card.keyword}</span>
                        </div>
                      </div>

                      {/* Card Foot & Fast Swimlane Moves */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700/80">
                        <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{card.date || 'Pipeline'}</span>
                        </div>

                        {/* Quick Transfer Actions */}
                        <div className="flex items-center gap-1">
                          {lane.id !== 'drafting' && (
                            <button 
                              onClick={() => {
                                const nextMap = { optimizing: 'drafting', scheduled: 'optimizing', published: 'scheduled' };
                                handleMoveCard(card.id, nextMap[lane.id]);
                              }}
                              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                              title="Move Left"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {lane.id !== 'published' && (
                            <button 
                              onClick={() => {
                                const nextMap = { drafting: 'optimizing', optimizing: 'scheduled', scheduled: 'published' };
                                handleMoveCard(card.id, nextMap[lane.id]);
                              }}
                              className="p-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-400 transition cursor-pointer font-extrabold flex items-center gap-0.5"
                              title="Move Right"
                            >
                              <span>Next</span> <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
}
