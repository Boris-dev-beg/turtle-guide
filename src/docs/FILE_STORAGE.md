# Stockage des fichiers

## ImageKit

ImageKit stocke les nouvelles images de procédures dans le dossier
`/turtleguide-images`. Le serveur fournit au navigateur une signature d'upload
temporaire après vérification du rôle administrateur; la clé privée n'est
jamais envoyée au navigateur. Le formulaire accepte JPG, PNG, WebP et AVIF,
avec une taille maximale de 5 Mo.

Dans le tableau de bord ImageKit, ouvrir **Developer options → API keys** et
récupérer la **Public Key** et la **Private Key**. Ajouter ces deux variables
dans le `.env` local et dans l'environnement du déploiement, puis redémarrer
l'application :

```env
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
```

La clé privée est un secret serveur : ne pas la préfixer par `NEXT_PUBLIC_`,
ne pas la placer dans le code client et ne pas la committer. Les uploads sont
placés dans le dossier ImageKit `turtleguide-images`.

## Documents

Les PDF actuellement placés dans `public/documents` restent servis comme
avant. L'intégration ImageKit actuelle concerne les images de procédures;
elle ne déplace pas automatiquement ces PDF. ImageKit peut également stocker
des PDF, mais pour des documents payants ou privés, il faut concevoir un accès
protégé et ne jamais enregistrer une URL publique comme seul contrôle d'accès.
