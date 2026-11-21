import type { PrixConfig } from '../types/sira';
export const ADMIN_PHONE     = '0100119314';
export const ADMIN_PASSWORD  = '0882';
export const WHATSAPP_NUMBER = '2250100119314';

export const DEFAULT_PRIX: PrixConfig = {
  cours: 200,
  exercices: 150,
  fiche: 100,
  examen: 500,
};

export const SEUILS_NIVEAUX = [0, 100, 300, 600, 1100, 1800, 2800, 4200, 6000, 8500];

export const getLevelData = (totalXp: number) => {
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
    const last = SEUILS_NIVEAUX[SEUILS_NIVEAUX.length - 1];
    return { level, currentLevelMin: last, nextLevelMin: last };
  }
  return {
    level,
    currentLevelMin: SEUILS_NIVEAUX[level - 1],
    nextLevelMin: SEUILS_NIVEAUX[level],
  };
};

export const calculateXpFromPrice = (price: number): number => {
  return Math.max(10, Math.floor(price / 4));
};
