# RodLab Studio — PWA v8.6.0

Application web progressive (PWA) complète de **RodLab Studio**, agence de design graphique, développement numérique et formation professionnelle basée à Lomé, Togo.

> « Votre vision, notre expertise. »

La **v8.6.0 élargit RodLab Academy et installe l'application** : le catalogue passe de **1 à 6 formations gratuites certifiantes** — s'ajoutent au cours vedette « Créez votre premier site web professionnel » : **Design graphique**, **Community management**, **Bureautique essentielle** (Word, Excel, PowerPoint), **Identité de marque & logo** et **Photo & vidéo au smartphone** (4 modules et 10 à 12 leçons rédigés chacun, examen final de 10 questions, certificat PDF vérifiable par formation). `/formation` devient un **catalogue** avec fiches détaillées par cours (`/formation/[slug]`), `/dashboard/formation` devient le hub **« Mes formations »** (progression, certificats, activation en un clic, parcours parallèles autorisés), l'espace admin supervise les 6 cours, et les anciennes URLs 8.5 restent valides via redirections. Côté PWA : une **bannière intelligente d'installation** apparaît après 4 secondes sur tout le site — le bouton « Installer l'application » ouvre la **fenêtre native du navigateur** (Android/Chrome/Edge : confirmer → l'application s'installe sur le PC ou le téléphone ; iOS : instructions guidées), avec rappel discret tous les 7 jours et confirmation d'installation réussie. Enfin, **« Accueil » réintègre la barre de navigation desktop** en première position, à la demande des utilisateurs.

La **v8.5.2 officialise le nom du fondateur** : **« K.A.S. Rodrigue »** remplace « Rodrigue Lawson » partout où il apparaissait — signature du **certificat PDF**, pages `/certificats/[code]` et `/dashboard/formation/certificat`, compte administrateur de démonstration (`directeur@rodlabstudio.tg`) et présentation de la session live Q&A. Le client de démonstration Sévérin Lawson (Hôtel Palma) reste inchangé.

