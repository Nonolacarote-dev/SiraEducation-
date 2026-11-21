import { useState } from 'react';
import type { Order } from '../types/sira';
import { loadOrders } from '../utils/storage';
import { GBtn, IF, SF } from './ui';

export function CalculonsTab() {
  const [notes, setNotes] = useState<{ id: string; matiere: string; note: number; coef: number }[]>([]);
  const [newMat, setNewMat] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newCoef, setNewCoef] = useState('2');

  const addNote = () => {
    const n = parseFloat(newNote);
    const c = parseFloat(newCoef);
    if (!newMat || isNaN(n) || n < 0 || n > 20 || isNaN(c) || c < 1) return;
    setNotes(prev => [...prev, { id: Date.now().toString(), matiere: newMat, note: n, coef: c }]);
    setNewNote('');
    setNewMat('');
    setNewCoef('2');
  };

  const moyenne = notes.length
    ? notes.reduce((s, e) => s + e.note * e.coef, 0) / notes.reduce((s, e) => s + e.coef, 0)
    : null;
  const moyColor = moyenne === null ? '' : moyenne >= 10 ? 'text-emerald-400' : moyenne >= 8 ? 'text-amber-400' : 'text-rose-400';

  return (
    <div className="space-y-4">
      <div className="bg-[#2c1c0e] rounded-2xl p-5 space-y-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Calculateur de Moyenne</p>
        <SF label="Matière" value={newMat} onChange={setNewMat} options={['Mathématiques','Français','Anglais','Physique-Chimie','SVT','Histoire-Géo','Philosophie']} placeholder="Choisir…" />
        <div className="grid grid-cols-2 gap-3">
          <IF label="Note (/20)" value={newNote} onChange={setNewNote} placeholder="14" type="number" />
          <IF label="Coefficient" value={newCoef} onChange={setNewCoef} placeholder="2" type="number" />
        </div>
        <button onClick={addNote} className="w-full py-3 bg-[#3d2a18] text-[#f5e6d3] font-black text-xs rounded-xl uppercase">Ajouter</button>
      </div>

      {moyenne !== null && (
        <div className="bg-[#2c1c0e] rounded-2xl p-5 text-center">
          <p className="text-[#b89070] text-[10px] uppercase font-bold">Moyenne générale</p>
          <p className={`font-black text-4xl ${moyColor}`}>{moyenne.toFixed(2)} / 20</p>
        </div>
      )}
    </div>
  );
}

export function AchatsEnfantTab() {
  const [childPhone, setChildPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  const search = () => {
    const p = childPhone.trim().replace(/\s+/g, '');
    if (!p) return;
    setOrders(loadOrders(p));
    setSearched(true);
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#2c1c0e] rounded-2xl p-5 space-y-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Suivi Enfant</p>
        <IF label="Numéro de l'élève" value={childPhone} onChange={setChildPhone} placeholder="0798123456" />
        <GBtn onClick={search}>Consulter les achats</GBtn>
      </div>
      {searched && orders.map(o => (
        <div key={o.id} className="bg-[#2c1c0e] rounded-xl px-4 py-3 flex justify-between items-center">
          <div>
            <p className="text-[#f5e6d3] font-bold text-sm">{o.label} {o.validated ? '✅' : '⏳'}</p>
            <p className="text-[#b89070] text-[10px]">{o.detail}</p>
          </div>
          <span className="text-emerald-400 font-bold">{o.amount} F</span>
        </div>
      ))}
    </div>
  );
}
