<a href="#fr">
  <img src="https://flagcdn.com/w40/fr.png" width="20" alt="Français"> Français
</a>&nbsp;&nbsp;|&nbsp;&nbsp;
<a href="#en">
  <img src="https://flagcdn.com/w40/gb.png" width="20" alt="English"> English
</a>

<hr style="margin-top: 4px; margin-bottom: 12px; border: none; border-top: 1px solid #ccc;" />

<img id="fr" src="https://flagcdn.com/w40/fr.png" width="20" alt="Français"> Français

<h1>We Art</h1>

We Art est une application web responsive permettant d'explorer, rechercher et sauvegarder des œuvres d'art du Metropolitan Museum of Art. L'application offre une interface moderne et intuitive pour découvrir des milliers d'œuvres d'art avec des fonctionnalités de recherche avancée et de gestion de favoris.

Projet collaboratif réalisé en équipe de 3 développeurs sur 1 mois, en suivant la méthodologie Agile/Scrum avec plus de 50 pull requests.

🔗 Découvrez le projet en ligne : [Lien à venir]

**Vos avis m'intéressent - n'hésitez pas à me faire part de vos retours ou suggestions !**

## Stack Technique

- **Frontend** : React + TypeScript + Vite
- **API** : Metropolitan Museum of Art Collection API (REST)
- **State Management** : Context API (React)
- **Styling** : CSS3 (Design Neo-Brutalist)
- **Storage** : localStorage (favoris)
- **Qualité** : Biome (linting & formatting), TypeScript strict mode
- **Gestion** : Git, GitHub, Scrum

## Fonctionnalités Principales

### Exploration d'œuvres

- Affichage de 20 œuvres d'art par défaut du Metropolitan Museum
- Interface responsive adaptée mobile, tablette et desktop
- Design Neo-Brutalist moderne et distinctif
- Chargement progressif avec barre de progression
- Animations fluides d'apparition des cartes

### Recherche Avancée

- Recherche en temps réel dans la collection du musée
- Debouncing automatique (300ms) pour optimiser les performances
- Affichage jusqu'à 30 résultats par recherche
- Gestion intelligente des états (chargement, erreur, vide)

### Gestion des Favoris

- Ajout/suppression de favoris en un clic
- Persistance des favoris dans localStorage
- Page dédiée aux favoris avec chargement optimisé
- Bouton "Clear All" pour vider tous les favoris
- Compteur de favoris dans le header

### Responsive Design

- Layout adaptatif :
  - **Desktop** : Grid 3-4 colonnes, header horizontal
  - **Tablet** : Grid 2-3 colonnes
  - **Mobile** : 1 colonne, cards à 90-95% de largeur
- Navigation optimisée pour tous les écrans
- Touch-friendly sur mobile

### Optimisations Performances

- **Système de cache intelligent** :
  - Cache des œuvres valides : 5 minutes
  - Cache des IDs invalides : 30 secondes avec retry (max 3)
  - Nettoyage automatique des caches expirés
- **Chargement par batch** :
  - 5 œuvres chargées simultanément
  - Délai de 150ms entre chaque batch
  - Évite les erreurs 403 (rate limiting API)
- **Progressive loading** : Barre de progression en temps réel
- **React.memo** : Optimisation des re-renders
- **Lazy loading** : Images chargées à la demande

## Architecture du Projet

```
We-Art/
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       │   └── images/
│       ├── components/
│       │   ├── CardArt.tsx
│       │   ├── Compteur.tsx
│       │   ├── Header.tsx
│       │   ├── Logo.tsx
│       │   ├── Navbar.tsx
│       │   └── SearchBar.tsx
│       ├── contexts/
│       │   └── FavoritesContext.tsx
│       ├── hooks/
│       │   ├── useArtworks.ts
│       │   └── useDebounce.ts
│       ├── pages/
│       │   ├── About.tsx
│       │   ├── Article.tsx
│       │   ├── Favoris.tsx
│       │   └── HomePage.tsx
│       ├── services/
│       │   └── metApiService.ts
│       ├── App.tsx
│       └── main.tsx
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── package.json
```

## Démarrer le Projet

### Prérequis

- Node.js (v18+)
- npm ou yarn

### Installation

1. **Cloner le dépôt** :

   ```bash
   git clone https://github.com/votre-username/We-Art.git
   cd We-Art
   ```

2. **Installer les dépendances** :

   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement** :

   Créer un fichier `.env` dans le dossier `client/` :

   ```env
   VITE_API_URL=https://collectionapi.metmuseum.org/public/collection/v1
   ```

