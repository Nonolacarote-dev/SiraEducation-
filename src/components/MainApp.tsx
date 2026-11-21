import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Baby, Calculator, LayoutGrid, Star, User, Zap } from 'lucide-react';
import type { NotificationPopup, Order, PrixConfig, ServiceType, Tab, UserProfile, UserStats, UserType } from '../types/sira';
import { DEFAULT_PRIX, WHATSAPP_NUMBER } from '../data/pricing';
import { buildFingerprint, getBanStatus, loadOrders, loadPrix, loadUserStats, saveOrders, saveUserStats } from '../utils/storage';
import { ServicesTab } from './ServicesTab';
import { AchatsEnfantTab, CalculonsTab } from './ExtraTabs';
import { AdminTab } from './AdminSection';
import { ProfileTab } from '../ProfileTab';

export default function MainApp({
  phone,
  role,
  userType,
  profile,
  onSave,
  onLogout,
}: {
  phone: string;
  role: 'client' | 'admin';
  userType: UserType;
  profile: UserProfile | null;
  onSave: (p: Partial<UserProfile>) => void;
  onLogout: () => void;
}) {
  const [tab, setTab] = useState<Tab>('services');
  const [orders, setOrders] = useState<Order[]>(() => loadOrders(phone));
  const [prix, setPrix] = useState<PrixConfig>(() => ({ ...DEFAULT_PRIX, ...loadPrix() }));
  const [stats, setStats] = useState<UserStats>(() => loadUserStats(phone));
  const [notifications, setNotifications] = useState<NotificationPopup[]>([]);

  useEffect(() => {
    const today = new Date().toDateString();
    if (!stats.lastLoginDate) {
      setStats(prev => {
        const initialStats = { ...prev, xp: 0, level: 1, streak: 0, lastLoginDate: today };
        saveUserStats(phone, initialStats);
        return initialStats;
      });
    }
  }, []);

  const triggerNotification = (message: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 2000);
  };

  const handleOrder = (label: string, detail: string, amount: number, serviceType: ServiceType) => {
    const banStatus = getBanStatus(phone);
    if (banStatus.isBanned) {
      alert(`Accès refusé : ${banStatus.reason || 'Votre compte est banni.'}`);
      return;
    }

    const id = Date.now().toString();
    const fp = buildFingerprint();
    const newOrder: Order = { id, phoneClient: phone, label, detail, amount, validated: false, serviceType };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    saveOrders(phone, updatedOrders);

    triggerNotification('⏳ Commande enregistrée ! En attente de validation admin.');

    const msg = encodeURIComponent(
      `Sira Éducation\nService : ${label}\nDétail : ${detail}\nMontant : ${amount} FCFA\nCommande N°${id.slice(-6)}\nClient : ${phone}\nID : ${fp}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  const tabs =
    role === 'admin'
      ? [
          { key: 'services' as Tab, icon: Star, label: 'Services' },
          { key: 'admin' as Tab, icon: LayoutGrid, label: 'Admin' },
          { key: 'profile' as Tab, icon: User, label: 'Profil' },
        ]
      : userType === 'parent'
      ? [
          { key: 'services' as Tab, icon: Star, label: 'Services' },
          { key: 'enfant' as Tab, icon: Baby, label: 'Mon enfant' },
          { key: 'profile' as Tab, icon: User, label: 'Profil' },
        ]
      : [
          { key: 'services' as Tab, icon: Star, label: 'Services' },
          { key: 'calculons' as Tab, icon: Calculator, label: 'Calculons' },
          { key: 'profile' as Tab, icon: User, label: 'Profil' },
        ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto relative">
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-amber-500 text-[#1a0f07] px-4 py-2 rounded-xl shadow-2xl font-black text-xs border border-amber-300"
            >
              <span>{n.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <header className="shrink-0 flex items-center justify-between px-4 py-3 bg-[#2c1c0e] border-b border-[#1a0f07]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-[#1a0f07]" />
          </div>
          <div>
            <p className="text-[#f5e6d3] font-black text-base leading-none tracking-wide">Sira</p>
            <p className="text-emerald-400 text-[9px] uppercase tracking-widest font-bold mt-0.5">Académie Privée</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-[#1a0f07] px-4 pt-4 pb-24">
        {tab === 'services' && <ServicesTab onOrder={handleOrder} prix={prix} />}
        {tab === 'calculons' && <CalculonsTab />}
        {tab === 'enfant' && <AchatsEnfantTab />}
        {tab === 'admin' && role === 'admin' && <AdminTab prix={prix} onPrixChange={setPrix} />}
        {tab === 'profile' && <ProfileTab phone={phone} profile={profile} stats={stats} onSave={onSave} onLogout={onLogout} />}
      </main>

      <nav className="shrink-0 max-w-md w-full fixed bottom-0 left-1/2 -translate-x-1/2 bg-[#2c1c0e] border-t border-[#1a0f07] flex">
        {tabs.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex flex-col items-center gap-1 py-3.5 transition-colors ${
              tab === key ? 'text-emerald-400' : 'text-[#b89070] opacity-50 hover:opacity-80'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