La **v8.5.1 désencombre la barre de navigation** : « Accueil » disparaît du menu desktop (le logo mène déjà à l'accueil), « L'application » devient une **icône compacte** avec info-bulle, « Connexion » et « Espace client » fusionnent en un seul lien, et « Devis gratuit » passe en **bouton plein terracotta** — la hiérarchie est enfin claire : utilitaire → connexion → action principale. La barre tient sans débordement dès 1024 px ; en dessous, le menu burger épuré prend le relais (mega-menus Services/Agence et menu mobile inchangés, comportement v8.4 conservé).

La **v8.5 lance RodLab Academy et RodLab Live** : une **formation en ligne certifiante** « Créez votre premier site web professionnel » (page publique `/formation`, inscription gratuite après connexion) suivie **module par module** depuis l'espace client — 8 modules, 23 leçons rédigées par l'agence, barre de progression, leçons cochables et reprise où on l'a laissée. Une fois les modules terminés, l'**examen final se débloque** : 24 questions à choix multiple (seuil 70 %), une question à la fois, correction détaillée avec explications et repassage illimité. À la réussite, un **certificat PDF officiel** est généré automatiquement (`/api/formation/certificat/[code]`, pdf-lib, logo et charte RodLab) : nom de l'apprenant, score, date et **code de vérification unique** consultable publiquement sur `/certificats/[code]` — le PDF se télécharge en un clic depuis l'espace client ou la page de vérification. La **v8.5 ajoute aussi RodLab Live** (`/live`) : sessions de **formation à distance pour les apprenants hors du Togo** — masterclass, ateliers de code et Q&A en direct via Zoom / Google Meet / YouTube / StreamYard, avec horaires de Lomé convertis (Europe, Amérique), inscription en un clic, salle accessible 15 minutes avant le début, badge « EN DIRECT » et replays. Côté administration : **`/admin/formation`** (apprenants, progression, tentatives d'examen, certificats émis, taux de réussite) et **`/admin/live`** (création, édition, statut et suppression des sessions, suivi des inscriptions). RodBot connaît l'Academy et le Live, et les nouveaux liens figurent dans la navbar, le menu mobile et le footer.

La **v8.4 rend RodBot infaillible** : en cas d'indisponibilité de l'IA distante (installation locale sans clé, connexion coupée, quota épuisé) ou de **navigation hors-ligne**, il bascule automatiquement sur un **moteur de réponses local** (`src/lib/rodbot-local.ts`, 20 intentions construites sur les informations officielles de l'agence : tarifs, délais, paiements, contact, installation de l'application, espace client, maintenance…) — l'erreur « RodBot est momentanément indisponible » ne peut plus apparaître. La **v8.4 répare aussi les menus du header** : les panneaux déroulants **Services** et **Agence** restent désormais ouverts quand la souris descend dans le panneau (suivi géométrique du pointeur via `mousemove` + `elementFromPoint`, grâce de fermeture de 300 ms, fermeture à Escape) — auparavant ils disparaissaient instantanément dès que la souris quittait la barre de liens.

La **v8.3 ajoute RodBot, le chatbot intelligent de l'agence** : bulle de chat flottante sur toutes les pages (public comme espaces sécurisés), alimentée par un modèle de langage côté serveur (`/api/chat` via z-ai-web-dev-sdk, jamais exposé au navigateur). RodBot connaît les services, tarifs, délais, modes de paiement, contacts et l'installation de l'application : il répond en français en quelques secondes, propose des **suggestions rapides** (tarifs logo, délai d'un site, installation de l'app, contact), transforme les chemins du site (`/contact`, `/telecharger`…) en **liens cliquables**, affiche un indicateur « en train d'écrire », permet de **réessayer** après une erreur réseau et **mémorise la conversation** localement (bouton « nouvelle conversation » disponible). Le widget se **décale automatiquement** au-dessus de la bannière d'installation lorsqu'elle apparaît.

La **v8.2 rend la PWA téléchargeable directement** : nouvelle page **`/telecharger`** (bouton « Installer maintenant » qui déclenche le prompt natif du navigateur, **QR code** à scanner depuis le téléphone, guide d'installation pas à pas par plateforme — Android, iPhone, ordinateur —, captures d'écran réelles de l'application et atouts de la PWA). Le bouton d'installation est désormais **partout** : navbar (« L'application »), bloc dédié dans le footer, section « Vos projets dans la poche » sur l'accueil et badge du héros cliquable. Un seul composant (`InstallPromptProvider`) capture l'événement d'installation pour toute l'app, détecte la plateforme et l'état « déjà installée ». Le **manifeste** est enrichi avec les captures d'écran de l'app (fenêtre d'installation visuelle sur Android/Chrome), `display_override` et `launch_handler`.

La v8.1 rend la connexion **infaillible en local** et habille la page de connexion : le panneau de marque affiche désormais le **visuel officiel RodLab Studio** en fond (avec voiles forêt pour la lisibilité), les identifiants de démonstration ne s'affichent plus à l'écran (ils restent en base), et l'application **se répare seule** : si la base est absente ou vide (installation incomplète, changement de `.env`…), le schéma et les comptes sont recréés automatiquement à la première tentative de connexion — plus besoin de Bun ni de tsx, tout fonctionne avec npm seul. La v8.0 avait ajouté un **carrousel de fond auto-défilant** sur l'accueil (trois visuels officiels qui glissent toutes les 5 secondes derrière le héros) ; la v7.1 avait remplacé la photo du héros par le **visuel officiel RodLab Studio** (« Nous formons les talents de demain ») ; la v7.0 avait habillé tout le site de **26 photographies sur mesure**. Le tout s'appuie sur la base posée en v6 : **site multi-pages** (13 pages publiques : accueil, services détaillés avec tarifs, études de cas filtrables, blog, FAQ, contact…) avec **navigation riche** (mega-menus, fil d'Ariane, footer 4 colonnes), et la plateforme métier complète : espaces sécurisés par rôle (administration, client, entreprise), suivi de projets en temps réel, devis et factures, messagerie intégrée, notifications push et **mode hors-ligne**.

---

## Fonctionnalités

### Site public multi-pages (13 routes)
- **Accueil** : héros photo avec cartes flottantes (avancement projet + notification devis), chiffres clés, services et portfolio **illustrés en photo**, avis clients avec portraits, aperçus blog avec couvertures (tout renvoie vers les pages dédiées)
- **Photographies** : 26 visuels générés sur mesure dans `public/images/site/` (équipe, bureau, 4 services, 6 réalisations, 4 couvertures blog, 4 portraits, 3 avatars clients, vue aérienne de Lomé) — servis optimisés (JPEG mozjpeg) et mis en cache hors-ligne par le service worker
- **Services** `/services` + **4 pages détail** `/services/[slug]` : présentation, bénéfices, **3 formules tarifaires en FCFA**, FAQ dédiée, autres services
- **Réalisations** `/realisations` : portfolio **filtrable par catégorie** + **6 études de cas complètes** `/realisations/[slug]` (défi, solution, résultats chiffrés, témoignage client)
- **Blog** `/blog` + **4 articles complets** `/blog/[slug]` (stratégie, technique, conseils)
- **À propos** `/a-propos` : histoire (timeline 2018 → 2026), valeurs, équipe, chiffres
- **FAQ** `/faq` : 8 questions en accordéons
- **Contact** `/contact` : formulaire de devis (service pré-sélectionnable via `?service=`), canaux, horaires
- **Navigation** : mega-menu Services (4 expertises + formules), menu Agence (à propos/blog/FAQ/contact), CTA « Devis gratuit », lien actif surligné, drawer mobile à accordéons
- **Footer** 4 colonnes : agence / services / ressources / contact + bandeau de chiffres
- **Fil d'Ariane** et métadonnées SEO par page + `sitemap.xml`

### Espace ADMINISTRATEUR `/admin`
- **Statistiques** : revenus encaissés/en attente, projets actifs, clients, graphique des revenus sur 8 mois (Recharts), répartition des projets par statut
- **Demandes de devis** : filtres par statut, recherche, mise en étude, archivage, suppression et **conversion en un clic** (création du compte client + du projet, notification push)
- **Clients** : cartes détaillées, consultation **et modification des profils** (coordonnées, ville, couleur d'avatar), réinitialisation de mot de passe, onglets projets/devis/factures
- **Projets** : création, statuts (en attente → en cours → révision → livré), jauge d'avancement, jalons cochables, budget, échéance — chaque changement **notifie le client**
- **Devis** : générateur de lignes avec calcul HT/TVA/TTC, brouillon ou envoi immédiat
- **Factures** : création, marquage payée/retard, numérotation automatique (FA-2026-00X)
- **Messagerie** : liste des fils clients, réponses en direct avec notifications push
- **Contenu du site** : édition des textes publics
- **Équipe & comptes** : création de comptes (admin/client/entreprise), changement de rôle, réinitialisation de mot de passe, suppression

### Espace CLIENT `/dashboard`
- Vue d'ensemble : projets en cours, devis à décider, montant à régler, derniers échanges
- **Mes projets** : avancement en pourcentage, étapes livrées, documents liés
- **Devis** : détail des lignes, **acceptation ou refus en un clic** (l'admin est notifié)
- **Factures** : vue imprimable (Ctrl+P → PDF) avec en-tête de marque
- **Messagerie** : discussion directe avec le studio
- **Mon profil** : consultation et modification (téléphone, adresse, avatar, mot de passe)

### Espace ENTREPRISE `/dashboard`
Toutes les fonctions client **plus** :
- **Notre équipe** : ajout de collaborateurs, suspension/réactivation, retrait — un collaborateur possédant déjà un compte RodLab est rattaché automatiquement

### PWA (Progressive Web App)
- **Installable** : bannière d'installation native (beforeinstallprompt), icônes maskable générées depuis le logo officiel
- **Mode hors-ligne** : service worker avec pré-cache des 7 pages publiques principales + cache « network-first » des pages visitées + page `/hors-ligne` de secours
- **Notifications push** : web-push (VAPID) — nouveau message, devis envoyé, facture créée, projet mis à jour
- Raccourcis d'application : Messagerie, Mes projets

---

## Comptes de démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| Administrateur | `admin@rodlabstudio.tg` | `demo1234` |
| Administrateur (fondateur) | `directeur@rodlabstudio.tg` | `demo1234` |
| Client | `kossi@chezkossi.tg` | `demo1234` |
| Client | `ayaba@adjale-boutique.tg` | `demo1234` |
| Entreprise (Hôtel Palma) | `contact@hotelpalma.tg` | `demo1234` |
| Collaborateur rattaché | `comptabilite@hotelpalma.tg` | `demo1234` |

La base livrée contient déjà : 7 projets, 6 devis, 7 factures, 3 fils de messagerie, 5 demandes de devis, 3 membres d'équipe et le contenu du site.

> 🔒 Par discrétion, **ces comptes ne s'affichent plus sur la page de connexion** (ils restent actifs en base de données). Gardez ce tableau sous la main pour vos tests.

---

## Démarrage rapide

### Prérequis
- [Node.js 20+](https://nodejs.org) et npm (installés avec Node) — **aucun autre outil requis**

### Installation (3 commandes)

```bash
# 1. Installer les dépendances (génère aussi le client Prisma automatiquement)
npm install

# 2. Créer la base de données + charger les données de démonstration
npm run setup

# 3. Lancer le serveur de développement
npm run dev
```

Ouvrez **http://localhost:3000** puis connectez-vous avec un compte de démonstration (voir tableau ci-dessus).

> 💡 **La base de démonstration est déjà incluse** (`db/custom.db`) : l'étape 2 est facultative si vous démarrez sur la base livrée. Et même sans l'exécuter, l'application se répare seule : schéma et comptes sont recréés automatiquement si la base est absente ou vide.

> ⚠️ Pour tester la PWA et les notifications push, servez l'application en **HTTPS** (ou `localhost`) : les service workers ne fonctionnent pas en HTTP simple. Pour tester l'installation et le mode hors-ligne depuis un téléphone, exposez le site en HTTPS (Vercel, tunnel Cloudflare…) — le manifeste, les icônes et le service worker sont déjà configurés.

### Variables d'environnement (`.env`)

```env
DATABASE_URL=file:../db/custom.db
NEXTAUTH_SECRET=votre-secret      # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
VAPID_PUBLIC_KEY=...              # npx web-push generate-vapid-keys --json
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:contact@rodlabstudio.tg
```

> Le fichier `.env` livré fonctionne immédiatement en local. **Changez `NEXTAUTH_SECRET` et les clés VAPID avant toute mise en production.**

---

## Dépannage (installation locale)

**« Email ou mot de passe incorrect » alors que les identifiants sont bons ?**
1. Arrêtez le serveur (Ctrl + C), relancez `npm install` (le `postinstall` régénère le client Prisma), puis `npm run dev` et réessayez.
2. Vérifiez que le fichier `.env` contient bien `DATABASE_URL=file:../db/custom.db` (chemin **relatif au dossier `prisma/`** — recopier `.env.example` tel quel fonctionne, ne pas le modifier).
3. En cas de base vide ou abscente, laissez-vous guider : à la première tentative de connexion, le schéma et les comptes de démonstration sont **recréés automatiquement** (message `[bootstrap]` dans le terminal du serveur).
4. Dernier recours : `npm run setup` (recrée le schéma + recharge toutes les données de démo).

**Le port 3000 est occupé ?** Changez la commande : `npx next dev -p 3001` et mettez `NEXTAUTH_URL=http://localhost:3001` dans `.env`.

**La page de connexion affiche une erreur de configuration ?** Assurez-vous que `NEXTAUTH_SECRET` est présent dans `.env` (le fichier livré en contient déjà un) et que vous avez redémarré le serveur après toute modification de `.env`.

---

## Stack technique

| Élément | Technologie |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Langage | TypeScript 5 |
| Styles | Tailwind CSS 4 + shadcn/ui (New York) |
| Animations | Framer Motion (site public) |
| Base de données | SQLite via Prisma ORM |
| Authentification | NextAuth.js v4 (credentials email + mot de passe, sessions JWT, bcrypt) |
| Graphiques | Recharts |
| Notifications | Web Push API (web-push, clés VAPID) |
| Icônes | lucide-react |
| Qualité | ESLint (config Next.js) |

## Structure du projet

```
├── db/custom.db                  # Base SQLite (données de démo incluses)
├── prisma/schema.prisma          # 11 modèles (User, Project, Quote, Invoice, Message…)
├── public/
│   ├── icons/                    # Icônes PWA (192→512, maskable, apple-touch)
│   ├── images/logo-original.png  # Logo officiel
│   ├── images/site/              # Photos du site (hero formation, carrousel accueil, services, portfolio, équipe…)
│   └── sw.js                     # Service worker (offline + push + cache images)
├── scripts/
│   ├── seed.ts                   # Source des données de démonstration
│   ├── seed-lib.js               # Module compilé (généré depuis src/lib/demo-seed.ts)
│   ├── seed.js                   # CLI « npm run seed » (JavaScript pur, sans Bun)
│   ├── gen-icons.js              # Régénération des icônes PWA
│   └── gen-site-images.js        # Régénération des 26 photos (prompts inclus)
└── src/
    ├── middleware.ts             # Protection des routes par rôle
    ├── sitemap.ts                # Plan du site (13 pages + 14 pages détail)
    ├── app/
    │   ├── (public)/             # Site vitrine multi-pages (layout partagé navbar+footer)
    │   │   ├── page.tsx          # Accueil
    │   │   ├── a-propos/ services/([slug]) realisations/([slug])
    │   │   ├── blog/([slug]) faq/ contact/
    │   ├── connexion/ inscription/
    │   ├── hors-ligne/           # Page de secours hors-ligne
    │   ├── manifest.ts           # Manifeste PWA
    │   ├── admin/                # 10 pages d'administration
    │   ├── dashboard/            # 8 pages espace client/entreprise
    │   └── api/                  # Route handlers (auth, CRUD, push, messagerie…)
    ├── components/               # Shell dashboard, formulaires, graphiques, PWA…
    │   └── landing/              # Navbar mega-menus, footer, héros+fil d'Ariane, CTA, grilles
    └── lib/
        ├── site-data.ts          # Services, équipe, FAQ, valeurs, navigation
        ├── site-data-content.ts  # Études de cas & articles de blog
        ├── bootstrap.ts          # Auto-réparation base (schéma + comptes démo)
        └── …                     # auth, db, push, rôles, formatage FCFA
```

## Sécurité

- Mots de passe hachés **bcrypt** (coût 12)
- Sessions **JWT signées** (NextAuth, 30 jours, cookie httpOnly)
- Middleware de routage : `/admin/**` réservé au rôle ADMIN, `/dashboard/**` aux utilisateurs connectés
- **Contrôles d'accès serveur** sur chaque route API (rôle + propriété des données)
- Validation systématique des entrées avec **Zod**
- Anti-élevation : un client ne peut agir que sur ses propres devis/projets/messages

## Réinitialiser la démonstration

```bash
npm run db:push   # recrée le schéma
npm run seed      # recharge les données de démo (JavaScript pur, sans Bun)
```

> Après modification de `src/lib/demo-seed.ts`, régénérez le module compilé :
> `npx -y esbuild src/lib/demo-seed.ts --bundle --platform=node --format=cjs --target=node18 --external:@prisma/client --outfile=scripts/seed-lib.js`

---

RodLab Studio — Bd du Mono, Tokoin, Lomé (Togo) · +228 70 08 86 68 · contact@rodlabstudio.tg
