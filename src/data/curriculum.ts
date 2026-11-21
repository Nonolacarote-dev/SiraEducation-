export const SYSTEMES = [
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

export const NIVEAUX_BY_SYSTEME: Record<string, string[]> = {
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

export function niveauKey(n: string): string {
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

export const MATIERES_BY_KEY: Record<string, string[]> = {
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

export const LECONS: Record<string, Record<string, string[]>> = {
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

export function getMatieres(niveau: string): string[] {
  return MATIERES_BY_KEY[niveauKey(niveau)] ?? [];
}

export function getLecons(niveau: string, matiere: string): string[] {
  return LECONS[niveauKey(niveau)]?.[matiere] ?? [];
}
