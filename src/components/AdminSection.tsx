import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Square } from 'lucide-react';
import type { BanInfo, Order, PrixConfig, UserStats } from '../types/sira';
import { ADMIN_PHONE, calculateXpFromPrice, getLevelData } from '../data/pricing';
import {
  getAllRegisteredPhones,
  getBanStatus,
  loadAllOrders,
  loadOrders,
  loadUserStats,
  saveOrders,
  savePrix,
  saveUserStats,
} from '../utils/storage';

function AdminClientModal({ phone, onClose, onRefresh }: { phone: string; onClose: () => void; onRefresh: () => void }) {
  const [orders, setOrders] = useState<Order[]>(loadOrders(phone));
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [banDays, setBanDays] = useState('1');
  const profile = JSON.parse(localStorage.getItem(`sira_profile_${phone}`) || '{}');
  const stats = loadUserStats(phone);
  const banStatus = getBanStatus(phone);

  const toggleSelect = (id: string) => {
    setSelectedOrderIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const validateSelectedOrders = () => {
    if (selectedOrderIds.length === 0) {
      alert('Veuillez sélectionner au moins une commande.');
      return;
    }

    let totalXpGain = 0;
    const allOrders = loadAllOrders();

    const updatedClientOrders = orders.map(o => {
      if (selectedOrderIds.includes(o.id)) {
        totalXpGain += calculateXpFromPrice(o.amount);
        return { ...o, validated: true };
      }
      return o;
    });

    setOrders(updatedClientOrders);
    saveOrders(phone, updatedClientOrders);

    const updatedAllOrders = allOrders.map(o => (selectedOrderIds.includes(o.id) ? { ...o, validated: true } : o));
    localStorage.setItem('sira_all_orders', JSON.stringify(updatedAllOrders));

    const newXp = stats.xp + totalXpGain;
    const newLevel = getLevelData(newXp).level;
    const updatedStats: UserStats = {
      ...stats,
      xp: newXp,
      level: newLevel,
      completedActions: stats.completedActions + selectedOrderIds.length,
      history: [
        {
          action: `Validation Admin (${selectedOrderIds.length} commandes)`,
          xpGained: totalXpGain,
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        ...stats.history,
      ].slice(0, 20),
    };
    saveUserStats(phone, updatedStats);

    alert(`Succès ! ${selectedOrderIds.length} commande(s) validée(s). +${totalXpGain} XP attribués à ${phone}.`);
    setSelectedOrderIds([]);
    onRefresh();
  };

  const banTemporary = () => {
    const days = parseInt(banDays) || 1;
    const until = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    const bans: Record<string, BanInfo> = JSON.parse(localStorage.getItem('sira_temp_bans') ?? '{}');
    bans[phone] = { isBanned: true, type: 'temporary', until, reason: `Banni temporairement pour ${days} jour(s).` };
    localStorage.setItem('sira_temp_bans', JSON.stringify(bans));
    alert(`Le compte ${phone} a été banni temporairement pour ${days} jour(s).`);
    onRefresh();
  };

  const banPermanent = () => {
    if (phone === ADMIN_PHONE) {
      alert('Impossible de bannir le compte admin !');
      return;
    }
    if (confirm(`Bannir DÉFINITIVEMENT le compte ${phone} ? Il ne pourra PLUS JAMAIS créer de compte avec ce numéro.`)) {
      const blacklist: string[] = JSON.parse(localStorage.getItem('sira_blacklist') ?? '[]');
      if (!blacklist.includes(phone)) {
        blacklist.push(phone);
        localStorage.setItem('sira_blacklist', JSON.stringify(blacklist));
      }
      localStorage.removeItem(`sira_profile_${phone}`);
      localStorage.removeItem(`sira_stats_${phone}`);
      localStorage.removeItem(`sira_orders_${phone}`);
      alert(`Le numéro ${phone} a été banni à vie et ajouté à la liste noire.`);
      onRefresh();
      onClose();
    }
  };

  const unban = () => {
    const blacklist: string[] = JSON.parse(localStorage.getItem('sira_blacklist') ?? '[]');
    localStorage.setItem('sira_blacklist', JSON.stringify(blacklist.filter(p => p !== phone)));
    const bans: Record<string, BanInfo> = JSON.parse(localStorage.getItem('sira_temp_bans') ?? '{}');
    delete bans[phone];
    localStorage.setItem('sira_temp_bans', JSON.stringify(bans));
    alert(`Bannissement levé pour ${phone}.`);
    onRefresh();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#2c1c0e] border border-[#4a3520] rounded-3xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start border-b border-[#4a3520] pb-3">
          <div>
            <h3 className="text-base font-black text-[#f5e6d3]">{profile.fullName || 'Élève Sira'} ({phone})</h3>
            <p className="text-xs text-amber-400 mt-0.5">Niveau {stats.level} — {stats.xp} XP | {orders.length} commande(s) totale(s)</p>
            {banStatus.isBanned && (
              <span className="inline-block mt-1 bg-rose-500/20 text-rose-400 font-bold text-[10px] px-2 py-0.5 rounded border border-rose-500/30">
                🚫 {banStatus.type === 'permanent' ? 'Banni à vie' : 'Banni temporairement'}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-[#b89070] hover:text-[#f5e6d3] font-black text-sm">✕ Fermer</button>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">Sélectionner les commandes à valider :</p>
          {orders.length === 0 ? (
            <p className="text-xs text-[#b89070] italic">Aucune commande enregistrée pour ce compte.</p>
          ) : (
            orders.map(o => {
              const isSelected = selectedOrderIds.includes(o.id);
              const xpForThis = calculateXpFromPrice(o.amount);
              return (
                <div
                  key={o.id}
                  onClick={() => !o.validated && toggleSelect(o.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    o.validated
                      ? 'bg-[#1a0f07]/40 border-emerald-500/20 opacity-60 cursor-default'
                      : isSelected
                      ? 'bg-emerald-500/10 border-emerald-500'
                      : 'bg-[#1a0f07] border-[#4a3520] hover:border-amber-500/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {!o.validated && (isSelected ? <CheckSquare className="w-5 h-5 text-emerald-400" /> : <Square className="w-5 h-5 text-[#b89070]" />)}
                    <div>
                      <p className="text-xs font-bold text-[#f5e6d3]">{o.label}</p>
                      <p className="text-[10px] text-[#b89070]">{o.detail}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-400">{o.amount} F</span>
                    <p className="text-[9px] text-amber-400">{o.validated ? 'Validé ✅' : `+${xpForThis} XP`}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button
          onClick={validateSelectedOrders}
          disabled={selectedOrderIds.length === 0}
          className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-[#1a0f07] font-black text-xs uppercase tracking-widest rounded-xl transition-colors"
        >
          Valider et attribuer l'XP ({selectedOrderIds.length} sélectionnée(s))
        </button>

        <div className="space-y-3 pt-3 border-t border-[#4a3520]">
          <p className="text-[11px] font-black text-rose-400 uppercase tracking-widest">🚫 Option de Bannissement</p>
          {banStatus.isBanned ? (
            <button onClick={unban} className="w-full py-2.5 bg-emerald-500/20 text-emerald-400 font-bold text-xs uppercase rounded-xl border border-emerald-500/30">
              Débannir ce compte
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={banDays}
                  onChange={e => setBanDays(e.target.value)}
                  placeholder="Jours"
                  className="w-24 bg-[#1a0f07] border border-[#4a3520] text-center text-xs font-bold text-[#f5e6d3] rounded-xl px-2"
                />
                <button onClick={banTemporary} className="flex-1 py-2.5 bg-amber-500/20 text-amber-400 font-bold text-xs uppercase rounded-xl border border-amber-500/30">
                  Bannir Temporairement
                </button>
              </div>
              <button onClick={banPermanent} className="w-full py-2.5 bg-rose-500/20 text-rose-400 font-black text-xs uppercase rounded-xl border border-rose-500/30">
                Bannir à Vie (Compte + Numéro Bloqué)
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function AdminTab({ prix, onPrixChange }: { prix: PrixConfig; onPrixChange: (p: PrixConfig) => void }) {
  const [local, setLocal] = useState<PrixConfig>(prix);
  const [saved, setSaved] = useState(false);
  const [allPhones, setAllPhones] = useState<string[]>(getAllRegisteredPhones());
  const [selectedClientPhone, setSelectedClientPhone] = useState<string | null>(null);

  const savePrices = () => {
    onPrixChange(local);
    savePrix(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const refreshData = () => {
    setAllPhones(getAllRegisteredPhones());
  };

  const allOrders = loadAllOrders();
  const totalRevenue = allOrders.filter(o => o.validated).reduce((s, o) => s + o.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#2c1c0e] rounded-2xl p-4">
          <p className="text-[#b89070] text-[10px] uppercase font-bold">Chiffre validé</p>
          <p className="text-emerald-400 text-2xl font-black mt-1">{totalRevenue} F</p>
        </div>
        <div className="bg-[#2c1c0e] rounded-2xl p-4">
          <p className="text-[#b89070] text-[10px] uppercase font-bold">Comptes inscrits</p>
          <p className="text-[#f5e6d3] text-2xl font-black mt-1">{allPhones.length}</p>
        </div>
      </div>

      <div className="bg-[#2c1c0e] rounded-2xl p-5 space-y-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">👥 Comptes &amp; Gestion des Commandes par Élève</p>
        <p className="text-[11px] text-[#b89070]">Cliquez sur un compte pour ouvrir sa fenêtre, valider ses commandes ou gérer les sanctions/bannissements.</p>

        <div className="space-y-2 pt-2">
          {allPhones.map(p => {
            const prof = JSON.parse(localStorage.getItem(`sira_profile_${p}`) || '{}');
            const stats = loadUserStats(p);
            const clientOrders = loadOrders(p);
            const pendingCount = clientOrders.filter(o => !o.validated).length;
            const banStatus = getBanStatus(p);

            return (
              <div
                key={p}
                onClick={() => setSelectedClientPhone(p)}
                className={`p-3.5 rounded-xl border flex justify-between items-center cursor-pointer transition-colors ${
                  banStatus.isBanned ? 'bg-rose-950/20 border-rose-500/30' : 'bg-[#1a0f07] hover:bg-[#3d2a18]/40 border-[#4a3520]'
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-[#f5e6d3]">
                    {prof.fullName || 'Élève Sira'} ({p})
                    {banStatus.isBanned && <span className="ml-2 text-rose-400 text-[10px]">🚫 [Banni]</span>}
                  </p>
                  <p className="text-[10px] text-[#b89070] mt-0.5">Niveau {stats.level} — {stats.xp} XP | {clientOrders.length} commandes ({pendingCount} en attente)</p>
                </div>
                <span className="text-[10px] font-black bg-amber-400/10 text-amber-400 px-3 py-1.5 rounded-lg border border-amber-400/20">
                  Gérer ➔
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {selectedClientPhone && (
        <AdminClientModal phone={selectedClientPhone} onClose={() => setSelectedClientPhone(null)} onRefresh={refreshData} />
      )}

      <div className="bg-[#2c1c0e] rounded-2xl p-5 space-y-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">💰 Modifier les tarifs (XP proportionnelle)</p>
        {([['cours','Cours complet'],['exercices','Exercices corrigés'],['fiche','Fiche de révision'],['examen','Préparation examen']] as [keyof PrixConfig, string][]).map(([k, label]) => (
          <div key={k} className="space-y-1">
            <label className="text-[10px] font-bold text-[#b89070] uppercase">{label} (FCFA)</label>
            <input
              type="number"
              value={local[k]}
              onChange={e => setLocal(p => ({ ...p, [k]: parseInt(e.target.value) || 0 }))}
              className="w-full bg-[#3d2a18] text-emerald-400 font-bold text-sm rounded-xl px-3 py-2 outline-none border border-[#4a3520]"
            />
          </div>
        ))}
        <button onClick={savePrices} className="w-full py-3 bg-emerald-500 text-[#1a0f07] font-black text-xs uppercase rounded-xl">
          {saved ? 'Enregistré !' : 'Sauvegarder les prix'}
        </button>
      </div>
    </div>
  );
}
