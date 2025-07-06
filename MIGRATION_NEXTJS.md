# Migration vers Next.js - Plan détaillé

## 🎯 Structure Next.js recommandée

```
jobswipe-nextjs/
├── app/                     # App Router (Next.js 13+)
│   ├── (auth)/             # Route groups
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   ├── matching/
│   ├── chat/
│   ├── profile/
│   ├── api/                # API Routes
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   └── me/route.ts
│   │   ├── users/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── candidates/
│   │   ├── jobs/
│   │   ├── matches/
│   │   ├── chats/
│   │   └── swipes/
│   ├── globals.css
│   ├── layout.tsx          # Layout principal
│   └── page.tsx           # Page d'accueil
├── components/            # Composants réutilisables
├── lib/                  # Utilitaires et config
│   ├── auth.ts
│   ├── db.ts
│   ├── validations.ts
│   └── utils.ts
├── types/
├── middleware.ts         # Middleware global
├── next.config.js
└── package.json
```

## 📋 Étapes de migration

### 1. Initialiser le projet Next.js

```bash
npx create-next-app@latest jobswipe-nextjs --typescript --tailwind --eslint --app
cd jobswipe-nextjs
```

### 2. Installer les dépendances

```bash
npm install lucide-react
npm install @prisma/client prisma
npm install bcryptjs jsonwebtoken
npm install @types/bcryptjs @types/jsonwebtoken
npm install zod # Pour la validation
npm install next-auth # Pour l'authentification
```

### 3. Configuration de base

#### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.pexels.com', 'your-image-domain.com'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
```

#### middleware.ts
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from './lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value

  // Pages protégées
  const protectedPaths = ['/dashboard', '/matching', '/chat', '/profile']
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token) {
    try {
      await verifyJWT(token)
    } catch (error) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('auth-token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

### 4. Structure des API Routes

#### app/api/auth/login/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signJWT } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { loginSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email },
      include: { candidateProfile: true }
    })

    if (!user || !await bcrypt.compare(password, user.password)) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      )
    }

    const token = await signJWT({ userId: user.id })
    
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type,
        // ... autres champs
      }
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 jours
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
```

#### app/api/candidates/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skills = searchParams.get('skills')?.split(',')

    const candidates = await prisma.user.findMany({
      where: {
        type: 'candidate',
        ...(skills && {
          candidateProfile: {
            skills: {
              hasSome: skills
            }
          }
        })
      },
      include: {
        candidateProfile: true
      },
      skip: (page - 1) * limit,
      take: limit
    })

    return NextResponse.json(candidates)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
```

### 5. Pages avec App Router

#### app/dashboard/page.tsx
```typescript
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardClient } from './dashboard-client'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  return <DashboardClient user={user} />
}
```

#### app/dashboard/dashboard-client.tsx
```typescript
'use client'

import { useState, useEffect } from 'react'
import { User } from '@/types'
// ... imports des composants

interface DashboardClientProps {
  user: User
}

export function DashboardClient({ user }: DashboardClientProps) {
  // Logique côté client (hooks, state, etc.)
  return (
    <div>
      {/* Votre composant Dashboard actuel */}
    </div>
  )
}
```

### 6. Configuration Prisma

#### prisma/schema.prisma
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  avatar    String?
  type      UserType
  location  String
  verified  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  candidateProfile CandidateProfile?
  recruiterProfile RecruiterProfile?
  sentMatches      Match[]           @relation("SentMatches")
  receivedMatches  Match[]           @relation("ReceivedMatches")
  messages         Message[]
  swipes           Swipe[]

  @@map("users")
}

model CandidateProfile {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title     String
  bio       String
  skills    String[]
  experience Int
  salaryMin Int
  salaryMax Int
  jobTypes  JobType[]
  workModes WorkMode[]
  education String?
  portfolio String?
  linkedin  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("candidate_profiles")
}

// ... autres modèles
```

### 7. Utilitaires et helpers

#### lib/auth.ts
```typescript
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { prisma } from './db'

const JWT_SECRET = process.env.JWT_SECRET!

export async function signJWT(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export async function verifyJWT(token: string) {
  return jwt.verify(token, JWT_SECRET)
}

export async function getCurrentUser(request?: NextRequest) {
  try {
    const token = request?.cookies.get('auth-token')?.value
    if (!token) return null

    const payload = await verifyJWT(token) as { userId: string }
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { candidateProfile: true, recruiterProfile: true }
    })

    return user
  } catch {
    return null
  }
}
```

## 🔄 Avantages de cette migration

1. **Performance** : SSR + optimisations automatiques
2. **SEO** : Indexation parfaite des profils
3. **Simplicité** : Un seul projet à maintenir
4. **Scalabilité** : Architecture Next.js éprouvée
5. **DX** : Excellent developer experience
6. **Déploiement** : Vercel en un clic

## 📦 Déploiement

```bash
# Vercel (recommandé)
npm i -g vercel
vercel

# Ou Netlify
npm run build
# Upload du dossier .next
```

## 🔧 Variables d'environnement

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
```