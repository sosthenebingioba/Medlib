# MedLib — Supabase Starter

Cette version conserve la version HTML de référence de MedLib dans `public/reference/`.

## Déjà préparé

- Next.js + App Router
- client Supabase navigateur
- client Supabase serveur
- variables `.env.local` via `.env.example`
- interface de référence conservée sans modification

## Prochaine étape

1. Copier `.env.example` vers `.env.local`
2. Ajouter l'URL Supabase et la Publishable Key
3. Installer les dépendances avec `npm install`
4. Lancer `npm run dev`
5. Remplacer progressivement les écrans de démonstration par les vrais écrans connectés à Supabase.

Ne jamais mettre une clé `service_role` dans `.env.local` exposé au navigateur.
