# Turtle Guide

Turtle Guide est une application web Next.js destinée à accompagner les
utilisateurs dans leurs démarches administratives.

## État d'avancement

L'application permet actuellement de :

- consulter les catégories et les démarches disponibles ;
- créer et suivre des dossiers personnels ;
- répondre à un diagnostic guidé avec progression sauvegardée ;
- consulter les étapes et les documents associés aux démarches ;
- gérer l'authentification par email, Google et Facebook ;
- vérifier son adresse email et réinitialiser son mot de passe ;
- consulter son profil et se déconnecter.

Le projet est encore en développement. Les fonctionnalités de paiement,
d'achat de documents et certains parcours administratifs restent à compléter.

## Stack technique

- Next.js 16 avec App Router et TypeScript ;
- Prisma et PostgreSQL pour la persistance des données ;
- Better Auth pour l'authentification ;
- Nodemailer pour les emails de vérification et de récupération ;
- React Query, Zustand, React Hook Form et Zod.

## Démarrage

1. Installer les dépendances : `npm install`
2. Configurer `DATABASE_URL` et les variables d'authentification dans
   l'environnement.
3. Exécuter les migrations et le seed :

```bash
npx prisma migrate dev
node prisma/seed.ts
```

4. Lancer le serveur de développement : `npm run dev`
