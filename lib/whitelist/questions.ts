// Banque de questions PLACEHOLDER - contenu générique sur les concepts RP
// courants, en attendant que le vrai règlement (/regles) soit rédigé.
// À remplacer par les vraies questions du serveur une fois les règles écrites.

export type Question = {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Que signifie le RDM (Random Death Match) ?",
    options: [
      "Tuer un joueur sans raison ou justification roleplay",
      "Rouler trop vite en ville",
      "Rejoindre un gang illégal",
      "Réanimer un personnage après sa mort",
    ],
    correctIndex: 0,
  },
  {
    id: 2,
    question: "Que signifie le VDM (Vehicle Death Match) ?",
    options: [
      "Voler un véhicule de luxe",
      "Utiliser un véhicule comme arme pour tuer sans raison RP",
      "Vendre un véhicule volé",
      "Participer à une course illégale",
    ],
    correctIndex: 1,
  },
  {
    id: 3,
    question: "Qu'est-ce que le fear RP ?",
    options: [
      "Avoir peur de perdre son personnage",
      "Refuser de jouer des scènes effrayantes",
      "Réagir de façon crédible face à une menace sérieuse (ex: arme braquée)",
      "Ne jamais prendre de risques en jeu",
    ],
    correctIndex: 2,
  },
  {
    id: 4,
    question: "La new life rule s'applique quand ton personnage...",
    options: [
      "Change de métier",
      "Meurt : il ne se souvient pas des événements l'ayant mené à sa mort",
      "Déménage dans un nouveau quartier",
      "Crée un deuxième personnage",
    ],
    correctIndex: 1,
  },
  {
    id: 5,
    question: "Qu'est-ce que le powergaming ?",
    options: [
      "Jouer très souvent sur le serveur",
      "Avoir beaucoup d'argent en jeu",
      "Forcer une action sur un autre joueur sans lui laisser de choix ni de réaction",
      "Être très fort en combat",
    ],
    correctIndex: 2,
  },
  {
    id: 6,
    question: "Qu'est-ce que le metagaming ?",
    options: [
      "Utiliser hors RP (Discord, stream...) une information que ton personnage ne connaît pas en jeu",
      "Discuter de stratégie avec son gang",
      "Changer de style de jeu selon les métas populaires",
      "Jouer plusieurs personnages en même temps",
    ],
    correctIndex: 0,
  },
  {
    id: 7,
    question: "Qu'est-ce que le fail RP ?",
    options: [
      "Perdre un combat en jeu",
      "Se tromper de nom de rue",
      "Jouer un rôle incohérent avec la situation ou la logique du monde RP",
      "Rater une mission de métier",
    ],
    correctIndex: 2,
  },
  {
    id: 8,
    question:
      "Ton personnage se fait braquer avec une arme pointée sur lui. Que dois-tu faire ?",
    options: [
      "Ignorer et continuer normalement",
      "Réagir avec de la peur crédible (fear RP), coopérer selon la situation",
      "Attaquer immédiatement le braqueur",
      "Appeler la police hors RP",
    ],
    correctIndex: 1,
  },
  {
    id: 9,
    question:
      "Un membre du staff te demande de le suivre en MDT (mode développeur) pour un contrôle. Tu dois...",
    options: [
      "Refuser si tu es en pleine scène RP importante",
      "Négocier un délai en RP",
      "Ignorer s'il ne se présente pas en jeu",
      "Obtempérer, le staff prime sur le RP en cours pour ce type de contrôle",
    ],
    correctIndex: 3,
  },
  {
    id: 10,
    question:
      "Ton personnage vient de mourir dans une fusillade. Peux-tu revenir immédiatement chercher vengeance sur le même lieu ?",
    options: [
      "Oui, immédiatement",
      "Non, la new life rule et le respect du délai de retour l'interdisent",
      "Oui, si tu changes d'arme",
      "Oui, si tu préviens le staff avant",
    ],
    correctIndex: 1,
  },
  {
    id: 11,
    question: "Le chat OOC (hors roleplay) doit être utilisé pour...",
    options: [
      "Négocier des prix en jeu",
      "Insulter les autres joueurs",
      "Des questions techniques, jamais pour du contenu RP",
      "Organiser des braquages",
    ],
    correctIndex: 2,
  },
  {
    id: 12,
    question:
      "Tu vois un joueur enfreindre clairement une règle. Que fais-tu ?",
    options: [
      "Tu le punis toi-même en jeu",
      "Tu l'ignores complètement",
      "Tu fais un signalement/ticket au staff avec des preuves si possible",
      "Tu en parles publiquement dans le chat général",
    ],
    correctIndex: 2,
  },
  {
    id: 13,
    question: "Le combat logging consiste à...",
    options: [
      "Se déconnecter pour échapper à une situation RP en cours (combat, arrestation...)",
      "Tenir un journal de ses combats",
      "Enregistrer une vidéo de ses combats",
      "Changer d'arme pendant un combat",
    ],
    correctIndex: 0,
  },
  {
    id: 14,
    question:
      "Un joueur menace ton personnage avec une arme factice qu'il prétend réelle. Comment réagir ?",
    options: [
      "Tu peux ignorer car l'arme n'est pas réelle",
      "En RP, ton personnage ne peut pas savoir si l'arme est factice : tu dois réagir avec fear RP",
      "Tu dois immédiatement désarmer le joueur",
      "Tu dois appeler le staff avant de réagir",
    ],
    correctIndex: 1,
  },
  {
    id: 15,
    question:
      "Ton personnage n'a aucune formation médicale. Peut-il soigner une blessure par balle sans conséquence ?",
    options: [
      "Oui, sans problème",
      "Non, cela s'apparente à du powergaming/fail RP sans justification",
      "Oui, si le blessé est d'accord",
      "Oui, une seule fois par jour",
    ],
    correctIndex: 1,
  },
  {
    id: 16,
    question: "Le RP passif (safe zone) sert à...",
    options: [
      "Éviter tout contact avec les autres joueurs",
      "Permettre du RP sans agression dans certaines zones définies (ex: hôpital)",
      "Devenir invincible partout sur la carte",
      "Se cacher du staff",
    ],
    correctIndex: 1,
  },
  {
    id: 17,
    question:
      "Tu entends par erreur (via Discord vocal en dehors du jeu) une info que ton personnage ignore. Tu peux l'utiliser en RP ?",
    options: [
      "Oui, si c'est utile à ton personnage",
      "Non, ce serait du metagaming",
      "Oui, avec l'accord du staff",
      "Oui, une seule fois",
    ],
    correctIndex: 1,
  },
  {
    id: 18,
    question: "Qu'implique le respect de la hiérarchie RP dans un métier légal ?",
    options: [
      "Chacun fait ce qu'il veut sans coordination",
      "Suivre les consignes et la structure définies par le métier en RP",
      "Ignorer les supérieurs hiérarchiques",
      "Changer de métier dès qu'un ordre déplaît",
    ],
    correctIndex: 1,
  },
  {
    id: 19,
    question:
      "Un conflit RP dégénère en désaccord hors RP entre deux joueurs. Quelle est la bonne attitude ?",
    options: [
      "Continuer à se disputer dans le chat général",
      "Se venger en RP de façon disproportionnée",
      "Séparer le hors RP du RP et, si besoin, contacter le staff",
      "Quitter définitivement le serveur",
    ],
    correctIndex: 2,
  },
  {
    id: 20,
    question: "Le RP de groupe illégal implique notamment...",
    options: [
      "Pouvoir agresser n'importe qui sans justification",
      "Ignorer les règles car le personnage est un criminel",
      "Construire une histoire cohérente tout en respectant les règles du serveur",
      "Ne jamais interagir avec les métiers légaux",
    ],
    correctIndex: 2,
  },
  {
    id: 21,
    question:
      "Tu penses qu'une règle a été appliquée injustement à ton encontre. Que fais-tu ?",
    options: [
      "Tu contestes publiquement dans le chat",
      "Tu ouvres un ticket/contestation sur le Discord, dans le calme",
      "Tu ignores la sanction",
      "Tu crées un nouveau compte",
    ],
    correctIndex: 1,
  },
  {
    id: 22,
    question:
      "Un joueur utilise un bug du serveur pour obtenir un avantage. C'est...",
    options: [
      "Autorisé si le bug n'est pas signalé",
      "Interdit : l'exploitation de bugs est une infraction grave",
      "Autorisé une seule fois",
      "Autorisé si aucun autre joueur n'est impacté",
    ],
    correctIndex: 1,
  },
  {
    id: 23,
    question: "Le RP de qualité repose avant tout sur...",
    options: [
      "La rapidité à accumuler de l'argent",
      "La cohérence du personnage et l'interaction crédible avec les autres",
      "Le nombre d'armes possédées",
      "La capacité à gagner tous les affrontements",
    ],
    correctIndex: 1,
  },
  {
    id: 24,
    question:
      "Ton personnage est arrêté et menotté par les forces de l'ordre RP. Tu dois...",
    options: [
      "Te débattre systématiquement car ton personnage est innocent",
      "Te déconnecter pour éviter la scène",
      "Jouer la scène de façon cohérente, y compris la contrainte physique",
      "Changer immédiatement de personnage",
    ],
    correctIndex: 2,
  },
  {
    id: 25,
    question: "Le greifing désigne...",
    options: [
      "Un style de combat au corps à corps",
      "Le fait de nuire délibérément à l'expérience d'autres joueurs sans justification RP",
      "Une technique de conduite sportive",
      "Un type de mission légale",
    ],
    correctIndex: 1,
  },
  {
    id: 26,
    question:
      "En cas de doute sur une règle pendant une scène RP en cours, la meilleure attitude est de...",
    options: [
      "Faire ce qui t'arrange le plus",
      "Arrêter la scène brutalement",
      "Rester cohérent, jouer prudemment, et clarifier après coup avec le staff si besoin",
      "Demander à l'autre joueur de trancher",
    ],
    correctIndex: 2,
  },
  {
    id: 27,
    question: "Le RP d'otage impose notamment de...",
    options: [
      "Pouvoir tuer l'otage sans aucune négociation ni justification",
      "Respecter un temps de jeu raisonnable et une progression RP cohérente",
      "Libérer l'otage immédiatement dans tous les cas",
      "Ignorer complètement les forces de l'ordre",
    ],
    correctIndex: 1,
  },
  {
    id: 28,
    question:
      "Tu es témoin d'un comportement toxique (insultes, discrimination) sur le serveur. Tu dois...",
    options: [
      "Répondre sur le même ton",
      "Ignorer, ce n'est pas grave",
      "Signaler au staff avec preuves si possible",
      "Quitter le serveur sans rien dire",
    ],
    correctIndex: 2,
  },
  {
    id: 29,
    question:
      "Le respect du délai/de la procédure avant de \"repop\" (réapparaître) après une mort sert à...",
    options: [
      "Punir le joueur",
      "Éviter les allers-retours abusifs qui cassent la cohérence RP (ex: revenge kill immédiat)",
      "Faire attendre les autres joueurs",
      "Tester la connexion internet",
    ],
    correctIndex: 1,
  },
  {
    id: 30,
    question:
      "Globalement, l'esprit attendu sur un serveur roleplay sérieux est de...",
    options: [
      "Maximiser le gain personnel avant tout",
      "Prioriser l'immersion, la cohérence et le respect des autres joueurs",
      "Gagner un maximum de combats PvP",
      "Éviter toute interaction avec les autres joueurs",
    ],
    correctIndex: 1,
  },
];