4. **Lancer l'application** :

   ```bash
   npm run dev
   ```

   L'application sera accessible sur `http://localhost:5173`

### Commandes Disponibles

| Commande              | Description                         |
| --------------------- | ----------------------------------- |
| `npm run dev`         | Lance le serveur de développement   |
| `npm run build`       | Build de production                 |
| `npm run preview`     | Prévisualise le build de production |
| `npm run check`       | Vérifie le code (Biome)             |
| `npm run check:write` | Corrige automatiquement les erreurs |
| `npm run check-types` | Vérifie les types TypeScript        |

## API Utilisée

### Metropolitan Museum of Art Collection API

**Base URL** : `https://collectionapi.metmuseum.org/public/collection/v1`

**Endpoints utilisés** :

| Méthode | Endpoint                           | Description         |
| ------- | ---------------------------------- | ------------------- |
| GET     | `/search?hasImages=true&q={query}` | Recherche d'œuvres  |
| GET     | `/objects/{objectID}`              | Détails d'une œuvre |

**Documentation officielle** : [Met Museum API](https://metmuseum.github.io/)

**Limitations** :

- Rate limiting : ~80 requêtes par seconde
- Gestion intelligente implémentée (batching + delays)
- Retry automatique pour les erreurs temporaires

## Gestion du Cache

### Cache des Œuvres Valides

```typescript
CACHE_DURATION = 5 minutes
```

- Réduit les appels API redondants
- Améliore les performances
- Expiration automatique

### Cache des IDs Invalides

```typescript
INVALID_CACHE_DURATION = 30 secondes
MAX_RETRY_COUNT = 3
```

- Évite de re-tenter les IDs qui échouent systématiquement
- Système de retry avec compteur
- Nettoyage automatique (10% de chance à chaque appel)

## Méthodologie de Développement

### Agile/Scrum

- **Sprints** : 1 semaine
- **Daily Standups** : Synchronisation quotidienne
- **Retrospectives** : Amélioration continue
- **Pull Requests** : 50+ PR sur 1 mois
- **Code Reviews** : Validation par les pairs

### Bonnes Pratiques

- **Git Flow** : Feature branches + PR
- **Conventional Commits** : Messages normalisés
- **TypeScript Strict** : Type safety maximale
- **Biome** : Qualité de code automatisée
- **React Best Practices** : Hooks, memo, lazy loading

## Optimisations Techniques Implémentées

### Performance

1. **Batch Loading** : Chargement par lots de 5 œuvres
2. **Progressive UI** : Affichage progressif avec barre de progression
3. **Debouncing** : Recherche optimisée (300ms)
4. **React.memo** : Évite les re-renders inutiles
5. **Lazy Loading** : Images chargées à la demande
6. **Cache System** : Double cache (valide/invalide)

### UX/UI

1. **Loading States** : Loaders animés + compteurs temps réel
2. **Error Handling** : Messages clairs et actionables
3. **Empty States** : Guides l'utilisateur
4. **Animations** : Fade-in progressif des cartes
5. **Responsive** : Adaptatif mobile/tablette/desktop

### Résolution de Bugs

1. **Infinite Loop** : Stabilisation des dépendances `useMemo`
2. **403 Errors** : Système de batching + delays
3. **Cache Issues** : Expiration et retry intelligents
4. **Mobile Layout** : Cards uniformes sur mobile

## Design System

### Couleurs

- **Primary** : `#ffcd29` (Jaune)
- **Secondary** : `#2997fd` (Bleu)
- **Background** : `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Text** : `#000` (Noir)
- **Cards** : `#cbcbcb` (Gris clair)

### Style Neo-Brutalist

- Bordures épaisses (3px) noires
- Pas de border-radius
- Box-shadows décalées (offset)
- Typographie uppercase avec letterspacing
- Hover effects avec transform

## Équipe

**Projet collaboratif développé par une équipe de 3 développeurs**, avec des contributions significatives sur :

- Architecture frontend et conception des composants
- Intégration API et optimisation des performances
- Gestion d'état et système de cache
- Implémentation du design responsive
- Qualité du code et tests

**Durée** : 1 mois (Sprint Agile)  
**Pull Requests** : 50+  
**Méthodologie** : Scrum

Par [Nadir AMMI SAID](https://www.linkedin.com/in/nadir-ammisaid/)

Vos avis m'intéressent - n'hésitez pas à me faire part de vos retours ou suggestions !  
📩 Contact : [LinkedIn.com/in/Nadir-AmmiSaid](https://www.linkedin.com/in/nadir-ammisaid/)
🌐 Portfolio : [portfolio-nad.vercel.app](https://www.portfolio-nad.vercel.app/)

## Contribution

Pour contribuer au projet :

1. **Fork** le dépôt
2. **Clone** votre fork sur votre machine locale
3. Créez une nouvelle branche (`git switch -c feature/ma-fonctionnalite`)
4. **Commit** vos modifications (`git commit -m 'feat: ajout fonctionnalité X'`)
5. **Push** vers votre branche (`git push origin feature/ma-fonctionnalite`)
6. Créez une **Pull Request**

**Bonnes pratiques** :

- Exécutez `npm run check` avant de pousser
- Respectez les conventions de commit
- Ajoutez des tests si nécessaire
- Documentez les nouvelles fonctionnalités

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

<br/>
<hr id="en" style="margin-top: 4px; margin-bottom: 12px; border: none; border-top: 1px solid #ccc;" />
<br/>

<img src="https://flagcdn.com/w40/gb.png" width="20" alt="English"> English

<h1>We Art</h1>

We Art is a responsive web application for exploring, searching, and saving artworks from the Metropolitan Museum of Art. The application offers a modern and intuitive interface to discover thousands of artworks with advanced search features and favorites management.

Collaborative project developed by a team of 3 developers over 1 month, following Agile/Scrum methodology with 50+ pull requests.

🔗 Discover the project online: [Link coming soon]

**Your feedback matters - don't hesitate to share your thoughts or suggestions!**

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **API**: Metropolitan Museum of Art Collection API (REST)
- **State Management**: Context API (React)
- **Styling**: CSS3 (Neo-Brutalist Design)
- **Storage**: localStorage (favorites)
- **Quality**: Biome (linting & formatting), TypeScript strict mode
- **Management**: Git, GitHub, Scrum

## Main Features

### Artwork Exploration

- Display 20 artworks by default from the Metropolitan Museum
- Responsive interface adapted for mobile, tablet, and desktop
- Modern and distinctive Neo-Brutalist design
- Progressive loading with progress bar
- Smooth card appearance animations

### Advanced Search

- Real-time search through the museum collection
- Automatic debouncing (300ms) for optimized performance
- Display up to 30 results per search
- Intelligent state management (loading, error, empty)

### Favorites Management

- Add/remove favorites with one click
- Favorites persistence in localStorage
- Dedicated favorites page with optimized loading
- "Clear All" button to empty all favorites
- Favorites counter in header

### Responsive Design

- Adaptive layout:
  - **Desktop**: 3-4 column grid, horizontal header
  - **Tablet**: 2-3 column grid
  - **Mobile**: 1 column, cards at 90-95% width
- Optimized navigation for all screens
- Touch-friendly on mobile

### Performance Optimizations

- **Smart cache system**:
  - Valid artworks cache: 5 minutes
  - Invalid IDs cache: 30 seconds with retry (max 3)
  - Automatic cleanup of expired caches
- **Batch loading**:
  - 5 artworks loaded simultaneously
  - 150ms delay between batches
  - Prevents 403 errors (API rate limiting)
- **Progressive loading**: Real-time progress bar
- **React.memo**: Re-render optimization
- **Lazy loading**: Images loaded on demand

## Project Architecture

```
We-Art/
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       │   └── images/
│       ├── components/
│       │   ├── CardArt.tsx
│       │   ├── Compteur.tsx
│       │   ├── Header.tsx
│       │   ├── Logo.tsx
│       │   ├── Navbar.tsx
│       │   └── SearchBar.tsx
│       ├── contexts/
│       │   └── FavoritesContext.tsx
│       ├── hooks/
│       │   ├── useArtworks.ts
│       │   └── useDebounce.ts
│       ├── pages/
│       │   ├── About.tsx
│       │   ├── Article.tsx
│       │   ├── Favoris.tsx
│       │   └── HomePage.tsx
│       ├── services/
│       │   └── metApiService.ts
│       ├── App.tsx
│       └── main.tsx
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/We-Art.git
   cd We-Art
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:

   Create a `.env` file in the `client/` folder:

   ```env
   VITE_API_URL=https://collectionapi.metmuseum.org/public/collection/v1
   ```

4. **Launch the application**:

   ```bash
   npm run dev
   ```

   The application will be accessible at `http://localhost:5173`

### Available Commands

| Command               | Description              |
| --------------------- | ------------------------ |
| `npm run dev`         | Start development server |
| `npm run build`       | Production build         |
| `npm run preview`     | Preview production build |
| `npm run check`       | Check code (Biome)       |
| `npm run check:write` | Auto-fix errors          |
| `npm run check-types` | Check TypeScript types   |

## API Used

### Metropolitan Museum of Art Collection API

**Base URL**: `https://collectionapi.metmuseum.org/public/collection/v1`

**Endpoints used**:

| Method | Endpoint                           | Description     |
| ------ | ---------------------------------- | --------------- |
| GET    | `/search?hasImages=true&q={query}` | Search artworks |
| GET    | `/objects/{objectID}`              | Artwork details |

**Official documentation**: [Met Museum API](https://metmuseum.github.io/)

**Limitations**:

- Rate limiting: ~80 requests per second
- Smart handling implemented (batching + delays)
- Automatic retry for temporary errors

## Cache Management

### Valid Artworks Cache

```typescript
CACHE_DURATION = 5 minutes
```

- Reduces redundant API calls
- Improves performance
- Automatic expiration

### Invalid IDs Cache

```typescript
INVALID_CACHE_DURATION = 30 seconds
MAX_RETRY_COUNT = 3
```

- Prevents retrying IDs that consistently fail
- Retry system with counter
- Automatic cleanup (10% chance per call)

## Development Methodology

### Agile/Scrum

- **Sprints**: 1 week
- **Daily Standups**: Daily synchronization
- **Retrospectives**: Continuous improvement
- **Pull Requests**: 50+ PR over 1 month
- **Code Reviews**: Peer validation

### Best Practices

- **Git Flow**: Feature branches + PR
- **Conventional Commits**: Standardized messages
- **TypeScript Strict**: Maximum type safety
- **Biome**: Automated code quality
- **React Best Practices**: Hooks, memo, lazy loading

## Technical Optimizations Implemented

### Performance

1. **Batch Loading**: Loading in batches of 5 artworks
2. **Progressive UI**: Progressive display with progress bar
3. **Debouncing**: Optimized search (300ms)
4. **React.memo**: Prevents unnecessary re-renders
5. **Lazy Loading**: Images loaded on demand
6. **Cache System**: Dual cache (valid/invalid)

### UX/UI

1. **Loading States**: Animated loaders + real-time counters
2. **Error Handling**: Clear and actionable messages
3. **Empty States**: Guides the user
4. **Animations**: Progressive card fade-in
5. **Responsive**: Adaptive mobile/tablet/desktop

### Bug Fixes

1. **Infinite Loop**: Dependency stabilization with `useMemo`
2. **403 Errors**: Batching + delays system
3. **Cache Issues**: Smart expiration and retry
4. **Mobile Layout**: Uniform cards on mobile

## Design System

### Colors

- **Primary**: `#ffcd29` (Yellow)
- **Secondary**: `#2997fd` (Blue)
- **Background**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Text**: `#000` (Black)
- **Cards**: `#cbcbcb` (Light gray)

### Neo-Brutalist Style

- Thick black borders (3px)
- No border-radius
- Offset box-shadows
- Uppercase typography with letterspacing
- Hover effects with transform

## Team

**Collaborative project developed by a team of 3 developers**, with significant contributions to:

- Frontend architecture and component design
- API integration and performance optimization
- State management and caching system
- Responsive design implementation
- Code quality and testing

**Duration**: 1 month (Agile Sprint)  
**Pull Requests**: 50+  
**Methodology**: Scrum

By [Nadir AMMI SAID](https://www.linkedin.com/in/nadir-ammisaid/)

Your feedback matters - don't hesitate to share your thoughts or suggestions!  
📩 Contact: [LinkedIn.com/in/Nadir-AmmiSaid](https://www.linkedin.com/in/nadir-ammisaid/)
🌐 Portfolio : [portfolio-nad.vercel.app](https://www.portfolio-nad.vercel.app/)

## Contribution

To contribute to the project:

1. **Fork** the repository
2. **Clone** your fork to your local machine
3. Create a new branch (`git switch -c feature/my-feature`)
4. **Commit** your changes (`git commit -m 'feat: add feature X'`)
5. **Push** to your branch (`git push origin feature/my-feature`)
6. Create a **Pull Request**

**Best practices**:

- Run `npm run check` before pushing
- Follow commit conventions
- Add tests if necessary
- Document new features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
