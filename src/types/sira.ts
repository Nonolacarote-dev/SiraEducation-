export type AuthStep = 'phone' | 'otp' | 'password' | 'usertype' | 'app';
export type UserType = 'eleve' | 'parent';
export type Tab = 'services' | 'calculons' | 'enfant' | 'gains' | 'admin' | 'profile';
export type ServiceType = 'cours' | 'exercice' | 'fiche' | 'examen';

export interface PrixConfig {
  cours: number;
  exercices: number;
  fiche: number;
  examen: number;
}

export interface UserProfile {
  phone: string;
  fullName: string;
  email: string;
  city: string;
  school: string;
  createdAt: string;
  userType: UserType;
}

export interface Order {
  id: string;
  phoneClient: string;
  label: string;
  detail: string;
  amount: number;
  validated?: boolean;
  serviceType?: ServiceType;
}

export interface BanInfo {
  isBanned: boolean;
  type?: 'temporary' | 'permanent';
  until?: string;
  reason?: string;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  completedActions: number;
  lastLoginDate?: string;
  history: { action: string; xpGained: number; date: string }[];
}

export interface NotificationPopup {
  id: number;
  message: string;
}
