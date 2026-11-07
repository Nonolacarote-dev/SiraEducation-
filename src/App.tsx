import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, TrendingUp, BookOpen, FileText, PenTool, GraduationCap,
  CheckCircle2, MessageCircle, ClipboardList, Trophy, Star,
  ShieldCheck, Lock, User, LogOut, Ban, Scale, Shield,
  LayoutGrid, Plus, Trash2, Calculator, Compass, TrendingDown,
  Eye, Baby, Award, Flame, Users, CheckSquare, Square, Clock
} from 'lucide-react';

// ─── Constantes ───────────────────────────────────────────────────────────────
const ADMIN_PHONE    = '0100119314';
const ADMIN_PASSWORD = '0882';

// ─── Systèmes d'éducation ─────────────────────────────────────────────────────
const SYSTEMES = [
  { id: 'ivoirien',    label: '🇨🇮 Système Ivoirien (MENA-CI)' },
  { id: 'français',   label: '🇫🇷 Système Français (Éducation Nationale)' },
  { id: 'burkinabe',  label: '🇧🇫 Système Burkinabé (MESS)' },
  { id: 'senegalais', label: '🇸🇳 Système Sénégalais (MEN)' },
  { id: 'camerounais',label: '🇨🇲 Système Camerounais (MINESEC)' },
  { id: 'malien',     label: '🇲🇱 Système Malien (MEN-Mali)' },
  { id: 'guineen',    label: '🇬🇳 Système Guinéen (MEPU-EC)' },
  { id: 'beninois',   label: '🇧🇯 Système Béninois (MEMP)' },
  { id: 'togolais',   label: '🇹🇬 Système Togolais (MEPSTA)' },
];

const NIVEAUX_BY_SYSTEME: Record<string, string[]> = {
  ivoirien:    ['6ème','5ème','4ème','3ème','2nde','1ère A','1ère C','1ère D','Tle A','Tle C','Tle D'],
  français:    ['6ème','5ème','4ème','3ème','Seconde','Première Générale','Première Techno','Terminale Générale','Terminale Techno'],
  burkinabe:   ['6ème','5ème','4ème','3ème','Seconde','Première A','Première C','Première D','Tle A','Tle C','Tle D'],
  senegalais:  ['6ème','5ème','4ème','3ème','Seconde','Première L','Première S1','Première S2','Terminale L','Terminale S1','Terminale S2'],
  camerounais: ['6ème','5ème','4ème','3ème','Seconde','Première A','Première C','Première D','Tle A','Tle C','Tle D'],
  malien:      ['7ème','8ème','9ème','10ème','11ème','12ème'],
  guineen:     ['7ème','8ème','9ème','10ème','11ème','12ème'],
  beninois:    ['6ème','5ème','4ème','3ème','Seconde','Première A','Première C','Première D','Tle A','Tle C','Tle D'],
  togolais:    ['6ème','5ème','4ème','3ème','Seconde','Première A1','Première C','Première D','Tle A1','Tle C','Tle D'],
};

function niveauKey(n: string): string {
  if (['6ème','7ème'].includes(n))                                    return '6e';
  if (['5ème','8ème'].includes(n))                                    return '5e';
  if (['4ème','9ème'].includes(n))                                    return '4e';
  if (['3ème','10ème'].includes(n))                                   return '3e';
  if (['2nde','Seconde','11ème'].includes(n))                        return '2nde';
  if (n.includes('1ère A') || n.includes('Première A') ||
      n.includes('Première L') || n.includes('Première G') ||
      n.includes('A1'))                                              return '1A';
  if (n.includes('1ère C') || n.includes('Première C'))             return '1C';
  if (n.includes('1ère D') || n.includes('Première D') ||
      n.includes('S1') || n.includes('S2') ||
      n.includes('Première Générale') || n.includes('Première Techno')) return '1D';
  if (n.includes('Tle A') || n.includes('Terminale A') ||
      n.includes('Terminale L') || n.includes('12ème'))             return 'TleA';
  if (n.includes('Tle C') || n.includes('Terminale C'))             return 'TleC';
  return 'TleD';
}

const MATIERES_BY_KEY: Record<string, string[]> = {
  '6e':   ['Mathématiques','Français','Anglais','Histoire-Géographie','Sciences de la Vie et de la Terre','Physique-Chimie','Éducation Civique'],
  '5e':   ['Mathématiques','Français','Anglais','Histoire-Géographie','Sciences de la Vie et de la Terre','Physique-Chimie','Espagnol (2ème LV)'],
  '4e':   ['Mathématiques','Français','Anglais','Histoire-Géographie','Sciences de la Vie et de la Terre','Physique-Chimie','Espagnol (2ème LV)'],
  '3e':   ['Mathématiques','Français','Anglais','Histoire-Géographie','Sciences de la Vie et de la Terre','Physique-Chimie','Éducation Civique et Morale'],
  '2nde': ['Mathématiques','Français','Anglais','Histoire-Géographie','Sciences de la Vie et de la Terre','Physique-Chimie','Philosophie (introduction)'],
  '1A':   ['Français','Philosophie','Histoire-Géographie','Anglais','Espagnol','Mathématiques'],
  '1C':   ['Mathématiques','Physique-Chimie','Français','Anglais','Histoire-Géographie'],
  '1D':   ['Mathématiques','Sciences de la Vie et de la Terre','Physique-Chimie','Français','Anglais','Histoire-Géographie'],
  'TleA': ['Français','Philosophie','Histoire-Géographie','Anglais','Espagnol','Mathématiques'],
  'TleC': ['Mathématiques','Physique-Chimie','Français','Anglais','Histoire-Géographie'],
  'TleD': ['Mathématiques','Sciences de la Vie et de la Terre','Physique-Chimie','Français','Anglais','Histoire-Géographie'],
};

