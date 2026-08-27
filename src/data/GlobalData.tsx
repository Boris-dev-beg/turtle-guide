import {
  AlertCircle,
  Baby,
  BriefcaseBusiness,
  CarFront,
  FileText,
  Flower2,
  Folders,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  HeartPulse,
  Home,
  HomeIcon,
  IdCard,
  LockKeyhole,
  Scale,
  Shield,
  Timer,
  UserCircle,
} from "lucide-react";

// ! Hero
export const Hero_infos = {
  title: "Toutes vos démarches administratives,",
  subtitle: "simplement expliquées.",
  description:
    "TurtleGuide vous accompagne pas à pas pour comprendre vos démarches et éviter les anarques.",
  link: {
    label: "Commencer",
    href: "/procedures",
  },
};

// ! How it work
export const HowDoesItWork_infos = {
  title: "Comment ça fonctionne ?",
  element: [
    {
      id: 1,
      title: "Décrivez votre situation",
      description: "Répondez à quelques questions simples.",
    },
    {
      id: 2,
      title: "Identifiez votre démarche",
      description:
        "TurtuleGuide vous indique la procédure et le service comptétent.",
    },
    {
      id: 3,
      title: "Suivez les étapes",
      description:
        "Consultez les piéces nécessaires, l'antenne compétente et les documents disponibles.",
    },
  ],
  alert: {
    title: "Attention aux faux agents !",
    description:
      "TurtleGuide ne délivre aucun document officiel. Méfiez-vous des intermediaires.",
  },
};

// ! Ours Engagements
export const OurEngagements_infos = {
  title: "Nos engagements",
  elements: [
    {
      icon: Shield,
      title: "Fiable et à jour",
      description:
        "Nos informations sont vérifiées en continu par des experts.",
    },
    {
      icon: LockKeyhole,
      title: "Confidentiel",
      description:
        "Vos données personnelles sont protégées et ne sont jamais partagées.",
    },
    {
      icon: Timer,
      title: "Simple et rapide",
      description:
        "Des démarches expliquées étapes par étapes, dans un language.",
    },
    {
      icon: UserCircle,
      title: "À vos côtés",
      description: "Nous vous accompagnons du dé a la fin de  votre démarche.",
    },
  ],
};

// ! Popular Procedures
export const Procedures_infos = {
  title: "Démarches populaires",
  link: {
    label: "Voir toute les démarches",
    href: "/proceduces",
  },
};

// ! Contact
export const Contact_infos = {
  title: "Besion d'aide pour votre démarche ?",
  description:
    "Consultez nos guides détaillés ou contactez notre support. Nous sommes là pour vous aider.",
};

// ! News Letter
export const NewLetter_infos = {
  title: "Restez informé",
  description:
    "Abonnew-vous à notre newsletter pour recevoir les derniéres informations et nouveautés.",
};

// ! ICONS
export const icons = {
  documents: IdCard,
  civil: Baby,
  logement: Home,
  santé: HeartPulse,
  éducation: GraduationCap,
  emploi: BriefcaseBusiness,
  mariage: HandHeart,
  nationalité: FileText,
  famille: HeartHandshake,
  justice: Scale,
  transport: CarFront,
  deces: Flower2,
};

export const links = [
  {
    icon: HomeIcon,
    href: "/",
    label: "Accueil",
  },
  {
    icon: Folders,
    href: "/folders",
    label: "Mes dossiers",
  },
  {
    icon: AlertCircle,
    href: "/about",
    label: "À propos",
  },
];
