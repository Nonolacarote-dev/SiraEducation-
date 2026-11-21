import React, { useState } from 'react';
import { Flame, Trophy } from 'lucide-react';
import type { UserProfile, UserStats } from './types/sira';
import { getLevelData } from './data/pricing';
import { IF } from './components/ui';

export function ProfileTab({
  phone,
  profile,
  stats,
  onSave,
  onLogout,
}: {
  phone: string;
  profile: UserProfile | null;
  stats: UserStats;
  onSave: (p: Partial<UserProfile>) => void;
  onLogout: () => void;
}) {
  const [fullName, setFullName] = useState(profile?.fullName ?? '');
  const [email, setEmail] = useState(profile?.email ?? '');
  const [, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ fullName, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const { currentLevelMin, nextLevelMin } = getLevelData(stats.xp);
  const xpInCurrentLevel = stats.xp - currentLevelMin;
  const xpNeededForNextLevel = nextLevelMin - currentLevelMin;
  const progressPercent = xpNeededForNextLevel > 0
    ? Math.min(Math.floor((xpInCurrentLevel / xpNeededForNextLevel) * 100), 100)
    : 100;

  return (
    <div className="space-y-4">
      <div className="bg-[#2c1c0e] rounded-2xl p-5 border border-amber-500/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-[#f5e6d3] flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" /> Progression Sira ({phone})
          </h3>
          <span className="bg-amber-400/10 text-amber-400 font-black text-xs px-3 py-1 rounded-full border border-amber-400/20">
            Niveau {stats.level}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#1a0f07] p-3 rounded-xl border border-[#4a3520]">
            <p className="text-[10px] text-[#b89070] uppercase font-bold">XP Total</p>
            <p className="text-lg font-black text-amber-400 mt-0.5">{stats.xp} XP</p>
          </div>
          <div className="bg-[#1a0f07] p-3 rounded-xl border border-[#4a3520]">
            <p className="text-[10px] text-[#b89070] uppercase font-bold">Série quotidienne</p>
            <p className="text-lg font-black text-orange-400 mt-0.5 flex items-center gap-1">
              <Flame className="w-4 h-4" /> {stats.streak} jours
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-[#b89070]">
            <span>Niveau {stats.level}</span>
            <span>{stats.xp} / {nextLevelMin} XP ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-[#1a0f07] h-3 rounded-full overflow-hidden border border-[#4a3520]">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-[#4a3520]">
          <p className="text-[11px] font-black uppercase tracking-wider text-[#b89070]">Historique des gains XP</p>
          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {stats.history.length === 0 ? (
              <p className="text-[11px] text-[#6b5040] italic">Aucune action validée pour le moment.</p>
            ) : (
              stats.history.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-xs bg-[#1a0f07] p-2 rounded-xl border border-[#4a3520]">
                  <span className="text-[#f5e6d3] font-medium">✅ {item.action}</span>
                  <span className="text-[10px] text-emerald-400 font-bold">+{item.xpGained} XP</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-[#2c1c0e] rounded-2xl p-5 space-y-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Modifier Profil</p>
        <IF label="Nom complet" value={fullName} onChange={setFullName} placeholder="Kouassi Marc" />
        <IF label="Email" value={email} onChange={setEmail} placeholder="marc@gmail.com" type="email" />
        <button type="submit" className="w-full py-3.5 bg-emerald-500 text-[#1a0f07] font-black text-xs uppercase rounded-xl">Sauvegarder</button>
      </form>

      <button onClick={onLogout} className="w-full py-3.5 bg-[#2c1c0e] text-rose-400 font-black text-xs uppercase rounded-xl border border-rose-500/20">
        Déconnecter cet appareil
      </button>
    </div>
  );
}
