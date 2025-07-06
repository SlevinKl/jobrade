# JobSwipe - Application de Recrutement

Une application de matching emploi inspirée de Tinder, développée avec React et TypeScript.

## 🚀 Fonctionnalités

- **Matching intelligent** : Swipe pour matcher candidats et recruteurs
- **Chat en temps réel** : Communication directe entre candidats et recruteurs
- **Profils détaillés** : Compétences, expérience, préférences
- **Dashboard analytique** : Statistiques et métriques
- **Interface responsive** : Optimisée mobile et desktop

## 🛠 Technologies

- **Frontend** : React 18, TypeScript, Tailwind CSS
- **Icons** : Lucide React
- **Build** : Vite
- **State Management** : React Context + useReducer

## 📦 Installation

```bash
# Cloner le projet
git clone <repository-url>
cd job-tinder-app

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

## 🔧 Configuration Backend

### Option 1: API REST personnalisée

1. Créer un fichier `.env` basé sur `.env.example`
2. Configurer l'URL de votre API backend
3. Implémenter les endpoints suivants :

```
POST /api/auth/login
POST /api/auth/register
GET  /api/users/me
PUT  /api/users/profile
GET  /api/candidates
GET  /api/jobs
POST /api/swipes
GET  /api/matches
GET  /api/chats
POST /api/chats/:id/messages
```

### Option 2: Supabase

1. Créer un projet Supabase
2. Configurer les variables d'environnement
3. Créer les tables nécessaires :

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  type TEXT CHECK (type IN ('candidate', 'recruiter')),
  location TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Candidate profiles
CREATE TABLE candidate_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT,
  bio TEXT,
  skills TEXT[],
  experience INTEGER,
  salary_min INTEGER,
  salary_max INTEGER,
  -- ... autres champs
);

-- Job offers
CREATE TABLE job_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  skills TEXT[],
  salary_min INTEGER,
  salary_max INTEGER,
  -- ... autres champs
);

-- Matches
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES users(id),
  recruiter_id UUID REFERENCES users(id),
  job_offer_id UUID REFERENCES job_offers(id),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID,
  sender_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Option 3: Firebase

1. Créer un projet Firebase
2. Activer Firestore et Authentication
3. Configurer les règles de sécurité
4. Adapter les services pour utiliser Firebase SDK

## 🔄 Migration des données mockées

Pour remplacer les données mockées par de vraies données :

1. Remplacer les imports de `mockData` par des appels API
2. Utiliser les hooks `useApi` dans les composants
3. Gérer les états de chargement et d'erreur
4. Implémenter la persistance des données

## 📱 Fonctionnalités temps réel

Pour les messages en temps réel :

1. **WebSocket** : Utiliser le service WebSocket fourni
2. **Server-Sent Events** : Alternative plus simple
3. **Supabase Realtime** : Si vous utilisez Supabase
4. **Firebase Realtime Database** : Si vous utilisez Firebase

## 🚀 Déploiement

### Frontend (Netlify/Vercel)

```bash
npm run build
# Déployer le dossier dist/
```

### Backend suggestions

- **Node.js + Express** : API REST classique
- **Supabase** : Backend-as-a-Service
- **Firebase** : Solution Google complète
- **Railway/Render** : Hébergement backend simple

## 🔐 Sécurité

- Authentification JWT
- Validation des données côté serveur
- Rate limiting sur les API
- Chiffrement des données sensibles
- HTTPS obligatoire en production

## 📊 Monitoring

- Logs d'erreurs (Sentry)
- Analytics (Google Analytics)
- Performance (Web Vitals)
- Uptime monitoring

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request