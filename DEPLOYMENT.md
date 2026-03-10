# 🚀 DEPLOYMENT GUIDE - HÅNDTVERKEREN

## ✅ BUILD-FEIL LØST

Følgende filer er lagt til for å fikse build-problemer:
- ✅ `tsconfig.json` - TypeScript konfigurasjon
- ✅ `tsconfig.node.json` - TypeScript for Vite
- ✅ `.npmrc` - NPM konfigurasjon
- ✅ `.gitignore` - Git ignore-regler
- ✅ Oppdatert `vite.config.ts` - Build-innstillinger
- ✅ Oppdatert `package.json` - React dependencies

---

## 📦 METODE 1: VERCEL (ANBEFALT - ENKLEST)

### Steg 1: Opprett Vercel-konto
1. Gå til **vercel.com**
2. Klikk **"Sign Up"**
3. Bruk e-post, Google eller GitHub

### Steg 2: Deploy via Vercel Dashboard

#### A) Med GitHub (Anbefalt for produksjon):

**1. Opprett GitHub repository:**
```bash
# I terminalen, i prosjektmappen:
git init
git add .
git commit -m "Initial commit - Håndtverkeren"
git branch -M main

# Gå til github.com og opprett nytt repository "handtverkeren"
# Deretter:
git remote add origin https://github.com/[ditt-brukernavn]/handtverkeren.git
git push -u origin main
```

**2. Importer til Vercel:**
- Gå til Vercel dashboard
- Klikk **"Add New... → Project"**
- Velg **GitHub** og velg repository
- Vercel detekterer automatisk settings

**3. Legg til Environment Variables:**
Klikk **"Environment Variables"** og legg til:

```
VITE_SUPABASE_URL = https://bfxqoasgmtxgeyefaxks.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmeHFvYXNnbXR4Z2V5ZWZheGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNDIwMDIsImV4cCI6MjA4ODcxODAwMn0.8yzkvQMnnZGX3QbA48HJA9ZHw_DhrYSRXG2waSwSOIc
```

**VIKTIG:** Environment variables må ha `VITE_` prefix for å fungere i Vite!

**4. Deploy:**
- Klikk **"Deploy"**
- Vent 2-3 minutter
- Ferdig! ✅

#### B) Uten GitHub (Rask testing):

**1. Zip prosjektet:**
- Pakk hele prosjektmappen som ZIP

**2. Upload til Vercel:**
- I Vercel: **"Add New... → Project"**
- Dra ZIP-filen inn
- Eller bruk Vercel CLI:

```bash
npm i -g vercel
vercel
```

---

## 📦 METODE 2: NETLIFY

### Via Netlify Drop (Super enkelt):

**1. Bygg lokalt:**
```bash
npm install
npm run build
```

**2. Deploy:**
- Gå til **app.netlify.com/drop**
- Dra `dist` mappen inn
- Ferdig!

**3. Legg til Environment Variables:**
- Gå til **Site settings → Environment variables**
- Legg til:
  ```
  VITE_SUPABASE_URL = [din url]
  VITE_SUPABASE_ANON_KEY = [din key]
  ```
- Klikk **"Trigger deploy"**

---

## 🌐 KOBLE TIL EGET DOMENE

### I Vercel:
1. Gå til **Settings → Domains**
2. Klikk **"Add"**
3. Skriv: `handtverkeren.no` (eller ditt domene)
4. Følg DNS-instruksjoner

### DNS-innstillinger (hos domeneleverandør):
```
Type: A
Name: @
Value: 76.76.19.19

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

Vent 5-60 minutter for DNS-propagering.

---

## 🔧 OPPDATER SUPABASE-INNSTILLINGER

**VIKTIG etter deployment:**

1. Gå til **Supabase Dashboard**
2. Velg prosjekt: `bfxqoasgmtxgeyefaxks`
3. Gå til **Authentication → URL Configuration**
4. Oppdater:

**Site URL:**
```
https://handtverkeren.no
```

**Redirect URLs:**
```
https://handtverkeren.no/**
https://www.handtverkeren.no/**
https://[din-app].vercel.app/**
```

---

## ✅ SJEKKLISTE FØR DEPLOYMENT

```
□ npm install fungerer lokalt
□ npm run build fungerer lokalt
□ npm run preview viser appen
□ Alle environment variables er klare
□ Supabase-prosjekt er aktivt
□ Domene er kjøpt (valgfritt)
```

---

## 🧪 TEST ETTER DEPLOYMENT

Sjekk disse sidene:

```
✅ / (landingsside)
✅ /pris (prisside)
✅ /abonnement-innstillinger (abonnementer)
✅ /bygg-tilbud/req-demo-001 (tilbudsbygger med demo-jobb)
✅ /leverandør-dashboard (dashboard)
```

---

## 🐛 FEILSØKING

### "npm run build" feiler:

**Løsning 1: Fjern node_modules og reinstaller**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Løsning 2: Bruk riktig Node-versjon**
```bash
# Sjekk versjon (bør være 18+)
node -v

# Installer nvm og bruk Node 18:
nvm install 18
nvm use 18
npm install
npm run build
```

**Løsning 3: Sjekk TypeScript-feil**
```bash
# Installer TypeScript globalt
npm install -g typescript

# Sjekk feil
npx tsc --noEmit
```

### Environment variables fungerer ikke:

- Sjekk at de har `VITE_` prefix
- Restart dev-server etter å ha lagt dem til
- I produksjon: Redeploy etter å ha lagt til variables

### Supabase-feil i produksjon:

- Sjekk at URL Configuration er oppdatert
- Sjekk at CORS er aktivert
- Sjekk at API-nøkler er riktige

---

## 💰 KOSTNADER

**Gratis tier (perfekt for MVP):**
- ✅ Vercel: Gratis (100GB bandwidth/måned)
- ✅ Supabase: Gratis (500MB database, 1GB storage)
- ✅ Netlify: Gratis (100GB bandwidth/måned)
- 💰 Domene: 100-300 kr/år

**Når du vokser:**
- Vercel Pro: $20/måned
- Supabase Pro: $25/måned

---

## 🎯 MIN ANBEFALING

**For testing (NÅ):**
1. ✅ Deploy til **Vercel** via GitHub
2. ✅ Bruk gratis `.vercel.app` domene
3. ✅ Test med venner/familie

**For produksjon (SENERE):**
1. ✅ Kjøp domene (handtverkeren.no)
2. ✅ Koble til Vercel
3. ✅ Oppdater Supabase URLs
4. ✅ Overvåk bruk og oppgrader ved behov

---

## 📞 SUPPORT

**Hvis build fortsatt feiler:**

1. Sjekk Vercel build-logger i detalj
2. Test `npm run build` lokalt først
3. Se etter TypeScript-feil: `npx tsc --noEmit`
4. Sjekk at alle imports er riktige

**Vanlige build-feil:**
- Manglende dependencies → `npm install`
- TypeScript-feil → Sjekk tsconfig.json
- Import-feil → Sjekk filstier
- Environment variables → Legg til i Vercel

---

## 🚀 RASK START (TL;DR)

```bash
# 1. Push til GitHub
git init
git add .
git commit -m "Deploy Håndtverkeren"
git remote add origin https://github.com/[bruker]/handtverkeren.git
git push -u origin main

# 2. Importer til Vercel
# - Gå til vercel.com
# - Import GitHub repo
# - Legg til environment variables
# - Deploy

# 3. Oppdater Supabase
# - Authentication → URL Configuration
# - Legg til production URL

# Ferdig! 🎉
```

---

**Nå burde build fungere!** Prøv å deploye på nytt. 🚀