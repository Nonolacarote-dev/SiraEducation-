import type { BanInfo, Order, PrixConfig, UserStats } from '../types/sira';
import { DEFAULT_PRIX } from '../data/pricing';

export function buildFingerprint(): string {
  const d = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    `${screen.width}x${screen.height}`,
    String((navigator as any).hardwareConcurrency ?? 4),
  ].join('|');
  let h = 0;
  for (let i = 0; i < d.length; i++) h = (Math.imul(31, h) + d.charCodeAt(i)) | 0;
  return 'SIRA_DEV_' + Math.abs(h);
}

const getStorageKey = (phone: string) => `sira_stats_${phone}`;

export const loadUserStats = (phone: string): UserStats => {
  try {
    const saved = localStorage.getItem(getStorageKey(phone));
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Erreur stats', e);
  }
  return { xp: 0, level: 0, streak: 0, completedActions: 0, history: [] };
};

export const saveUserStats = (phone: string, stats: UserStats) => {
  try {
    localStorage.setItem(getStorageKey(phone), JSON.stringify(stats));
  } catch (e) {
    console.error('Erreur sauvegarde stats', e);
  }
};

export function getBanStatus(phone: string): BanInfo {
  try {
    const blacklist: string[] = JSON.parse(localStorage.getItem('sira_blacklist') ?? '[]');
    if (blacklist.includes(phone)) {
      return { isBanned: true, type: 'permanent', reason: 'Compte banni définitivement.' };
    }
    const bans: Record<string, BanInfo> = JSON.parse(localStorage.getItem('sira_temp_bans') ?? '{}');
    const userBan = bans[phone];
    if (userBan && userBan.isBanned && userBan.until) {
      if (new Date() < new Date(userBan.until)) {
        return userBan;
      }
      delete bans[phone];
      localStorage.setItem('sira_temp_bans', JSON.stringify(bans));
    }
  } catch (e) {
    console.error(e);
  }
  return { isBanned: false };
}

export function loadPrix(): PrixConfig {
  try {
    return JSON.parse(localStorage.getItem('sira_prix') ?? '{}') ?? DEFAULT_PRIX;
  } catch {
    return DEFAULT_PRIX;
  }
}

export function savePrix(p: PrixConfig) {
  localStorage.setItem('sira_prix', JSON.stringify(p));
}

export function saveOrders(phone: string, orders: Order[]) {
  localStorage.setItem(`sira_orders_${phone}`, JSON.stringify(orders));
  const allOrders = loadAllOrders();
  const filtered = allOrders.filter(o => o.phoneClient !== phone);
  localStorage.setItem('sira_all_orders', JSON.stringify([...filtered, ...orders]));
}

export function loadOrders(phone: string): Order[] {
  try {
    return JSON.parse(localStorage.getItem(`sira_orders_${phone}`) ?? '[]');
  } catch {
    return [];
  }
}

export function loadAllOrders(): Order[] {
  try {
    return JSON.parse(localStorage.getItem('sira_all_orders') ?? '[]');
  } catch {
    return [];
  }
}

export function getAllRegisteredPhones(): string[] {
  const phones: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('sira_profile_')) {
      phones.push(key.replace('sira_profile_', ''));
    }
  }
  return phones;
}
