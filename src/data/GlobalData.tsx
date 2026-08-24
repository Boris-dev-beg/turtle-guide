import {
    AlertTriangle,
    FolderCheck,
  LockKeyhole,
  MessagesSquare,
  Shield,
  ShieldCheck,
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
  title: "Comment ça marche ?",
  element: [
    {
      icon: MessagesSquare,
      title: "1. Répondez à quelques questions",
      description: "Nous comprenons votre situation",
    },
    {
      icon: FolderCheck,
      title: "2. Recevez votre parcours personnalisé",
      description: "Étapes, lieux et documents utiles",
    },
    {
      icon: ShieldCheck,
      title: "3. Évitez les arnaques",
      description: "Nos alertes vous protégent",
    },
  ],
  alert: {
    icon: AlertTriangle,
    title: "Attention aux faux agents !",
    description: "TurtleGuide ne délivre aucun document officiel. Méfiez-vous des intermediaires."
  }
};

// ! Ours Engagements
export const OurEngagements = {
  name: "Nos engagements",
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
export const Procedures = {
  name: "Nos engagements",
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
  link: {
    label: "Voir toute les démarches",
    href: "/proceduces",
  },
};