const LECONS: Record<string, Record<string, string[]>> = {
  '6e': {
    'Mathématiques': ['Entiers naturels — Numération et opérations','Nombres décimaux','Divisibilité — PGCD et PPCM','Fractions ordinaires','Droites, demi-droites et segments','Les angles','Triangles — Propriétés et construction','Le cercle','Périmètres et aires des figures planes','Introduction aux statistiques'],
    'Français': ['La situation de communication','La phrase et ses types','Le groupe nominal','Le groupe verbal','Accord du verbe avec le sujet','Temps du passé (imparfait, passé composé)','La description','Le récit — conte et légende','La lettre familière'],
    'Anglais': ['Greetings and introductions','The family and school','Simple present tense','Numbers and daily routines','Food and drinks','Describing people','Days, months and seasons','My town and neighbourhood'],
    'Histoire-Géographie': ['La préhistoire','Les grandes civilisations de l\'Antiquité','Les royaumes d\'Afrique ancienne','Géographie de l\'Afrique','L\'Afrique de l\'Ouest','Les activités économiques de base','La population — distribution et densité'],
    'Sciences de la Vie et de la Terre': ['La cellule — unité du vivant','Nutrition chez les plantes vertes','Nutrition chez les animaux','Reproduction des êtres vivants','L\'eau dans la nature','Les roches et les sols','Hygiène et santé'],
    'Physique-Chimie': ['La matière — états et propriétés','Mélanges et corps purs','Les solutions aqueuses','Circuit électrique simple — courant et tension','Mesures de grandeurs physiques'],
  },
  '5e': {
    'Mathématiques': ['Nombres relatifs — repérage et calcul','Fractions — multiplication et division','Proportionnalité et pourcentages','Introduction à l\'algèbre — expressions littérales','Triangles — médiatrices et bissectrices','Quadrilatères particuliers','Cercle et disque — arc et secteur','Statistiques — fréquences et diagrammes'],
    'Français': ['Le récit littéraire — structure et personnages','La poésie — vers et strophes','Le théâtre — dialogue et mise en scène','Classes grammaticales des mots','Propositions subordonnées relatives','Le passé simple','L\'argumentation — thèse et arguments','Le compte rendu de lecture'],
    'Anglais': ['Present continuous','Past simple (regular and irregular)','Comparatives and superlatives','Modal verbs (can, must, should)','Food and health','Transport and travel','The environment'],
    'Histoire-Géographie': ['Les grands empires africains médiévaux','Le monde arabe et l\'Islam','L\'Europe médiévale','Géographie physique du monde','Ressources naturelles','L\'urbanisation en Afrique'],
    'Sciences de la Vie et de la Terre': ['Digestion — organes et nutriments','Respiration et circulation sanguine','Reproduction chez les mammifères','Introduction à l\'hérédité','Les écosystèmes','Roches magmatiques et sédimentaires'],
    'Physique-Chimie': ['Atomes et molécules','Le tableau périodique (introduction)','Liaisons chimiques','Loi d\'Ohm — résistances','Lumière et optique géométrique'],
  },
  '4e': {
    'Mathématiques': ['Équations du 1er degré à une inconnue','Inéquations du 1er degré','Théorème de Pythagore','Théorème de Thalès — introduction','Trigonométrie — sin, cos, tan dans le triangle rectangle','Statistiques — moyenne, médiane, mode','Probabilités — introduction','Solides de l\'espace — volumes et surfaces'],
    'Français': ['Le roman — personnage et narration','Autobiographie et biographie','Le conte philosophique','Propositions subordonnées conjonctives','Le discours indirect','Versification et figures de style','La dissertation littéraire — initiation'],
    'Anglais': ['Present perfect','Future tenses (will / going to)','Passive voice','Conditional type 1 and 2','Social issues vocabulary','Science and technology','Formal writing — letter and email'],
    'Histoire-Géographie': ['La traite négrière et l\'esclavage','La colonisation en Afrique','Les révolutions (XVIIIe-XIXe siècle)','Le monde contemporain après 1945','Géopolitique de l\'Afrique','Développement et sous-développement'],
    'Sciences de la Vie et de la Terre': ['Immunologie et maladies infectieuses','VIH/SIDA — prévention','Reproduction chez les plantes','Chromosomes et ADN','Tectonique des plaques — introduction','Environnement et développement durable'],
    'Physique-Chimie': ['Forces et mouvement — notion de force','Lois de Newton','Circuits en série et en parallèle','Optique — lentilles convergentes et divergentes','Chimie organique — introduction'],
  },
  '3e': {
    'Mathématiques': ['Développement et factorisation','Équations et systèmes du 1er degré','Théorème de Thalès — complet et réciproque','Racines carrées et équations du 2nd degré (intro)','Fonctions linéaires et affines','Statistiques descriptives — boîte à moustaches','Probabilités — dénombrement','Vecteurs — introduction'],
    'Français': ['Le roman réaliste et naturaliste','La nouvelle littéraire','Littérature africaine francophone','Implicite et explicite dans un texte','Figures de rhétorique avancées','L\'éloquence et le discours','Commentaire de texte — méthode'],
    'Anglais': ['Reported speech','Relative clauses','Conditional type 3','Global issues vocabulary','Writing — formal letters and essays','Literature in English — short stories'],
    'Histoire-Géographie': ['Décolonisation en Afrique','La Guerre Froide','Les indépendances africaines','La Côte d\'Ivoire contemporaine','La mondialisation','Géographie de la Côte d\'Ivoire','Enjeux environnementaux mondiaux'],
    'Sciences de la Vie et de la Terre': ['Génétique — génotype et phénotype','Évolution des espèces','Immunologie approfondie','Séismes et volcans','Énergie et métabolisme','Bilan SVT collège'],
    'Physique-Chimie': ['Travail et énergie mécanique','Lois de Kirchhoff','Réactions acide-base','Optique — miroirs et lentilles','Ondes — introduction'],
    'Éducation Civique et Morale': ['Les droits de l\'Homme','Les institutions de la Côte d\'Ivoire','La démocratie et le citoyen','La lutte contre la corruption','Les institutions africaines et mondiales'],
  },
  '2nde': {
    'Mathématiques': ['Ensembles de nombres (N, Z, Q, R, C)','Fonctions numériques — généralités et représentations','Fonctions affines et linéaires','Fonctions du second degré','Trigonométrie — cercle trigonométrique','Vecteurs dans le plan','Statistiques et probabilités','Suites numériques — introduction'],
    'Français': ['Le roman et ses genres','La poésie lyrique et engagée','Méthodes d\'analyse de texte','Grammaire de l\'énonciation','Synthèse de documents'],
    'Anglais': ['Advanced grammar review','Literature — short stories and novels','Current affairs and debates','Academic writing skills'],
    'Histoire-Géographie': ['Bilan de la 2ème Guerre mondiale','La décolonisation','Le monde bipolaire','Développement durable','L\'Afrique dans le monde'],
    'Sciences de la Vie et de la Terre': ['Biologie cellulaire approfondie','Métabolisme — photosynthèse et respiration','ADN et chromosomes','Tectonique des plaques','Écologie et biomes'],
    'Physique-Chimie': ['Cinématique — mouvement rectiligne','Dynamique — forces et équilibre','Électricité — loi des nœuds et des mailles','Optique — réfraction et réflexion','Structure électronique des atomes','Liaisons chimiques et géométrie moléculaire'],
    'Philosophie (introduction)': ['Introduction à la philosophie','La conscience','La liberté','La connaissance'],
  },
  '1D': {
    'Mathématiques': ['Dérivées — définition et calcul','Dérivées — tableaux de variation et extrema','Fonction logarithme népérien','Fonction exponentielle','Suites arithmétiques et géométriques','Probabilités — variables aléatoires discrètes','Géométrie analytique — droites et cercles','Trigonométrie avancée — formules'],
    'Physique-Chimie': ['Cinétique — vitesse et accélération','Dynamique — lois de Newton appliquées','Condensateurs — charge et décharge','Ondes — propriétés et propagation','Chimie organique — familles fonctionnelles','Équilibres acide-base en solution'],
    'Sciences de la Vie et de la Terre': ['Méiose et fécondation','Lois de Mendel et génétique','Réactions immunitaires — anticorps','Le système nerveux — neurones et influx','Orogenèse et chaînes de montagnes','Flux d\'énergie dans les écosystèmes'],
    'Français': ['Littérature africaine — Négritude (Césaire, Senghor)','Le roman africain contemporain','Argumentation et rhétorique','Résumé et synthèse de documents'],
    'Histoire-Géographie': ['La Guerre froide — détente et fin','Le monde après 1989','Géopolitique mondiale','Développement de l\'Afrique','Enjeux énergétiques mondiaux'],
  },
  '1C': {
    'Mathématiques': ['Polynômes et fractions rationnelles','Dérivées — applications avancées','Logarithme et exponentielle','Nombres complexes — introduction','Suites et récurrences','Probabilités — loi binomiale','Géométrie analytique avancée'],
    'Physique-Chimie': ['Lois de Newton — applications complexes','Énergie cinétique et potentielle','Oscillations LC — circuits électriques','Ondes électromagnétiques','Cinétique chimique','Chimie organique — réactions de substitution et addition'],
    'Français': ['Textes littéraires et argumentation','Littérature comparée','Méthodes rédactionnelles avancées'],
    'Histoire-Géographie': ['Le monde contemporain','Géopolitique et géoéconomie','L\'Afrique dans la mondialisation'],
  },
  '1A': {
    'Français': ['Roman — naturalisme et réalisme','Poésie — symbolisme et surréalisme','Théâtre — tragédie classique et contemporaine','Dissertation littéraire — méthode complète','Stylistique et figures de style avancées'],
    'Philosophie': ['La conscience et l\'inconscient','La liberté et la responsabilité','La raison et la vérité','La morale et la justice','L\'art et la beauté','La politique et l\'État'],
    'Histoire-Géographie': ['L\'Afrique post-coloniale','Géopolitique mondiale','La mondialisation culturelle','Les conflits contemporains'],
    'Anglais': ['Literature and civilization','Debates and argumentation','Formal writing in English','Media and communication'],
    'Mathématiques': ['Statistiques et probabilités','Fonctions — révisions','Suites numériques de base'],
  },
  'TleD': {
    'Mathématiques': ['Calcul intégral — primitive et intégrale définie','Nombres complexes — formes algébrique et trigonométrique','Suites — convergence et limites','Probabilités — lois continues (loi normale)','Statistiques inférentielles','Équations différentielles (introduction)','Géométrie dans l\'espace — plans et droites'],
    'Physique-Chimie': ['Mouvement circulaire et satellite','Théorème de l\'énergie cinétique','Oscillations forcées et résonance','Diffraction et interférences','Réactions d\'oxydoréduction','Chimie organique — polymères et macromolécules'],
    'Sciences de la Vie et de la Terre': ['Génie génétique et biotechnologies','Vaccins, sérums et immunothérapie','Mémoire et apprentissage — neurobiologie','Phylogenèse et sélection naturelle','Tectonique des plaques — bilan complet','Biodiversité et biomes — écologie'],
    'Français': ['Littérature africaine — Mongo Beti, Camara Laye','Dissertation et commentaire — méthode BAC','Révision générale BAC Français'],
    'Histoire-Géographie': ['Bilan du monde contemporain','Enjeux géopolitiques actuels','Révision BAC Histoire-Géographie'],
  },
  'TleC': {
    'Mathématiques': ['Calcul intégral avancé','Nombres complexes — applications géométriques','Algèbre linéaire — matrices et déterminants','Probabilités avancées — variables continues','Suites et séries numériques','Géométrie dans l\'espace approfondie'],
    'Physique-Chimie': ['Mouvement des planètes — lois de Kepler','Électromagnétisme — induction','Mécanique quantique — introduction','Thermodynamique chimique','Chimie organique — synthèse totale'],
    'Français': ['Textes philosophiques et littéraires — méthode BAC','Dissertation et commentaire avancés'],
    'Histoire-Géographie': ['Géopolitique mondiale avancée','Révision BAC Histoire-Géographie'],
  },
  'TleA': {
    'Français': ['Littérature africaine et francophone — analyse comparée','La dissertation — méthode BAC complète','Le commentaire littéraire — méthode BAC','Stylistique avancée','Expression orale — exposé et débat'],
    'Philosophie': ['La connaissance et la science','L\'existence humaine','L\'État, le droit et la justice','La liberté et la morale','Révision — dissertation et explication de texte BAC'],
    'Histoire-Géographie': ['Synthèse du programme de Terminale','Révision BAC — composition et croquis','Géopolitique contemporaine'],
    'Anglais': ['Literature review — novel and poetry','Essay writing for BAC','Oral BAC preparation'],
    'Mathématiques': ['Statistiques appliquées','Probabilités — révisions','Géométrie analytique — synthèse'],
  },
};

