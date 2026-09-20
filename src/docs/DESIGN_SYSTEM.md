# Design system — TurtleGuide

Ce fichier est la référence unique des décisions de design déjà prises sur ce
projet. Objectif : qu'une nouvelle session avec l'agent IA n'ait jamais à
redécouvrir ou re-justifier une décision déjà tranchée ici.

**Règle pour l'agent : lis ce fichier avant toute tâche de style ou de UI.
Si une décision manque, propose-la puis ajoute-la ici avant de conclure la
tâche — ne laisse jamais une décision de design vivre uniquement dans un
message de chat.**

**Source de vérité technique : `global.css` (tokens Tailwind v4 via
`@theme`). Ce document explique le _pourquoi_ des tokens ; `global.css`
reste la seule source pour leur valeur réelle. En cas de divergence entre
ce fichier et `global.css`, `global.css` a raison — mets à jour ce fichier
en conséquence.**

---

## 1. Vision générale

TurtleGuide accompagne des citoyens camerounais — des jeunes aux parents peu
familiers du numérique — dans des démarches administratives et judiciaires.
L'interface doit inspirer confiance et sérieux avant tout. Deux registres
coexistent délibérément dans le produit :

| Registre                   | Où                                                  | Caractère                                                                                   |
| -------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Contenu / découverte**   | Cartes de catégories, procédures, contenu éditorial | Chaleureux mais sobre — accent ocre, bordure gauche, coins modérément arrondis              |
| **Structure / navigation** | Header, footer, bottom navigation                   | Institutionnel — pas d'accent coloré, rayons proches de l'angle droit, stabilité avant tout |

Principe transversal : **chaque élément affiché doit correspondre à une
donnée réellement utile à l'utilisateur.** Pas de texte marketing
générique, pas de décoration sans fonction, pas de lien vers une page qui
n'existe pas.

---

## 2. Typographie

- **Titres** : Fraunces (serif, weight 500–600) — chaleur et gravité sans
  tomber dans le froid corporate.
- **Interface / corps de texte** : Public Sans — conçue pour les services
  publics numériques, très lisible à toute taille et tout âge.
- Taille de base : **18px minimum**, line-height **1.6**.
- Jamais de MAJUSCULES pour les labels. Jamais d'emoji dans l'UI.

## 3. Couleurs (voir `global.css` pour les valeurs exactes)

| Token                                                                              | Rôle                          | Où l'utiliser                                                   |
| ---------------------------------------------------------------------------------- | ----------------------------- | --------------------------------------------------------------- |
| `brand-green`                                                                      | Couleur de marque             | Header, footer, CTA principal, navigation                       |
| `brand-ink`                                                                        | Texte principal               | Partout                                                         |
| `brand-ink-muted`                                                                  | Texte secondaire              | Métadonnées, descriptions courtes                               |
| `brand-ocre` _(anciennement nommé `brand-yellow` — à renommer si pas encore fait)_ | Accent chaleureux             | **Cartes de contenu uniquement.** Jamais sur header/footer/nav. |
| `brand-alert` (rouge)                                                              | Statuts importants uniquement | Alertes de fraude, erreurs — jamais décoratif                   |
| Fond de page                                                                       | Ivoire, pas blanc pur         | Fond global                                                     |

## 4. Cartes de contenu (catégories, procédures)

- Bordure gauche accentuée en `brand-ocre` plutôt qu'une carte à ombre
  uniforme partout.
- Coins modérément arrondis (voir token de rayon dédié aux cartes dans
  `global.css`).
- Structure : titre serif → description courte → pied de carte avec
  séparateur fin, métadonnée à gauche, bouton circulaire chevron à droite
  au survol.
- Pas de badge-pilule coloré, pas de coche décorative.
- Chaque carte a un skeleton de chargement qui matche sa structure exacte
  (pas de rectangle générique), et distingue trois états : chargement /
  erreur ou donnée indisponible / liste vide mais chargée avec succès.

## 5. Header, footer, bottom navigation

_(à compléter après la recherche USWDS / DSFR / GOV.UK Design System —
voir section 7)_

- Aucune bordure d'accent colorée (pas d'ocre, pas de jaune, pas d'orange).
- Rayons nettement plus petits que sur les cartes de contenu — proches de
  l'angle droit.
- Priorité à la lisibilité et à la stabilité visuelle : pas d'ombre portée
  superflue, pas d'animation non fonctionnelle.
- Vert de marque et encre comme couleurs dominantes.
- Zones cliquables ≥48px de haut, en particulier bottom navigation (usage
  au pouce sur mobile).
- Références externes utilisées pour ces décisions : USWDS Header,
  GOV.UK Header et GOV.UK Service navigation. Ces systèmes recommandent des
  libellés courts, une hiérarchie lisible, un état actif explicite, des zones
  tactiles accessibles et peu de décoration dans la navigation.

## 6. Gestion des données et des états

Pour tout composant qui consomme des données asynchrones, toujours
distinguer explicitement :

1. **Chargement** → skeleton calé sur la structure du composant final.
2. **Erreur / donnée indisponible** (`!data`, `isError`) → composant d'état
   vide réutilisable, ton neutre, action de réessai si pertinente.
3. **Succès mais liste vide** → message différent de l'état d'erreur, ce
   n'est pas un échec.

Ne jamais laisser un accès direct à une propriété potentiellement
`undefined` sans garde — c'est la cause des pages blanches et des crashs
React.

## 7. Journal des décisions

_(Ajoutez une ligne à chaque session de design avec l'agent, pour garder
une trace de ce qui a été tranché et pourquoi.)_

| Date       | Décision                                                                                                | Justification                                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| —          | Cartes de contenu : bordure gauche ocre, pas de badge-pilule                                            | Éviter le style "SaaS générique"                                                                                                       |
| —          | Header/footer/nav : pas d'accent coloré, rayons sobres                                                  | Registre institutionnel distinct du registre contenu                                                                                   |
| 2026-09-20 | Navigation institutionnelle : séparateurs neutres, rayons sobres, état actif discret et aucun faux lien | Les recommandations USWDS et GOV.UK privilégient la lisibilité, la stabilité, les libellés courts et une navigation directement utile. |
