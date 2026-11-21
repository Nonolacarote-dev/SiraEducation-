// Utilisateur / Élève
export interface UserProfile {
  id: string;
  phone: string;
  fullName: string;
  system: 'ivoirien' | 'francais' | 'burkinabe' | 'senegalais' | 'camerounais';
  niveau: string; // ex: 'Tle D', '3ème'
  role: 'student' | 'admin';
  xp: number;
  createdAt: string;
}

// Matière
export interface Subject {
  id: string;
  name: string; // ex: 'Mathématiques'
  code: string; // ex: 'MATH'
  icon?: string;
}

// Cours / Fiche de révision
export interface CourseItem {
  id: string;
  title: string;
  description: string;
  system: string;
  niveau: string;
  subjectId: string;
  type: 'fiche' | 'exercice' | 'epreuve' | 'resume';
  price: number; // en FCFA (ex: 500)
  xpReward: number; // XP gagné à l'achat/consultation
  pdfUrl?: string;
  isPopular?: boolean;
}

// Historique des Achats / Commandes WhatsApp
export interface Order {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  status: 'pending' | 'completed';
  createdAt: string;
}