function getMatieres(niveau: string): string[] {
  return MATIERES_BY_KEY[niveauKey(niveau)] ?? [];
}

function getLecons(niveau: string, matiere: string): string[] {
  return LECONS[niveauKey(niveau)]?.[matiere] ?? [];
}

// ─── Paliers d'XP (Croissants et Proportionnels) ───────────────────────────────
const SEUILS_NIVEAUX = [0, 100, 300, 600, 1100, 1800, 2800, 4200, 6000, 8500];

const getLevelData = (totalXp: number) => {
  let level = 1;
  for (let i = 0; i < SEUILS_NIVEAUX.length; i++) {
    if (totalXp >= SEUILS_NIVEAUX[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  if (level >= SEUILS_NIVEAUX.length) {
    level = SEUILS_NIVEAUX.length;
    return { level, currentLevelMin: SEUILS_NIVEAUX[SEUILS_NIVEAUX.length - 1], nextLevelMin: SEUILS_NIVEAUX[SEUILS_NIVEAUX.length - 1] };
  }
  return {
    level,
    currentLevelMin: SEUILS_NIVEAUX[level - 1],
    nextLevelMin: SEUILS_NIVEAUX[level]
  };
};

// Calcul XP proportionnel au prix (1 XP tous les 4 FCFA)
const calculateXpFromPrice = (price: number): number => {
  return Math.max(10, Math.floor(price / 4));
};

interface BanInfo {
  isBanned: boolean;
  type?: 'temporary' | 'permanent';
  until?: string; // ISO date string pour ban temporaire
  reason?: string;
}

interface UserStats {
  xp: number;
  level: number;
  streak: number;
  completedActions: number;
  lastLoginDate?: string;
  history: { action: string; xpGained: number; date: string }[];
}

interface NotificationPopup {
  id: number;
  message: string;
}

const getStorageKey = (phone: string) => `sira_stats_${phone}`;

const loadUserStats = (phone: string): UserStats => {
  try {
    const saved = localStorage.getItem(getStorageKey(phone));
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Erreur stats", e);
  }
  return { xp: 0, level: 1, streak: 0, completedActions: 0, history: [] };
};

const saveUserStats = (phone: string, stats: UserStats) => {
  try {
    localStorage.setItem(getStorageKey(phone), JSON.stringify(stats));
  } catch (e) {
    console.error("Erreur sauvegarde stats", e);
  }
};

// Gestion de la Blacklist & Bannissements
function getBanStatus(phone: string): BanInfo {
  try {
    // Vérifier la liste noire permanente
    const blacklist: string[] = JSON.parse(localStorage.getItem('sira_blacklist') ?? '[]');
    if (blacklist.includes(phone)) {
      return { isBanned: true, type: 'permanent', reason: 'Compte banni définitivement.' };
    }
    // Vérifier les bannissements temporaires
    const bans: Record<string, BanInfo> = JSON.parse(localStorage.getItem('sira_temp_bans') ?? '{}');
    const userBan = bans[phone];
    if (userBan && userBan.isBanned && userBan.until) {
      if (new Date() < new Date(userBan.until)) {
        return userBan;
      } else {
        // Expiré : supprimer le ban
        delete bans[phone];
        localStorage.setItem('sira_temp_bans', JSON.stringify(bans));
      }
    }
  } catch (e) {
    console.error(e);
  }
  return { isBanned: false };
}

// ─── Prix ─────────────────────────────────────────────────────────────────────
interface PrixConfig { cours: number; exercices: number; fiche: number; examen: number; }
const DEFAULT_PRIX: PrixConfig = { cours: 200, exercices: 150, fiche: 100, examen: 500 };

function loadPrix(): PrixConfig {
  try { return JSON.parse(localStorage.getItem('sira_prix') ?? '{}') ?? DEFAULT_PRIX; }
  catch { return DEFAULT_PRIX; }
}

function savePrix(p: PrixConfig) { localStorage.setItem('sira_prix', JSON.stringify(p)); }

type AuthStep = 'phone' | 'otp' | 'password' | 'usertype' | 'app';
type UserType = 'eleve' | 'parent';
type Tab = 'services' | 'calculons' | 'enfant' | 'gains' | 'admin' | 'profile';

interface UserProfile {
  phone: string; fullName: string; email: string;
  city: string; school: string; createdAt: string;
  userType: UserType;
}

interface Order { id: string; phoneClient: string; label: string; detail: string; amount: number; validated?: boolean; serviceType?: string; }

function buildFingerprint(): string {
  const d = [navigator.userAgent, navigator.language, screen.colorDepth,
    `${screen.width}x${screen.height}`, String((navigator as any).hardwareConcurrency ?? 4)].join('|');
  let h = 0;
  for (let i = 0; i < d.length; i++) h = Math.imul(31, h) + d.charCodeAt(i) | 0;
  return 'SIRA_DEV_' + Math.abs(h);
}

function saveOrders(phone: string, orders: Order[]) {
  localStorage.setItem(`sira_orders_${phone}`, JSON.stringify(orders));
  const allOrders = loadAllOrders();
  const filtered = allOrders.filter(o => o.phoneClient !== phone);
  localStorage.setItem('sira_all_orders', JSON.stringify([...filtered, ...orders]));
}

function loadOrders(phone: string): Order[] {
  try { return JSON.parse(localStorage.getItem(`sira_orders_${phone}`) ?? '[]'); }
  catch { return []; }
}

function loadAllOrders(): Order[] {
  try { return JSON.parse(localStorage.getItem('sira_all_orders') ?? '[]'); }
  catch { return []; }
}

function getAllRegisteredPhones(): string[] {
  const phones: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('sira_profile_')) {
      phones.push(key.replace('sira_profile_', ''));
    }
  }
  return phones;
}

// ─── UI Partagé ───────────────────────────────────────────────────────────────
function SF({ label, value, onChange, options, placeholder }: { label: string; value: string; onChange: (v: string) => void; options: (string | { id: string; label: string })[]; placeholder: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-[#b89070] uppercase tracking-wide">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-[#3d2a18] text-[#f5e6d3] text-sm rounded-xl px-4 py-3 outline-none border border-[#4a3520]">
        <option value="">{placeholder}</option>
        {options.map(o => {
          const val = typeof o === 'object' ? o.id : o;
          const lbl = typeof o === 'object' ? o.label : o;
          return <option key={val} value={val}>{lbl}</option>;
        })}
      </select>
    </div>
  );
}

function IF({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-[#b89070] uppercase tracking-wide">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-[#3d2a18] text-[#f5e6d3] text-sm rounded-xl px-4 py-3 outline-none border border-[#4a3520] focus:border-emerald-500 transition-colors placeholder:text-[#6b5040]" />
    </div>
  );
}

function GBtn({ onClick, children, disabled, type = 'button' }: {
  onClick?: () => void; children: React.ReactNode; disabled?: boolean; type?: 'button' | 'submit';
}) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-xl text-[#1a0f07] font-black text-[11px] uppercase tracking-widest">
      {children}
    </button>
  );
}

function Card({ icon: Icon, title, price, description, children }: {
  icon: React.ElementType; title: string; price: string; description: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-[#2c1c0e] rounded-2xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1a0f07] flex items-center justify-center shrink-0 mt-0.5">
            <Icon className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-[#f5e6d3] font-bold text-[15px] leading-tight">{title}</p>
            <p className="text-[#b89070] text-[11px] mt-1 leading-snug">{description}</p>
          </div>
        </div>
        <span className="shrink-0 text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full whitespace-nowrap">{price}</span>
      </div>
      {children}
    </div>
  );
}

// ─── Sélecteur Cascade et Services ───────────────────────────────────────────
function CascadeSelector({ onOrder, label, prix }: {
  onOrder: (l: string, d: string, a: number, type: 'cours' | 'exercice' | 'fiche' | 'examen') => void;
  label: string; prix: number;
}) {
  const [sys, setSys]     = useState('');
  const [niv, setNiv]     = useState('');
  const [mat, setMat]     = useState('');
  const [lec, setLec]     = useState('');
  const [detail, setDetail] = useState('');

  const niveaux  = sys ? NIVEAUX_BY_SYSTEME[sys] ?? [] : [];
  const matieres = niv ? getMatieres(niv) : [];
  const lecons   = mat ? getLecons(niv, mat) : [];
  const ok = sys && niv && mat && lec;

  const getServiceType = (l: string): 'cours' | 'exercice' | 'fiche' | 'examen' => {
    if (l.includes('Cours')) return 'cours';
    if (l.includes('Exercice')) return 'exercice';
    if (l.includes('Fiche')) return 'fiche';
    return 'examen';
  };

  const submit = () => {
    if (!ok) return;
    const d = `${sys} · ${niv} · ${mat} · ${lec}${detail ? ' — ' + detail : ''}`;
    onOrder(label, d, prix, getServiceType(label));
  };

  return (
    <div className="space-y-3">
      <SF label="Système d'éducation" value={sys}
        onChange={v => { setSys(v); setNiv(''); setMat(''); setLec(''); }}
        options={SYSTEMES} placeholder="Choisir un système…" />
      
      {sys && niveaux.length > 0 && (
        <SF label="Niveau / Classe" value={niv}
          onChange={v => { setNiv(v); setMat(''); setLec(''); }}
          options={niveaux} placeholder="Choisir la classe…" />
      )}

      {niv && matieres.length > 0 && (
        <SF label="Matière" value={mat}
          onChange={v => { setMat(v); setLec(''); }}
          options={matieres} placeholder="Choisir une matière…" />
      )}

      {mat && lecons.length > 0 && (
        <SF label="Leçon au programme" value={lec}
          onChange={setLec} options={lecons} placeholder="Choisir la leçon…" />
      )}

      {mat && lecons.length === 0 && (
        <IF label="Leçon / Chapitre" value={lec} onChange={setLec}
          placeholder="Ex : Le théorème de Thalès…" />
      )}

      {lec && (
        <IF label="Point précis ou grand titre (optionnel)" value={detail} onChange={setDetail}
          placeholder="Ex : II. Applications du théorème…" />
      )}

      <GBtn onClick={submit} disabled={!ok}>
        <MessageCircle className="w-4 h-4" /> Payer &amp; Recevoir via WhatsApp
      </GBtn>
    </div>
  );
}

function CoursCard({ onOrder, prix }: { onOrder: (l: string, d: string, a: number, t: 'cours' | 'exercice' | 'fiche' | 'examen') => void; prix: number }) {
  return (
    <Card icon={BookOpen} title="Cours complet" price={`${prix} FCFA`}
      description="Cours rédigé conformément au programme officiel de votre système scolaire.">
      <CascadeSelector label="Cours complet" onOrder={onOrder} prix={prix} />
    </Card>
  );
}

function ExercicesCard({ onOrder, prix }: { onOrder: (l: string, d: string, a: number, t: 'cours' | 'exercice' | 'fiche' | 'examen') => void; prix: number }) {
  const [sys, setSys] = useState('');
  const [niv, setNiv] = useState('');
  const [mat, setMat] = useState('');
  const [lec, setLec] = useState('');
  const niveaux = sys ? NIVEAUX_BY_SYSTEME[sys] ?? [] : [];
  const matieres = niv ? getMatieres(niv) : [];
  const lecons = mat ? getLecons(niv, mat) : [];
  return (
    <Card icon={PenTool} title="Exercices corrigés" price={`${prix} FCFA`}
      description="Série d'exercices avec corrections détaillées, conformes au programme.">
      <SF label="Système d'éducation" value={sys}
        onChange={v => { setSys(v); setNiv(''); setMat(''); setLec(''); }}
        options={SYSTEMES} placeholder="Choisir un système…" />
      {sys && niveaux.length > 0 && <SF label="Niveau / Classe" value={niv} onChange={v => { setNiv(v); setMat(''); setLec(''); }} options={niveaux} placeholder="Choisir la classe…" />}
      {niv && matieres.length > 0 && <SF label="Matière" value={mat} onChange={v => { setMat(v); setLec(''); }} options={matieres} placeholder="Choisir une matière…" />}
      {mat && lecons.length > 0 && <SF label="Leçon (optionnel)" value={lec} onChange={setLec} options={lecons} placeholder="Toutes les leçons ou choisir…" />}
      {mat && lecons.length === 0 && <IF label="Chapitre (optionnel)" value={lec} onChange={setLec} placeholder="Ex : Probabilités, Thermodynamique…" />}
      <GBtn onClick={() => sys && niv && mat && onOrder('Exercices corrigés', `${sys} · ${niv} · ${mat}${lec ? ' · ' + lec : ''}`, prix, 'exercice')} disabled={!sys || !niv || !mat}>
        <MessageCircle className="w-4 h-4" /> Payer &amp; Recevoir les exercices
      </GBtn>
    </Card>
  );
}

function FicheCard({ onOrder, prix }: { onOrder: (l: string, d: string, a: number, t: 'cours' | 'exercice' | 'fiche' | 'examen') => void; prix: number }) {
  const [sys, setSys] = useState('');
  const [niv, setNiv] = useState('');
  const [mat, setMat] = useState('');
  const niveaux = sys ? NIVEAUX_BY_SYSTEME[sys] ?? [] : [];
  const matieres = niv ? getMatieres(niv) : [];
  return (
    <Card icon={FileText} title="Fiche de révision" price={`${prix} FCFA`}
      description="Fiche synthétique : l'essentiel d'un chapitre pour réviser efficacement.">
      <SF label="Système d'éducation" value={sys} onChange={v => { setSys(v); setNiv(''); setMat(''); }} options={SYSTEMES} placeholder="Choisir un système…" />
      {sys && niveaux.length > 0 && <SF label="Niveau / Classe" value={niv} onChange={v => { setNiv(v); setMat(''); }} options={niveaux} placeholder="Choisir la classe…" />}
      {niv && matieres.length > 0 && <SF label="Matière" value={mat} onChange={setMat} options={matieres} placeholder="Choisir une matière…" />}
      <GBtn onClick={() => sys && niv && mat && onOrder('Fiche de révision', `${sys} · ${niv} · ${mat}`, prix, 'fiche')} disabled={!sys || !niv || !mat}>
        <MessageCircle className="w-4 h-4" /> Payer &amp; Recevoir la fiche
      </GBtn>
    </Card>
  );
}

function ExamenCard({ onOrder, prix }: { onOrder: (l: string, d: string, a: number, t: 'cours' | 'exercice' | 'fiche' | 'examen') => void; prix: number }) {
  const [examen, setExamen] = useState('');
  const [mat, setMat] = useState('');
  const [theme, setTheme] = useState('');
  const mats = examen.includes('BEPC') ? MATIERES_BY_KEY['3e'] : MATIERES_BY_KEY['TleD'];
  return (
    <Card icon={Trophy} title="Préparation examen" price={`${prix} FCFA`}
      description="Pack révision complet pour le BEPC ou le BAC — sujets + corrections.">
      <SF label="Examen cible" value={examen} onChange={v => { setExamen(v); setMat(''); }} options={['BEPC (3ème)','BAC Série A','BAC Série C','BAC Série D']} placeholder="Choisir l'examen…" />
      {examen && <SF label="Matière prioritaire" value={mat} onChange={setMat} options={mats} placeholder="Choisir une matière…" />}
      {mat && <IF label="Thème prioritaire (optionnel)" value={theme} onChange={setTheme} placeholder="Ex : Probabilités, Révolution française…" />}
      <GBtn onClick={() => examen && mat && onOrder('Préparation examen', `${examen} · ${mat}${theme ? ' · ' + theme : ''}`, prix, 'examen')} disabled={!examen || !mat}>
        <MessageCircle className="w-4 h-4" /> Payer &amp; Préparer mon examen
      </GBtn>
    </Card>
  );
}

function ServicesTab({ onOrder, prix }: { onOrder: (l: string, d: string, a: number, t: 'cours' | 'exercice' | 'fiche' | 'examen') => void; prix: PrixConfig }) {
  return (
    <div className="space-y-4">
      <div className="bg-[#2c1c0e] rounded-2xl p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#1a0f07] flex items-center justify-center shrink-0">
          <GraduationCap className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <p className="text-[#f5e6d3] font-bold text-sm">Cours sur mesure — tous systèmes</p>
          <p className="text-[#b89070] text-[11px] mt-0.5">Conformes aux programmes officiels. Livraison via WhatsApp.</p>
        </div>
      </div>
      <CoursCard onOrder={onOrder} prix={prix.cours} />
      <ExercicesCard onOrder={onOrder} prix={prix.exercices} />
      <FicheCard onOrder={onOrder} prix={prix.fiche} />
      <ExamenCard onOrder={onOrder} prix={prix.examen} />
      <LegalFooter />
    </div>
  );
}

// ─── Onglets annexes ──────────────────────────────────────────────────────────
function CalculonsTab() {
  const [subTab, setSubTab] = useState<'moyenne' | 'orientation'>('moyenne');
  const [notes, setNotes] = useState<{ id: string; matiere: string; note: number; coef: number; }[]>([]);
  const [newMat, setNewMat] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newCoef, setNewCoef] = useState('2');

  const addNote = () => {
    const n = parseFloat(newNote);
    const c = parseFloat(newCoef);
    if (!newMat || isNaN(n) || n < 0 || n > 20 || isNaN(c) || c < 1) return;
    setNotes(prev => [...prev, { id: Date.now().toString(), matiere: newMat, note: n, coef: c }]);
    setNewNote(''); setNewMat(''); setNewCoef('2');
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

function AchatsEnfantTab() {
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

// ─── Fenêtre modale Admin (Commandes & Gestion Bannissement) ─────────────────
function AdminClientModal({ phone, onClose, onRefresh }: { phone: string; onClose: () => void; onRefresh: () => void }) {
  const [orders, setOrders] = useState<Order[]>(loadOrders(phone));
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [banDays, setBanDays] = useState('1');
  const profile = JSON.parse(localStorage.getItem(`sira_profile_${phone}`) || '{}');
  const stats = loadUserStats(phone);
  const banStatus = getBanStatus(phone);

  const toggleSelect = (id: string) => {
    setSelectedOrderIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const validateSelectedOrders = () => {
    if (selectedOrderIds.length === 0) {
      alert("Veuillez sélectionner au moins une commande.");
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

    const updatedAllOrders = allOrders.map(o => {
      if (selectedOrderIds.includes(o.id)) {
        return { ...o, validated: true };
      }
      return o;
    });
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
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...stats.history
      ].slice(0, 20)
    };
    saveUserStats(phone, updatedStats);

    alert(`Succès ! ${selectedOrderIds.length} commande(s) validée(s). +${totalXpGain} XP attribués à ${phone}.`);
    setSelectedOrderIds([]);
    onRefresh();
  };

  // Bannissement temporaire
  const banTemporary = () => {
    const days = parseInt(banDays) || 1;
    const until = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    
    const bans: Record<string, BanInfo> = JSON.parse(localStorage.getItem('sira_temp_bans') ?? '{}');
    bans[phone] = { isBanned: true, type: 'temporary', until, reason: `Banni temporairement pour ${days} jour(s).` };
    localStorage.setItem('sira_temp_bans', JSON.stringify(bans));
    
    alert(`Le compte ${phone} a été banni temporairement pour ${days} jour(s).`);
    onRefresh();
  };

  // Bannissement à vie (Permanent + Blacklist création compte)
  const banPermanent = () => {
    if (phone === ADMIN_PHONE) { alert("Impossible de bannir le compte admin !"); return; }
    if (confirm(`Bannir DÉFINITIVEMENT le compte ${phone} ? Il ne pourra PLUS JAMAIS créer de compte avec ce numéro.`)) {
      const blacklist: string[] = JSON.parse(localStorage.getItem('sira_blacklist') ?? '[]');
      if (!blacklist.includes(phone)) {
        blacklist.push(phone);
        localStorage.setItem('sira_blacklist', JSON.stringify(blacklist));
      }
      
      // Nettoyage des données
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
    const updatedBlacklist = blacklist.filter(p => p !== phone);
    localStorage.setItem('sira_blacklist', JSON.stringify(updatedBlacklist));

    const bans: Record<string, BanInfo> = JSON.parse(localStorage.getItem('sira_temp_bans') ?? '{}');
    delete bans[phone];
    localStorage.setItem('sira_temp_bans', JSON.stringify(bans));

    alert(`Bannissement levé pour ${phone}.`);
    onRefresh();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-[#2c1c0e] border border-[#4a3520] rounded-3xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* En-tête profil */}
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

        {/* Liste des commandes avec cases à cocher */}
        <div className="space-y-2">
          <p className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">Sélectionner les commandes à valider :</p>
          {orders.length === 0 ? (
            <p className="text-xs text-[#b89070] italic">Aucune commande enregistrée pour ce compte.</p>
          ) : (
            orders.map(o => {
              const isSelected = selectedOrderIds.includes(o.id);
              const xpForThis = calculateXpFromPrice(o.amount);
              return (
                <div key={o.id} onClick={() => !o.validated && toggleSelect(o.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    o.validated ? 'bg-[#1a0f07]/40 border-emerald-500/20 opacity-60 cursor-default' : 
                    isSelected ? 'bg-emerald-500/10 border-emerald-500' : 'bg-[#1a0f07] border-[#4a3520] hover:border-amber-500/50'
                  }`}>
                  <div className="flex items-center gap-3">
                    {!o.validated && (
                      isSelected ? <CheckSquare className="w-5 h-5 text-emerald-400" /> : <Square className="w-5 h-5 text-[#b89070]" />
                    )}
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

        {/* Bouton d'action groupé */}
        <button onClick={validateSelectedOrders} disabled={selectedOrderIds.length === 0}
          className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-[#1a0f07] font-black text-xs uppercase tracking-widest rounded-xl transition-colors">
          Valider et attribuer l'XP ({selectedOrderIds.length} sélectionnée(s))
        </button>

        {/* Section Sanctions / Bannissement */}
        <div className="space-y-3 pt-3 border-t border-[#4a3520]">
          <p className="text-[11px] font-black text-rose-400 uppercase tracking-widest">🚫 Option de Bannissement</p>
          
          {banStatus.isBanned ? (
            <button onClick={unban} className="w-full py-2.5 bg-emerald-500/20 text-emerald-400 font-bold text-xs uppercase rounded-xl border border-emerald-500/30">
              Débannir ce compte
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input type="number" value={banDays} onChange={e => setBanDays(e.target.value)} placeholder="Jours"
                  className="w-24 bg-[#1a0f07] border border-[#4a3520] text-center text-xs font-bold text-[#f5e6d3] rounded-xl px-2" />
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

// ─── Onglet Admin Complet ─────────────────────────────────────────────────────
function AdminTab({ prix, onPrixChange }: { prix: PrixConfig; onPrixChange: (p: PrixConfig) => void }) {
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
      {/* Statistiques globales */}
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

      {/* Liste des comptes avec accès à leur fenêtre dédiée de commandes */}
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
              <div key={p} onClick={() => setSelectedClientPhone(p)}
                className={`p-3.5 rounded-xl border flex justify-between items-center cursor-pointer transition-colors ${
                  banStatus.isBanned ? 'bg-rose-950/20 border-rose-500/30' : 'bg-[#1a0f07] hover:bg-[#3d2a18]/40 border-[#4a3520]'
                }`}>
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

      {/* Fenêtre modale individuelle active */}
      {selectedClientPhone && (
        <AdminClientModal phone={selectedClientPhone} onClose={() => setSelectedClientPhone(null)} onRefresh={refreshData} />
      )}

      {/* Modification des prix */}
      <div className="bg-[#2c1c0e] rounded-2xl p-5 space-y-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">💰 Modifier les tarifs (XP proportionnelle)</p>
        {([['cours','Cours complet'],['exercices','Exercices corrigés'],['fiche','Fiche de révision'],['examen','Préparation examen']] as [keyof PrixConfig, string][]).map(([k, label]) => (
          <div key={k} className="space-y-1">
            <label className="text-[10px] font-bold text-[#b89070] uppercase">{label} (FCFA)</label>
            <input type="number" value={local[k]} onChange={e => setLocal(p => ({ ...p, [k]: parseInt(e.target.value) || 0 }))}
              className="w-full bg-[#3d2a18] text-emerald-400 font-bold text-sm rounded-xl px-3 py-2 outline-none border border-[#4a3520]" />
          </div>
        ))}
        <button onClick={savePrices} className="w-full py-3 bg-emerald-500 text-[#1a0f07] font-black text-xs uppercase rounded-xl">
          {saved ? 'Enregistré !' : 'Sauvegarder les prix'}
        </button>
      </div>
    </div>
  );
}

// ─── Onglet Profil (Gamification & XP) ────────────────────────────────────────
function ProfileTab({ phone, profile, stats, onSave, onLogout }: {
  phone: string; profile: UserProfile | null; stats: UserStats; onSave: (p: Partial<UserProfile>) => void; onLogout: () => void;
}) {
  const [fullName, setFullName] = useState(profile?.fullName ?? '');
  const [email, setEmail]       = useState(profile?.email ?? '');
  const [saved, setSaved]       = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ fullName, email });
    setSaved(true); setTimeout(() => setSaved(false), 2500);
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
            <Trophy className="w-5 h-5 text-amber-400" /> Progression Sira
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
            <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}></div>
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

function LegalFooter() {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2 pt-2 pb-4 text-center">
      <button onClick={() => setShow(s => !s)}
        className="text-[9px] font-bold text-[#6b5040] hover:text-[#b89070] uppercase tracking-widest mx-auto px-3 py-1.5 rounded-lg border border-[#2c1c0e] bg-[#1a0f07]">
        <Scale className="w-3 h-3 inline mr-1" /> Protection des droits &amp; Confidentialité
      </button>
      {show && (
        <div className="bg-[#2c1c0e] border border-[#4a3520] p-4 rounded-xl text-[10px] text-[#b89070] text-left space-y-2">
          <p><strong>Tatouage Numérique :</strong> Chaque document acheté est marqué avec le numéro de téléphone.</p>
        </div>
      )}
    </div>
  );
}

// ─── App principale ───────────────────────────────────────────────────────────
function MainApp({ phone, role, userType, profile, onSave, onLogout }: {
  phone: string; role: 'client' | 'admin'; userType: UserType;
  profile: UserProfile | null; onSave: (p: Partial<UserProfile>) => void; onLogout: () => void;
}) {
  const [tab, setTab]   = useState<Tab>('services');
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
      return;
    }
  }, []);

  const triggerNotification = (message: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 2000);
  };

  const handleOrder = (label: string, detail: string, amount: number, serviceType: 'cours' | 'exercice' | 'fiche' | 'examen') => {
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

    triggerNotification(`⏳ Commande enregistrée ! En attente de validation admin.`);

    const msg = encodeURIComponent(`Sira Éducation\nService : ${label}\nDétail : ${detail}\nMontant : ${amount} FCFA\nCommande N°${id.slice(-6)}\nClient : ${phone}\nID : ${fp}`);
    window.open(`https://wa.me/2250100119314?text=${msg}`, '_blank');
  };

  const tabs = role === 'admin'
    ? [
        { key: 'services' as Tab, icon: Star,        label: 'Services' },
        { key: 'admin'    as Tab, icon: LayoutGrid,  label: 'Admin' },
        { key: 'profile'  as Tab, icon: User,        label: 'Profil' },
      ]
    : userType === 'parent'
    ? [
        { key: 'services' as Tab, icon: Star,        label: 'Services' },
        { key: 'enfant'   as Tab, icon: Baby,        label: 'Mon enfant' },
        { key: 'profile'  as Tab, icon: User,        label: 'Profil' },
      ]
    : [
        { key: 'services'  as Tab, icon: Star,       label: 'Services' },
        { key: 'calculons' as Tab, icon: Calculator, label: 'Calculons' },
        { key: 'profile'   as Tab, icon: User,       label: 'Profil' },
      ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto relative">
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div key={n.id} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-amber-500 text-[#1a0f07] px-4 py-2 rounded-xl shadow-2xl font-black text-xs border border-amber-300">
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
        {tab === 'services'  && <ServicesTab onOrder={handleOrder} prix={prix} />}
        {tab === 'calculons' && <CalculonsTab />}
        {tab === 'enfant'    && <AchatsEnfantTab />}
        {tab === 'admin' && role === 'admin' && <AdminTab prix={prix} onPrixChange={setPrix} />}
        {tab === 'profile'   && <ProfileTab phone={phone} profile={profile} stats={stats} onSave={onSave} onLogout={onLogout} />}
      </main>

      <nav className="shrink-0 max-w-md w-full fixed bottom-0 left-1/2 -translate-x-1/2 bg-[#2c1c0e] border-t border-[#1a0f07] flex">
        {tabs.map(({ key, icon: Icon, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex-1 flex flex-col items-center gap-1 py-3.5 transition-colors ${tab === key ? 'text-emerald-400' : 'text-[#b89070] opacity-50 hover:opacity-80'}`}>
            <Icon className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// ─── Écrans d'auth ────────────────────────────────────────────────────────────
function PhoneScreen({ onSubmit }: { onSubmit: (p: string) => void }) {
  const [phone, setPhone] = useState('');
  return (
    <div className="fixed inset-0 bg-[#1a0f07] flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm bg-[#2c1c0e] border border-[#4a3520] rounded-3xl p-6 space-y-6 text-center">
        <h2 className="text-xl font-black text-[#f5e6d3]">Sira Éducation</h2>
        <form onSubmit={e => { e.preventDefault(); const c = phone.trim().replace(/\s+/g,''); if (c.length >= 8) onSubmit(c); }} className="space-y-4">
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0798123456"
            className="w-full bg-[#1a0f07] border border-[#4a3520] rounded-2xl py-4 px-4 text-sm text-center font-bold text-[#f5e6d3]" required />
          <button type="submit" className="w-full py-4 bg-emerald-500 text-[#1a0f07] font-black text-xs uppercase tracking-widest rounded-2xl">Continuer</button>
        </form>
      </div>
    </div>
  );
}

function OtpScreen({ otp, onVerify }: { otp: string; onVerify: (c: string) => void }) {
  const [code, setCode] = useState('');
  return (
    <div className="fixed inset-0 bg-[#1a0f07] flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm bg-[#2c1c0e] border border-[#4a3520] rounded-3xl p-6 space-y-5 text-center">
        <p className="text-xs text-[#b89070]">OTP : {otp}</p>
        <form onSubmit={e => { e.preventDefault(); onVerify(code); }} className="space-y-4">
          <input type="text" maxLength={4} value={code} onChange={e => setCode(e.target.value)}
            className="w-full bg-[#1a0f07] border border-[#4a3520] rounded-2xl py-3.5 text-center text-2xl font-black text-emerald-400" />
          <button type="submit" className="w-full py-3 bg-emerald-500 text-[#1a0f07] font-black rounded-xl">Confirmer</button>
        </form>
      </div>
    </div>
  );
}

function PasswordScreen({ onVerify }: { onVerify: () => void }) {
  const [pwd, setPwd] = useState('');
  return (
    <div className="fixed inset-0 bg-[#1a0f07] flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm bg-[#2c1c0e] border border-[#4a3520] rounded-3xl p-6 space-y-5 text-center">
        <form onSubmit={e => { e.preventDefault(); if (pwd === ADMIN_PASSWORD) onVerify(); }} className="space-y-4">
          <input type="password" value={pwd} onChange={e => setPwd(e.target.value)} placeholder="• • • •"
            className="w-full bg-[#1a0f07] border border-[#4a3520] rounded-2xl py-3.5 text-center text-xl font-black text-emerald-400" />
          <button type="submit" className="w-full py-3 bg-emerald-500 text-[#1a0f07] font-black rounded-xl">Confirmer</button>
        </form>
      </div>
    </div>
  );
}

function UserTypeScreen({ onChoose }: { onChoose: (t: UserType) => void }) {
  return (
    <div className="fixed inset-0 bg-[#1a0f07] flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm bg-[#2c1c0e] border border-[#4a3520] rounded-3xl p-6 space-y-4 text-center">
        <button onClick={() => onChoose('eleve')} className="w-full p-4 bg-[#1a0f07] rounded-2xl text-[#f5e6d3] font-bold">Je suis Élève</button>
        <button onClick={() => onChoose('parent')} className="w-full p-4 bg-[#1a0f07] rounded-2xl text-[#f5e6d3] font-bold">Je suis Parent</button>
      </div>
    </div>
  );
}

// ─── Racine ────────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep]         = useState<AuthStep>('phone');
  const [phone, setPhone]       = useState('');
  const [otp, setOtp]           = useState('');
  const [role, setRole]         = useState<'client' | 'admin'>('client');
  const [userType, setUserType] = useState<UserType>('eleve');
  const [profile, setProfile]   = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedPhone = localStorage.getItem('sira_user_phone') ?? '';
    if (localStorage.getItem('sira_session_active') && savedPhone) {
      const banStatus = getBanStatus(savedPhone);
      if (banStatus.isBanned) {
        alert(`Votre compte a été banni. ${banStatus.reason || ''}`);
        handleLogout();
        return;
      }
      setPhone(savedPhone);
      setRole(savedPhone === ADMIN_PHONE ? 'admin' : 'client');
      const saved = localStorage.getItem(`sira_profile_${savedPhone}`);
      if (saved) {
        const p = JSON.parse(saved) as UserProfile;
        setProfile(p);
        setUserType(p.userType ?? 'eleve');
      }
      setStep('app');
    }
  }, []);

  const handlePhone = (clean: string) => {
    const banStatus = getBanStatus(clean);
    if (banStatus.isBanned) {
      alert(`Accès refusé : Ce numéro est banni ${banStatus.type === 'permanent' ? 'à vie' : 'temporairement'}.`);
      return;
    }

    setPhone(clean);
    if (clean === ADMIN_PHONE) { setStep('password'); return; }
    const exists = localStorage.getItem(`sira_profile_${clean}`);
    if (exists) {
      const p = JSON.parse(exists) as UserProfile;
      localStorage.setItem('sira_session_active', 'true');
      localStorage.setItem('sira_user_phone', clean);
      setRole('client'); setProfile(p); setUserType(p.userType ?? 'eleve'); setStep('app');
    } else {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setOtp(code); setStep('otp');
    }
  };

  const handleOtp = (code: string) => {
    if (code !== otp) { alert('Code OTP incorrect.'); return; }
    localStorage.setItem('sira_session_active', 'true');
    localStorage.setItem('sira_user_phone', phone);
    setRole('client'); setStep('usertype');
  };

  const handleUserType = (t: UserType) => {
    setUserType(t);
    const newProfile: UserProfile = { phone, fullName: '', email: '', city: '', school: '', createdAt: new Date().toLocaleDateString('fr-FR'), userType: t };
    localStorage.setItem(`sira_profile_${phone}`, JSON.stringify(newProfile));
    setProfile(newProfile); setStep('app');
  };

  const handlePasswordVerify = () => {
    localStorage.setItem('sira_session_active', 'true');
    localStorage.setItem('sira_user_phone', phone);
    setRole('admin'); setStep('app');
  };

  const handleSaveProfile = (updates: Partial<UserProfile>) => {
    const updated = { ...profile!, ...updates };
    localStorage.setItem(`sira_profile_${phone}`, JSON.stringify(updated));
    setProfile(updated);
  };

  const handleLogout = () => {
    localStorage.removeItem('sira_session_active');
    setStep('phone'); setPhone(''); setOtp(''); setProfile(null); setRole('client');
  };

     return (
      <div className="min-h-screen bg-[#120a05] flex items-center justify-center p-0 sm:py-6">
        <div className="w-full max-w-md min-h-screen sm:min-h-[85vh] sm:h-[850px] bg-[#1a0f07] text-[#f5e6d3] font-sans sm:rounded-3xl sm:border sm:border-[#4a3520] shadow-2xl overflow-hidden flex flex-col relative">
          {step === 'phone'    && <PhoneScreen onSubmit={handlePhone} />}
          {step === 'otp'      && <OtpScreen otp={otp} onVerify={handleOtp} />}
          {step === 'password' && <PasswordScreen onVerify={handlePasswordVerify} />}
          {step === 'usertype' && <UserTypeScreen onChoose={handleUserType} />}
          {step === 'app'      && <MainApp phone={phone} role={role} userType={userType} profile={profile} onSave={handleSaveProfile} onLogout={handleLogout} />}
        </div>
      </div>
    );
}
