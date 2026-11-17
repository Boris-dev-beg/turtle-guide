import {
  AlertCircle,
  AlertTriangle,
  Baby,
  BriefcaseBusiness,
  CarFront,
  ChartNoAxesColumn,
  ChevronRight,
  Files,
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
  LayoutDashboard,
  LockKeyhole,
  Scale,
  Shield,
  ShieldAlert,
  Timer,
  UserCircle,
  Users,
  Users2,
} from "lucide-react";

// ! Hero
export const Hero_infos = {
  eyebrow: "La plateforme de guide administratif camerounais",
  title: "Vos démarches administratives et judiciaires, étape par étape",
  description:
    "TurtleGuide vous aide à identifier et suivre pas à pas vos démarches, en toute simplicité.",
  link: {
    href: "/categories",
    label: "Commencer une démarche",
  },
};

// ! How it work
export const HowDoesItWork_infos = {
  title: "Comment ça fonctionne ?",
  subtitle:
    "En quelques étapes, accédez à la démarche qui vous concerne et suivez son avancement.",
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
    title: "Attention aux arnaques !",
    description:
      "TurtleGuide ne vous demandera jamais de payer un service via un intermediaire non officiel. En cas de doute, contactez toujours les services compétents.",
  },
};

// ! Ours Engagements
export const OurEngagements_infos = {
  title: "Nos engagements",
  elements: [
    {
      icon: Shield,
      title: "Des informations fiables",
      description: "Basées sur les tectes officiels.",
    },
    {
      icon: LockKeyhole,
      title: "Vos données sont protégées",
      description: "En toute confidentialité.",
    },
    {
      icon: Timer,
      title: "Un gain de temps",
      description: "Des démarches simplifiées.",
    },
    {
      icon: UserCircle,
      title: "À vos côtés",
      description: "Des démarches pour tous.",
    },
  ],
};

// ! Popular Procedures
export const Procedures_infos = {
  title: "Démarches populaires",
  link: {
    label: "Voir toute les démarches",
    href: "/categories",
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
    href: "/categories",
    label: "Démarches",
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


// ! DASHBOARD
export const LinksDashboard = [
  { icon: LayoutDashboard, label: "Tableau de bord", href: "/admin" },
  {
    icon: ShieldAlert,
    label: "Alertes de fraude",
    href: "/admin/fraud-alerts",
  },
  {
    icon: FileText,
    label: "Gestion du contenu",
    href: "/admin/content",
    icon2: ChevronRight,
  },
  {
    icon: Users2,
    label: "Utilisateurs",
    href: "/admin/users",
    icon2: ChevronRight,
  },
  {
    icon: ChartNoAxesColumn,
    label: "Statistiques",
    href: "/admin/stats",
    icon2: ChevronRight,
  },
  { icon: LayoutDashboard, label: "Paramètre", href: "/admin/settings" },
];
export const KYCDatas = [
  {
    icon: Users,
    title: "Utilisateurs inscrits",
    value: 12510,
  },
  {
    icon: Folders,
    title: "Dossiers créés",
    value: 9312,
  },
  {
    icon: Files,
    title: "Documents achetés",
    value: 3248,
  },
  {
    icon: AlertTriangle,
    title: "Alertes fraudes",
    value: 12,
  },
]
