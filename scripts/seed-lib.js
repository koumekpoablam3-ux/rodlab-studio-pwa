"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/lib/demo-seed.ts
var demo_seed_exports = {};
__export(demo_seed_exports, {
  seedDemoData: () => seedDemoData
});
module.exports = __toCommonJS(demo_seed_exports);
var import_bcryptjs = __toESM(require("bcryptjs"));

// src/lib/academy/content-part1.ts
var COURSE_META = {
  slug: "site-web-professionnel",
  title: "Cr\xE9ez votre premier site web professionnel",
  subtitle: "De la page blanche au site en ligne : la m\xE9thode compl\xE8te de l'agence RodLab Studio, pens\xE9e pour les d\xE9butants ambitieux d'Afrique francophone.",
  description: "Une formation 100 % pratique o\xF9 vous apprenez \xE0 planifier, concevoir, construire et publier un site web professionnel \u2014 puis \xE0 vendre cette comp\xE9tence. Vous suivez 8 modules \xE0 votre rythme, le\xE7on par le\xE7on, puis vous validez vos connaissances avec un examen final de 24 questions. En cas de r\xE9ussite, vous obtenez un certificat RodLab Studio v\xE9rifiable et t\xE9l\xE9chargeable en PDF.",
  level: "D\xE9butant",
  durationHours: 14
};
var MODULES_1_4 = [
  {
    order: 1,
    title: "Comprendre le web moderne",
    summary: "Internet sans myst\xE8re : comment une page voyage jusqu'\xE0 l'\xE9cran de votre visiteur, quels langages parlent les sites, et quel type de site correspond vraiment \xE0 votre projet.",
    minutes: 45,
    lessons: [
      {
        order: 1,
        title: "Comment fonctionne Internet : clients, serveurs et DNS",
        minutes: 14,
        content: "Quand vous tapez une adresse dans votre navigateur, une conversation rapide se d\xE9clenche. Votre appareil \u2014 le client \u2014 envoie une requ\xEAte vers un ordinateur puissant toujours allum\xE9 \u2014 le serveur \u2014 qui renvoie les fichiers du site : HTML pour la structure, CSS pour le style, JavaScript pour les interactions, plus les images.\n\nEntre les deux, le DNS agit comme l'annuaire t\xE9l\xE9phonique d'Internet : il traduit le nom de domaine \xAB rodlabstudio.tg \xBB en adresse IP, le vrai num\xE9ro du serveur. C'est pour cela qu'acheter un nom de domaine est la premi\xE8re \xE9tape officielle de tout projet s\xE9rieux.\n\nRetenez cette cha\xEEne, elle explique presque tous les probl\xE8mes que vous rencontrerez : un site inaccessible peut venir du domaine, du serveur, ou des fichiers eux-m\xEAmes. Bonne nouvelle : cr\xE9er un site, c'est simplement pr\xE9parer ces fichiers pour qu'un serveur puisse les servir vite et bien.\n\n- Le navigateur (Chrome, Firefox, Safari) lit et affiche les fichiers du site\n- Le serveur h\xE9berge ces fichiers 24 h/24 et les renvoie \xE0 la demande\n- Le DNS relie le nom de domaine \xE0 l'adresse du serveur\n- La connexion se fait par HTTPS : les donn\xE9es sont chiffr\xE9es"
      },
      {
        order: 2,
        title: "Les langages du web : HTML, CSS et JavaScript",
        minutes: 12,
        content: "Trois langages suffisent \xE0 construire l'immense majorit\xE9 du web, et chacun a un r\xF4le pr\xE9cis. Le HTML (HyperText Markup Language) d\xE9crit la structure : c'est le squelette \u2014 titres, paragraphes, images, liens, formulaires. Sans HTML, il n'y a pas de page.\n\nLe CSS (Cascading Style Sheets) habille cette structure : couleurs, tailles, espacements, positionnement, adaptations mobile. C'est lui qui transforme un document brut en interface \xE9l\xE9gante. Le JavaScript, enfin, rend la page vivante : menus d\xE9roulants, galeries interactives, formulaires qui v\xE9rifient les donn\xE9es avant envoi.\n\nUne comparaison utile : le HTML est le corps, le CSS est la tenue, le JavaScript est les gestes. Un professionnel sait distinguer les trois couches et les faire collaborer proprement \u2014 c'est exactement ce que vous allez pratiquer dans les modules 3, 4 et 5.\n\nNe cherchez pas \xE0 tout retenir par c\u0153ur : m\xEAme les d\xE9veloppeurs exp\xE9riment\xE9s consultent la documentation (MDN Web Docs) chaque jour. Ce qui compte, c'est de comprendre la logique et de savoir chercher."
      },
      {
        order: 3,
        title: "Choisir le bon type de site pour son projet",
        minutes: 19,
        content: "Tous les sites ne r\xE9pondent pas au m\xEAme besoin, et le pire investissement est celui qui ne correspond pas \xE0 votre objectif r\xE9el. Avant de coder ou de choisir un outil, identifiez la cat\xE9gorie de votre projet.\n\n- Site vitrine : pr\xE9senter une activit\xE9, ses services, ses contacts. C'est la carte de visite \xE9tendue d'une entreprise \u2014 la demande la plus fr\xE9quente au Togo et dans la sous-r\xE9gion.\n- Blog ou magazine : publier r\xE9guli\xE8rement du contenu pour attirer et fid\xE9liser une audience.\n- Boutique en ligne (e-commerce) : vendre des produits avec panier et paiement. Il faut alors penser stock, livraison et paiement mobile (T-Money, Flooz, cartes).\n- Application web : un outil interactif \u2014 gestion de r\xE9servations, suivi de commandes, espace client. Plus co\xFBteux, mais souvent rentable quand le besoin est r\xE9el.\n\nLe choix conditionne tout : budget, d\xE9lais, h\xE9bergement, maintenance. Un site vitrine bien fait co\xFBte autour de 450 000 FCFA chez un professionnel ; une application m\xE9tier peut d\xE9passer le million. Comprendre ces ordres de grandeur vous servira autant pour b\xE2tir le v\xF4tre que pour conseiller vos futurs clients."
      }
    ]
  },
  {
    order: 2,
    title: "Planifier son site comme un pro",
    summary: "Ce qui s\xE9pare un site amateur d'un site professionnel se joue avant la premi\xE8re ligne de code : cahier des charges net, arborescence pens\xE9e pour le visiteur, identit\xE9 visuelle coh\xE9rente.",
    minutes: 50,
    lessons: [
      {
        order: 1,
        title: "Le cahier des charges : votre feuille de route",
        minutes: 15,
        content: "Le cahier des charges est un document court qui fixe ce que le site doit faire, pour qui, et dans quelles limites. Il \xE9vite les deux pi\xE8ges classiques : le site qui s'\xE9tire pendant des mois, et le client insatisfait \xAB parce que ce n'\xE9tait pas \xE7a \xBB.\n\nUn bon cahier tient en deux pages : objectif principal (vendre ? \xEAtre contact\xE9 ? recruter ?), cibles (qui visite et pourquoi), pages n\xE9cessaires, contenus disponibles (textes, photos, logos), fonctionnalit\xE9s (formulaire, galerie, WhatsApp), d\xE9lais et budget.\n\n- Objectif unique et mesurable : \xAB recevoir 20 demandes de devis par mois \xBB plut\xF4t que \xAB \xEAtre visible \xBB\n- Une page = un objectif : la page Services fait comprendre, la page Contact fait agir\n- Liste des contenus \xE0 fournir, avec un responsable et une date pour chacun\n- Budget total incluant domaine, h\xE9bergement annuels \u2014 souvent oubli\xE9s\n\nPrenez l'habitude d'\xE9crire ce document pour chaque projet, m\xEAme les plus petits. C'est ce r\xE9flexe de professionnel qui vous fera gagner du temps \u2014 et de l'argent."
      },
      {
        order: 2,
        title: "Arborescence et maquettes (wireframes)",
        minutes: 15,
        content: "L'arborescence est la carte du site : la liste des pages et comment elles se rejoignent. Un site vitrine efficace tient en 5 \xE0 7 pages : Accueil, Services, R\xE9alisations, \xC0 propos, Blog \xE9ventuel, FAQ, Contact. Au-del\xE0, chaque page suppl\xE9mentaire doit se justifier par un besoin r\xE9el du visiteur.\n\nLe wireframe est le croquis d'une page, sans couleur ni logo : juste des blocs (en-t\xEAte, hero, sections, pied de page) et la place du contenu. Dessin\xE9 \xE0 la main ou avec Figma, il r\xE9pond \xE0 une seule question : dans quel ordre le visiteur doit-il d\xE9couvrir l'information pour agir ?\n\nLa r\xE8gle d'or : chaque page doit mener \xE0 l'action principale \u2014 appeler, \xE9crire, acheter. Sur l'Accueil, placez l'essentiel en haut : qui vous \xEAtes, ce que vous faites, le bouton qui passe \xE0 l'action. Le d\xE9tail vient ensuite, pour ceux qui veulent creuser.\n\nFaites valider vos wireframes avant de styliser quoi que ce soit. Modifier un croquis co\xFBte cinq minutes ; modifier un site styl\xE9 co\xFBte des heures."
      },
      {
        order: 3,
        title: "Identit\xE9 visuelle : couleurs, typographie et ton",
        minutes: 20,
        content: "Votre site doit ressembler \xE0 la marque qu'il repr\xE9sente. Si la marque poss\xE8de d\xE9j\xE0 un logo et des couleurs, le site les respecte : on ne r\xE9invente pas une identit\xE9 existante, on l'applique avec discipline.\n\nConstruisez une mini-charte : deux ou trois couleurs principales (une dominante, une accentu\xE9e pour les boutons, un fond clair), deux polices maximum (une pour les titres, une pour le texte), et un ton d'\xE9criture (vous ou tu, sobre ou complice) appliqu\xE9 partout.\n\n- Dominante : la couleur de la marque, utilis\xE9e pour l'en-t\xEAte et les titres\n- Accent : r\xE9serv\xE9e aux actions (boutons, liens) \u2014 jamais d\xE9corative\n- Contraste : le texte doit rester lisible ; testez le blanc sur couleur fonc\xE9e\n- Coh\xE9rence : m\xEAmes marges, m\xEAmes arrondis, m\xEAmes tailles sur toutes les pages\n\nCe vocabulaire visuel commun est ce qui donne l'impression imm\xE9diate de s\xE9rieux. Dans les modules 4 et 5, vous traduirez cette charte en CSS propre \u2014 une palette bien d\xE9finie rendra ce travail \xE9vident."
      }
    ]
  },
  {
    order: 3,
    title: "HTML : la structure de vos pages",
    summary: "\xC9crivez vos premi\xE8res pages web : balises, titres, textes, listes, images, liens et formulaires \u2014 le squelette solide que le CSS viendra habiller.",
    minutes: 55,
    lessons: [
      {
        order: 1,
        title: "Votre premi\xE8re page HTML",
        minutes: 20,
        content: `Ouvrez un \xE9diteur simple (VS Code, gratuit, est la r\xE9f\xE9rence) et cr\xE9ez un fichier \xAB index.html \xBB. Le nom index est conventionnel : c'est la page que le serveur affiche par d\xE9faut \xE0 la racine du site.

Toute page commence par la d\xE9claration <!DOCTYPE html>, suivie d'un \xE9l\xE9ment html qui contient deux enfants : head (les informations pour le navigateur \u2014 titre de l'onglet, encodage, lien vers le CSS) et body (tout ce que le visiteur voit).

Une balise s'ouvre et se ferme : <h1>\u2026</h1>, <p>\u2026</p>. Certaines sont autofermantes comme <img> ou <br>. Les balises peuvent porter des attributs : <a href="https://exemple.tg"> un lien </a>, <img src="photo.jpg" alt="Description de la photo">.

Saisissez quelques titres et paragraphes, enregistrez, puis ouvrez le fichier dans votre navigateur par double-clic : votre premi\xE8re page existe. C'est un moment fondateur \u2014 tout le reste du cours consiste \xE0 l'enrichir m\xE9thodiquement.`
      },
      {
        order: 2,
        title: "Structurer le contenu : titres, textes et listes",
        minutes: 15,
        content: "Le HTML propose six niveaux de titres, de <h1> \xE0 <h6>. Une page n'a qu'un seul <h1> \u2014 le titre principal \u2014 puis une hi\xE9rarchie logique : <h2> pour les grandes sections, <h3> pour leurs sous-parties. Cette hi\xE9rarchie sert aux moteurs de recherche comme aux lecteurs d'\xE9cran.\n\nLe texte courant vit dans <p>. Pour une \xE9num\xE9ration, deux choix : <ul> (liste \xE0 puces) ou <ol> (liste num\xE9rot\xE9e), chaque \xE9l\xE9ment dans un <li>. Pour mettre en valeur : <strong> (important) et <em> (accent).\n\n## Les balises s\xE9mantiques\nDepuis HTML5, des balises d\xE9crivent le r\xF4le des zones : <header> pour l'en-t\xEAte, <nav> pour la navigation, <main> pour le contenu principal, <section> pour une section, <footer> pour le pied de page. Elles ne changent rien visuellement, mais elles donnent du sens \u2014 le navigateur, Google et les outils d'accessibilit\xE9 savent enfin o\xF9 est quoi.\n\nPrenez le r\xE9flexe d\xE8s maintenant : structurez toujours avec des balises s\xE9mantiques, m\xEAme si le rendu semble identique. C'est l'une des diff\xE9rences majeures entre un site d'amateur et un site de professionnel."
      },
      {
        order: 3,
        title: "Images, liens et formulaires",
        minutes: 20,
        content: `L'image <img> exige deux attributs : src (le chemin du fichier) et alt (la description pour les malvoyants et les moteurs de recherche). Pr\xE9f\xE9rez des formats modernes et l\xE9gers : une photo de 4 Mo ralentit tout le site \u2014 compressez vos images avant de les int\xE9grer (WebP ou JPEG optimis\xE9, largeur maximale ~1600 px pour un visuel pleine largeur).

Le lien <a> avec son attribut href relie les pages entre elles. Un lien interne vise une page du m\xEAme site (\xAB /services.html \xBB), un lien externe vise un autre domaine. L'attribut target="_blank" ouvre dans un nouvel onglet \u2014 r\xE9servez-le aux sites externes.

## Le formulaire de contact
<form> regroupe des champs : <input type="text"> pour le nom, type="email" pour l'e-mail, <textarea> pour le message, et <button type="submit"> pour envoyer. Chaque champ porte un label et un attribut name \u2014 c'est ce nom qui permettra au serveur d'identifier les donn\xE9es re\xE7ues.

Un formulaire HTML seul ne sait pas envoyer d'e-mail : il faut un traitement c\xF4t\xE9 serveur ou un service tiers. Pour vos premiers sites, une solution simple et fiable : faire pointer le formulaire vers un service de messagerie de formulaires, ou afficher directement les coordonn\xE9es et un bouton WhatsApp.`
      }
    ]
  },
  {
    order: 4,
    title: "CSS : donner vie au design",
    summary: "Traduisez votre charte en r\xE8gles CSS : s\xE9lecteurs, couleurs, espacements, Flexbox pour la mise en page et media queries pour un site impeccable sur mobile.",
    minutes: 60,
    lessons: [
      {
        order: 1,
        title: "S\xE9lecteurs et premi\xE8res r\xE8gles CSS",
        minutes: 20,
        content: `Le CSS relie des s\xE9lecteurs (\xE0 qui s'applique la r\xE8gle ?) \xE0 des d\xE9clarations (que change-t-on ?). Une r\xE8gle s'\xE9crit : s\xE9lecteur { propri\xE9t\xE9 : valeur; } \u2014 par exemple h1 { color: #1e5b3c; font-size: 32px; }.

Trois s\xE9lecteurs couvrent 90 % des besoins : la balise (p, h2, img), la classe (.menu, .carte \u2014 la plus utilis\xE9e, r\xE9utilisable sur plusieurs \xE9l\xE9ments) et l'identifiant (#accueil \u2014 unique). On connecte la feuille de style avec <link rel="stylesheet" href="style.css"> dans le head.

## Les propri\xE9t\xE9s essentielles
- Couleurs : color pour le texte, background-color pour le fond \u2014 en notation hexad\xE9cimale (#276144) ou rgb
- Espacements : margin (\xE0 l'ext\xE9rieur de l'\xE9l\xE9ment), padding (\xE0 l'int\xE9rieur)
- Tailles : font-size, width, height \u2014 privil\xE9giez rem et % aux pixels fixes
- Bordures : border, border-radius pour les arrondis

Cr\xE9ez un dossier styles/ avec un fichier style.css unique : une feuille par site, bien organis\xE9e par sections comment\xE9es. La discipline d'aujourd'hui est la rapidit\xE9 de demain.`
      },
      {
        order: 2,
        title: "Le mod\xE8le de bo\xEEte et Flexbox",
        minutes: 20,
        content: "En CSS, chaque \xE9l\xE9ment est une bo\xEEte compos\xE9e de quatre couches : le contenu, le padding, la bordure et la marge. Comprendre ce mod\xE8le r\xE9sout la plupart des surprises d'alignement. Ajoutez d\xE8s le d\xE9part * { box-sizing: border-box; } : les dimensions incluront padding et bordure, ce qui est beaucoup plus intuitif.\n\nPour organiser les bo\xEEtes entre elles, Flexbox est l'outil moderne. Sur un conteneur, display: flex active la mise en page ; flex-direction choisit l'axe (row ou column), justify-content distribue sur l'axe principal (flex-start, center, space-between), align-items aligne sur l'axe secondaire, et gap d\xE9finit l'\xE9cart entre les \xE9l\xE9ments.\n\n## Recettes qui servent tous les jours\n- Centrer parfaitement : display: flex; justify-content: center; align-items: center;\n- En-t\xEAte classique : logo \xE0 gauche, menu \xE0 droite avec justify-content: space-between\n- Cartes de services : conteneur flex avec flex-wrap: wrap pour passer \xE0 la ligne\n\nEntra\xEEnez-vous en reprenant la page HTML du module 3 : alignez le menu, espacez les sections, disposez trois cartes c\xF4te \xE0 c\xF4te. Flexbox est le geste qui, ma\xEEtris\xE9, fait passer votre mise en page au niveau professionnel."
      },
      {
        order: 3,
        title: "Responsive design : mobile d'abord",
        minutes: 20,
        content: "Plus de 80 % de vos visiteurs arriveront depuis un t\xE9l\xE9phone, souvent en 3G. Un site qui n'est pas pens\xE9 pour mobile perd ses visiteurs en quelques secondes \u2014 et Google le p\xE9nalise dans ses r\xE9sultats.\n\nLa strat\xE9gie \xAB mobile d'abord \xBB consiste \xE0 styliser d'abord pour le petit \xE9cran, puis \xE0 enrichir pour les \xE9crans larges avec les media queries : @media (min-width: 768px) { \u2026 } \u2014 les r\xE8gles entre accolades ne s'appliquent qu'\xE0 partir de cette largeur.\n\nDeux r\xE9flexes suffisent \xE0 \xE9viter 80 % des probl\xE8mes : des largeurs en pourcentage ou en max-width plut\xF4t qu'en pixels fixes, et Flexbox avec flex-wrap pour que les rang\xE9es de cartes se r\xE9organisent naturellement. Les images, elles, prennent max-width: 100% pour ne jamais d\xE9border.\n\n- Testez dans Chrome avec F12 puis l'outil d'appareils (Ctrl+Shift+M)\n- Points de rupture usuels : 640 px (grand mobile), 768 px (tablette), 1024 px et 1280 px (desktop)\n- Le bouton d'action principal doit rester visible et touchable sur mobile\n\nLa m\xE9thode RodLab est simple : on con\xE7oit la version mobile d'abord \u2014 c'est la plus contraignante \u2014 puis on laisse respirer sur grand \xE9cran. Un site responsive est un site qui respecte tous ses visiteurs."
      }
    ]
  }
];

// src/lib/academy/content-part2.ts
var MODULES_5_8 = [
  {
    order: 5,
    title: "Design UI : couleurs, typographie et composants",
    summary: "Passez du \xAB \xE7a fonctionne \xBB au \xAB c'est beau et cr\xE9dible \xBB : palettes ma\xEEtris\xE9es, typographie lisible et composants r\xE9utilisables qui donnent une allure professionnelle.",
    minutes: 55,
    lessons: [
      {
        order: 1,
        title: "Construire une palette qui inspire confiance",
        minutes: 18,
        content: "Une palette r\xE9ussie ne compte pas beaucoup de couleurs : une dominante (l'identit\xE9), une couleur d'accent (l'action), un ou deux fonds neutres et deux ou trois gris pour le texte. C'est la restriction qui cr\xE9e l'harmonie \u2014 pas la quantit\xE9.\n\nPour choisir, partez de la marque : si le logo est vert for\xEAt et or, le site l'assumera. Sinon, appuyez-vous sur la signification courante des couleurs dans votre secteur : le vert inspire confiance et croissance (agriculture, finance, sant\xE9), le terracotta la chaleur et l'artisanat, le bleu la technologie et la rigueur.\n\n- Dominante : en-t\xEAtes, titres, pieds de page \u2014 environ 60 % des surfaces color\xE9es\n- Accent : uniquement les boutons et liens actifs \u2014 elle doit rester rare pour rester visible\n- Neutres : fonds cr\xE8me ou blanc cass\xE9, plus doux qu'un blanc pur\n- Contraste : v\xE9rifiez la lisibilit\xE9 texte/fond (le blanc sur gris moyen se lit mal)\n\nNotez vos couleurs en variables CSS (:root { --forest: #276144; }) : une seule place \xE0 modifier si la charte \xE9volue, et tout le site suit. C'est exactement ainsi que travaillent les agences, RodLab inclus."
      },
      {
        order: 2,
        title: "Typographie web : la lisibilit\xE9 avant tout",
        minutes: 17,
        content: "Le texte est la mati\xE8re premi\xE8re du web : un site \xE9l\xE9gant mais p\xE9nible \xE0 lire est un site rat\xE9. La r\xE8gle fondatrice : deux polices maximum \u2014 une expressive pour les titres, une sobre et tr\xE8s lisible pour le corps (par exemple Fraunces + Inter, la combinaison du site RodLab).\n\nLe corps de texte se r\xE8gle entre 16 et 18 px, avec une hauteur de ligne de 1,6 environ et des lignes de 60 \xE0 80 caract\xE8res maximum : plus longues, l'\u0153il se perd ; plus courtes, la lecture saccade. Justifiez rarement : le texte align\xE9 \xE0 gauche respire mieux sur le web.\n\n- Hi\xE9rarchie visible : le titre principal est nettement plus grand que les sous-titres, eux-m\xEAmes plus grands que le texte\n- Interligne et marges g\xE9n\xE9reux : l'espace blanc n'est pas du g\xE2chis, c'est du confort\n- Poids : deux \xE0 trois graisses suffisent (normal, semi-bold, bold)\n- Google Fonts offre des familles gratuites pens\xE9es pour le web ; limitez-vous aux graisses r\xE9ellement utilis\xE9es pour ne pas ralentir la page\n\nOuvrez un site que vous admirez et observez sa typographie : tailles relatives, espacements, rythme. Vous lirez d\xE9sormais les pages autrement."
      },
      {
        order: 3,
        title: "Composants r\xE9utilisables : boutons, cartes et formulaires",
        minutes: 20,
        content: "Un professionnel ne dessine pas chaque bouton s\xE9par\xE9ment : il construit des composants \u2014 des briques visuelles r\xE9utilis\xE9es partout avec le m\xEAme style. C'est ce qui donne cette impression de coh\xE9rence sur les bons sites.\n\nLe bouton : fond uni (la couleur d'accent), texte blanc, coins arrondis, padding g\xE9n\xE9reux (12\u201316 px), et un \xE9tat au survol l\xE9g\xE8rement plus fonc\xE9. Un seul style de bouton principal par site ; les actions secondaires se contentent d'une bordure.\n\nLa carte : fond blanc ou cr\xE8me, bordure discr\xE8te ou ombre douce, padding r\xE9gulier, une ic\xF4ne ou une image, un titre, deux lignes de texte, un lien. Elle se pr\xEAte aux services, aux articles, aux t\xE9moignages \u2014 d'o\xF9 son omnipr\xE9sence.\n\nLe formulaire : labels au-dessus des champs, placeholders explicites, messages d'erreur en rouge sous le champ concern\xE9, bouton d'envoi impossible \xE0 rater.\n\n## Le syst\xE8me d'espacement\nFixez des valeurs d'espacement par paliers (4, 8, 16, 24, 48, 96 px) et n'utilisez que celles-l\xE0. Les marges r\xE9guli\xE8res sont la signature silencieuse du travail soign\xE9 \u2014 le visiteur ne sait pas pourquoi, mais il sent que c'est professionnel."
      }
    ]
  },
  {
    order: 6,
    title: "Les outils qui acc\xE9l\xE8rent : CMS et no-code",
    summary: "Quand le code n'est pas la voie la plus rapide : WordPress, constructeurs de pages et outils no-code \u2014 leurs forces, leurs limites, et comment choisir en connaissance de cause.",
    minutes: 40,
    lessons: [
      {
        order: 1,
        title: "WordPress et les constructeurs de pages",
        minutes: 20,
        content: "WordPress fait tourner plus de 40 % du web. C'est un CMS \u2014 un syst\xE8me de gestion de contenu : la structure technique est install\xE9e une fois, puis le propri\xE9taire modifie textes et images sans toucher au code. Pour un client qui veut \xEAtre autonome, c'est souvent l'argument d\xE9cisif.\n\nUn site WordPress s'assemble avec un th\xE8me (l'habillage) et des extensions (les fonctions : formulaire, boutique avec WooCommerce, r\xE9f\xE9rencement). Les constructeurs de pages comme Elementor ajoutent l'\xE9dition visuelle par glisser-d\xE9poser.\n\n- Forces : autonomie du client, \xE9norme \xE9cosyst\xE8me, id\xE9al blog et vitrine \xE9volutive\n- Co\xFBts r\xE9els : th\xE8me et extensions premium payants, mises \xE0 jour r\xE9guli\xE8res indispensables\n- Vigilance : beaucoup d'extensions = site lent et surface d'attaque accrue ; maintenance \xE0 pr\xE9voir (sauvegardes, mises \xE0 jour de s\xE9curit\xE9)\n\nLa r\xE8gle de RodLab : WordPress se justifie quand le client publie souvent ou veut \xE9diter son site seul. Quand le contenu est stable et la performance critique, un site cod\xE9 sur mesure reste plus rapide, plus s\xFBr et moins co\xFBteux \xE0 entretenir sur la dur\xE9e."
      },
      {
        order: 2,
        title: "No-code : Webflow, Framer \u2014 et quand passer au code",
        minutes: 20,
        content: "Les outils no-code permettent de produire des sites visuellement aboutis sans \xE9crire de HTML ni CSS : Webflow et Framer traduisent vos gestes en code propre, Framer excelle pour les pages anim\xE9es et les prototypes, Webflow pour les sites vitrines complets avec CMS int\xE9gr\xE9.\n\nCes outils sont de vrais alli\xE9s pour tester une id\xE9e en quelques jours, livrer une landing page d'\xE9v\xE9nement, ou produire maquettes et sites pour des clients au budget serr\xE9. Le co\xFBt est l'abonnement mensuel par site, et la d\xE9pendance : le site vit chez l'\xE9diteur.\n\n## Comment choisir ?\n- Besoin ponctuel, budget limit\xE9, design soign\xE9 exig\xE9 \u2192 no-code est l\xE9gitime\n- Client propri\xE9taire de son outillage, performance maximale, fonctions m\xE9tier \u2192 code\n- Site d'entreprise durable avec r\xE9f\xE9rencement exigeant \u2192 code ou WordPress bien maintenu\n\nLe bon professionnel n'est ni \xAB pour \xBB ni \xAB contre \xBB : il choisit l'outil du projet. Et comprenne le code ou non, celui qui conna\xEEt HTML/CSS/JS obtient toujours plus des outils no-code \u2014 parce qu'il comprend ce qu'ils fabriquent. C'est pr\xE9cis\xE9ment votre cas, maintenant."
      }
    ]
  },
  {
    order: 7,
    title: "Mettre son site en ligne",
    summary: "Du disque dur au monde entier : choisir domaine et h\xE9bergement, d\xE9ployer avec HTTPS, cr\xE9er l'e-mail professionnel \u2014 puis \xEAtre trouv\xE9 gr\xE2ce aux bases du SEO.",
    minutes: 50,
    lessons: [
      {
        order: 1,
        title: "Nom de domaine et h\xE9bergement",
        minutes: 15,
        content: "Le nom de domaine est l'adresse officielle : court, m\xE9morable, sans tirets inutiles. Au Togo, le .tg affirme l'ancrage local ; le .com reste la valeur s\xFBre internationale. L'enregistrement annuel tourne autour de 5 000\u201312 000 FCFA selon l'extension \u2014 chez un registrar reconnu (Namecheap, OVH, registre togolais CAFAtech pour le .tg).\n\nL'h\xE9bergement, lui, loge vos fichiers. Trois familles : l'h\xE9bergement mutualis\xE9 (partag\xE9, 20 000\u201360 000 FCFA/an, parfait pour un vitrine WordPress), le VPS (serveur d\xE9di\xE9 virtuel, plus puissant, demande des comp\xE9tences d'administration) et l'h\xE9bergement statique gratuit ou presque (Netlify, Vercel, GitHub Pages) \u2014 id\xE9al pour les sites HTML/CSS/JS sans base de donn\xE9es.\n\n- Le domaine se renouvelle chaque ann\xE9e : programmez un rappel, un domaine expir\xE9 = site mort\n- Distinguez le registrar (le domaine) de l'h\xE9bergeur (les fichiers) : ils peuvent \xEAtre diff\xE9rents\n- Le renvoi DNS se propage en quelques minutes \xE0 48 h apr\xE8s configuration\n\nBudget annuel r\xE9aliste d'un site vitrine : 30 000 \xE0 80 000 FCFA tout compris. Int\xE9grez-le d\xE8s le devis \u2014 c'est une ligne que beaucoup de d\xE9butants oublient, au prix de leur marge."
      },
      {
        order: 2,
        title: "D\xE9ployer son site : FTP, HTTPS et e-mail professionnel",
        minutes: 20,
        content: "D\xE9ployer, c'est copier vos fichiers vers le serveur. Sur un h\xE9bergement mutualis\xE9, le logiciel FileZilla (FTP) fait le transfert : vous vous connectez avec les identifiants fournis par l'h\xE9bergeur, et vous d\xE9posez vos fichiers dans le dossier racine (souvent public_html). Sur Netlify ou Vercel, glisser-d\xE9poser le dossier du site suffit \u2014 et chaque mise \xE0 jour prend une minute.\n\nD\xE8s la mise en ligne, activez HTTPS : le cadenas du navigateur est devenu un standard de cr\xE9dibilit\xE9 et un crit\xE8re Google. Les certificats Let's Encrypt sont gratuits et la plupart des h\xE9bergeurs les installent en un clic.\n\n## L'e-mail professionnel\ncontact@votredomaine.tg vaut mieux que votredomaine@gmail.com : l'adresse au nom de domaine rassure instantan\xE9ment. Les h\xE9bergeurs la proposent souvent incluse ; les suites (Google Workspace, Zoho) offrent plus d'espace et d'outils pour quelques milliers de FCFA par mois.\n\nV\xE9rifiez enfin la version mobile, testez le formulaire de contact avec une vraie adresse, et faites visiter le site \xE0 une personne ext\xE9rieure avant l'annonce officielle. Une mise en ligne r\xE9ussie est une mise en ligne test\xE9e."
      },
      {
        order: 3,
        title: "Performance et SEO : se faire trouver",
        minutes: 15,
        content: "Un site invisible n'existe pas. Le SEO (r\xE9f\xE9rencement naturel) rassemble les pratiques qui font remonter votre site dans Google \u2014 gratuitement, mais avec constance.\n\nCommencez par les fondations techniques : un titre <title> unique et descriptif par page, une meta description qui donne envie de cliquer, une seule balise <h1> par page, des images avec attribut alt, des adresses propres. Cr\xE9ez ensuite votre fiche Google Business Profile : c'est elle qui fait appara\xEEtre l'entreprise sur Maps et dans les recherches locales \u2014 d\xE9cisif pour une activit\xE9 \xE0 Lom\xE9 comme ailleurs.\n\n- Vitesse : compressez les images, limitez les extensions, testez sur PageSpeed Insights\n- Contenu : une page par service, r\xE9dig\xE9e pour r\xE9pondre aux vraies questions des clients\n- R\xE9gularit\xE9 : un blog actif nourrit le r\xE9f\xE9rencement mieux que mille astuces\n- Mesure : installez Google Analytics ou une alternative l\xE9g\xE8re pour suivre les visites\n\nLe SEO est un marathon de six mois, pas un sprint d'une semaine. Mais chaque fondation pos\xE9e aujourd'hui travaille gratuitement pour vous pendant des ann\xE9es."
      }
    ]
  },
  {
    order: 8,
    title: "Vivre de sa comp\xE9tence",
    summary: "Transformer la technique en revenus : trouver les premiers clients, chiffrer un devis rentable sans se sous-vendre, et construire une r\xE9putation qui fait venir les projets \xE0 vous.",
    minutes: 45,
    lessons: [
      {
        order: 1,
        title: "Trouver ses premiers clients",
        minutes: 15,
        content: "Vos premiers clients existent d\xE9j\xE0 autour de vous : commerces sans site, artisans tout au plus sur WhatsApp, associations aux affiches fades, amis d'amis qui lancent une activit\xE9. Listez quinze entreprises de votre entourage, identifiez ce que leur pr\xE9sence en ligne a de rat\xE9, et proposez une am\xE9lioration concr\xE8te et chiffr\xE9e.\n\nLe portefeuille est votre arme principale : trois r\xE9alisations soign\xE9es \u2014 m\xEAme fictives ou faites b\xE9n\xE9volement \u2014 prouvent votre valeur mieux que n'importe quel discours. Publiez-les sur une page d\xE9di\xE9e, sur LinkedIn et dans les groupes Facebook professionnels de votre ville.\n\n- Le r\xE9flexe gagnant : montrer avant de vendre \u2014 une maquette rapide du \xAB site id\xE9al \xBB du prospect ouvre dix fois plus de portes qu'un tarif annonc\xE9\n- Demandez syst\xE9matiquement une recommandation \xE9crite \xE0 chaque client satisfait\n- Les partenariats rapportent : graphistes, imprimeurs, agences \xE9v\xE9nementielles d\xE9bordent parfois de demandes web\n- Fixez-vous un rituel : trois prospections par jour, cinq jours par semaine, quoi qu'il arrive\n\nLes premi\xE8res ventes viennent rarement de la publicit\xE9 : elles viennent de la constance et de la preuve. Votre travail bien montr\xE9, r\xE9p\xE9t\xE9, finit toujours par trouver preneur."
      },
      {
        order: 2,
        title: "Chiffrer un devis rentable",
        minutes: 15,
        content: "Le pi\xE8ge du d\xE9butant est de casser ses prix pour obtenir le contrat. Un devis rentable se calcule, il ne se devine pas. Partez de votre objectif de revenu mensuel, divisez par vos heures productives r\xE9elles (120 \xE0 140 h), et obtenez votre taux horaire plancher \u2014 puis gardez-le.\n\nEstimez chaque projet en lots : conception (r\xE9union, cahier des charges, maquettes), production (pages, int\xE9gration), contenus (r\xE9daction, photos \u2014 souvent sous-estim\xE9s), mise en ligne, et reprise. Multipliez vos heures estim\xE9es par votre taux, ajoutez 20 % d'impr\xE9vus \u2014 il y en aura \u2014, puis pr\xE9sentez un forfait clair par phases.\n\n- Mod\xE8le RodLab pour un vitrine : 450 000 FCFA, 3 semaines, paiement 40 % \xE0 la commande, 30 % \xE0 la validation du design, 30 % \xE0 la livraison\n- Chaque aller-retour de retouches au-del\xE0 du forfait se facture \u2014 c'est \xE9crit dans le devis\n- Les annuels (domaine, h\xE9bergement, maintenance) se r\xE9percutent clairement sur une ligne d\xE9di\xE9e\n- Un acompte de 40 % filtre les clients qui ne sont pas s\xE9rieux\n\nUn prix bas n'ach\xE8te pas la fid\xE9lit\xE9 : il ach\xE8te des clients difficiles. Le bon prix, expliqu\xE9 avec confiance, est le premier signe de professionnalisme que votre client recherchait."
      },
      {
        order: 3,
        title: "Livrer, fid\xE9liser et b\xE2tir sa r\xE9putation",
        minutes: 15,
        content: "La livraison est un moment strat\xE9gique, pas une fin. Formez le client \xE0 ses outils (30 minutes suffisent), remettez un dossier propre (fichiers sources, acc\xE8s, mots de passe, facture), et fixez ensemble ce que couvre la garantie (typiquement 30 jours de corrections) et ce qui rel\xE8ve d'une nouvelle demande.\n\nLe suivi fait na\xEEtre les revenus r\xE9currents : une offre de maintenance \xE0 15 000\u201330 000 FCFA/mois (mises \xE0 jour, sauvegardes, petites modifications) transforme un client unique en revenu stable \u2014 et cinq clients en maintenance valent mieux que dix projets dispers\xE9s.\n\n- Programmez un point gratuit \xE0 J+30 apr\xE8s la livraison : probl\xE8mes r\xE9els, recommandations, opportunit\xE9s\n- Chaque projet livr\xE9 nourrit votre vitrine : capture d'\xE9cran, t\xE9moignage demand\xE9 au bon moment (juste apr\xE8s la satisfaction)\n- Restez visible : une publication hebdomadaire sur votre activit\xE9 (avant/apr\xE8s, coulisses, conseils) entretient votre notori\xE9t\xE9 sans effort commercial\n- Visez la recommandation : le client combl\xE9 vous am\xE8ne son r\xE9seau \u2014 le canal le moins cher et le plus fiable qui soit\n\nVotre r\xE9putation est votre vraie boutique. Chaque projet termin\xE9 avec soin est un commercial silencieux qui travaille pour vous la nuit \u2014 et c'est ainsi qu'une comp\xE9tence devient un m\xE9tier."
      }
    ]
  }
];

// src/lib/academy/quiz.ts
var QUIZ_QUESTIONS = [
  // Module 1 — Comprendre le web moderne
  {
    prompt: "Quel est le r\xF4le du DNS lorsqu'on tape une adresse de site dans le navigateur ?",
    options: [
      "Il chiffre la connexion entre le navigateur et le serveur",
      "Il traduit le nom de domaine en adresse IP du serveur",
      "Il compresse les images du site pour acc\xE9l\xE9rer l'affichage",
      "Il stocke une copie du site pour la consultation hors-ligne"
    ],
    answer: 1,
    explanation: "Le DNS est l'annuaire d'Internet : il convertit le nom de domaine lisible (ex. rodlabstudio.tg) en adresse IP, la v\xE9ritable adresse du serveur."
  },
  {
    prompt: "Quel langage d\xE9crit la STRUCTURE d'une page web (titres, paragraphes, images) ?",
    options: ["CSS", "JavaScript", "HTML", "SQL"],
    answer: 2,
    explanation: "Le HTML structure le contenu de la page. Le CSS le met en forme et le JavaScript le rend interactif."
  },
  {
    prompt: "Une entreprise veut pr\xE9senter ses services et \xEAtre contact\xE9e. Quel type de site correspond le mieux \xE0 ce besoin ?",
    options: [
      "Une application web m\xE9tier",
      "Une boutique en ligne compl\xE8te",
      "Un site vitrine de 5 \xE0 7 pages",
      "Un r\xE9seau social interne"
    ],
    answer: 2,
    explanation: "Le site vitrine est la carte de visite \xE9tendue d'une entreprise : pr\xE9senter l'activit\xE9 et g\xE9n\xE9rer des contacts, sans complexit\xE9 inutile."
  },
  // Module 2 — Planifier son site comme un pro
  {
    prompt: "Que contient en priorit\xE9 un bon cahier des charges ?",
    options: [
      "Le code HTML complet des futures pages",
      "L'objectif du site, les cibles, les pages, les fonctionnalit\xE9s, le budget et les d\xE9lais",
      "La liste des logiciels utilis\xE9s par le d\xE9veloppeur",
      "Le prix des concurrents uniquement"
    ],
    answer: 1,
    explanation: "Le cahier des charges fixe l'objectif, les cibles, les pages, les fonctionnalit\xE9s, les contenus, le budget et les d\xE9lais \u2014 la feuille de route du projet."
  },
  {
    prompt: "Qu'est-ce qu'un wireframe ?",
    options: [
      "Le croquis d'une page montrant les blocs et l'ordre de l'information, sans style final",
      "Le fichier final du site pr\xEAt \xE0 publier",
      "Un certificat de s\xE9curit\xE9 pour le site",
      "Le contrat sign\xE9 entre le client et l'agence"
    ],
    answer: 0,
    explanation: "Le wireframe est le croquis structurel d'une page : blocs et hi\xE9rarchie de l'information, sans couleurs ni polices finales."
  },
  {
    prompt: "Dans une charte visuelle, \xE0 quoi doit servir la couleur d'accent ?",
    options: [
      "\xC0 colorer tous les fonds de page",
      "Uniquement aux actions principales : boutons et liens actifs",
      "\xC0 d\xE9corer librement chaque section",
      "\xC0 remplacer la couleur de la marque"
    ],
    answer: 1,
    explanation: "La couleur d'accent est r\xE9serv\xE9e aux actions (boutons, liens) : sa raret\xE9 la rend imm\xE9diatement rep\xE9rable par le visiteur."
  },
  // Module 3 — HTML
  {
    prompt: "Combien de balises <h1> une page bien construite doit-elle contenir ?",
    options: ["Une seule", "Autant que de sections", "Trois au maximum", "Aucune, c'est interdit"],
    answer: 0,
    explanation: "Une seule balise <h1> par page : le titre principal. Les <h2>, <h3>\u2026 structurent ensuite la hi\xE9rarchie des sections."
  },
  {
    prompt: "Quel attribut de la balise <img> d\xE9crit l'image pour les malvoyants et les moteurs de recherche ?",
    options: ["src", "title", "alt", "name"],
    answer: 2,
    explanation: "L'attribut alt fournit une description textuelle de l'image, utilis\xE9e par les lecteurs d'\xE9cran et les moteurs de recherche."
  },
  {
    prompt: "Pourquoi un formulaire HTML seul ne suffit-il pas pour recevoir des messages ?",
    options: [
      "Les formulaires HTML sont interdits par Google",
      "Il faut un traitement c\xF4t\xE9 serveur (ou un service tiers) pour recevoir les donn\xE9es",
      "Les navigateurs bloquent tous les formulaires de contact",
      "Il faut obligatoirement payer une licence pour activer un formulaire"
    ],
    answer: 1,
    explanation: "Le HTML collecte les champs, mais l'envoi d'un e-mail ou l'enregistrement des donn\xE9es exige un traitement c\xF4t\xE9 serveur ou un service de formulaires."
  },
  // Module 4 — CSS
  {
    prompt: "Quelle r\xE8gle CSS cible tous les \xE9l\xE9ments portant la classe \xAB carte \xBB ?",
    options: ["#carte { }", "carte { }", ".carte { }", "*carte { }"],
    answer: 2,
    explanation: `Le point d\xE9signe une classe : .carte { } s'applique \xE0 tous les \xE9l\xE9ments class="carte". Le di\xE8se (#) cible un identifiant unique.`
  },
  {
    prompt: "En CSS, quelle propri\xE9t\xE9 cr\xE9e l'espace INT\xC9RIEUR d'un \xE9l\xE9ment, entre son bord et son contenu ?",
    options: ["margin", "padding", "gap", "border"],
    answer: 1,
    explanation: "Le padding est l'espace int\xE9rieur ; la margin est l'espace ext\xE9rieur, entre l'\xE9l\xE9ment et ses voisins."
  },
  {
    prompt: "Que fait la r\xE8gle @media (min-width: 768px) { \u2026 } ?",
    options: [
      "Elle charge la page \xE0 partir de 768 kilo-octets",
      "Elle applique ses r\xE8gles seulement sur des \xE9crans d'au moins 768 px de large",
      "Elle redimensionne toutes les images \xE0 768 px",
      "Elle bloque l'acc\xE8s au site sur mobile"
    ],
    answer: 1,
    explanation: "C'est une media query : les r\xE8gles qu'elle contient ne s'appliquent qu'\xE0 partir de la largeur indiqu\xE9e \u2014 le c\u0153ur du responsive design."
  },
  // Module 5 — Design UI
  {
    prompt: "Combien de polices un site professionnel utilise-t-il au maximum ?",
    options: ["Une ou deux", "Quatre", "Autant que n\xE9cessaire", "Cinq pour la vari\xE9t\xE9"],
    answer: 0,
    explanation: "Deux polices suffisent : une expressive pour les titres, une sobre et lisible pour le texte courant. Au-del\xE0, la coh\xE9rence se perd."
  },
  {
    prompt: "Quelle taille de corps de texte et quelle hauteur de ligne sont recommand\xE9es pour un article web ?",
    options: [
      "10\u201312 px, interligne 1,0",
      "16\u201318 px, interligne environ 1,6",
      "24\u201328 px, interligne 0,8",
      "14 px, texte justifi\xE9 partout"
    ],
    answer: 1,
    explanation: "16\u201318 px avec une hauteur de ligne d'environ 1,6 et des lignes de 60 \xE0 80 caract\xE8res : la combinaison la plus confortable \xE0 l'\xE9cran."
  },
  {
    prompt: "Pourquoi d\xE9finir des variables CSS comme :root { --forest: #276144; } ?",
    options: [
      "Pour acc\xE9l\xE9rer le chargement des images",
      "Pour pouvoir changer une couleur en un seul endroit et mettre tout le site \xE0 jour",
      "Pour que le site fonctionne sans connexion Internet",
      "Pour chiffrer les couleurs et les prot\xE9ger"
    ],
    answer: 1,
    explanation: "Les variables CSS centralisent les valeurs (couleurs, espacements) : la charte \xE9volue en modifiant une seule ligne."
  },
  // Module 6 — Outils & no-code
  {
    prompt: "Qu'est-ce qu'un CMS comme WordPress ?",
    options: [
      "Un syst\xE8me qui permet de g\xE9rer le contenu d'un site sans toucher au code apr\xE8s installation",
      "Un logiciel de retouche photo",
      "Un nom de domaine premium",
      "Un langage de programmation r\xE9cent"
    ],
    answer: 0,
    explanation: "Un CMS (syst\xE8me de gestion de contenu) s\xE9pare la technique du contenu : le propri\xE9taire \xE9dite textes et images sans coder."
  },
  {
    prompt: "Quel est le principal inconv\xE9nient des outils no-code comme Webflow ou Framer ?",
    options: [
      "Ils ne permettent pas de faire de beaux designs",
      "L'abonnement mensuel par site et la d\xE9pendance \xE0 l'\xE9diteur",
      "Ils exigent de conna\xEEtre le JavaScript avanc\xE9",
      "Ils ne fonctionnent que sur Mac"
    ],
    answer: 1,
    explanation: "Le no-code est rapide et \xE9l\xE9gant, mais le site vit par abonnement chez l'\xE9diteur : co\xFBt r\xE9current et d\xE9pendance, \xE0 peser selon le projet."
  },
  // Module 7 — Mise en ligne
  {
    prompt: "Quelle est la diff\xE9rence entre un nom de domaine et un h\xE9bergement ?",
    options: [
      "Aucune, ce sont deux noms de la m\xEAme chose",
      "Le domaine est l'adresse du site ; l'h\xE9bergement est le serveur qui stocke ses fichiers",
      "L'h\xE9bergement est l'adresse ; le domaine stocke les fichiers",
      "Le domaine est obligatoirement gratuit et l'h\xE9bergement payant"
    ],
    answer: 1,
    explanation: "Le domaine est l'adresse (ex. monentreprise.tg), l'h\xE9bergement est le serveur 24 h/24 qui garde et sert les fichiers du site."
  },
  {
    prompt: "\xC0 quoi reconna\xEEt-on une connexion s\xE9curis\xE9e HTTPS sur un site ?",
    options: [
      "Au logo dor\xE9 de l'h\xE9bergeur",
      "Au cadenas affich\xE9 dans la barre d'adresse du navigateur",
      "Au fait que le site soit payant",
      "\xC0 la pr\xE9sence d'un formulaire de contact"
    ],
    answer: 1,
    explanation: "HTTPS chiffre les \xE9changes entre visiteur et serveur ; les navigateurs l'indiquent par un cadenas. Le certificat Let's Encrypt est gratuit."
  },
  {
    prompt: "Que se passe-t-il si le nom de domaine d'un site n'est pas renouvel\xE9 \xE0 son \xE9ch\xE9ance annuelle ?",
    options: [
      "Le site passe automatiquement en .com",
      "Le site devient inaccessible et le nom peut \xEAtre rachet\xE9 par quelqu'un d'autre",
      "Google renouvelle le domaine gratuitement",
      "Rien, un domaine est valable \xE0 vie"
    ],
    answer: 1,
    explanation: "Un domaine se renouvelle chaque ann\xE9e : expir\xE9, le site dispara\xEEt et le nom peut \xEAtre achet\xE9 par un tiers. Programmez un rappel de renouvellement."
  },
  {
    prompt: "Quel outil gratuit fait appara\xEEtre une entreprise sur Google Maps et dans les recherches locales ?",
    options: [
      "Google Business Profile",
      "Google Translate",
      "Google Chrome",
      "Google Drive"
    ],
    answer: 0,
    explanation: "La fiche Google Business Profile est l'outil local par excellence : cartes, horaires, avis \u2014 d\xE9cisif pour \xEAtre trouv\xE9 pr\xE8s de chez soi."
  },
  // Module 8 — Vivre de sa compétence
  {
    prompt: "Quelle est la meilleure preuve de valeur pour d\xE9crocher ses premiers clients ?",
    options: [
      "Un dipl\xF4me scann\xE9 envoy\xE9 par WhatsApp",
      "Un portefeuille de trois r\xE9alisations soign\xE9es, m\xEAme fictives ou b\xE9n\xE9voles",
      "Un compte TikTok actif",
      "Une carte de visite dor\xE9e"
    ],
    answer: 1,
    explanation: "Le portefeuille prouve ce que vous savez faire : trois r\xE9alisations soign\xE9es valent mieux que tous les discours commerciaux."
  },
  {
    prompt: "Dans le mod\xE8le RodLab, comment se r\xE9partit le paiement d'un site vitrine ?",
    options: [
      "100 % \xE0 la fin du projet",
      "40 % \xE0 la commande, 30 % \xE0 la validation du design, 30 % \xE0 la livraison",
      "50 % avant, 50 % un an apr\xE8s",
      "Un abonnement mensuel \xE0 vie"
    ],
    answer: 1,
    explanation: "40/30/30 : l'acompte engage le client et finance le travail, le solde s\xE9curise la livraison. C'est un standard sain pour la tr\xE9sorerie."
  },
  {
    prompt: "Pourquoi proposer une offre de maintenance mensuelle apr\xE8s la livraison d'un site ?",
    options: [
      "Parce qu'un site cass\xE9 ne se r\xE9pare jamais autrement",
      "Pour transformer un client unique en revenu r\xE9current et fid\xE9liser durablement",
      "Parce que la loi l'exige au Togo",
      "Pour \xE9viter de refaire de nouveaux sites"
    ],
    answer: 1,
    explanation: "La maintenance (mises \xE0 jour, sauvegardes, petites modifications) cr\xE9e un revenu stable : quelques clients fid\xE8les valent mieux que mille projets dispers\xE9s."
  }
];

// src/lib/academy/catalog-design.ts
var COURSE_DESIGN = {
  slug: "design-graphique-pro",
  title: "Design graphique : cr\xE9ez des visuels qui marquent",
  subtitle: "Couleurs, typographies, composition, Canva, Photoshop et Illustrator : la m\xE9thode de l'atelier RodLab pour produire des affiches, logos et visuels r\xE9seaux de niveau professionnel.",
  description: "Une formation 100 % pratique o\xF9 vous apprenez les vraies r\xE8gles du design \u2014 couleurs, typographies, composition \u2014 puis \xE0 les appliquer dans Canva et les outils professionnels pour cr\xE9er des affiches, des flyers, des visuels de r\xE9seaux sociaux et des logos propres. Vous suivez 4 modules \xE0 votre rythme, le\xE7on par le\xE7on, puis vous validez vos connaissances avec un examen final de 10 questions. En cas de r\xE9ussite, vous obtenez un certificat RodLab Studio v\xE9rifiable et t\xE9l\xE9chargeable en PDF.",
  level: "D\xE9butant",
  durationHours: 10,
  skills: [
    "Construire des palettes harmonieuses et lisibles",
    "Marier des polices et hi\xE9rarchiser un texte",
    "Composer des affiches et flyers qui se lisent en 3 secondes",
    "Cr\xE9er et exporter des gabarits pro dans Canva",
    "Utiliser calques, d\xE9tourage et vectoriel (Photoshop / Illustrator)",
    "Livrer des fichiers sources et des exports print/web corrects"
  ],
  modules: [
    {
      order: 1,
      title: "Les fondations du design visuel",
      summary: "Avant les outils, les r\xE8gles qui ne changent pas : comment la couleur transmet une \xE9motion, comment la typographie guide la lecture et comment la composition ordonne l'\u0153il.",
      minutes: 45,
      lessons: [
        {
          order: 1,
          title: "La couleur : construire une palette qui raconte",
          minutes: 16,
          content: "La couleur est le premier message qu'un visuel envoie, avant m\xEAme le texte. Chaque teinte porte une \xE9motion : le vert for\xEAt inspire la confiance et la croissance, le terracotta la chaleur et la proximit\xE9, l'or le prestige, le bleu la s\xE9curit\xE9. Un bon designer ne choisit pas des couleurs qu'il \xAB aime \xBB : il choisit celles qui parlent \xE0 la cible et au secteur d'activit\xE9.\n\n## La r\xE8gle du 60-30-10\n\nPour \xE9viter les palettes brouillonnes, les professionnels utilisent une r\xE9partition simple : 60 % de couleur dominante (souvent un fond neutre), 30 % de couleur secondaire (les blocs et illustrations), 10 % de couleur d'accent (boutons, mots-cl\xE9s, \xE9l\xE9ments \xE0 souligner). C'est cette petite part d'accent qui attire l'\u0153il exactement o\xF9 il faut.\n\n- Limitez chaque projet \xE0 3 couleurs maximum, plus le blanc et le noir\n- V\xE9rifiez toujours le contraste : un texte doit se lire au premier coup d'\u0153il\n- Testez votre palette en noir et blanc : si la hi\xE9rarchie survit, elle est solide\n- Gardez vos palettes dans un fichier texte (codes HEX) pour les r\xE9utiliser"
        },
        {
          order: 2,
          title: "Typographie : choisir et marier des polices",
          minutes: 14,
          content: "La typographie occupe jusqu'\xE0 80 % d'un visuel : c'est elle qui rend un message lisible ou illisible. Deux grandes familles suffisent \xE0 comprendre l'essentiel : les serifs (avec empattements, comme Times ou Fraunces) qui \xE9voquent le classique, le prestige et l'\xE9ditorial ; les sans-serif (sans empattements, comme Inter ou Montserrat) qui \xE9voquent la modernit\xE9, la simplicit\xE9 et la tech.\n\n## La r\xE8gle des deux polices\n\nUn projet professionnel utilise au maximum deux familles : une pour les titres (expressive, avec du caract\xE8re) et une pour le corps de texte (lisible, discr\xE8te). Pour les marier, jouez le contraste : un serif fort avec un sans-serif neutre fonctionne presque toujours. Deux polices trop similaires cr\xE9ent un effet d'erreur.\n\n- \xC9vitez les polices d\xE9coratives dans le corps de texte : elles fatiguent la lecture\n- Limitez les graisses \xE0 deux par police (regular + bold, par exemple)\n- La taille parle : un titre fort fait 2 \xE0 3 fois la taille du texte courant\n- Interligne g\xE9n\xE9reux (1,4 \xE0 1,6) = texte a\xE9r\xE9 = lecture confortable"
        },
        {
          order: 3,
          title: "Composition : hi\xE9rarchie, alignement, espaces",
          minutes: 15,
          content: "La composition d\xE9cide de l'ordre dans lequel l'\u0153il traverse votre visuel. Un bon design raconte : d'abord le titre (l'accroche), puis l'information cl\xE9, enfin l'action \xE0 mener (contact, date, QR code). Si tout crie en m\xEAme temps, rien n'est entendu.\n\n## Trois leviers imm\xE9diats\n\nPremier levier : l'alignement. Aligner les \xE9l\xE9ments entre eux cr\xE9e un fil invisible qui structure la page \u2014 c'est la diff\xE9rence la plus visible entre amateur et pro. Deuxi\xE8me levier : l'espace blanc. Il n'est pas \xAB perdu \xBB : il isole, respire et met en valeur. Un affiche bourr\xE9e d'informations est une affiche jet\xE9e. Troisi\xE8me levier : la hi\xE9rarchie par la taille et le gras \u2014 un seul \xE9l\xE9ment doit dominer.\n\n- Une accroche, un message, une action : sinon d\xE9coupez en plusieurs visuels\n- Utilisez une grille mentale : marges \xE9gales, colonnes r\xE9guli\xE8res\n- Le contraste guide : fond sombre + texte clair, ou l'inverse, jamais les deux moyens\n- Reculez de 2 m\xE8tres : si le message principal ne se lit pas, recommencez"
        }
      ]
    },
    {
      order: 2,
      title: "Canva : de z\xE9ro \xE0 pro",
      summary: "Canva est l'outil le plus rapide pour produire proprement. Vous apprenez \xE0 d\xE9marrer vite avec les gabarits, \xE0 les personnaliser pour ne pas ressembler \xE0 tout le monde, et \xE0 exporter au bon format.",
      minutes: 50,
      lessons: [
        {
          order: 1,
          title: "L'interface et les gabarits : d\xE9marrer vite",
          minutes: 15,
          content: "Canva organise le travail autour de trois zones : la toile centrale o\xF9 vous composez, la barre d'outils sup\xE9rieure (texte, \xE9l\xE9ments, t\xE9l\xE9chargement) et le panneau lat\xE9ral (gabarits, polices, photos). Le r\xE9flexe professionnel consiste \xE0 partir d'un gabarit proche du r\xE9sultat voulu, puis \xE0 le modifier \u2014 jamais \xE0 cr\xE9er une page blanche quand le client attend un livrable rapide.\n\n## Organiser son espace d\xE8s le premier jour\n\nCr\xE9ez deux dossiers d\xE8s maintenant : \xAB Clients \xBB (un sous-dossier par client) et \xAB Gabarits maison \xBB (vos compositions r\xE9utilisables). Chaque projet dupliqu\xE9 \xE0 partir d'un gabarit sauve 30 \xE0 60 minutes. Renommez chaque fichier avec un format clair : \xAB client-type-support-date \xBB.\n\n- Partez d'un gabarit, mais changez au minimum la palette et la police\n- Verrouillez les \xE9l\xE9ments de fond pour ne pas les d\xE9placer par erreur\n- Utilisez les grilles (Position > Grilles) pour aligner proprement\n- Le mode \xAB Redimensionner \xBB transforme un post carr\xE9 en story en un clic"
        },
        {
          order: 2,
          title: "Personnaliser un gabarit : votre identit\xE9, pas un mod\xE8le g\xE9n\xE9rique",
          minutes: 18,
          content: "Le pi\xE8ge num\xE9ro un des d\xE9butants : livrer un gabarit Canva reconnaissable entre mille. Le client paie pour une identit\xE9, pas pour un mod\xE8le vu 10 000 fois. La bonne m\xE9thode : conserver la structure du gabarit (son squelette), puis remplacer syst\xE9matiquement les couleurs, les polices, les images et les formes.\n\n## La checklist de personnalisation\n\nUn gabarit devient \xAB \xE0 vous \xBB quand quatre couches ont \xE9t\xE9 remplac\xE9es : la palette (vos codes HEX enregistr\xE9s dans Marque), les typographies (vos deux familles), les visuels (photos libres ou photos du client, jamais les images satur\xE9es par d\xE9faut) et les formes d\xE9coratives (remplacez les blobs g\xE9n\xE9riques par des \xE9l\xE9ments li\xE9s au secteur).\n\n- Cr\xE9ez une \xAB Marque \xBB Canva par client : logo, palette, polices enregistr\xE9es\n- Remplacez le texte par de vrais messages, jamais les lorem ipsum du gabarit\n- Ajustez les espaces : les gabarits serr\xE9s respirent mal avec du texte fran\xE7ais\n- Comparez avant/apr\xE8s : si votre version ressemble encore au gabarit, continuez"
        },
        {
          order: 3,
          title: "Exports : formats, r\xE9solutions, print vs web",
          minutes: 17,
          content: "Un beau visuel mal export\xE9 devient inutilisable : photo floue \xE0 l'impression, fichier de 15 Mo refus\xE9 par WhatsApp, PDF non convertible par l'imprimeur. Chaque usage a son format, et le professionnel le conna\xEEt par c\u0153ur.\n\n## Les exports \xE0 conna\xEEtre\n\n- JPG : photos et visuels web l\xE9gers \u2014 qualit\xE9 80-90 %, le bon compromis\n- PNG : logos, \xE9l\xE9ments avec transparence, textes fins sur fond uni\n- PDF Impression : affiches et flyers, avec rep\xE8res et fond perdu si l'imprimeur l'exige\n- PDF Standard : envois par e-mail et archivage, plus l\xE9ger\n- MP4 : animations Canva pour les r\xE9seaux\n\nPour le print, travaillez \xE0 300 DPI et ajoutez 3 mm de fond perdu : la couleur doit d\xE9border au-del\xE0 de la coupe, sinon une liser\xE9 blanc appara\xEEt. Pour le web et les r\xE9seaux, 72 DPI et les dimensions natives de la plateforme suffisent (1080 \xD7 1080 pour un post, 1080 \xD7 1920 pour une story).\n\nUne habitude qui rassure les clients : livrer un dossier zip nomm\xE9 \xAB livrables \xBB contenant les exports finaux + les fichiers sources. Cela double la valeur per\xE7ue du travail."
        }
      ]
    },
    {
      order: 3,
      title: "Les outils pros : Photoshop & Illustrator",
      summary: "Quand Canva atteint ses limites, les outils professionnels prennent le relais : retouche photo et d\xE9tourage d'un c\xF4t\xE9, cr\xE9ation vectorielle de l'autre \u2014 avec des alternatives gratuites pour chaque usage.",
      minutes: 55,
      lessons: [
        {
          order: 1,
          title: "Photoshop : calques, retouches et d\xE9tourage",
          minutes: 20,
          content: "Photoshop manipule des images en pixels. Son concept central est le calque : chaque \xE9l\xE9ment (photo, texte, forme, r\xE9glage) vit sur une couche ind\xE9pendante que vous pouvez d\xE9placer, masquer ou corriger sans toucher aux autres. Comprenez les calques et vous comprenez 80 % de Photoshop.\n\n## Le d\xE9tourage, la comp\xE9tence la plus demand\xE9e\n\nD\xE9tourer, c'est isoler un sujet de son fond \u2014 pour un packshot produit, une photo d'identit\xE9, un montage. La m\xE9thode rapide : s\xE9lection du sujet en un clic (S\xE9lection > Sujet), puis affinage des contours avec l'outil Am\xE9liorer le bord, surtout sur les cheveux. Travaillez toujours sur une copie et enregistrez en PSD (fichier source) avant d'exporter.\n\n- Les masques de fusion effacent sans d\xE9truire : peignez en noir pour cacher, blanc pour montrer\n- Courbes et niveaux corrigent la luminosit\xE9 mieux que les filtres automatiques\n- Le tampon de correction retire les petits d\xE9fauts (poussi\xE8re, prise, fil \xE9lectrique)\n- Export web : Fichier > Exportation > Exporter sous, en JPG qualit\xE9 80"
        },
        {
          order: 2,
          title: "Illustrator : formes et logo vectoriel",
          minutes: 19,
          content: "Illustrator travaille en vectoriel : des formes math\xE9matiques, pas des pixels. Cons\xE9quence d\xE9cisive : un logo vectoriel peut passer d'une carte de visite \xE0 une b\xE2che de 10 m\xE8tres sans jamais se flouter. C'est pour cela que tout logo s\xE9rieux se construit dans un outil vectoriel \u2014 Illustrator, ou son alternative gratuite Inkscape.\n\n## Les outils qui suffisent pour un premier logo\n\nL'outil Plume trace des trac\xE9s pr\xE9cis point par point \u2014 il demande de l'entra\xEEnement mais reste irrempla\xE7able. L'outil Forme (rectangle, ellipse, polygone) combin\xE9 aux op\xE9rations Pathfinder (union, soustraction, intersection) construit des monogrammes propres. Le texte vectoris\xE9 (Object > Vectoriser) transforme une police en formes : indispensable pour livrer un logo que n'importe qui pourra ouvrir.\n\n- Commencez en noir et blanc : un logo doit fonctionner sans couleur\n- Testez-le \xE0 16 px (favicon) comme \xE0 3 m\xE8tres : il doit rester lisible\n- Simplifiez : un bon logo tient en une forme et une id\xE9e, pas dix d\xE9tails\n- Livrez en SVG, PDF et EPS, plus les exports PNG transparents"
        },
        {
          order: 3,
          title: "Quand utiliser quel outil (et les alternatives gratuites)",
          minutes: 16,
          content: "Le professionnel ne \xAB ma\xEEtrise tout \xBB : il sait quel outil choisir en trois secondes selon la t\xE2che. La mauvaise excuse du d\xE9butant est de tout faire dans un seul logiciel ; la mauvaise habitude du confirm\xE9 est de sortir Photoshop pour un post Instagram.\n\n## La carte des usages\n\n- Photo \xE0 retoucher, d\xE9tourer, recomposer \u2192 Photoshop (ou GIMP, gratuit)\n- Logo, ic\xF4ne, illustration nette \xE0 toutes tailles \u2192 Illustrator (ou Inkscape, gratuit)\n- Post r\xE9seau, story, pr\xE9sentation rapide \u2192 Canva (ou Photopea, gratuit, clone de Photoshop dans le navigateur)\n- Mise en page longue (brochure, magazine) \u2192 InDesign (ou Scribus, gratuit)\n- Diagrammes et maquettes d'interface \u2192 Figma, gratuit en usage individuel\n\nCe qui compte pour vos clients, c'est le r\xE9sultat : un d\xE9tourage net, un logo qui reste net, un visuel coh\xE9rent. Les outils sont des moyens. Commencez par Canva, ajoutez Photopea pour la retouche, puis passez \xE0 Illustrator quand des clients demandent du vectoriel \u2014 c'est le parcours le plus rentable."
        }
      ]
    },
    {
      order: 4,
      title: "Des supports qui convertissent",
      summary: "Le design n'est pas une fin : il sert un message. Affiches qui se lisent de loin, visuels r\xE9seaux r\xE9utilisables, livrables professionnels \u2014 le module final transforme vos comp\xE9tences en production rentable.",
      minutes: 45,
      lessons: [
        {
          order: 1,
          title: "Affiches et flyers : le message avant la d\xE9coration",
          minutes: 15,
          content: "Une affiche efficace se lit en trois secondes : quoi (l'\xE9v\xE9nement ou l'offre), quand (la date, en gros), o\xF9 (le lieu ou le contact). Tout le reste est secondaire. Avant d'ouvrir un outil, \xE9crivez ces trois informations sur papier et classez-les par importance \u2014 cette hi\xE9rarchie devient votre composition.\n\n## La structure qui marche\n\nEn haut, l'accroche (le titre, la plus grande taille de tout le visuel). Au centre, l'information visuelle : photo du produit, visage du conf\xE9rencier, illustration. En bas, les d\xE9tails pratiques regroup\xE9s dans un bloc unique \u2014 date, heure, lieu, contact \u2014 align\xE9s et a\xE9r\xE9s. Un seul point de contact suffit : un num\xE9ro, un QR code ou un nom de page. Multiplier les contacts dilue l'action.\n\n- Maximum deux polices et trois couleurs, m\xEAme \xE0 grande \xE9chelle\n- La date en tr\xE8s gros : c'est l'information n\xB0 1 d'un \xE9v\xE9nement\n- Testez l'affiche r\xE9duite \xE0 la taille d'un timbre : le titre doit rester lisible\n- Pour le print, v\xE9rifiez fond perdu et 300 DPI avant d'envoyer \xE0 l'imprimeur"
        },
        {
          order: 2,
          title: "Visuels r\xE9seaux sociaux : gabarits r\xE9utilisables",
          minutes: 15,
          content: "Sur les r\xE9seaux, la coh\xE9rence vaut plus que l'originalit\xE9 : un feed o\xF9 chaque post est diff\xE9rent para\xEEt amateur, un feed structur\xE9 para\xEEt professionnel. La solution des agences \u2014 celle que RodLab applique \u2014 est le gabarit r\xE9utilisable : une mise en page fixe o\xF9 seuls le texte et la photo changent.\n\n## Construire son syst\xE8me de gabarits\n\nCr\xE9ez quatre gabarits de base : citation (texte centr\xE9, logo discret), annonce (titre fort + photo), carrousel (premi\xE8re slide accrocheuse + slides de contenu), promo (offre + prix + bouton). Enregistrez-les dans Canva comme mod\xE8les d'\xE9quipe. Un mois de contenu se produit alors en quelques heures au lieu de quelques jours.\n\n- R\xE9servez une zone fixe au logo : m\xEAme position, m\xEAme taille sur tous les posts\n- Alternez les formats de contenu (citation, conseil, coulisses, preuve client) pour \xE9viter la monotonie\n- Les carrousels doublent souvent l'engagement : la premi\xE8re slide doit donner envie de cliquer\n- V\xE9rifiez vos visuels sur mobile : 9 lecteurs sur 10 les verront sur un \xE9cran de t\xE9l\xE9phone"
        },
        {
          order: 3,
          title: "Livrables pro : fichiers sources, mini-charte, droits",
          minutes: 15,
          content: "Ce qui distingue un professionnel, ce n'est pas seulement le visuel : c'est la livraison. Un client qui re\xE7oit un dossier propre revient ; un client qui re\xE7oit trois JPG perdus dans WhatsApp doute. La livraison est un argument de vente \xE0 part enti\xE8re.\n\n## Le dossier de livraison type\n\nUn dossier zip structur\xE9 : \xAB exports \xBB (les fichiers pr\xEAts \xE0 l'emploi, nomm\xE9s clairement), \xAB sources \xBB (PSD, AI ou lien Canva en mode mod\xE8le), \xAB readme \xBB (un fichier texte qui explique o\xF9 utiliser chaque format et quels sont les droits). Ajoutez une mini-charte d'une page : palette HEX, deux polices, r\xE8gles d'usage du logo. Cette page vaut parfois plus que le visuel lui-m\xEAme aux yeux du client.\n\n- Nommez les fichiers : \xAB client-support-version-date \xBB, jamais \xAB final-final-2 \xBB\n- Pr\xE9cisez toujours les droits des photos utilis\xE9es : libres, achet\xE9es, ou fournies par le client\n- Gardez une sauvegarde de chaque livraison : le client reviendra six mois plus tard\n- Proposez une mini-charte en option payante : c'est un upsell naturel et utile"
        }
      ]
    }
  ]
};

// src/lib/academy/catalog-community.ts
var COURSE_COMMUNITY = {
  slug: "community-management",
  title: "Community management : animez vos r\xE9seaux sociaux",
  subtitle: "Strat\xE9gie, ligne \xE9ditoriale, contenu qui engage, publicit\xE9 \xE0 petit budget et rapports clients : la m\xE9thode compl\xE8te pour g\xE9rer les r\xE9seaux d'une marque comme un professionnel.",
  description: "Une formation 100 % pratique o\xF9 vous apprenez \xE0 comprendre les plateformes et leurs algorithmes, \xE0 construire une strat\xE9gie \xE9ditoriale, \xE0 produire du contenu qui engage, \xE0 animer une communaut\xE9 et \xE0 pr\xE9senter des r\xE9sultats chiffr\xE9s \xE0 vos clients. Vous suivez 4 modules \xE0 votre rythme, le\xE7on par le\xE7on, puis vous validez vos connaissances avec un examen final de 10 questions. En cas de r\xE9ussite, vous obtenez un certificat RodLab Studio v\xE9rifiable et t\xE9l\xE9chargeable en PDF.",
  level: "D\xE9butant",
  durationHours: 9,
  skills: [
    "Comprendre les usages r\xE9els de chaque plateforme",
    "D\xE9finir des cibles, une ligne \xE9ditoriale et un ton",
    "Planifier un mois de publications en quelques heures",
    "\xC9crire des accroches et produire des vid\xE9os courtes qui retiennent",
    "Lancer des campagnes sponsoris\xE9es \xE0 petit budget",
    "Mesurer, interpr\xE9ter et pr\xE9senter des r\xE9sultats \xE0 un client"
  ],
  modules: [
    {
      order: 1,
      title: "Comprendre les r\xE9seaux sociaux",
      summary: "Chaque plateforme a ses codes, ses audiences et son algorithme. On les d\xE9cortique sans jargon pour choisir o\xF9 investir votre temps \u2014 et celui de vos clients.",
      minutes: 40,
      lessons: [
        {
          order: 1,
          title: "L'\xE9cosyst\xE8me : plateformes, audiences, usages locaux",
          minutes: 14,
          content: "G\xE9rer des r\xE9seaux, ce n'est pas \xAB poster partout \xBB : c'est \xEAtre au bon endroit, avec le bon format, devant les bonnes personnes. Au Togo et en Afrique de l'Ouest, WhatsApp r\xE8gne en ma\xEEtre pour la relation client directe, Facebook reste la premi\xE8re plateforme publique pour toucher les 25 ans et plus, Instagram porte les univers visuels (mode, food, d\xE9co, \xE9v\xE9nementiel), TikTok concentre la jeunesse et la d\xE9couverte, LinkedIn relie les professionnels et les entreprises s\xE9rieuses.\n\n## Trois familles d'usage\n\n- D\xE9couverte : TikTok, Reels \u2014 l'algorithme propose votre contenu \xE0 des inconnus\n- Relation : Facebook, WhatsApp Business \u2014 la communaut\xE9 et le service client\n- Cr\xE9dibilit\xE9 : LinkedIn, Google Business \u2014 la preuve professionnelle\n\nUn restaurant utilisera Instagram pour l'app\xE9tit visuel, WhatsApp pour les commandes, Facebook pour les \xE9v\xE9nements. Une agence B2B privil\xE9giera LinkedIn et Facebook. Choisir, c'est d\xE9j\xE0 50 % du travail \u2014 et c'est ce qu'un client attend d'un community manager pay\xE9 pour son expertise."
        },
        {
          order: 2,
          title: "L'algorithme sans myst\xE8re : ce qui fait la port\xE9e",
          minutes: 12,
          content: "Un algorithme de r\xE9seau social a une seule mission : garder les utilisateurs le plus longtemps possible sur la plateforme. Il met donc en avant le contenu qui d\xE9clenche des r\xE9actions rapides \u2014 vues compl\xE8tes, likes, commentaires, partages \u2014 dans les premi\xE8res minutes suivant la publication.\n\n## Les signaux qui comptent vraiment\n\n- La compl\xE9tion : une vid\xE9o regard\xE9e jusqu'au bout p\xE8se plus que 100 likes\n- La rapidit\xE9 des premi\xE8res r\xE9actions : publiez quand votre audience est en ligne\n- Les commentaires (et vos r\xE9ponses) : la conversation prolonge la port\xE9e\n- Les partages : le signal le plus fort, surtout sur Facebook et WhatsApp\n\nLes r\xE9flexes qui en d\xE9coulent : accrocher dans les 2 premi\xE8res secondes d'une vid\xE9o, poser une vraie question en l\xE9gende, r\xE9pondre \xE0 chaque commentaire dans l'heure qui suit, publier r\xE9guli\xE8rement plut\xF4t que par \xE0-coups. Aucune astuce ne remplace la r\xE9gularit\xE9 : l'algorithme r\xE9compense les comptes fiables qui nourrissent la plateforme."
        },
        {
          order: 3,
          title: "Choisir ses plateformes selon son objectif",
          minutes: 14,
          content: "Avant de cr\xE9er un compte de plus, posez la question qui change tout : que doit rapporter cette plateforme ? Des clients (vente directe), de la notori\xE9t\xE9 (\xEAtre connu), de la cr\xE9dibilit\xE9 (\xEAtre choisi quand on cherche) ? Un objectif mal d\xE9fini produit des comptes fant\xF4mes avec 40 abonn\xE9s et z\xE9ro vente.\n\n## Le tableau de d\xE9cision du community manager\n\n- Vendre des produits physiques \u2192 Instagram + WhatsApp Business (catalogue, statut, commandes)\n- Remplir un restaurant ou un \xE9v\xE9nement \u2192 Facebook (\xE9v\xE9nements, groupes locaux) + TikTok local\n- Attirer des entreprises \u2192 LinkedIn + un site vitrine s\xE9rieux\n- Devenir une r\xE9f\xE9rence d'expert \u2192 TikTok ou YouTube (tutoriels) + relais WhatsApp\n\nMieux vaut deux plateformes bien tenues que cinq abandonn\xE9es. Pour chaque compte tenu, d\xE9finissez une fr\xE9quence r\xE9aliste (3 \xE0 5 posts par semaine) et un indicateur de succ\xE8s (messages re\xE7us, inscriptions, ventes). C'est ce cadrage, pr\xE9sent\xE9 au client au d\xE9part, qui vous prot\xE8ge des \xAB pourquoi on n'a pas 10 000 abonn\xE9s en un mois ? \xBB."
        }
      ]
    },
    {
      order: 2,
      title: "Construire sa strat\xE9gie",
      summary: "La strat\xE9gie transforme le posting al\xE9atoire en pr\xE9sence qui travaille. Personas, ligne \xE9ditoriale, calendrier : trois outils qui font la diff\xE9rence entre un compte actif et un compte rentable.",
      minutes: 45,
      lessons: [
        {
          order: 1,
          title: "Cibles et personas : \xE0 qui parlez-vous vraiment ?",
          minutes: 15,
          content: "\xAB Tout le monde \xBB n'est pas une cible. Un persona est un portrait pr\xE9cis de votre client id\xE9al : son \xE2ge, sa ville, son m\xE9tier, ses r\xEAves, ses frustrations, ses habitudes num\xE9riques. Quand vous \xE9crivez pour \xAB Fatima, 28 ans, entrepreneure \xE0 Lom\xE9, sans temps, qui veut plus de clients \xBB \u2014 vos posts deviennent pertinents. Quand vous \xE9crivez pour tout le monde, ils deviennent inoffensifs, donc invisibles.\n\n## Construire trois personas en une heure\n\n- Qui est-il ? (\xE2ge, ville, m\xE9tier, niveau de revenu)\n- Que cherche-t-il ? (le r\xE9sultat qu'il veut, pas votre produit)\n- Qu'est-ce qui le freine ? (prix, confiance, temps,complexit\xE9 per\xE7ue)\n- O\xF9 passe-t-il son temps en ligne ? (plateforme, heures de connexion)\n\nChaque contenu doit r\xE9pondre \xE0 une de ces cases : une frustration lev\xE9e, un d\xE9sir nomm\xE9, une objection trait\xE9e. Les clients r\xE9pondent d'ailleurs rarement au produit : ils r\xE9pondent \xE0 la transformation. \xAB Des photos qui donnent faim \xBB vend mieux que \xAB photographe professionnel avec 10 ans d'exp\xE9rience \xBB."
        },
        {
          order: 2,
          title: "La ligne \xE9ditoriale : ton, th\xE8mes, rythme",
          minutes: 15,
          content: "La ligne \xE9ditoriale est le contrat invisible entre la marque et son audience : sur quoi on s'exprime, avec quelle voix, \xE0 quelle fr\xE9quence. C'est elle qui rend un compte reconnaissable d\xE8s la deuxi\xE8me ligne \u2014 avant m\xEAme de voir le logo.\n\n## Les trois colonnes de contenu\n\nLa r\xE8gle \xE9prouv\xE9e des agences : r\xE9partir la production en trois colonnes. Contenu utile (conseils, tutoriels, r\xE9ponses aux questions fr\xE9quentes) \u2014 environ 40 %. Contenu preuve (r\xE9alisations, avis clients, avant/apr\xE8s, coulisses) \u2014 environ 30 %. Contenu lien (humour local, coulisses humaines, coups de c\u0153ur, vie de l'\xE9quipe) \u2014 environ 30 %. Cette r\xE9partition fait d'un compte une ressource que l'on suit, pas une publicit\xE9 que l'on fuit.\n\n- D\xE9finissez 3 \xE0 5 mots qui d\xE9crivent le ton (ex. : chaleureux, direct, d\xE9cal\xE9)\n- Listez 5 th\xE8mes r\xE9currents : c'est votre garde-manger de sujets\n- Choisissez une fr\xE9quence tenable : 3 posts/semaine tenus battent 7 posts abandonn\xE9s\n- R\xE9digez cette ligne sur une page et faites-la valider par le client : c'est votre r\xE9f\xE9rence en cas de d\xE9saccord"
        },
        {
          order: 3,
          title: "Le calendrier de publication : planifier un mois en 2 heures",
          minutes: 15,
          content: "Le calendrier \xE9ditorial transforme la cr\xE9ation en production. Plut\xF4t que de chercher chaque matin \xAB qu'est-ce qu'on poste aujourd'hui ? \xBB, le community manager professionnel bloque deux heures, une fois par mois, pour planifier l'ensemble : dates, formats, sujets, visuels.\n\n## La m\xE9thode du bloc mensuel\n\nUn simple tableau suffit : date, plateforme, colonne (utile/preuve/lien), sujet, format (photo, carrousel, vid\xE9o), statut (\xE0 produire, pr\xEAt, publi\xE9). Remplissez d'abord les dates fixes (promotions, \xE9v\xE9nements, jours f\xE9ri\xE9s), puis alternez les trois colonnes de contenu pour \xE9quilibrer. R\xE9servez ensuite un bloc de production photo/vid\xE9o : tourner 6 vid\xE9os en une apr\xE8s-midi est trois fois plus rapide que six sessions s\xE9par\xE9es.\n\n- Les outils de programmation (Meta Business Suite, Buffer) publient \xE0 l'avance : lib\xE9rez votre quotidien\n- Gardez 20 % de souplesse pour l'actualit\xE9 et les tendances du moment\n- Recyclez vos succ\xE8s : un post qui a march\xE9 redevient carrousel, puis vid\xE9o, puis story\n- Relisez le calendrier chaque vendredi : ajustez la semaine suivante selon les statistiques"
        }
      ]
    },
    {
      order: 3,
      title: "Produire du contenu qui engage",
      summary: "Accroches, l\xE9gendes, vid\xE9o courte, hashtags : le module technique de production, avec les formats et les formules qui d\xE9clenchent r\xE9actions et messages.",
      minutes: 50,
      lessons: [
        {
          order: 1,
          title: "Le copywriting r\xE9seaux : accroches, l\xE9gendes, appels \xE0 l'action",
          minutes: 18,
          content: "Sur les r\xE9seaux, la premi\xE8re ligne d\xE9cide de tout : elle s'affiche avant le \xAB voir plus \xBB, et c'est elle que l'\u0153il lit en scannant son fil. Les professionnels utilisent des formules d'accroche \xE9prouv\xE9es : la question directe (\xAB Vous avez du mal \xE0 vendre en ligne ? \xBB), le chiffre surprenant (\xAB 80 % des sites togolais perdent leurs visiteurs en 5 secondes \xBB), la promesse concr\xE8te (\xAB Le menu que nous avons utilis\xE9 pour remplir ce restaurant \xBB), l'opinion tranch\xE9e (\xAB Arr\xEAtez de poster tous les jours. \xBB).\n\n## La structure de l\xE9gende qui travaille\n\n- Accroche (1 ligne) : stoppe le d\xE9filement\n- Contexte (2-3 lignes) : raconte, explique, donne l'information\n- Valeur (le c\u0153ur) : le conseil, l'enseignement, la preuve\n- Appel \xE0 l'action (1 ligne) : \xAB Commentez \xBB, \xAB Envoie-nous un message \xBB, \xAB Enregistre ce post \xBB\n\nUn seul appel \xE0 l'action par post \u2014 deux actions possibles, c'est z\xE9ro action. Et \xE9crivez comme vous parlez : le langage administr\xE9 tue l'engagement. Les emojis sont utiles s'ils restent des ponctuations, pas des d\xE9corations d'arbre de No\xEBl."
        },
        {
          order: 2,
          title: "Vid\xE9o courte : Reels, TikTok \u2014 le format roi",
          minutes: 16,
          content: "La vid\xE9o courte est le format que les algorithmes poussent le plus : elle demande peu de mat\xE9riel (un t\xE9l\xE9phone) mais beaucoup de m\xE9thode. La structure qui fonctionne tient en trois temps : le hook (0-2 secondes, une phrase ou une image qui surprend), le corps (5-20 secondes, une seule id\xE9e, montr\xE9e plut\xF4t que racont\xE9e), la fin (un appel clair : suivre, commenter, cliquer le lien en bio).\n\n## Tourner sans mat\xE9riel pro\n\n- Lumi\xE8re naturelle en face du sujet, jamais derri\xE8re \u2014 une fen\xEAtre suffit\n- Cadre vertical, sujet centr\xE9 ou sur le tiers, arri\xE8re-plan propre\n- Son clair : un micro-cravate \xE0 10 000 FCFA change tout ; sinon, tournez au calme\n- Des coupes toutes les 2-3 secondes : le rythme retient l'attention\n- Sous-titrez syst\xE9matiquement : la majorit\xE9 regarde sans le son\n\nNe cherchez pas la perfection, cherchez la r\xE9gularit\xE9 : trois vid\xE9os simples par semaine surpassent une vid\xE9o \xAB cin\xE9matique \xBB par mois. Les premi\xE8res vid\xE9os seront m\xE9diocres \u2014 c'est le prix d'entr\xE9e, et tout le monde l'a pay\xE9."
        },
        {
          order: 3,
          title: "Hashtags, tendances et contenus UGC",
          minutes: 16,
          content: "Les hashtags classent votre contenu dans des communaut\xE9s th\xE9matiques : ils servent la d\xE9couverte par des inconnus, pas la satisfaction des abonn\xE9s existants. La bonne dose : 3 \xE0 8 hashtags pertinents plut\xF4t que 30 g\xE9n\xE9riques. M\xE9langez trois niveaux : un large (#mode), un moyen (#modeLome), un sp\xE9cifique (#couturetogo). Les hashtags locaux sont les plus rentables : moins de concurrence, audience exacte.\n\n## Les tendances, utilis\xE9es intelligemment\n\nUne tendance (son, format, m\xE8me) est un ticket d'entr\xE9e vers la port\xE9e \u2014 \xE0 condition de la lier \xE0 votre sujet. Demandez-vous toujours : \xAB comment ce format raconte-t-il mon activit\xE9 ? \xBB. Un cabinet comptable peut reprendre un son tendance pour expliquer la TVA ; le m\xEAme son sans lien avec son m\xE9tier ne sert \xE0 rien.\n\n- Le contenu UGC (contenu cr\xE9\xE9 par vos clients) est une mine : photos clients, avis, unboxings \u2014 republiez avec cr\xE9dit\n- Cr\xE9ez un hashtag de marque unique pour regrouper vos contenus clients\n- R\xE9pondez aux commentaires dans la premi\xE8re heure : la conversation multiplie la port\xE9e\n- Archivez vos meilleurs posts dans un dossier \xAB \xE0 recycler \xBB : un succ\xE8s se red\xE9ploie sous un autre format"
        }
      ]
    },
    {
      order: 4,
      title: "Animer, mod\xE9rer, mesurer",
      summary: "La communaut\xE9 se cultive apr\xE8s la publication : r\xE9ponses, mod\xE9ration, premi\xE8res campagnes payantes et rapports qui prouvent votre valeur au client.",
      minutes: 45,
      lessons: [
        {
          order: 1,
          title: "Communaut\xE9 : r\xE9pondre, mod\xE9rer, fid\xE9liser",
          minutes: 15,
          content: "Un compte qui publie sans jamais r\xE9pondre est une affiche, pas une marque. La r\xE8gle professionnelle simple : tout commentaire ou message re\xE7oit une r\xE9ponse sous 24 heures (id\xE9alement sous une heure pour les messages priv\xE9s \u2014 c'est souvent une vente qui attend). Chaque r\xE9ponse est publique : les futurs visiteurs la lisent et jugent la marque sur votre mani\xE8re de traiter les gens.\n\n## G\xE9rer les cas difficiles\n\n- Question simple \u2192 r\xE9ponse claire + lien vers l'info (prix, horaires, livraison)\n- R\xE9clamation \u2192 accueil sans excuse excessive, passage en priv\xE9, r\xE9solution, retour public bref\n- Troll ou insulte \u2192 une r\xE9ponse calme maximum, puis masquage ou suppression si l'abus continue\n- Faux avis \u2192 signalement \xE0 la plateforme, r\xE9ponse factuelle pos\xE9e pour les lecteurs futurs\n\nFid\xE9liser co\xFBte dix fois moins que conqu\xE9rir : mentionnez vos abonn\xE9s fid\xE8les, republiez leurs contenus avec cr\xE9dit, cr\xE9ez des rendez-vous (le conseil du mardi, la promo du vendredi). Une communaut\xE9 qui se sent vue d\xE9fend la marque \u2014 et la recommande."
        },
        {
          order: 2,
          title: "Publicit\xE9 : premi\xE8res campagnes \xE0 petit budget",
          minutes: 15,
          content: "La publicit\xE9 organique a ses plafonds ; la pub payante les brise \u2014 m\xEAme avec 2 000 FCFA par jour. Le principe : votre meilleur contenu organique, montr\xE9 \xE0 une audience pr\xE9cise, avec un objectif unique. Ne sponsorisez jamais un post m\xE9diocre : la pub multiplie, elle ne corrige pas.\n\n## Lancer sa premi\xE8re campagne Meta\n\n- Objectif unique : messages (WhatsApp/Messenger) pour vendre, interactions pour nourrir, trafic pour un site\n- Audience : ville + int\xE9r\xEAts + tranche d'\xE2ge de votre persona \u2014 pas \xAB tout le monde \xBB\n- Visuel : la vid\xE9o courte performe mieux que l'image fixe dans la plupart des cas\n- Budget test : 2 000 \xE0 5 000 FCFA/jour pendant 4 \xE0 7 jours avant de juger\n- Mesure : co\xFBt par r\xE9sultat (par message re\xE7u, par clic) \u2014 c'est LE chiffre qui d\xE9cide\n\nLancez deux variantes d'annonce (visuel ou accroche diff\xE9rent) et laissez la plateforme arbitrer. Apr\xE8s la p\xE9riode test, coupez la moins performante et r\xE9investissez. C'est en pr\xE9sentant ces chiffres simples \u2014 d\xE9pens\xE9, messages re\xE7us, co\xFBt par message \u2014 que le client comprend votre valeur et augmente le budget."
        },
        {
          order: 3,
          title: "Statistiques et rapports clients : prouver vos r\xE9sultats",
          minutes: 15,
          content: "Les statistiques transforment votre travail en r\xE9sultat visible \u2014 et votre facture en \xE9vidence. Oubliez le \xAB nombre d'abonn\xE9s \xBB comme seul indicateur : il flatte mais ne vend pas. Ce qui int\xE9resse un client, c'est le chemin vers l'argent : port\xE9e, engagement, messages re\xE7us, ventes attribu\xE9es.\n\n## Le rapport mensuel d'une page\n\n- Chiffres de t\xEAte : port\xE9e totale, abonn\xE9s gagn\xE9s, messages re\xE7us (avec \xE9volution vs mois pr\xE9c\xE9dent)\n- Top 3 des publications : capture d'\xE9cran + pourquoi \xE7a a march\xE9\n- Actions r\xE9alis\xE9es : X posts, Y vid\xE9os, Z campagnes, r\xE9ponses sous 1 h\n- Le mois suivant : 3 recommandations concr\xE8tes (nouveaux formats, budget pub, \xE9v\xE9nement)\n\nEnvoyez-le le premier jour du mois, en PDF, avec une phrase d'introduction honn\xEAte \u2014 y compris quand les r\xE9sultats sont moyens : \xAB les vid\xE9os courtes ont doubl\xE9 la port\xE9e ; les posts photos ont d\xE9croch\xE9, on bascule 70 % de l'effort sur la vid\xE9o \xBB. Cette transparence construit la confiance long terme \u2014 et la confiance renouvelle les contrats, qui sont le vrai business du community manager."
        }
      ]
    }
  ]
};

// src/lib/academy/catalog-bureautique.ts
var COURSE_BUREAUTIQUE = {
  slug: "bureautique-essentielle",
  title: "Bureautique essentielle : Word, Excel, PowerPoint",
  subtitle: "L'ordinateur sans stress, des documents Word impeccables, des tableaux Excel qui calculent tout seuls et des pr\xE9sentations PowerPoint qui impressionnent : le socle exig\xE9 par tous les emplois.",
  description: "Une formation 100 % pratique o\xF9 vous ma\xEEtrisez l'ordinateur au quotidien (fichiers, sauvegardes, s\xE9curit\xE9), puis les trois outils que tout employeur attend : Word pour des documents professionnels, Excel pour g\xE9rer et analyser des donn\xE9es, PowerPoint pour pr\xE9senter avec impact. Vous suivez 4 modules \xE0 votre rythme, le\xE7on par le\xE7on, puis vous validez vos connaissances avec un examen final de 10 questions. En cas de r\xE9ussite, vous obtenez un certificat RodLab Studio v\xE9rifiable et t\xE9l\xE9chargeable en PDF.",
  level: "D\xE9butant",
  durationHours: 12,
  skills: [
    "Organiser ses fichiers et ne plus jamais perdre un document",
    "Cr\xE9er des documents Word propres : styles, sommaire, tableaux",
    "Automatiser le courrier avec le publipostage",
    "Ma\xEEtriser les formules Excel essentielles (SOMME, MOYENNE, SI)",
    "Construire des graphiques lisibles et des impressions propres",
    "Pr\xE9senter avec des diapositives qui soutiennent le discours"
  ],
  modules: [
    {
      order: 1,
      title: "L'ordinateur sans stress",
      summary: "Les r\xE9flexes de base que personne n'enseigne : organiser ses fichiers, utiliser les raccourcis qui font gagner des heures, naviguer sur Internet et e-mail en s\xE9curit\xE9.",
      minutes: 40,
      lessons: [
        {
          order: 1,
          title: "Fichiers, dossiers et sauvegardes : la maison num\xE9rique",
          minutes: 14,
          content: "Un ordinateur est une maison : si chaque chose n'a pas sa place, on perd un temps fou \xE0 chercher. La r\xE8gle d'or des professionnels : un seul dossier racine (Documents, ou \xAB Travail \xBB), \xE0 l'int\xE9rieur duquel chaque grand projet devient un dossier, et chaque dossier re\xE7oit des fichiers nomm\xE9s selon un format fixe \u2014 \xAB date-client-document-version \xBB (ex. : 2026-03-devis-hotel-palma-v2).\n\n## La sauvegarde 3-2-1, adapt\xE9e \xE0 la r\xE9alit\xE9\n\n- 3 copies des fichiers importants\n- 2 supports diff\xE9rents (l'ordinateur + un disque externe ou une cl\xE9)\n- 1 copie hors site : le cloud (Google Drive, OneDrive) prot\xE8ge du vol et de la panne\n\nLes cl\xE9s USB se perdent et se corrompent : ne comptez que sur elles, c'est prendre un risque inutile. Le r\xE9flexe simple : travaillez directement dans le dossier synchronis\xE9 avec le cloud, et copiez chaque fin de semaine les fichiers critiques sur un disque externe. Dix minutes par semaine qui sauvent des ann\xE9es de travail."
        },
        {
          order: 2,
          title: "Raccourcis et astuces qui font gagner des heures",
          minutes: 12,
          content: "La diff\xE9rence entre un utilisateur lent et un utilisateur efficace tient \xE0 une poign\xE9e de r\xE9flexes. Les raccourcis clavier sont le premier : la main reste sur le clavier au lieu d'aller chercher chaque action dans les menus. Ceux-ci fonctionnent dans presque tous les logiciels, y compris Word, Excel et le navigateur.\n\n## Les raccourcis qui changent le quotidien\n\n- Ctrl+C / Ctrl+X / Ctrl+V : copier / couper / coller\n- Ctrl+Z : annuler \u2014 le bouton le plus important de l'informatique\n- Ctrl+F : chercher dans un document ou une page web\n- Alt+Tab : basculer entre les fen\xEAtres ouvertes\n- Ctrl+S : enregistrer \u2014 \xE0 faire devenir un tic\n- Ctrl+Maj+V : coller sans mise en forme (le sauveur des documents propres)\n\nDeuxi\xE8me r\xE9flexe : le clic droit expose presque toujours plus d'options que le clic simple. Troisi\xE8me r\xE9flexe : quand vous cherchez une fonction, tapez son nom dans la barre de recherche du logiciel au lieu de fouiller les menus. L'objectif n'est pas de tout m\xE9moriser, mais d'automatiser les dix gestes que vous r\xE9p\xE9tez cent fois par jour."
        },
        {
          order: 3,
          title: "Internet, e-mail et s\xE9curit\xE9 de base",
          minutes: 14,
          content: "Le navigateur et la messagerie sont les deux outils les plus utilis\xE9s au travail \u2014 et les portes d'entr\xE9e de la plupart des probl\xE8mes. Trois r\xE9flexes suffisent \xE0 \xE9viter l'essentiel des pi\xE8ges.\n\n## Les trois r\xE9flexes de s\xE9curit\xE9\n\nPremier r\xE9flexe : le mot de passe fort et unique par service, g\xE9r\xE9 par un gestionnaire (celui du navigateur convient tr\xE8s bien). Deuxi\xE8me r\xE9flexe : la double authentification (code re\xE7u par SMS ou application) sur la messagerie et les r\xE9seaux \u2014 elle bloque la quasi-totalit\xE9 des piratages de comptes. Troisi\xE8me r\xE9flexe : le doute syst\xE9matique devant l'urgence. \xAB Votre compte sera bloqu\xE9, cliquez vite \xBB est le sch\xE9ma de toutes les arnaques ; en cas de doute, on ne clique jamais, on va soi-m\xEAme sur le site officiel.\n\nPour l'e-mail professionnel : un objet clair (\xAB Devis n\xB0 24 \u2014 H\xF4tel Palma \xBB), un message court, une pi\xE8ce jointe nomm\xE9e proprement, et une r\xE9ponse sous 24 h m\xEAme si c'est pour dire \xAB je reviens vers vous vendredi \xBB. La r\xE9activit\xE9 est la premi\xE8re qualit\xE9 per\xE7ue au travail."
        }
      ]
    },
    {
      order: 2,
      title: "Word : des documents professionnels",
      summary: "Contrats, rapports, courriers : vous apprenez la mise en forme par styles, les sommaires automatiques, les tableaux propres et le publipostage qui envoie 100 lettres personnalis\xE9es en 5 minutes.",
      minutes: 50,
      lessons: [
        {
          order: 1,
          title: "Mise en forme propre : styles, titres, sommaire automatique",
          minutes: 18,
          content: "Le r\xE9flexe amateur : s\xE9lectionner chaque titre pour le mettre en gras et en rouge, un par un. R\xE9sultat : un document incoh\xE9rent, impossible \xE0 mettre \xE0 jour. Le r\xE9flexe professionnel : utiliser les styles (Accueil > Styles) \u2014 Titre 1 pour les grandes parties, Titre 2 pour les sous-parties, Normal pour le texte. On d\xE9finit l'apparence une fois, elle s'applique partout.\n\n## La puissance du sommaire automatique\n\nQuand vos titres utilisent les styles, Word peut g\xE9n\xE9rer un sommaire automatique (R\xE9f\xE9rences > Table des mati\xE8res) : une seule ligne de menu, et le sommaire se met \xE0 jour avec les num\xE9ros de pages exacts apr\xE8s chaque modification (clic droit > Mettre \xE0 jour les champs). Pour un rapport de 30 pages, c'est la diff\xE9rence entre 2 heures de corrections et 2 secondes.\n\n- D\xE9finissez d'abord la police et la taille du style Normal, tout le document en h\xE9rite\n- Utilisez des interlignes 1,15 ou 1,5 : la lecture en est transform\xE9e\n- Les sauts de page (Ctrl+Entr\xE9e) structurent les grandes sections, pas les touches Entr\xE9e\n- Alignez \xE0 gauche par d\xE9faut ; le justifi\xE9 cr\xE9e des rivi\xE8res blanches in\xE9l\xE9gantes"
        },
        {
          order: 2,
          title: "Tableaux, images et pages de garde",
          minutes: 16,
          content: "Un document professionnel n'est pas qu'une suite de paragraphes : il contient des tableaux de donn\xE9es, des images illustratives, une page de garde soign\xE9e. Chacun a ses r\xE8gles simples.\n\n## Les tableaux\n\nIns\xE9rez le tableau (Insertion > Tableau), remplissez, puis utilisez les styles de tableau int\xE9gr\xE9s \u2014 une ligne d'en-t\xEAte sombre et des lignes altern\xE9es se lisent mieux que des bordures lourdes de partout. Cochez \xAB Ligne d'en-t\xEAte \xBB dans l'onglet Disposition pour que l'en-t\xEAte se r\xE9p\xE8te automatiquement quand le tableau s'\xE9tale sur plusieurs pages : le d\xE9tail qui distingue un rapport s\xE9rieux.\n\n## Les images et la page de garde\n\n- Une image s'ins\xE8re en ligne avec le texte (Insertion > Images) ; pour la placer librement, choisissez l'habillage \xAB Devant le texte \xBB ou \xAB Carr\xE9 \xBB\n- Redimensionnez toujours par un coin pour respecter les proportions\n- La page de garde (Insertion > Page de garde) donne un rendu instantan\xE9 : titre, sous-titre, date, auteur\n- Num\xE9rotez les pages (Insertion > Num\xE9ro de page) \u2014 un document sans pagination perd sa cr\xE9dibilit\xE9 d\xE8s la deuxi\xE8me page"
        },
        {
          order: 3,
          title: "Le publipostage : 100 lettres en 5 minutes",
          minutes: 16,
          content: "Le publipostage est la fonction la plus impressionnante de Word \u2014 et la moins connue. Elle g\xE9n\xE8re automatiquement autant de lettres, \xE9tiquettes ou enveloppes que de destinataires, chacun avec son nom, son adresse, son montant. Le principe : un document mod\xE8le + une liste de donn\xE9es (Excel), et Word g\xE9n\xE8re tout seul chaque document personnalis\xE9.\n\n## La marche \xE0 suivre\n\n- Pr\xE9parez votre liste dans Excel : une ligne par destinataire, une colonne par information (Nom, Adresse, Ville, Montant\u2026)\n- Dans Word, ouvrez votre lettre mod\xE8le, puis Publipostage > D\xE9marrer la fusion > Lettres\n- S\xE9lectionnez les destinataires : \xAB Utiliser une liste existante \xBB \u2192 votre fichier Excel\n- Ins\xE9rez les champs de fusion dans le texte : \xAB Cher <<Nom>>\u2026 \xBB\n- Aper\xE7u des r\xE9sultats, puis \xAB Terminer et fusionner \xBB : Word cr\xE9e toutes les lettres\n\nLe m\xEAme m\xE9canisme produit des certificats de participation, des \xE9tiquettes d'adresse, des attestations personnalis\xE9es. C'est exactement le genre de t\xE2che que vous pourrez facturer : \xAB Je vous pr\xE9pare 200 invitations personnalis\xE9es pour demain \xBB devient un service, pas une corv\xE9e."
        }
      ]
    },
    {
      order: 3,
      title: "Excel : le tableur au travail",
      summary: "Du tableau simple aux formules qui calculent tout seuls : la saisie propre, les formules essentielles, et des graphiques que tout dirigeant comprend en dix secondes.",
      minutes: 55,
      lessons: [
        {
          order: 1,
          title: "Saisie, tri et mise en forme de tableaux",
          minutes: 18,
          content: "Excel organise les donn\xE9es en cellules \u2014 colonnes (A, B, C\u2026) et lignes (1, 2, 3\u2026). La premi\xE8re r\xE8gle professionnelle : une information par cellule, une ligne par enregistrement, une colonne par champ. Un tableau de ventes propre, c'est : Date | Client | Produit | Quantit\xE9 | Prix unitaire | Total. Cette discipline de saisie d\xE9termine tout ce que vous pourrez faire ensuite \u2014 trier, filtrer, calculer.\n\n## Les manipulations de base\n\n- Le coin inf\xE9rieur droit d'une cellule se tire pour recopier une formule ou une s\xE9rie (janvier, f\xE9vrier, mars\u2026)\n- Ctrl+Maj+Fl\xE8che s\xE9lectionne jusqu'\xE0 la derni\xE8re donn\xE9e : fini les s\xE9lections \xE0 la souris interminables\n- Donn\xE9es > Trier et Filtrer : un clic sur l'entonnoir filtre par valeur, par texte, par date\n- Format > Nombre : les montants en FCFA, les dates en date \u2014 jamais de texte l\xE0 o\xF9 il faut calculer\n\nMettez la premi\xE8re ligne en gras et figez-la (Affichage > Figer la ligne sup\xE9rieure) : elle reste visible quand vous d\xE9filez. Ces petits r\xE9flexes rendent vos tableaux agr\xE9ables \xE0 lire \u2014 et vous cr\xE9dibles devant un patron ou un client."
        },
        {
          order: 2,
          title: "Formules essentielles : SOMME, MOYENNE, SI, NB",
          minutes: 20,
          content: `Une formule commence toujours par le signe =. Les quatre fonctions ci-dessous couvrent 80 % des besoins quotidiens \u2014 les ma\xEEtriser suffit \xE0 transformer un tableau statique en outil de pilotage.

## Les incontournables

- =SOMME(B2:B31) : additionne une plage (les ventes du mois)
- =MOYENNE(C2:C100) : la valeur moyenne (panier moyen, note moyenne)
- =NB.SI(B2:B100;"Pay\xE9") : compte les cellules qui remplissent un crit\xE8re
- =SI(D2>=500000;"Objectif atteint";"En cours") : une d\xE9cision automatique selon un test

La fonction SI est la porte d'entr\xE9e de l'automatisation : elle compare une valeur \xE0 un seuil et renvoie un r\xE9sultat diff\xE9rent selon le cas. Combinez-la avec NB.SI et SOMME.SI pour des tableaux de bord qui se mettent \xE0 jour d\xE8s qu'une ligne change.

Deux r\xE9flexes de pro : utilisez les r\xE9f\xE9rences de cellules (=B2*C2, jamais 1500*3 tap\xE9s \xE0 la main), et nommez vos plages importantes (Formules > D\xE9finir un nom) pour des formules lisibles : =SOMME(Ventes_Mars). Quand vous copiez une formule, faites attention aux r\xE9f\xE9rences : ajoutez un $ devant la colonne ou la ligne \xE0 figer (=B2*$F$1 pour toujours multiplier par le m\xEAme taux).`
        },
        {
          order: 3,
          title: "Graphiques et impressions propres",
          minutes: 17,
          content: "Un chiffre convainc, une image convainc en dix secondes. Excel transforme vos donn\xE9es en graphiques en trois clics : s\xE9lectionnez la plage, Insertion > Graphique recommand\xE9. Le choix du type fait toute la diff\xE9rence : colonnes pour comparer des cat\xE9gories, ligne pour montrer une \xE9volution dans le temps, secteurs (camembert) pour une r\xE9partition en parts \u2014 et jamais plus de 5-6 parts, sinon la lecture devient impossible.\n\n## Soigner le graphique\n\n- Un titre qui dit la conclusion : \xAB Ventes : +34 % au 2e trimestre \xBB, pas \xAB Graphique 1 \xBB\n- Supprimez le superflu : grille trop dense, l\xE9gendes redondantes, effets 3D dat\xE9s\n- Une couleur d'accent pour la s\xE9rie importante, gris clair pour le reste\n- \xC9tiquettes de donn\xE9es sur les valeurs cl\xE9s, plut\xF4t qu'un axe que le lecteur doit d\xE9coder\n\nPour l'impression : Mise en page > Zone d'impression pour ne sortir que le tableau utile, \xAB Faire tenir sur une page \xBB pour l'\xE9chelle, et v\xE9rifiez toujours l'aper\xE7u avant d'imprimer \u2014 rien ne compromet un rapport comme un tableau coup\xE9 en deux sur deux pages."
        }
      ]
    },
    {
      order: 4,
      title: "PowerPoint & communication",
      summary: "Des diapositives qui soutiennent le discours au lieu de le remplacer, la posture pour pr\xE9senter avec assurance, et l'e-mail professionnel plus le travail collaboratif.",
      minutes: 45,
      lessons: [
        {
          order: 1,
          title: "Diaporamas qui soutiennent le discours",
          minutes: 16,
          content: "Le p\xE9ch\xE9 capital des pr\xE9sentations : transformer PowerPoint en document de lecture. Un slide n'est pas un rapport \u2014 c'est un support visuel qui appuie ce que vous dites. La r\xE8gle des professionnels : une id\xE9e par diapositive, un maximum de 20 mots par slide. Si tout votre discours est \xE9crit sur la diapositive, l'audience lit au lieu de vous \xE9couter, et vous devenez un lecteur \xE0 voix haute.\n\n## La structure d'une pr\xE9sentation qui marque\n\n- Slide 1 : le titre + qui vous \xEAtes (10 secondes, on y reste peu)\n- Slide 2 : le probl\xE8me ou la question \u2014 c'est elle qui accroche l'audience\n- Slides 3 \xE0 8 : le c\u0153ur, une id\xE9e par slide, avec visuel dominant et peu de texte\n- Slide finale : la conclusion ou l'appel \xE0 l'action \u2014 ce que vous voulez qu'il se passe\n\nC\xF4t\xE9 forme : utilisez le mod\xE8le du th\xE8me (Cr\xE9ation > Th\xE8mes) pour une coh\xE9rence automatique, une seule famille de polices, et des images en pleine page plut\xF4t que des puces \xE0 r\xE9p\xE9tition. Les transitions sobres (fondu) suffisent ; les animations spectaculaires d\xE9cr\xE9dibilisent en r\xE9union professionnelle."
        },
        {
          order: 2,
          title: "Pr\xE9senter en public avec assurance",
          minutes: 14,
          content: "L'outil ne fait pas l'orateur : c'est votre pr\xE9sence qui porte le message. La pr\xE9paration est le meilleur rem\xE8de au trac \u2014 non pas apprendre par c\u0153ur, mais ma\xEEtriser le fil : l'introduction, les trois id\xE9es du corps, la conclusion. Avec ce squelette en t\xEAte, un oubli de d\xE9tail ne casse jamais la pr\xE9sentation.\n\n## Les techniques qui changent tout\n\n- La r\xE8gle 10-20-30 de Guy Kawasaki : 10 slides, 20 minutes, police minimale 30 \u2014 la concision force la clart\xE9\n- R\xE9p\xE9tez \xE0 voix haute au moins deux fois : ce que vous d\xE9couvrez \xE0 voix haute, l'audience le sent\n- Regardez trois points dans la salle (gauche, centre, droite) : tout le monde se sent regard\xE9\n- Parlez plus lentement que votre sensation : votre perception du rythme est d\xE9form\xE9e par le trac\n- Pr\xE9voyez les questions probables et pr\xE9parez des r\xE9ponses en une phrase\n\nEt le jour J, arrivez en avance pour tester la projection, le son et le clic : les incidents techniques se r\xE8glent mal \xE0 la derni\xE8re minute. Si le mat\xE9riel tombe en panne, vous devez pouvoir pr\xE9senter sans slides \u2014 c'est le test ultime de la ma\xEEtrise du sujet."
        },
        {
          order: 3,
          title: "E-mail pro et travail collaboratif (Drive, partage)",
          minutes: 15,
          content: "L'e-mail professionnel a ses codes \u2014 et ils comptent, parce que la messagerie reste le premier canal du monde du travail. Un bon e-mail tient en quatre blocs : l'objet informatif (\xAB Proposition site web \u2014 H\xF4tel Palma \xBB), la salutation br\xE8ve, le corps structur\xE9 (une demande ou une info par paragraphe, les questions num\xE9rot\xE9es), la formule de politesse courte. R\xE9pondre sous 24 h, m\xEAme par un simple accus\xE9, est la norme professionnelle.\n\n## Le collaboratif : fin des pi\xE8ces jointes interminables\n\n- Google Drive ou OneDrive : le fichier vit en ligne, tout le monde travaille sur la m\xEAme version\n- Le partage se fait par lien avec droits : \xAB Peut consulter \xBB ou \xAB Peut modifier \xBB \u2014 choisissez consciemment\n- Historique de versions : un fichier \xE9cras\xE9 par erreur se restaure en deux clics\n- Les commentaires en marge remplacent les allers-retours d'e-mails contradictoires\n\nLa bonne pratique : pour toute r\xE9vision de document \xE0 plusieurs, un lien cloud plut\xF4t qu'une pi\xE8ce jointe. Les versions \xAB rapport-final-v3-corrig\xE9-VRAIMENT-final.xlsx \xBB disparaissent, et avec elles la moiti\xE9 des malentendus d'\xE9quipe."
        }
      ]
    }
  ]
};

// src/lib/academy/catalog-marque.ts
var COURSE_MARQUE = {
  slug: "identite-de-marque",
  title: "Identit\xE9 de marque : logo & charte graphique",
  subtitle: "Positionnement, logo qui traverse les ann\xE9es, charte graphique professionnelle et d\xE9ploiement coh\xE9rent : construisez des marques que l'on reconna\xEEt au premier regard.",
  description: "Une formation 100 % pratique o\xF9 vous apprenez \xE0 poser les fondations strat\xE9giques d'une marque, \xE0 concevoir un logo durable, \xE0 r\xE9diger une charte graphique compl\xE8te et \xE0 d\xE9ployer cette identit\xE9 sur tous les supports sans jamais la d\xE9former. Vous suivez 4 modules \xE0 votre rythme, le\xE7on par le\xE7on, puis vous validez vos connaissances avec un examen final de 10 questions. En cas de r\xE9ussite, vous obtenez un certificat RodLab Studio v\xE9rifiable et t\xE9l\xE9chargeable en PDF.",
  level: "Interm\xE9diaire",
  durationHours: 8,
  skills: [
    "D\xE9finir un positionnement et une personnalit\xE9 de marque",
    "Cadrer un projet logo avec un brief cr\xE9atif s\xE9rieux",
    "Concevoir un logo lisible \xE0 toutes les tailles",
    "Pr\xE9parer toutes les d\xE9clinaisons utiles d'un logo",
    "R\xE9diger une charte graphique d'une page comme d'un livre",
    "Garantir la coh\xE9rence de la marque sur tous les supports"
  ],
  modules: [
    {
      order: 1,
      title: "Les fondations de la marque",
      summary: "Un logo dessin\xE9 sans strat\xE9gie est une d\xE9coration. Ce module pose les questions qui pr\xE9c\xE8dent tout trait de crayon : pour qui, contre qui, avec quelle promesse.",
      minutes: 40,
      lessons: [
        {
          order: 1,
          title: "Positionnement : la place unique de votre marque",
          minutes: 14,
          content: "Le positionnement est la place qu'une marque occupe dans l'esprit du client, face aux alternatives. Sa formule classique : \xAB Pour [cible], [marque] est [cat\xE9gorie] qui [b\xE9n\xE9fice cl\xE9], parce que [preuve] \xBB. Pour RodLab Studio : pour les PME et entrepreneurs d'Afrique francophone, RodLab est l'agence digitale qui transforme une id\xE9e en pr\xE9sence professionnelle compl\xE8te, parce que chaque projet part de la strat\xE9gie et non de l'esth\xE9tique.\n\n## Trouver sa place\n\n- Listez 5 concurrents directs : que promettent-ils, avec quels mots, \xE0 quel prix ?\n- Cherchez le \xAB mais \xBB : \xAB tous font X, mais aucun ne fait Y \xBB \u2014 Y est votre positionnement\n- Une marque qui essaie de tout \xEAtre ne signale rien : la niche paie plus que la g\xE9n\xE9ralit\xE9\n\nLe positionnement dicte ensuite tout le reste : une marque premium n'utilisera ni les m\xEAmes polices ni les m\xEAmes canaux qu'une marque populaire. Quand un client vous demande \xAB un logo \xBB, vous vendez en r\xE9alit\xE9 un positionnement visible \u2014 c'est pour cela que ce module vient avant les crayons."
        },
        {
          order: 2,
          title: "Personnalit\xE9 et promesse : le c\u0153ur de la marque",
          minutes: 12,
          content: "Une marque est une personne : elle a un caract\xE8re, une voix, des valeurs, des manies. La personnalit\xE9 se d\xE9finit avec des adjectifs pr\xE9cis \u2014 jamais \xAB moderne \xBB ou \xAB professionnel \xBB (tout le monde le dit), mais \xAB directe et chaleureuse, avec une pointe d'audace \xBB, ou \xAB sobre, pr\xE9cise, presque architecturale \xBB. Ces 3 \xE0 5 adjectifs deviennent la r\xE9f\xE9rence de chaque d\xE9cision visuelle et verbale qui suivra.\n\n## De la personnalit\xE9 au visage\n\n- Le test du miroir : si la marque \xE9tait une personne dans une r\xE9union, comment parlerait-elle, comment s'habillerait-elle ?\n- La promesse : ce que le client obtient toujours, en une phrase v\xE9rifiable (ex. : \xAB livr\xE9 dans les d\xE9lais, sinon rembours\xE9 \xBB)\n- Les valeurs utiles : 2 ou 3 maximum, celles qui orientent vraiment les d\xE9cisions\n\nC'est ce socle qui rendra votre logo \xAB juste \xBB : la m\xEAme forme peut \xEAtre \xE9l\xE9gante ou fade selon la marque qu'elle sert. Un logo sans personnalit\xE9 d\xE9finie est une coquille vide : joli peut-\xEAtre, mais sans direction."
        },
        {
          order: 3,
          title: "\xC9tudier le march\xE9 et les concurrents",
          minutes: 14,
          content: "Avant de cr\xE9er, on observe. L'audit concurrentiel n'est pas de la copie : c'est la carte du terrain pour savoir o\xF9 sont les codes du secteur \u2014 et o\xF9 sont les espaces libres. Rassemblez les logos, palettes et messages des 8 \xE0 10 acteurs les plus visibles du march\xE9 vis\xE9, puis classez-les.\n\n## Ce que l'audit r\xE9v\xE8le\n\n- Les codes \xE0 conna\xEEtre : dans la banque, le bleu rassure ; dans le bio, le vert s'impose. Les ignorer par provocation co\xFBte cher\n- Les espaces libres : si tous les concurrents sont bleus et sobres, un accent terracotta et une typographie affirm\xE9e rendent imm\xE9diatement identifiable\n- Les pi\xE8ges \xE0 \xE9viter : les ressemblances g\xEAnantes (m\xEAme forme, m\xEAme couleur qu'un acteur connu) exposent \xE0 la confusion et parfois au contentieux\n\nConcr\xE8tement, livrez l'audit au client en une planche visuelle simple : \xAB voici le paysage, voici o\xF9 nous allons nous placer, et pourquoi \xBB. Cette \xE9tape, souvent n\xE9glig\xE9e par les d\xE9butants, transforme une demande de logo en mission strat\xE9gique \u2014 et justifie un tarif sup\xE9rieur."
        }
      ]
    },
    {
      order: 2,
      title: "Le logo",
      summary: "Du brief cr\xE9atif aux d\xE9clinaisons techniques : la m\xE9thode compl\xE8te de conception d'un logo qui reste lisible sur une carte de visite comme sur une fa\xE7ade.",
      minutes: 50,
      lessons: [
        {
          order: 1,
          title: "Le brief cr\xE9atif : cadrer avant de dessiner",
          minutes: 15,
          content: "Le brief cr\xE9atif est le contrat entre la strat\xE9gie et le crayon. Une heure de questions pos\xE9es au client \xE9pargne des semaines de retouches \u2014 parce que la plupart des \xAB \xE7a ne me pla\xEEt pas \xBB viennent d'un cadrage manqu\xE9, pas d'un dessin rat\xE9.\n\n## Les questions du brief qui sauvent\n\n- Comment d\xE9cririez-vous votre marque en trois adjectifs ? (et en trois marques que vous admirez ?)\n- Que ne voulez-vous surtout pas ? (les exclusions \xE9clairent autant que les souhaits)\n- O\xF9 le logo vivra-t-il ? (fa\xE7ade, WhatsApp, brod\xE9e sur uniforme, signature e-mail)\n- Y a-t-il des \xE9l\xE9ments non n\xE9gociables ? (couleur d'histoire, symbole, nom exact)\n\nFormalisez le brief en une page et faites-la valider par \xE9crit. C'est votre protection professionnelle : quand la proposition 2 arrive et que le client \xE9voque \xAB quelque chose de plus dynamique \xBB, vous relisez ensemble la page valid\xE9e. Le brief transforme le go\xFBt subjectif en projet objectif \u2014 c'est ce qui distingue un cr\xE9atif d'un ex\xE9cutant."
        },
        {
          order: 2,
          title: "Formes, symboles et typographies du logo",
          minutes: 18,
          content: "Un logo r\xE9ussi tient en une id\xE9e claire, ex\xE9cut\xE9e simplement. Les grandes familles de formes parlent chacune leur langue : le cercle \xE9voque l'unit\xE9 et la communaut\xE9, le carr\xE9 la stabilit\xE9 et le s\xE9rieux, le triangle l'\xE9lan et la pointe, la ligne courbe la fluidit\xE9. Le symbole \u2014 s'il existe \u2014 doit se relier au nom ou au m\xE9tier sans n\xE9cessiter d'explication : la fl\xE8che cach\xE9e de FedEx reste l'exemple canonique du d\xE9tail qui r\xE9compense l'attention.\n\n## Les r\xE8gles d'or du dessin\n\n- Une id\xE9e, pas dix : si le logo raconte trois histoires, il n'en raconte aucune\n- Le test de la silhouette : noircissez le logo \u2014 la forme doit rester reconnaissable\n- Le test de l'\xE9chelle : lisible \xE0 16 px (favicon) comme \xE0 3 m\xE8tres\n- La typographie doit survivre au logo : \xE9vitez les polices d\xE9coratives qui datent en cinq ans\n- Travaillez d'abord en noir et blanc : la couleur vient r\xE9compenser une forme solide, jamais la sauver\n\nProduisez trois pistes distinctes r\xE9pondant au brief \u2014 pas trente. Trois directions s\xE9rieuses permettent au client de choisir un cap ; trente variantes d'une m\xEAme id\xE9e produisent une r\xE9union confuse et un logo moyen."
        },
        {
          order: 3,
          title: "D\xE9clinaisons : versions, couleurs, fonds, favicon",
          minutes: 17,
          content: "Un logo n'est pas un fichier : c'est une famille de fichiers. La diff\xE9rence entre un logo amateur et un logo professionnel se voit dans les d\xE9clinaisons livr\xE9es \u2014 celles qui permettent d'utiliser la marque partout sans jamais la d\xE9former.\n\n## Le pack de d\xE9clinaisons standard\n\n- Version principale (horizontale) : l'usage par d\xE9faut\n- Version verticale ou monogramme : pour les espaces carr\xE9s (profil de r\xE9seau social, favicon)\n- Versions couleur : fond clair (couleur pleine), fond sombre (blanc ou cr\xE8me), monochrome noire et blanche (fax, gravure, tampon)\n- Zone de protection : le logo s'entoure d'un espace vide minimum (souvent la hauteur d'une lettre du nom) qu'aucun \xE9l\xE9ment n'empi\xE8te\n- Taille minimale : en dessous de X px, utiliser le monogramme\n\nLivrez les formats utiles : SVG et PDF pour l'imprimeur, PNG transparents pour l'usage quotidien, JPG sur fond blanc pour les plateformes qui l'exigent. Un client qui re\xE7oit ce pack comprend imm\xE9diatement qu'il a pay\xE9 un syst\xE8me \u2014 pas un dessin."
        }
      ]
    },
    {
      order: 3,
      title: "La charte graphique",
      summary: "La charte transforme le logo en langage : r\xE8gles de couleur, de typographie, d'images et d'usage \u2014 de la page unique aux projets complets.",
      minutes: 45,
      lessons: [
        {
          order: 1,
          title: "Palette, typographies et r\xE8gles d'usage",
          minutes: 16,
          content: "La charte graphique est le mode d'emploi de la marque : elle permet \xE0 n'importe qui \u2014 graphiste, community manager, imprimeur \u2014 de produire des supports coh\xE9rents sans vous appeler pour chaque d\xE9cision. Sa base : les couleurs cod\xE9es (HEX pour le web, CMJN pour le print, avec le pantone si pr\xE9cision critique), les polices autoris\xE9es avec leurs graisses, et les r\xE8gles d'usage du logo.\n\n## Les r\xE8gles d'usage qui pr\xE9viennent les d\xE9g\xE2ts\n\n- Interdictions explicites : ne pas \xE9tirer le logo, ne pas changer ses couleurs, ne pas le poser sur une photo charg\xE9e sans voile, ne pas le recr\xE9er \xE0 partir d'une capture d'\xE9cran\n- Contrastes minimaux : le logo clair exige un fond sombre, et inversement \u2014 donnez les combinaisons autoris\xE9es\n- Hi\xE9rarchie typographique : titre, sous-titre, corps \u2014 avec tailles et graisses d\xE9finies\n\nUne charte d'une page bien faite sert mieux une PME qu'un pav\xE9 de 40 pages jamais ouvert. Commencez par la page unique : palette, polices, logo et interdits. Le livre complet vient avec la croissance de la marque \u2014 et constitue un second contrat pour vous."
        },
        {
          order: 2,
          title: "Tonalit\xE9 visuelle : photos, ic\xF4nes, illustrations",
          minutes: 14,
          content: "Deux marques aux couleurs identiques peuvent \xEAtre reconnaissables entre mille : c'est la tonalit\xE9 visuelle qui tranche \u2014 la mani\xE8re constante de traiter les images, les ic\xF4nes et les illustrations. Elle se d\xE9finit par des choix concrets plut\xF4t que par des adjectifs.\n\n## D\xE9finir la tonalit\xE9 par des d\xE9cisions\n\n- Photos : naturelles et lumineuses ou studio sur fond color\xE9 ? Sujets africains r\xE9els ou banques d'images g\xE9n\xE9riques ? (\xE0 Lom\xE9, la vraie \xE9quipe photographi\xE9e bat toujours la banque d'images \u2014 c'est une preuve, pas une d\xE9coration)\n- Ic\xF4nes : trait fin ou plein ? coins ronds ou droits ? une seule famille, jamais m\xE9l\xE9e\n- Illustrations : pr\xE9sentes ou absentes ? si pr\xE9sentes, quel style et dans quel but ?\n- Filtres et retouches : une consigne fixe (\xAB lumi\xE8re naturelle, contraste doux \xBB) vaut mieux que six styles de photos concurrents\n\nLe meilleur moyen de fixer cette tonalit\xE9 : constituer un moodboard de 10 \xE0 15 images de r\xE9f\xE9rence et l'annexer \xE0 la charte. Le visuel se comprend d'un regard, l\xE0 o\xF9 mille mots de r\xE8gle ne suffiraient pas."
        },
        {
          order: 3,
          title: "Document de charte : structure et livrables",
          minutes: 15,
          content: "Le document de charte est le livrable qui mat\xE9rialise toute votre mission de marque. Sa structure standard, du g\xE9n\xE9ral au particulier :\n\n## Le sommaire type\n\n1. Introduction : la marque en une page (positionnement, personnalit\xE9, promesse)\n2. Le logo : versions, zone de protection, tailles minimales, interdits illustr\xE9s\n3. Les couleurs : codes HEX, RVB, CMJN \u2014 avec leurs parts d'usage (le 60-30-10)\n4. Les typographies : familles, graisses, hi\xE9rarchie, alternatives gratuites pour le web\n5. La tonalit\xE9 visuelle : moodboard, r\xE8gles photo, famille d'ic\xF4nes\n6. Les supports : exemples appliqu\xE9s (carte de visite, profil WhatsApp, post r\xE9seau, signature e-mail)\n\nChaque r\xE8gle s'accompagne d'un exemple fait et d'un exemple d\xE9fendu (\xAB \xE0 faire / \xE0 ne pas faire \xBB) : la r\xE8gle illustr\xE9e est comprise m\xEAme par les non-cr\xE9atifs. Livrez le document en PDF verrouill\xE9, avec les fichiers sources dans un dossier s\xE9par\xE9 \u2014 et proposez une s\xE9ance de passation de 30 minutes : c'est elle qui transforme la charte en outil r\xE9ellement utilis\xE9."
        }
      ]
    },
    {
      order: 4,
      title: "D\xE9ployer la marque",
      summary: "La marque vit ensuite sur cent supports. Les priorit\xE9s de d\xE9ploiement, la coh\xE9rence quotidienne sur les r\xE9seaux, et les erreurs qui d\xE9truisent une identit\xE9 \u2014 avec leurs corrections.",
      minutes: 40,
      lessons: [
        {
          order: 1,
          title: "Supports de premi\xE8re n\xE9cessit\xE9",
          minutes: 14,
          content: "Apr\xE8s le logo et la charte, le client attend de voir sa marque \xAB en vrai \xBB. Priorisez les supports qui servent imm\xE9diatement son activit\xE9 \u2014 la liste des premi\xE8res 48 heures :\n\n## Le kit de lancement\n\n- Digital d'abord : photo de profil et banni\xE8re WhatsApp Business, Facebook, Instagram \u2014 c'est l\xE0 que 90 % des clients rencontrent la marque\n- Signature e-mail : logo compact, coordonn\xE9es, un lien \u2014 sobre et lisible sur mobile\n- Carte de visite : toujours utile au Togo \u2014 recto logo, verso informations, avec le QR code vers la page ou le catalogue\n- Mod\xE8le de devis/facture : la marque dans les documents de travail, l\xE0 o\xF9 la cr\xE9dibilit\xE9 se joue vraiment\n\nChaque support se construit \xE0 partir des gabarits de la charte \u2014 pas librement. Un tampon, une b\xE2che, un t-shirt viendront ensuite. L'erreur classique est de d\xE9penser tout le budget dans le print au lancement, alors que les supports num\xE9riques portent le premier contact : commencez l\xE0 o\xF9 se trouve l'audience."
        },
        {
          order: 2,
          title: "Coh\xE9rence sur les r\xE9seaux et le web",
          minutes: 13,
          content: "La marque se d\xE9forme doucement, post apr\xE8s post : une police improvis\xE9e ici, une couleur approximative l\xE0, un logo \xE9tir\xE9 sur une story. La coh\xE9rence n'est pas un suppl\xE9ment d'\xE2me : c'est ce qui transforme une exposition r\xE9p\xE9t\xE9e en m\xE9moire de marque. Le client doit reconna\xEEtre un post sans voir le nom de la page.\n\n## Le syst\xE8me qui tient sans effort\n\n- Les gabarits Canva li\xE9s \xE0 la charte : polices et couleurs d\xE9j\xE0 enregistr\xE9es dans \xAB Marque \xBB, impossible de s'en \xE9carter\n- Une photo de profil identique partout, mise \xE0 jour simultan\xE9ment\n- Le ton de voix document\xE9 : la m\xEAme marque n'\xE9crit pas \xAB Bonjour chers clients \xBB le matin et \xAB Yo \xBB le soir\n- Un audit trimestriel : parcourez les 20 derniers posts et notez chaque \xE9cart \u2014 c'est la liste de correction du trimestre\n\nPour les \xE9quipes de plusieurs personnes, la r\xE8gle d'or : seul un r\xE9f\xE9rent modifie les gabarits, les autres produisent \xE0 l'int\xE9rieur. La libert\xE9 cr\xE9ative s'exerce dans le cadre \u2014 c'est ce qui distingue une marque d'un fil d'images al\xE9atoires."
        },
        {
          order: 3,
          title: "Erreurs de marque \xE0 \xE9viter (et comment les corriger)",
          minutes: 13,
          content: "Les identit\xE9s ne meurent rarement d'un mauvais dessin initial : elles se d\xE9gradent par des fautes r\xE9p\xE9t\xE9es. Voici les cinq erreurs les plus fr\xE9quentes \u2014 et leur rem\xE8de.\n\n## Les cinq p\xE9ch\xE9s de la marque\n\n1. Le logo-cam\xE9l\xE9on : une couleur par support, une forme par usage \u2192 revenir \xE0 la charte, redistribuer les fichiers officiels \xE0 tous ceux qui produisent\n2. La mode suivie : changer d'identit\xE9 \xE0 chaque tendance \u2192 une refonte se justifie tous les 7 \xE0 10 ans, pas tous les 7 mois\n3. L'oubli du fichier source : le client perd le SVG et \xAB redessine \xBB le logo \u2192 toujours livrer + archiver les sources, et le rappeler en s\xE9ance de passation\n4. La marque muette : un beau logo, aucune ligne \xE9ditoriale \u2192 compl\xE9ter avec un ton de voix et trois th\xE8mes r\xE9currents\n5. L'incoh\xE9rence entre collaborateurs : chacun sa version \u2192 un r\xE9f\xE9rent unique + gabarits verrouill\xE9s + audit trimestriel\n\nCorriger ne co\xFBte presque rien quand on le fait t\xF4t : un rappel de charte, une redistribution de gabarits, un audit. C'est aussi un service r\xE9current \xE0 proposer : la \xAB garderie de marque \xBB trimestrielle, factur\xE9e, qui s\xE9curise l'identit\xE9 \u2014 et votre relation client."
        }
      ]
    }
  ]
};

// src/lib/academy/catalog-photo.ts
var COURSE_PHOTO = {
  slug: "photo-video-smartphone",
  title: "Photo & vid\xE9o au smartphone : produisez du contenu pro",
  subtitle: "Lumi\xE8re, cadrage, son, montage CapCut et organisation de production : tournez avec votre t\xE9l\xE9phone des photos et vid\xE9os qui passent pour du mat\xE9riel professionnel.",
  description: "Une formation 100 % pratique o\xF9 vous apprenez \xE0 photographier et filmer avec le seul appareil que vous avez d\xE9j\xE0 \u2014 votre smartphone : ma\xEEtriser la lumi\xE8re, composer l'image, tourner des vid\xE9os qui retiennent l'attention, monter avec CapCut et organiser une production de contenu r\xE9guli\xE8re. Vous suivez 4 modules \xE0 votre rythme, le\xE7on par le\xE7on, puis vous validez vos connaissances avec un examen final de 10 questions. En cas de r\xE9ussite, vous obtenez un certificat RodLab Studio v\xE9rifiable et t\xE9l\xE9chargeable en PDF.",
  level: "D\xE9butant",
  durationHours: 7,
  skills: [
    "Utiliser la lumi\xE8re naturelle comme un studio",
    "Composer des images selon la r\xE8gle des tiers et plus",
    "Tourner des vid\xE9os verticales avec un hook qui retient",
    "Capturer un son propre sans mat\xE9riel co\xFBteux",
    "Monter avec CapCut : coupes, sous-titres, musique, export",
    "Produire une banque de contenu en s\xE9rie et l'archiver"
  ],
  modules: [
    {
      order: 1,
      title: "La photo au smartphone",
      summary: "Le t\xE9l\xE9phone photographie tr\xE8s bien \u2014 quand la lumi\xE8re et le cadrage le servent. Les fondations qui s\xE9parent une photo amateur d'une photo professionnelle.",
      minutes: 45,
      lessons: [
        {
          order: 1,
          title: "Lumi\xE8re : le vrai secret de la photo",
          minutes: 16,
          content: "La photographie signifie litt\xE9ralement \xAB dessiner avec la lumi\xE8re \xBB \u2014 et c'est la lumi\xE8re, pas l'appareil, qui s\xE9pare l'amateur du professionnel. La r\xE8gle la plus rentable de tout ce cours : placez votre sujet FACE \xE0 une source de lumi\xE8re (fen\xEAtre, porte ouverte), jamais dos \xE0 elle. Un sujet face \xE0 une fen\xEAtre par jour clair obtient un rendu doux et uniforme que rien ne remplace.\n\n## Les moments et directions de lumi\xE8re\n\n- L'heure dor\xE9e (une heure apr\xE8s le lever, avant le coucher) : lumi\xE8re chaude, ombres longues, la plus flatteuse pour les visages et les ext\xE9rieurs\n- La lumi\xE8re du midi : dure et verticale, elle creuse les yeux \u2014 \xE9vitez les portraits \xE0 cette heure, ou passez \xE0 l'ombre\n- L'ombre ouverte (sous un auvent, \xE0 l'int\xE9rieur pr\xE8s de la fen\xEAtre) : le studio du pauvre, parfait pour les produits et les portraits\n- Le contre-jour donne des silhouettes et de l'atmosph\xE8re : \xE0 utiliser volontairement, jamais par accident\n\n\xC9teignez le flash int\xE9gr\xE9 : il aplatit et blanchit. \xC0 l'int\xE9rieur, une simple lampe dirig\xE9e sur le mur en face du sujet cr\xE9e une lumi\xE8re rebondie acceptable. Ce sont ces d\xE9cisions de lumi\xE8re, prises avant d'appuyer sur le d\xE9clencheur, qui font 80 % de la qualit\xE9 finale."
        },
        {
          order: 2,
          title: "Cadrage et composition : grammaire de l'image",
          minutes: 15,
          content: "La composition d\xE9cide de ce que l'\u0153il regarde et de ce qu'il ressent. Le fondement universel : la r\xE8gle des tiers. Activez la grille de l'appareil photo (R\xE9glages > Appareil photo > Grille) et placez votre sujet sur l'une des intersections des lignes plut\xF4t qu'au centre \u2014 l'image respire et l'\u0153il circule.\n\n## Les outils de composition qui servent tous les jours\n\n- Les lignes directrices : route, table, mur, fen\xEAtre \u2014 elles guident l'\u0153il vers le sujet\n- L'arri\xE8re-plan propre : la premi\xE8re cause de photo amateur est le poteau qui sort de la t\xEAte \u2014 d\xE9placez-vous de trois pas, souvent\n- La distance : approchez. Les meilleures photos produits et portraits se prennent pr\xE8s, pas de loin\n- La perspective : photographiez \xE0 hauteur du sujet (\xE0 genoux pour un enfant, au ras du plat pour une assiette), pas toujours debout\n\nAvant chaque pression sur le d\xE9clencheur, faites le tour visuel : sujet net, arri\xE8re-plan propre, bords sans d\xE9chets, lumi\xE8re face au sujet. Ces quatre v\xE9rifications prennent trois secondes et changent tout."
        },
        {
          order: 3,
          title: "R\xE9glages et nettoyage : tirer le meilleur de son t\xE9l\xE9phone",
          minutes: 14,
          content: "Le smartphone de 2019 et celui d'aujourd'hui se valent presque en journ\xE9e \u2014 ce qui les diff\xE9rencie, ce sont les r\xE9glages et les r\xE9flexes de l'utilisateur.\n\n## Les r\xE9glages qui comptent\n\n- Nettoyez l'objectif avec un chiffon doux avant chaque session : c'est LE conseil le plus rentable, le t\xE9l\xE9phone vit dans la poche et la lentille graisseuse floute toute la journ\xE9e\n- Touchez l'\xE9cran sur le sujet pour verrouiller la mise au point et l'exposition ; glissez le soleil qui appara\xEEt pour \xE9claircir ou assombrir\n- Verrouillez AE/AF (appui long) quand le sujet bouge\n- Photographiez en mode HDR par d\xE9faut, sans zoom num\xE9rique \u2014 le zoom num\xE9rique d\xE9truit la qualit\xE9 : rapprochez-vous\n- Pour les produits : un fond uni, une fen\xEAtre lat\xE9rale, et le mode rafale pour choisir la meilleure prise\n\nPour la retouche, trois gestes suffisent dans l'\xE9diteur int\xE9gr\xE9 ou Snapseed (gratuit) : la luminosit\xE9, le contraste l\xE9ger, le recadrage. R\xE9sistez aux filtres satur\xE9s : une retouche invisible vaut mieux qu'une retouche visible."
        }
      ]
    },
    {
      order: 2,
      title: "La vid\xE9o qui retient",
      summary: "Formats verticaux, hook, son, mouvements : le module o\xF9 votre t\xE9l\xE9phone devient une cam\xE9ra de production de contenu \u2014 sans stabilisateur ni micro-studio.",
      minutes: 45,
      lessons: [
        {
          order: 1,
          title: "Formats verticaux : hook, rythme, dur\xE9e",
          minutes: 15,
          content: "Sur Instagram, TikTok et WhatsApp, la vid\xE9o verticale (9:16) est reine : elle occupe tout l'\xE9cran et l'algorithme la favorise. Mais le format vertical a sa grammaire propre \u2014 et une loi d'airain : les deux premi\xE8res secondes d\xE9cident si le spectateur reste ou d\xE9file.\n\n## La structure qui fonctionne\n\n- Le hook (0-2 s) : le r\xE9sultat d'abord. Montrez le plat fini avant la recette, l'avant/apr\xE8s avant l'explication, la question choquante avant le d\xE9veloppement\n- Le corps (5-25 s) : une seule id\xE9e. Chaque seconde doit apporter quelque chose \u2014 sinon coupez\n- La fin : un appel clair (suivre, commenter, lien en bio) en une phrase\n\nLe rythme se construit au montage : une action par plan, des plans courts (2 \xE0 4 secondes), pas de temps morts entre les phrases. Pour la dur\xE9e, mieux vaut 20 secondes denses que 90 secondes dilu\xE9es \u2014 la compl\xE9tion du visionnage est le signal que l'algorithme r\xE9compense le plus."
        },
        {
          order: 2,
          title: "Le son : la moiti\xE9 de la qualit\xE9 per\xE7ue",
          minutes: 14,
          content: "Les spectateurs pardonnent une image moyenne ; ils quittent une vid\xE9o dont le son est mauvais. Le son repr\xE9sente la moiti\xE9 de la qualit\xE9 per\xE7ue \u2014 et c'est souvent lui qui distingue un contenu amateur d'un contenu pro.\n\n## Tourner propre, sans studio\n\n- Le vent est l'ennemi n\xB0 1 : \xE9quipez-vous d'un micro-cravate filaire (10 000-15 000 FCFA), la meilleure d\xE9pense de ce cours\n- Rapprochez le micro de la bouche : \xE0 d\xE9faut de cravate, filmez \xE0 moins d'un m\xE8tre du sujet, dans la pi\xE8ce la plus calme\n- Coupez les bruits de fond : ventilateur, t\xE9l\xE9vision, rue \u2014 choisissez la pi\xE8ce la plus silencieuse, les meubles absorbent l'\xE9cho\n- V\xE9rifiez en \xE9coutant au casque les 10 premi\xE8res secondes : toujours\n- En voix off : parlez comme au t\xE9l\xE9phone, plus pr\xE8s du micro que vous ne le pensez\n\nUne astuce de production : tournez l'ambiance 20 secondes sans parole (le lieu, les mains qui travaillent) \u2014 ces plans serviront au montage pour cacher les coupes et enrichir le rythme."
        },
        {
          order: 3,
          title: "Plans, mouvements et stabilit\xE9",
          minutes: 16,
          content: "Une vid\xE9o qui bouge tout le temps fatigue ; une vid\xE9o parfaitement statique endort. Le professionnalisme na\xEEt de l'intention : chaque mouvement a une raison d'\xEAtre.\n\n## Les plans de base d'un vocabulaire complet\n\n- Le plan large : installe le lieu (l'atelier, le restaurant, la boutique)\n- Le plan moyen : montre l'action (les mains qui coupent, qui versent, qui mesurent)\n- Le gros plan : fait ressentir (la texture, la fum\xE9e, le sourire) \u2014 c'est le plan le plus engageant sur mobile\n- Le plan de d\xE9tail : coupe, ingr\xE9dient, outil \u2014 id\xE9al pour couvrir les transitions\n\nPour la stabilit\xE9 : coudes contre le corps, t\xE9l\xE9phone \xE0 deux mains, ou t\xE9l\xE9phone pos\xE9 sur un support improvis\xE9 (pile de livres, verre). Les mouvements simples \u2014 un travelling lat\xE9ral lent en marchant \xE0 pas feutr\xE9s, un pivot doux sur un axe fixe \u2014 s'apprennent en une semaine. Le stabilisateur \xE9lectronique du t\xE9l\xE9phone lisse les micro-tremblements : avancez lentement, toujours lentement. Et tournez chaque action deux fois : la seconde prise, plus d\xE9tendue, est presque toujours la bonne."
        }
      ]
    },
    {
      order: 3,
      title: "Le montage",
      summary: "CapCut pas \xE0 pas : couper, rythmer, sous-titrer, musiquer et exporter \u2014 la cha\xEEne compl\xE8te du montage mobile qui transforme des rushes bruts en vid\xE9o publiables.",
      minutes: 45,
      lessons: [
        {
          order: 1,
          title: "CapCut pas \xE0 pas : coupe, transitions, texte",
          minutes: 16,
          content: "CapCut (gratuit) est devenu le standard du montage mobile : complet, gratuit, adapt\xE9 aux formats verticaux. Son interface se comprend en trois zones : la timeline (les plans pos\xE9s les uns apr\xE8s les autres), la pr\xE9visualisation, et le menu d'outils (couper, texte, audio, effets).\n\n## Le premier montage, plan par plan\n\n1. Nouveau projet \u2192 importez vos rushes dans l'ordre logique du r\xE9cit\n2. Coupez les d\xE9buts et fins inutiles : s\xE9lectionnez le plan, d\xE9placez les poign\xE9es blanches, ou utilisez \xAB Diviser \xBB au point de coupe\n3. Supprimez les silences et h\xE9sitations : le rythme se cr\xE9e en enlevant, pas en ajoutant\n4. Le texte : minimum un titre d'accroche au d\xE9but, une police lisible, plac\xE9 au tiers sup\xE9rieur (jamais coup\xE9 par les boutons de l'interface TikTok/Reels en bas)\n5. Les transitions : le fondu encha\xEEn\xE9 discret suffit \xE0 90 % des cas \u2014 les transitions spectaculaires datent vite\n\nHabitude de pro : montez d'abord toute la structure avec des plans bruts, regardez le r\xE9sultat en entier, puis raffinez. Le montage est une \xE9criture : d'abord le brouillon, ensuite le style."
        },
        {
          order: 2,
          title: "Sous-titres automatiques et accessibilit\xE9",
          minutes: 13,
          content: "La majorit\xE9 des vid\xE9os de r\xE9seaux sociaux est regard\xE9e sans le son \u2014 dans les transports, au bureau, en scannant son fil. Une vid\xE9o sans sous-titres perd donc l'essentiel de son audience. CapCut int\xE8gre la g\xE9n\xE9ration automatique de sous-titres (Texte > Sous-titres auto) : elle reconna\xEEt le fran\xE7ais avec une pr\xE9cision honorable et pose les mots au bon moment.\n\n## Les r\xE8gles des sous-titres professionnels\n\n- Relisez et corrigez : l'automatique se trompe sur les noms propres, les chiffres et le vocabulaire m\xE9tier\n- Par bloc court : 4 \xE0 7 mots \xE0 l'\xE9cran maximum, la lecture doit rester instantan\xE9e\n- Position : au centre-bas mais au-dessus des zones d'interface, avec une ombre ou un fond l\xE9ger pour rester lisible sur toute image\n- Style constant : une police, une taille, une couleur pour toute la vid\xE9o \u2014 la coh\xE9rence fait le pro\n\nLes sous-titres servent aussi le r\xE9f\xE9rencement : les plateformes analysent le texte des vid\xE9os pour classer le contenu. Mentionner clairement le sujet dans les sous-titres aide la bonne audience \xE0 vous trouver \u2014 c'est de l'accessibilit\xE9 ET de la strat\xE9gie."
        },
        {
          order: 3,
          title: "Musique, droits et exports optimis\xE9s",
          minutes: 16,
          content: "La musique donne l'\xE9motion et le rythme \u2014 mais elle est aussi la premi\xE8re source de probl\xE8mes de droits. La r\xE8gle simple : utilisez la biblioth\xE8que int\xE9gr\xE9e \xE0 la plateforme de publication (sons Instagram/TikTok) ou les banques libres de droits (biblioth\xE8que audio CapCut, YouTube Audio Library). Une chanson populaire coll\xE9e sur une vid\xE9o destin\xE9e \xE0 un usage commercial (pub, page d'un client) peut entra\xEEner la suppression du son \u2014 voire du compte.\n\n## Le mixage simple qui suffit\n\n- La musique accompagne, elle ne couvre pas : volume \xE0 20-30 % quand il y a de la voix\n- Utilisez le fondu audio (fade) \xE0 l'entr\xE9e et \xE0 la sortie : une musique qui coupe net trahit l'amateur\n- Choisissez le tempo selon le rythme des coupes : synchroniser les plans sur les temps forts est le luxe du montage\n\nPour l'export : 1080 \xD7 1920 (vertical), 30 images/s suffisent, d\xE9bit \xE9lev\xE9 si l'application le propose. Exportez une fois en qualit\xE9 maximale et publiez depuis la galerie \u2014 r\xE9exporter ou recadrer apr\xE8s coup d\xE9grade l'image. Nommez le fichier avant l'export (\xAB client-produit-reel-2026-03 \xBB) : le rangement commence l\xE0."
        }
      ]
    },
    {
      order: 4,
      title: "Organiser sa production",
      summary: "La r\xE9gularit\xE9 ne s'improvise pas : shooting en s\xE9rie, gabarits de montage, archivage propre \u2014 la m\xE9thode de production qui fait durer la qualit\xE9 dans le temps.",
      minutes: 40,
      lessons: [
        {
          order: 1,
          title: "Banque de contenu : shooting en s\xE9rie",
          minutes: 14,
          content: "Produire un contenu par jour \xE9puise ; produire quinze contenus en une apr\xE8s-midi est r\xE9aliste. La diff\xE9rence tient \xE0 la production en s\xE9rie : pr\xE9parer le d\xE9cor, les tenues et la liste de plans, puis d\xE9rouler toute la s\xE9ance d'un trait. C'est la m\xE9thode de toutes les \xE9quipes de contenu professionnelles.\n\n## Organiser une s\xE9ance rentable\n\n- La semaine pr\xE9c\xE9dente : la liste des plans \xE9crite (quels plats, quels gestes, quels t\xE9moignages), le d\xE9cor pr\xE9par\xE9, la lumi\xE8re rep\xE9r\xE9e selon l'heure\n- Pendant la s\xE9ance : un plan apr\xE8s l'autre, deux prises chacun, et les plans d'ambiance en fin de s\xE9ance (les mains, les d\xE9tails, le lieu)\n- Les raccords : filmez chaque action de d\xE9but \xE0 fin, m\xEAme si vous ne garderez que 3 secondes \u2014 la coupe libre au montage\n- Multipliez les usages : une m\xEAme s\xE9ance produit des posts photos, des Reels, des stories et des images de couverture pour un mois\n\nNotez dans un carnet ce qui a \xE9t\xE9 film\xE9 : au montage, trois semaines plus tard, la m\xE9moire fait d\xE9faut. La banque de contenu est le stock qui sauve les semaines charg\xE9es \u2014 c'est elle qui rend la r\xE9gularit\xE9 possible."
        },
        {
          order: 2,
          title: "Coh\xE9rence de marque et gabarits de montage",
          minutes: 13,
          content: "Une vid\xE9o r\xE9ussie engage ; dix vid\xE9os coh\xE9rentes construisent une marque. La coh\xE9rence vid\xE9o repose sur des \xE9l\xE9ments fixes que le spectateur reconna\xEEt avant m\xEAme le logo : le style de sous-titres, la police des titres, la mani\xE8re d'ouvrir (le hook), la couleur dominante des visuels.\n\n## Le gabarit qui acc\xE9l\xE8re tout\n\n- Dans CapCut, enregistrez un projet mod\xE8le : intro typ\xE9e, style de sous-titres, logo en filigrane discret, transition de fin avec appel \xE0 l'action \u2014 chaque nouvelle vid\xE9o part de ce squelette\n- La m\xEAme police et les m\xEAmes couleurs que la charte graphique : les vid\xE9os appartiennent \xE0 la marque, pas au monteur\n- Un ton de voix constant : la marque qui chuchote lundi et hurle samedi brouille tout le monde\n- Les th\xE8mes r\xE9currents cr\xE9ent des rendez-vous : \xAB le conseil du mardi \xBB, \xAB la coulisse du vendredi \xBB \u2014 l'audience revient pour la s\xE9rie\n\nCette m\xE9canique a un effet de bord pr\xE9cieux : elle rend le travail d\xE9l\xE9gable. Un assistant qui suit le gabarit produit des vid\xE9os conformes \u2014 c'est ainsi qu'un cr\xE9ateur de contenu passe d'un format artisanal \xE0 une vraie production."
        },
        {
          order: 3,
          title: "Planifier et archiver ses m\xE9dias",
          minutes: 13,
          content: "Le contenu produit mais introuvable est un contenu perdu. La derni\xE8re discipline du cr\xE9ateur professionnel est archivistique : savoir o\xF9 est chaque rush, chaque version finale, chaque musique utilis\xE9e \u2014 pour les retrouver, les recycler et les sauvegarder.\n\n## Le syst\xE8me minimal viable\n\n- Une arborescence fixe : Ann\xE9e > Mois > Client ou Projet, avec les sous-dossiers \xAB rushes \xBB, \xAB projet-montage \xBB, \xAB exports \xBB\n- Les noms de fichiers dat\xE9s et nomm\xE9s : \xAB 2026-03-15-hotelpalma-plat-jollof-prise2.mp4 \xBB\n- La sauvegarde 3-2-1 adapt\xE9e : le t\xE9l\xE9phone + le disque externe + le cloud (Google Photos, Drive) \u2014 les m\xE9dias sont les fichiers les plus lourds et les plus pr\xE9cieux\n- Le registre des droits : d'o\xF9 vient chaque musique, chaque photo de personne (accord oral suffit rarement \u2014 un message \xE9crit d'accord vaut mieux)\n\nAjoutez le calendrier de publication au m\xEAme endroit (tableau simple ou application) : chaque semaine, 30 minutes de revue \u2014 ce qui a \xE9t\xE9 publi\xE9, ce qui reste dans la banque, ce qui manque. Ce point hebdomadaire transforme la production de contenu d'une course permanente en routine ma\xEEtris\xE9e."
        }
      ]
    }
  ]
};

// src/lib/academy/catalog-quizzes.ts
var CATALOG_QUIZZES = [
  {
    courseSlug: "design-graphique-pro",
    title: "Examen final \u2014 Design graphique",
    passScore: 70,
    questions: [
      {
        prompt: "Selon la r\xE8gle du 60-30-10, que repr\xE9sente les 10 % de couleur d'accent ?",
        options: ["Le fond du visuel", "Les \xE9l\xE9ments \xE0 mettre en valeur (boutons, mots-cl\xE9s)", "La couleur des photos", "Le texte courant"],
        answer: 1,
        explanation: "Les 10 % d'accent attirent l'\u0153il exactement o\xF9 il faut : boutons, mots-cl\xE9s, \xE9l\xE9ments d'action. Le fond prend 60 %, les blocs secondaires 30 %."
      },
      {
        prompt: "Combien de familles de polices utilise au maximum un projet professionnel ?",
        options: ["Une seule, toujours", "Deux : une pour les titres, une pour le texte", "Quatre pour varier", "Autant que n\xE9cessaire"],
        answer: 1,
        explanation: "La r\xE8gle des deux polices : une expressive pour les titres, une lisible pour le corps. Au-del\xE0, la mise en page devient brouillonne."
      },
      {
        prompt: "Pour exporter une affiche destin\xE9e \xE0 l'impression, il faut :",
        options: ["72 DPI et JPG", "300 DPI et PDF avec fond perdu", "PNG transparent", "Un GIF anim\xE9"],
        answer: 1,
        explanation: "Le print exige 300 DPI et un PDF avec fond perdu (3 mm) : la couleur doit d\xE9border au-del\xE0 de la coupe pour \xE9viter le liser\xE9 blanc."
      },
      {
        prompt: "Un logo doit imp\xE9rativement \xEAtre cr\xE9\xE9 en vectoriel parce que :",
        options: ["C'est plus l\xE9ger \xE0 envoyer", "Il reste net \xE0 toutes les tailles, du favicon \xE0 la b\xE2che", "Illustrator est plus rapide que Photoshop", "Les pixels ne permettent pas la couleur"],
        answer: 1,
        explanation: "Le vectoriel repose sur des formes math\xE9matiques : le logo passe d'une carte de visite \xE0 une b\xE2che de 10 m\xE8tres sans jamais se flouter."
      },
      {
        prompt: "Quel est le premier r\xE9flexe pour personnaliser un gabarit Canva ?",
        options: ["Le publier tel quel pour aller vite", "Remplacer palette, polices, images et formes par celles de la marque", "Changer uniquement le texte", "Ajouter plus de d\xE9corations"],
        answer: 1,
        explanation: "Un gabarit devient \xAB \xE0 vous \xBB quand les quatre couches sont remplac\xE9es : palette, typographies, visuels et formes d\xE9coratives."
      },
      {
        prompt: "Sur une affiche d'\xE9v\xE9nement, quelle information m\xE9rite la plus grande taille ?",
        options: ["Le logo de l'organisateur", "Le titre de l'\xE9v\xE9nement et la date", "Les remerciements", "Le plan d'acc\xE8s d\xE9taill\xE9"],
        answer: 1,
        explanation: "L'affiche se lit en trois secondes : quoi (le titre), quand (la date en tr\xE8s gros), o\xF9. Tout le reste est secondaire."
      },
      {
        prompt: "Le masque de fusion de Photoshop a un avantage d\xE9cisif :",
        options: ["Il efface d\xE9finitivement les pixels", "Il cache sans d\xE9truire : on peut revenir en arri\xE8re \xE0 tout moment", "Il acc\xE9l\xE8re l'export", "Il change automatiquement les couleurs"],
        answer: 1,
        explanation: "Peignez en noir pour cacher, blanc pour montrer : le masque non destructif permet de revenir en arri\xE8re sans perte."
      },
      {
        prompt: "Pour un post Instagram carr\xE9, la dimension native \xE0 exporter est :",
        options: ["1080 \xD7 1080 px", "500 \xD7 500 px", "300 DPI obligatoires", "1920 \xD7 1080 px"],
        answer: 0,
        explanation: "Le post carr\xE9 natif Instagram fait 1080 \xD7 1080 px ; la story fait 1080 \xD7 1920 px."
      },
      {
        prompt: "Pourquoi livrer les fichiers sources au client ?",
        options: ["Pour qu'il paie plus", "Le dossier complet (exports + sources) double la valeur per\xE7ue et fid\xE9lise", "Parce que la loi l'exige", "Pour occuper son espace de stockage"],
        answer: 1,
        explanation: "Un dossier de livraison structur\xE9 (exports nomm\xE9s, sources, mini-charte) transforme une prestation en service professionnel complet."
      },
      {
        prompt: "Testez un logo en le r\xE9duisant \xE0 16 px pour v\xE9rifier :",
        options: ["Ses couleurs", "Sa lisibilit\xE9 en favicon \u2014 il doit rester reconnaissable", "Son poids en Ko", "Sa compatibilit\xE9 Word"],
        answer: 1,
        explanation: "Le test de l'\xE9chelle : un bon logo reste lisible \xE0 16 px (favicon) comme \xE0 3 m\xE8tres (fa\xE7ade)."
      }
    ]
  },
  {
    courseSlug: "community-management",
    title: "Examen final \u2014 Community management",
    passScore: 70,
    questions: [
      {
        prompt: "Quel est le signal que l'algorithme r\xE9compense le plus ?",
        options: ["Le nombre d'abonn\xE9s", "Le partage du contenu", "La longueur des l\xE9gendes", "Le nombre de hashtags"],
        answer: 1,
        explanation: "Le partage est le signal le plus fort : il prolonge la port\xE9e vers de nouvelles audiences. Viennent ensuite la compl\xE9tion vid\xE9o et les commentaires."
      },
      {
        prompt: "La r\xE9partition \xE9prouv\xE9e des trois colonnes de contenu est :",
        options: ["40 % utile, 30 % preuve, 30 % lien", "100 % promotion", "50 % photos de produits, 50 % citations", "Autant de chaque plateforme"],
        answer: 0,
        explanation: "Contenu utile (40 %), preuve (30 %) et lien humain (30 %) : le compte devient une ressource que l'on suit, pas une publicit\xE9 que l'on fuit."
      },
      {
        prompt: "Que fait un community manager au moment de la d\xE9finition de persona ?",
        options: ["Il choisit le logo", "Il dresse le portrait pr\xE9cis du client id\xE9al : \xE2ge, frustrations, habitudes num\xE9riques", "Il r\xE9dige les CGU", "Il ach\xE8te des abonn\xE9s"],
        answer: 1,
        explanation: "Le persona pr\xE9cise \xE0 qui l'on parle vraiment : \xE9crire pour \xAB Fatima, 28 ans, entrepreneure \xE0 Lom\xE9 \xBB rend les contenus pertinents."
      },
      {
        prompt: "Combien d'appels \xE0 l'action par publication ?",
        options: ["Un seul", "Deux pour doubler les chances", "Un par plateforme", "Aucun, le client d\xE9cide seul"],
        answer: 0,
        explanation: "Un seul appel \xE0 l'action : deux actions possibles, c'est z\xE9ro action \u2014 l'attention ne se partage pas."
      },
      {
        prompt: "La structure d'une vid\xE9o courte efficace est :",
        options: ["Intro longue, conclusion br\xE8ve", "Hook en 2 secondes, une seule id\xE9e, appel \xE0 l'action clair", "Musique d'abord, message ensuite", "Un plan unique de 3 minutes"],
        answer: 1,
        explanation: "Hook (0-2 s), corps (une seule id\xE9e, plans de 2-4 s), fin avec appel clair : la compl\xE9tion du visionnage fait la port\xE9e."
      },
      {
        prompt: "Pourquoi sous-titrer syst\xE9matiquement ses vid\xE9os ?",
        options: ["Pour occuper l'\xE9cran", "La majorit\xE9 regarde sans le son : les sous-titres gardent l'audience", "Parce que c'est obligatoire", "Pour ralentir le spectateur"],
        answer: 1,
        explanation: "Transports, bureau, scroll silencieux : la majorit\xE9 regarde sans son. Les sous-titres sont de l'accessibilit\xE9 et de la strat\xE9gie."
      },
      {
        prompt: "Budget de test recommand\xE9 pour une premi\xE8re campagne Meta :",
        options: ["2 000 \xE0 5 000 FCFA/jour pendant 4 \xE0 7 jours", "100 FCFA une seule fois", "500 000 FCFA d\xE8s le d\xE9part", "Z\xE9ro, la pub est inutile"],
        answer: 0,
        explanation: "Un petit budget test sur plusieurs jours permet d'arbitrer entre deux variantes et de mesurer le co\xFBt par r\xE9sultat avant d'investir."
      },
      {
        prompt: "Quelle est l'indicateur le plus parlant pour un client ?",
        options: ["Le nombre d'abonn\xE9s", "Le co\xFBt par r\xE9sultat (par message re\xE7u, par clic)", "Le nombre de likes", "La longueur des publications"],
        answer: 1,
        explanation: "Le co\xFBt par r\xE9sultat relie l'effort \xE0 l'argent : d\xE9pens\xE9, messages re\xE7us, co\xFBt par message \u2014 c'est ce chiffre qui convainc."
      },
      {
        prompt: "Face \xE0 une r\xE9clamation en commentaire, la bonne pratique est :",
        options: ["Supprimer imm\xE9diatement", "Accueillir sans exc\xE8s, passer en priv\xE9, r\xE9soudre, puis r\xE9ponse publique br\xE8ve", "Ignorer une semaine", "R\xE9pondre avec ironie"],
        answer: 1,
        explanation: "La r\xE9ponse publique lue par les futurs visiteurs : accueil pos\xE9, r\xE9solution en priv\xE9, trace publique br\xE8ve \u2014 la marque est jug\xE9e sur ce comportement."
      },
      {
        prompt: "Que contient le rapport mensuel d'une page \xE0 un client ?",
        options: ["Uniquement le nombre d'abonn\xE9s", "Chiffres cl\xE9s, top 3 des publications, actions r\xE9alis\xE9es, 3 recommandations", "Toutes les captures d'\xE9cran du mois", "Un po\xE8me de motivation"],
        answer: 1,
        explanation: "Une page : chiffres de t\xEAte avec \xE9volution, top 3 comment\xE9, actions r\xE9alis\xE9es et 3 recommandations concr\xE8tes pour le mois suivant."
      }
    ]
  },
  {
    courseSlug: "bureautique-essentielle",
    title: "Examen final \u2014 Bureautique essentielle",
    passScore: 70,
    questions: [
      {
        prompt: "La r\xE8gle de sauvegarde 3-2-1 signifie :",
        options: ["3 copies, 2 supports diff\xE9rents, 1 copie hors site (cloud)", "3 dossiers, 2 disques, 1 mot de passe", "Sauvegarder 3 fois par jour", "3 ordinateurs au minimum"],
        answer: 0,
        explanation: "Trois copies des fichiers importants, sur deux supports diff\xE9rents, dont une hors site : le cloud prot\xE8ge du vol et de la panne."
      },
      {
        prompt: "Quel raccourci annule la derni\xE8re action dans presque tous les logiciels ?",
        options: ["Ctrl+Z", "Ctrl+S", "Ctrl+F", "Alt+Tab"],
        answer: 0,
        explanation: "Ctrl+Z est \xAB le bouton le plus important de l'informatique \xBB : annuler. Ctrl+S enregistre, Ctrl+F cherche, Alt+Tab bascule entre fen\xEAtres."
      },
      {
        prompt: "Pourquoi utiliser les styles (Titre 1, Titre 2) dans Word plut\xF4t que la mise en forme manuelle ?",
        options: ["Pour la couleur", "Le sommaire automatique et la coh\xE9rence en d\xE9pendent directement", "Pour \xE9conomiser de l'encre", "Par tradition"],
        answer: 1,
        explanation: "Les styles alimentent le sommaire automatique et garantissent la coh\xE9rence : modifier le style une fois met \xE0 jour tout le document."
      },
      {
        prompt: "Le publipostage sert \xE0 :",
        options: ["Envoyer un e-mail en copie cach\xE9e", "G\xE9n\xE9rer automatiquement des documents personnalis\xE9s \xE0 partir d'une liste (Excel)", "Corriger l'orthographe", "Imprimer en recto verso"],
        answer: 1,
        explanation: "Document mod\xE8le + liste de donn\xE9es : Word g\xE9n\xE8re 100 lettres, \xE9tiquettes ou certificats personnalis\xE9s en quelques minutes."
      },
      {
        prompt: "Dans Excel, une formule commence toujours par :",
        options: ["Le signe =", "Le signe #", "Une majuscule", "Le mot FORMULE"],
        answer: 0,
        explanation: 'Toute formule Excel d\xE9bute par le signe = : =SOMME(B2:B31), =SI(D2>=500000;"Atteint";"En cours")\u2026'
      },
      {
        prompt: "Quelle fonction compte les cellules qui remplissent un crit\xE8re ?",
        options: ["NB.SI", "SOMME", "MOYENNE", "MAX"],
        answer: 0,
        explanation: '=NB.SI(B2:B100;"Pay\xE9") compte les cellules correspondant au crit\xE8re \u2014 la base des tableaux de bord simples.'
      },
      {
        prompt: "\xC0 quoi sert le symbole $ dans une r\xE9f\xE9rence comme $F$1 ?",
        options: ["\xC0 afficher des francs CFA", "\xC0 figer la r\xE9f\xE9rence quand on recopie la formule", "\xC0 rendre la cellule invisible", "\xC0 multiplier"],
        answer: 1,
        explanation: "Le $ fige colonne et/ou ligne : en recopiant la formule, toutes les cellules pointent toujours vers le m\xEAme taux, le m\xEAme coefficient."
      },
      {
        prompt: "Quel type de graphique choisir pour montrer une \xE9volution dans le temps ?",
        options: ["Le graphique en ligne", "Le camembert", "L'histogramme 3D", "Le nuage de mots"],
        answer: 0,
        explanation: "La ligne montre l'\xE9volution temporelle ; les colonnes comparent des cat\xE9gories ; le camembert (5-6 parts max) montre une r\xE9partition."
      },
      {
        prompt: "La r\xE8gle d'or d'une diapositive PowerPoint est :",
        options: ["Une id\xE9e par slide, 20 mots maximum", "Tout le discours \xE9crit en petit", "Le maximum d'animations", "Une police par slide"],
        answer: 0,
        explanation: "Une id\xE9e par diapositive, peu de mots : si tout est \xE9crit, l'audience lit au lieu d'\xE9couter \u2014 et vous devenez un lecteur \xE0 voix haute."
      },
      {
        prompt: "Pour travailler \xE0 plusieurs sur un document, la bonne pratique est :",
        options: ["S'envoyer des pi\xE8ces jointes \xAB final-v3-corrig\xE9 \xBB", "Partager un lien cloud avec des droits d\xE9finis (consulter/modifier)", "Travailler chacun sur sa version", "Imprimer et recopier"],
        answer: 1,
        explanation: "Le lien cloud (Drive, OneDrive) avec droits choisis garde une version unique, un historique restaurable et des commentaires en marge."
      }
    ]
  },
  {
    courseSlug: "identite-de-marque",
    title: "Examen final \u2014 Identit\xE9 de marque",
    passScore: 70,
    questions: [
      {
        prompt: "Le positionnement d'une marque se formule avec :",
        options: ["Un slogan po\xE9tique", "La formule : pour [cible], [marque] est [cat\xE9gorie] qui [b\xE9n\xE9fice], parce que [preuve]", "Une liste de prix", "Le logo seul"],
        answer: 1,
        explanation: "Le positionnement d\xE9finit la place unique dans l'esprit du client : cible, cat\xE9gorie, b\xE9n\xE9fice cl\xE9, preuve \u2014 avant tout dessin."
      },
      {
        prompt: "Combien d'adjectifs pr\xE9cis d\xE9finissent une personnalit\xE9 de marque ?",
        options: ["3 \xE0 5, pr\xE9cis et distinctifs", "\xAB Moderne \xBB et \xAB professionnel \xBB suffisent", "Aucun, la marque improvise", "20 pour couvrir tout"],
        answer: 0,
        explanation: "3 \xE0 5 adjectifs pr\xE9cis (\xAB directe et chaleureuse, avec une pointe d'audace \xBB) deviennent la r\xE9f\xE9rence de chaque d\xE9cision visuelle et verbale."
      },
      {
        prompt: "\xC0 quoi sert l'audit concurrentiel avant la cr\xE9ation ?",
        options: ["\xC0 copier le leader", "\xC0 rep\xE9rer les codes du secteur et les espaces libres pour se diff\xE9rencier", "\xC0 calculer les salaires", "\xC0 remplir un site web"],
        answer: 1,
        explanation: "L'audit montre les codes \xE0 conna\xEEtre et les espaces libres : si tous sont bleus et sobres, un accent affirm\xE9 rend imm\xE9diatement identifiable."
      },
      {
        prompt: "Le test de la silhouette consiste \xE0 :",
        options: ["Imprimer le logo en grand", "Noircir le logo : la forme doit rester reconnaissable", "Le tester au t\xE9l\xE9phone", "Mesurer son poids en Ko"],
        answer: 1,
        explanation: "Noirci, un bon logo reste reconnaissable : la forme porte l'identit\xE9, pas la couleur ni les effets."
      },
      {
        prompt: "Combien de pistes de logo pr\xE9sente-t-on au client ?",
        options: ["Trois directions s\xE9rieuses, pas trente", "Trente pour faire plaisir", "Une seule, sans discussion", "Aucune, on livre direct"],
        answer: 0,
        explanation: "Trois pistes distinctes permettent de choisir un cap ; trente variantes d'une m\xEAme id\xE9e produisent une r\xE9union confuse et un logo moyen."
      },
      {
        prompt: "Quel fichier permet \xE0 un logo de rester net \xE0 toutes les tailles ?",
        options: ["Le JPG", "Le SVG / PDF vectoriel", "Le screenshot", "Le GIF"],
        answer: 1,
        explanation: "Le vectoriel (SVG, PDF, EPS) repose sur des formes math\xE9matiques : net du favicon \xE0 la b\xE2che. Livrez aussi des PNG transparents."
      },
      {
        prompt: "La zone de protection d'un logo est :",
        options: ["Un cadre imprim\xE9", "Un espace vide minimum autour du logo qu'aucun \xE9l\xE9ment n'empi\xE8te", "Un mot de passe", "Le fond de la page"],
        answer: 1,
        explanation: "Le logo s'entoure d'un vide minimum (souvent la hauteur d'une lettre du nom) : c'est ce qui pr\xE9serve sa lisibilit\xE9 sur tout support."
      },
      {
        prompt: "Que doit contenir une charte graphique d'une page ?",
        options: ["Palette cod\xE9e, polices, usages du logo et interdits", "Seulement le logo", "L'historique de l'entreprise", "Les contrats clients"],
        answer: 0,
        explanation: "La page unique : couleurs (HEX/CMJN), deux polices avec hi\xE9rarchie, r\xE8gles et interdits du logo. Le livre complet vient avec la croissance."
      },
      {
        prompt: "Pourquoi chaque r\xE8gle de charte doit-elle \xEAtre illustr\xE9e \xAB \xE0 faire / \xE0 ne pas faire \xBB ?",
        options: ["Pour remplir le document", "La r\xE8gle illustr\xE9e est comprise m\xEAme par les non-cr\xE9atifs", "Par tradition juridique", "Pour doubler le nombre de pages"],
        answer: 1,
        explanation: "L'exemple fait et l'exemple d\xE9fendu rendent la r\xE8gle visuelle : un community manager ou un imprimeur l'applique correctement sans formation."
      },
      {
        prompt: "Comment corriger un logo qui change de couleur sur chaque support ?",
        options: ["Redessiner tout", "Revenir \xE0 la charte et redistribuer les fichiers officiels \xE0 tous les producteurs", "Changer de nom", "Supprimer les r\xE9seaux"],
        answer: 1,
        explanation: "Le logo-cam\xE9l\xE9on se soigne par la charte : redistribuer les fichiers officiels + gabarits verrouill\xE9s + audit trimestriel de coh\xE9rence."
      }
    ]
  },
  {
    courseSlug: "photo-video-smartphone",
    title: "Examen final \u2014 Photo & vid\xE9o au smartphone",
    passScore: 70,
    questions: [
      {
        prompt: "La r\xE8gle la plus rentable en photo : placer le sujet\u2026",
        options: ["Dos \xE0 la fen\xEAtre", "Face \xE0 la source de lumi\xE8re (fen\xEAtre, porte ouverte)", "Sous le soleil de midi", "Dans le noir complet"],
        answer: 1,
        explanation: "Un sujet face \xE0 la lumi\xE8re obtient un rendu doux et uniforme. Le contre-jour et le midi dur sont des choix volontaires, jamais des accidents."
      },
      {
        prompt: "Quelle est la meilleure heure pour photographier en ext\xE9rieur ?",
        options: ["L'heure dor\xE9e (apr\xE8s le lever, avant le coucher)", "12 h 00 en plein soleil", "Nuit sans lumi\xE8re", "Peu importe"],
        answer: 0,
        explanation: "L'heure dor\xE9e offre une lumi\xE8re chaude et des ombres longues. \xC0 midi, la lumi\xE8re verticale creuse les yeux : passez \xE0 l'ombre."
      },
      {
        prompt: "La r\xE8gle des tiers consiste \xE0 :",
        options: ["Diviser l'image en trois couleurs", "Placer le sujet sur les intersections de la grille, pas au centre exact", "Prendre trois photos", "Filmer en trois plans"],
        answer: 1,
        explanation: "Activez la grille de l'appareil et placez le sujet sur une intersection : l'image respire et l'\u0153il circule naturellement."
      },
      {
        prompt: "Pourquoi nettoyer l'objectif avant chaque session ?",
        options: ["Par hygi\xE8ne", "La lentille graiss\xE9e dans la poche floute toute la journ\xE9e \u2014 c'est LE conseil le plus rentable", "Pour la garantie", "Pour le zoom"],
        answer: 1,
        explanation: "Le t\xE9l\xE9phone vit dans la poche : un chiffon doux sur la lentille avant de shooter am\xE9liore instantan\xE9ment toutes les photos."
      },
      {
        prompt: "Le zoom num\xE9rique d'un t\xE9l\xE9phone :",
        options: ["Am\xE9liore la qualit\xE9", "D\xE9truit la qualit\xE9 : rapprochez-vous physiquement", "Est indispensable", "Change la lumi\xE8re"],
        answer: 1,
        explanation: "Le zoom num\xE9rique agrandit les pixels au lieu d'opter pour une vraie focale : rapprochez-vous du sujet, toujours."
      },
      {
        prompt: "Dans une vid\xE9o verticale, que se passe-t-il dans les 2 premi\xE8res secondes ?",
        options: ["Rien d'important", "Tout : le hook d\xE9cide si le spectateur reste ou d\xE9file", "On attend la musique", "On pr\xE9sente le logo"],
        answer: 1,
        explanation: "Le hook (r\xE9sultat d'abord, question choquante, avant/apr\xE8s) retient l'attention : la compl\xE9tion du visionnage est le signal que l'algorithme r\xE9compense."
      },
      {
        prompt: "Quelle est la meilleure d\xE9pense audio pour d\xE9buter ?",
        options: ["Un micro-cravate filaire (10 000-15 000 FCFA)", "Une enceinte Bluetooth", "Un logiciel payant", "Rien, le son ne compte pas"],
        answer: 0,
        explanation: "Le spectateur pardonne une image moyenne, jamais un son mauvais : le micro-cravate est la moiti\xE9 de la qualit\xE9 per\xE7ue."
      },
      {
        prompt: "Le rythme d'une vid\xE9o se construit au montage en :",
        options: ["Ajoutant des effets partout", "Coupant : une action par plan, 2 \xE0 4 secondes, z\xE9ro temps mort", "Ralentissant tout", "Filmant plus longtemps"],
        answer: 1,
        explanation: "Le rythme se cr\xE9e en enlevant : plans courts, une action chacun, silences supprim\xE9s. 20 secondes denses battent 90 secondes dilu\xE9es."
      },
      {
        prompt: "O\xF9 placer les sous-titres pour qu'ils restent lisibles ?",
        options: ["Tout en bas, sous l'interface", "Centre-bas, au-dessus des zones d'interface, avec ombre ou fond l\xE9ger", "En haut \xE0 gauche, minuscules", "N'importe o\xF9"],
        answer: 1,
        explanation: "Centre-bas mais au-dessus des boutons d'interface, 4 \xE0 7 mots par bloc, style constant : la lecture doit rester instantan\xE9e."
      },
      {
        prompt: "Pour la musique d'une vid\xE9o destin\xE9e \xE0 un client :",
        options: ["N'importe quelle chanson \xE0 la mode", "Une banque libre de droits ou la biblioth\xE8que de la plateforme \u2014 jamais de tube commercial", "Du silence", "Enregistrer la radio"],
        answer: 1,
        explanation: "Une chanson commerciale sur un usage commercial peut co\xFBter la suppression du son ou du compte : banques libres de droits uniquement."
      }
    ]
  }
];

// src/lib/academy/index.ts
var ACADEMY_MODULES = [...MODULES_1_4, ...MODULES_5_8];
var FLAGSHIP_SKILLS = [
  "Comprendre comment fonctionne le web et choisir le bon type de site",
  "R\xE9diger un cahier des charges et maquetter son projet comme une agence",
  "\xC9crire du HTML propre et s\xE9mantique (textes, images, formulaires)",
  "Mettre en page avec CSS et Flexbox, parfaitement sur mobile",
  "Construire des palettes, des typographies et des composants professionnels",
  "Choisir entre code, WordPress et no-code en connaissance de cause",
  "Mettre un site en ligne avec domaine, h\xE9bergement et HTTPS",
  "Trouver des clients et chiffrer des devis rentables"
];
var FLAGSHIP_COURSE = {
  ...COURSE_META,
  skills: FLAGSHIP_SKILLS,
  modules: ACADEMY_MODULES
};
var ACADEMY_COURSES = [
  FLAGSHIP_COURSE,
  COURSE_DESIGN,
  COURSE_COMMUNITY,
  COURSE_BUREAUTIQUE,
  COURSE_MARQUE,
  COURSE_PHOTO
];
var ACADEMY_QUIZ = {
  title: "Examen final \u2014 Certification RodLab",
  passScore: 70,
  questions: QUIZ_QUESTIONS
};
var ACADEMY_QUIZZES = [
  { courseSlug: FLAGSHIP_COURSE.slug, ...ACADEMY_QUIZ },
  ...CATALOG_QUIZZES
];
function quizSeedForCourse(slug) {
  return ACADEMY_QUIZZES.find((q) => q.courseSlug === slug);
}
var TOTAL_LESSONS = ACADEMY_MODULES.reduce((n, mod) => n + mod.lessons.length, 0);
var TOTAL_MINUTES = ACADEMY_MODULES.reduce((n, mod) => n + mod.minutes, 0);
var TOTAL_LESSONS_CATALOG = ACADEMY_COURSES.reduce(
  (n, c) => n + c.modules.reduce((m2, mod) => m2 + mod.lessons.length, 0),
  0
);

// src/lib/demo-seed.ts
var d = (daysFromNow) => new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1e3);
var m = (monthOffset, day = 5, hour = 10) => {
  const now = /* @__PURE__ */ new Date();
  return new Date(now.getFullYear(), now.getMonth() + monthOffset, day, hour, 30);
};
async function seedDemoData(db) {
  console.log("[seed] Nettoyage de la base\u2026");
  await db.notification.deleteMany();
  await db.pushSubscription.deleteMany();
  await db.teamMember.deleteMany();
  await db.message.deleteMany();
  await db.lessonProgress.deleteMany();
  await db.quizAttempt.deleteMany();
  await db.certificate.deleteMany();
  await db.enrollment.deleteMany();
  await db.liveRegistration.deleteMany();
  await db.liveSession.deleteMany();
  await db.quizQuestion.deleteMany();
  await db.quiz.deleteMany();
  await db.courseModule.deleteMany();
  await db.course.deleteMany();
  await db.projectTask.deleteMany();
  await db.invoice.deleteMany();
  await db.quote.deleteMany();
  await db.project.deleteMany();
  await db.quoteRequest.deleteMany();
  await db.siteContent.deleteMany();
  await db.user.deleteMany();
  const passwordHash = await import_bcryptjs.default.hash("demo1234", 12);
  console.log("[seed] Cr\xE9ation des comptes\u2026");
  const admin = await db.user.create({
    data: {
      name: "Awa Kodjo",
      email: "admin@rodlabstudio.tg",
      passwordHash,
      role: "ADMIN",
      jobTitle: "Directrice de production",
      phone: "+228 70 08 86 68",
      city: "Lom\xE9",
      avatarColor: "#276144"
    }
  });
  await db.user.create({
    data: {
      name: "K.A.S. Rodrigue",
      email: "directeur@rodlabstudio.tg",
      passwordHash,
      role: "ADMIN",
      jobTitle: "Fondateur & Directeur cr\xE9atif",
      phone: "+228 96 32 79 92",
      city: "Lom\xE9",
      avatarColor: "#bd4f2b"
    }
  });
  const kossi = await db.user.create({
    data: {
      name: "Kossi Am\xE9gan",
      email: "kossi@chezkossi.tg",
      passwordHash,
      role: "CLIENT",
      jobTitle: "Restaurateur",
      phone: "+228 90 11 22 33",
      address: "Bd du 13 Janvier, Tokoin",
      city: "Lom\xE9",
      country: "Togo",
      avatarColor: "#b98224"
    }
  });
  const ayaba = await db.user.create({
    data: {
      name: "Ayaba Tetteh",
      email: "ayaba@adjale-boutique.tg",
      passwordHash,
      role: "CLIENT",
      jobTitle: "Fondatrice",
      phone: "+228 91 45 67 89",
      city: "Lom\xE9",
      country: "Togo",
      avatarColor: "#1b6fa8"
    }
  });
  const palma = await db.user.create({
    data: {
      name: "S\xE9v\xE9rin Lawson",
      email: "contact@hotelpalma.tg",
      passwordHash,
      role: "ENTREPRISE",
      jobTitle: "Directeur g\xE9n\xE9ral",
      companyName: "H\xF4tel Palma Lom\xE9",
      phone: "+228 22 21 45 67",
      address: "Route d'An\xE9ho, Agbal\xE9p\xE9dogan",
      city: "Lom\xE9",
      country: "Togo",
      avatarColor: "#7c3aed"
    }
  });
  const comptable = await db.user.create({
    data: {
      name: "Ekou\xE9 Badji",
      email: "comptabilite@hotelpalma.tg",
      passwordHash,
      role: "CLIENT",
      jobTitle: "Responsable comptable",
      companyName: "H\xF4tel Palma Lom\xE9",
      city: "Lom\xE9",
      avatarColor: "#be185d"
    }
  });
  console.log("[seed] \xC9quipe de l'entreprise\u2026");
  await db.teamMember.createMany({
    data: [
      {
        ownerId: palma.id,
        userId: comptable.id,
        name: "Ekou\xE9 Badji",
        email: "comptabilite@hotelpalma.tg",
        phone: "+228 90 88 77 66",
        position: "Responsable comptable",
        status: "ACTIVE",
        joinedAt: m(-4, 12)
      },
      {
        ownerId: palma.id,
        name: "Mireille Dossou",
        email: "mireille.dossou@hotelpalma.tg",
        position: "Responsable marketing",
        status: "INVITED"
      },
      {
        ownerId: palma.id,
        name: "Tchala Bodjona",
        email: "tchala.bodjona@hotelpalma.tg",
        phone: "+228 93 22 44 66",
        position: "Chef r\xE9ception",
        status: "SUSPENDED"
      }
    ]
  });
  console.log("[seed] Projets\u2026");
  const pPalmaWeb = await db.project.create({
    data: {
      title: "Site web & moteur de r\xE9servation",
      description: "Conception et d\xE9veloppement du nouveau site de l'h\xF4tel avec moteur de r\xE9servation int\xE9gr\xE9, paiement Mobile Money et version trilingue (fran\xE7ais, anglais, \xE9w\xE9).",
      serviceType: "developpement-numerique",
      status: "IN_PROGRESS",
      progress: 65,
      budget: 28e5,
      clientId: palma.id,
      startDate: m(-3, 2),
      deadline: d(21)
    }
  });
  const pPalmaIdentite = await db.project.create({
    data: {
      title: "Refonte de l'identit\xE9 visuelle",
      description: "Modernisation du logo, cr\xE9ation de la charte graphique compl\xE8te et d\xE9clinaisons sur tous les supports de l'h\xF4tel : signal\xE9tique, papeterie, uniformes et menus.",
      serviceType: "design-graphique",
      status: "REVIEW",
      progress: 90,
      budget: 95e4,
      clientId: palma.id,
      startDate: m(-4, 10),
      deadline: d(7)
    }
  });
  const pKossiMenu = await db.project.create({
    data: {
      title: "Menu digital & QR code",
      description: "Cr\xE9ation d'un menu digital consultable par QR code, avec photos des plats, prix mis \xE0 jour en temps r\xE9el et version anglaise pour la client\xE8le touristique.",
      serviceType: "design-graphique",
      status: "DELIVERED",
      progress: 100,
      budget: 45e4,
      clientId: kossi.id,
      startDate: m(-6, 8),
      deadline: m(-5, 8),
      deliveredAt: m(-5, 6)
    }
  });
  const pKossiSocial = await db.project.create({
    data: {
      title: "Campagne r\xE9seaux sociaux \u2014 3 mois",
      description: "Gestion \xE9ditoriale et visuelle des pages Facebook et Instagram du restaurant : 12 publications mensuelles, visuels saisonniers et reporting mensuel.",
      serviceType: "community-management",
      status: "IN_PROGRESS",
      progress: 40,
      budget: 9e5,
      clientId: kossi.id,
      startDate: m(-1, 15),
      deadline: d(45)
    }
  });
  const pAdjaleEcom = await db.project.create({
    data: {
      title: "Boutique e-commerce Adjal\xE9",
      description: "D\xE9veloppement d'une boutique en ligne de pagnes et accessoires : catalogue 120 r\xE9f\xE9rences, paiement T-Money/Visa, livraison Lom\xE9 & r\xE9gions, espace administrateur.",
      serviceType: "developpement-numerique",
      status: "IN_PROGRESS",
      progress: 55,
      budget: 165e4,
      clientId: ayaba.id,
      startDate: m(-2, 20),
      deadline: d(30)
    }
  });
  const pAdjaleFormation = await db.project.create({
    data: {
      title: "Formation community management",
      description: "Formation intensive de 2 semaines pour l'\xE9quipe de la boutique : strat\xE9gie de contenu, prise de vue produit, publicit\xE9s Meta et service client en ligne.",
      serviceType: "formation",
      status: "PENDING",
      progress: 0,
      budget: 25e4,
      clientId: ayaba.id,
      deadline: d(60)
    }
  });
  const pKodjoLogo = await db.project.create({
    data: {
      title: "Logo & charte clinique dentaire",
      description: "Identit\xE9 visuelle compl\xE8te pour la clinique : logo, carte de visite, ordonnances en-t\xEAte et fa\xE7ade lumineuse.",
      serviceType: "design-graphique",
      status: "DELIVERED",
      progress: 100,
      budget: 6e5,
      clientId: kossi.id,
      startDate: m(-8, 3),
      deadline: m(-7, 3),
      deliveredAt: m(-7, 1)
    }
  });
  console.log("[seed] T\xE2ches des projets\u2026");
  await db.projectTask.createMany({
    data: [
      { projectId: pPalmaWeb.id, title: "Wireframes & maquettes valid\xE9es", done: true, order: 1 },
      { projectId: pPalmaWeb.id, title: "Int\xE9gration front-end", done: true, order: 2 },
      { projectId: pPalmaWeb.id, title: "Moteur de r\xE9servation", done: true, order: 3 },
      { projectId: pPalmaWeb.id, title: "Paiement Mobile Money", done: false, order: 4 },
      { projectId: pPalmaWeb.id, title: "Recette & mise en ligne", done: false, order: 5 },
      { projectId: pPalmaIdentite.id, title: "Recherche cr\xE9ative", done: true, order: 1 },
      { projectId: pPalmaIdentite.id, title: "Logo finalis\xE9", done: true, order: 2 },
      { projectId: pPalmaIdentite.id, title: "Charte graphique", done: true, order: 3 },
      { projectId: pPalmaIdentite.id, title: "Validation direction", done: false, order: 4 },
      { projectId: pAdjaleEcom.id, title: "Catalogue import\xE9", done: true, order: 1 },
      { projectId: pAdjaleEcom.id, title: "Paiement T-Money", done: true, order: 2 },
      { projectId: pAdjaleEcom.id, title: "Module livraison", done: false, order: 3 },
      { projectId: pAdjaleEcom.id, title: "Tests utilisateurs", done: false, order: 4 },
      { projectId: pKossiSocial.id, title: "Mois 1 \u2014 publications livr\xE9es", done: true, order: 1 },
      { projectId: pKossiSocial.id, title: "Mois 2 \u2014 publications livr\xE9es", done: false, order: 2 }
    ]
  });
  console.log("[seed] Devis\u2026");
  const items = (rows) => JSON.stringify(rows.map(([label, qty, unitPrice]) => ({ label, qty, unitPrice })));
  const qPalmaResa = await db.quote.create({
    data: {
      number: "DV-2026-001",
      title: "Site web & moteur de r\xE9servation",
      clientId: palma.id,
      projectId: pPalmaWeb.id,
      items: items([
        ["Design UX/UI (10 \xE9crans)", 1, 45e4],
        ["D\xE9veloppement front + back", 1, 185e4],
        ["Moteur de r\xE9servation", 1, 4e5],
        ["Formation des \xE9quipes", 1, 1e5]
      ]),
      subtotal: 28e5,
      taxRate: 18,
      taxAmount: 504e3,
      total: 3304e3,
      status: "ACCEPTED",
      validUntil: m(-3, 1),
      decidedAt: m(-3, 2),
      createdAt: m(-4, 1)
    }
  });
  const qKossiMenu = await db.quote.create({
    data: {
      number: "DV-2026-002",
      title: "Menu digital & QR code",
      clientId: kossi.id,
      projectId: pKossiMenu.id,
      items: items([
        ["Design du menu digital", 1, 25e4],
        ["Shooting photo des plats (20 plats)", 1, 15e4],
        ["Mise en place QR code", 1, 5e4]
      ]),
      subtotal: 45e4,
      taxRate: 18,
      taxAmount: 81e3,
      total: 531e3,
      status: "ACCEPTED",
      validUntil: m(-6, 1),
      decidedAt: m(-6, 7),
      createdAt: m(-6, 2)
    }
  });
  const qAdjaleEcom = await db.quote.create({
    data: {
      number: "DV-2026-003",
      title: "Boutique e-commerce Adjal\xE9",
      clientId: ayaba.id,
      projectId: pAdjaleEcom.id,
      items: items([
        ["Boutique en ligne (120 r\xE9f\xE9rences)", 1, 12e5],
        ["Paiement mobile & carte", 1, 25e4],
        ["Module livraison", 1, 2e5]
      ]),
      subtotal: 165e4,
      taxRate: 18,
      taxAmount: 297e3,
      total: 1947e3,
      status: "ACCEPTED",
      validUntil: m(-2, 15),
      decidedAt: m(-2, 18),
      createdAt: m(-2, 12)
    }
  });
  await db.quote.create({
    data: {
      number: "DV-2026-004",
      title: "Formation community management",
      clientId: ayaba.id,
      projectId: pAdjaleFormation.id,
      items: items([
        ["Formation 2 semaines (5 personnes)", 1, 2e5],
        ["Support de cours & exercices", 1, 5e4]
      ]),
      subtotal: 25e4,
      taxRate: 18,
      taxAmount: 45e3,
      total: 295e3,
      status: "SENT",
      validUntil: d(12),
      createdAt: m(0, 2)
    }
  });
  const qKossiSocial = await db.quote.create({
    data: {
      number: "DV-2026-005",
      title: "Campagne r\xE9seaux sociaux \u2014 3 mois",
      clientId: kossi.id,
      projectId: pKossiSocial.id,
      items: items([
        ["Package mensuel (12 posts + stories)", 3, 25e4],
        ["Reporting mensuel", 3, 5e4]
      ]),
      subtotal: 9e5,
      taxRate: 18,
      taxAmount: 162e3,
      total: 1062e3,
      status: "ACCEPTED",
      validUntil: m(-1, 10),
      decidedAt: m(-1, 13),
      createdAt: m(-1, 8)
    }
  });
  await db.quote.create({
    data: {
      number: "DV-2026-006",
      title: "Application fid\xE9lit\xE9 Chez Kossi",
      clientId: kossi.id,
      items: items([
        ["Application mobile fid\xE9lit\xE9", 1, 16e5],
        ["Backend & tableau de bord", 1, 9e5]
      ]),
      subtotal: 25e5,
      taxRate: 18,
      taxAmount: 45e4,
      total: 295e4,
      status: "SENT",
      validUntil: d(20),
      createdAt: m(0, 8)
    }
  });
  console.log("[seed] Factures\u2026");
  const inv = (number, clientId, projectId, quoteId, amount, status, issue, due, paid, method) => db.invoice.create({
    data: {
      number,
      clientId,
      projectId,
      quoteId,
      amount,
      taxRate: 18,
      taxAmount: Math.round(amount * 0.18),
      total: amount + Math.round(amount * 0.18),
      status,
      issueDate: issue,
      dueDate: due,
      paidAt: paid,
      method
    }
  });
  await inv("FA-2026-001", palma.id, pPalmaWeb.id, qPalmaResa.id, 933e3, "PAID", m(-3, 3), m(-3, 18), m(-3, 15), "Virement bancaire");
  await inv("FA-2026-002", palma.id, pPalmaWeb.id, null, 1188e3, "PAID", m(-2, 5), m(-2, 20), m(-2, 19), "Virement bancaire");
  await inv("FA-2026-003", kossi.id, pKossiMenu.id, qKossiMenu.id, 531e3, "PAID", m(-5, 10), m(-5, 25), m(-5, 22), "Mobile Money");
  await inv("FA-2026-004", ayaba.id, pAdjaleEcom.id, qAdjaleEcom.id, 973500, "PAID", m(-2, 20), m(-1, 5), m(-1, 4), "Mobile Money");
  await inv("FA-2026-005", ayaba.id, pAdjaleEcom.id, null, 486750, "SENT", m(0, 1), d(14), null, null);
  await inv("FA-2026-006", kossi.id, pKossiSocial.id, qKossiSocial.id, 354e3, "PAID", m(-1, 15), m(0, 1), m(0, 1), "Esp\xE8ces");
  await inv("FA-2026-007", palma.id, pPalmaIdentite.id, null, 285e3, "OVERDUE", m(-1, 20), m(0, 4), null, null);
  console.log("[seed] Messagerie\u2026");
  await db.message.createMany({
    data: [
      {
        threadId: palma.id,
        senderId: palma.id,
        senderRole: "ENTREPRISE",
        content: "Bonjour, est-ce que le module de paiement Mobile Money sera pr\xEAt avant la mise en ligne ? Nous avons beaucoup de demandes de r\xE9servation en ce moment.",
        createdAt: m(0, 9, 9)
      },
      {
        threadId: palma.id,
        senderId: admin.id,
        senderRole: "ADMIN",
        content: "Bonjour M. Lawson ! Oui, le connecteur T-Money et Flooz est en cours de test en environnement de production simul\xE9e. Vous pourrez le valider d\xE8s la semaine prochaine lors de la recette.",
        createdAt: m(0, 9, 11)
      },
      {
        threadId: palma.id,
        senderId: palma.id,
        senderRole: "ENTREPRISE",
        content: "Parfait, merci pour la r\xE9activit\xE9. Ma comptable suivra \xE9galement la validation des factures depuis son espace.",
        createdAt: m(0, 9, 12)
      },
      {
        threadId: kossi.id,
        senderId: kossi.id,
        senderRole: "CLIENT",
        content: "Bonjour, j'ai bien re\xE7u le devis pour l'application de fid\xE9lit\xE9. Est-ce qu'on peut \xE9taler le paiement sur 3 fois ?",
        createdAt: m(0, 10, 10)
      },
      {
        threadId: kossi.id,
        senderId: admin.id,
        senderRole: "ADMIN",
        content: "Bonjour Kossi ! Bien s\xFBr, c'est possible : 40 % au d\xE9marrage, 30 % \xE0 la livraison de la version de test et 30 % \xE0 la mise en ligne. Je mets \xE0 jour le devis aujourd'hui.",
        createdAt: m(0, 10, 14)
      },
      {
        threadId: ayaba.id,
        senderId: ayaba.id,
        senderRole: "CLIENT",
        content: "La boutique avance tr\xE8s bien ! Serait-il possible d'ajouter une page \xAB Lookbook \xBB pour pr\xE9senter les nouveaut\xE9s en photos ?",
        createdAt: m(0, 11, 16)
      }
    ]
  });
  console.log("[seed] Demandes de devis\u2026");
  await db.quoteRequest.createMany({
    data: [
      {
        name: "Adjoa Sowu",
        email: "adjoa.sowu@glambeauty.tg",
        phone: "+228 92 55 66 77",
        company: "Glam Beauty Institute",
        serviceType: "design-graphique",
        budgetRange: "250 000 \u2013 500 000 FCFA",
        message: "Bonjour, nous ouvrons un institut de beaut\xE9 \xE0 Kara et nous aurions besoin d'un logo complet, de cartes de visite et d'affiches pour notre lancement pr\xE9vu dans deux mois.",
        status: "NEW",
        createdAt: m(0, 12)
      },
      {
        name: "\xC9tienne Gbedemah",
        email: "etienne@transportsexpress.tg",
        phone: "+228 90 34 56 78",
        company: "Transports Express Togo",
        serviceType: "developpement-numerique",
        budgetRange: "1 000 000 \u2013 3 000 000 FCFA",
        message: "Nous cherchons \xE0 digitaliser le suivi de nos livraisons : une application o\xF9 les clients peuvent suivre leurs colis en temps r\xE9el et payer en mobile money.",
        status: "IN_REVIEW",
        notes: "Potentiel int\xE9ressant \u2014 proposer un MVP en 2 phases. RDV visio \xE0 planifier.",
        createdAt: m(0, 10)
      },
      {
        name: "Fafa Nyante",
        email: "fafa.nyante@gmail.com",
        phone: "+228 91 78 90 12",
        serviceType: "formation",
        budgetRange: "Moins de 250 000 FCFA",
        message: "\xC9tudiante en marketing, je souhaite suivre la formation en design graphique \xE0 temps partiel. Quelles sont les prochaines dates de session et les modalit\xE9s de paiement ?",
        status: "NEW",
        createdAt: m(0, 13)
      },
      {
        name: "Yao Mensah",
        email: "yao.mensah@agroterroir.tg",
        phone: "+228 90 23 45 67",
        company: "Agro Terroir",
        serviceType: "design-graphique",
        budgetRange: "500 000 \u2013 1 000 000 FCFA",
        message: "Refonte de nos \xE9tiquettes de produits alimentaires pour l'export r\xE9gional.",
        status: "CONVERTED",
        convertedUserId: kossi.id,
        convertedProjectId: pKossiMenu.id,
        handledAt: m(-5, 7),
        createdAt: m(-5, 5)
      },
      {
        name: "Comit\xE9 d'organisation FESPOL",
        email: "contact@fespol2026.tg",
        serviceType: "design-graphique",
        budgetRange: "250 000 \u2013 500 000 FCFA",
        message: "Demande d'affiche officielle et de kak\xE9monos pour le festival du policiers 2026.",
        status: "ARCHIVED",
        notes: "Budget annul\xE9 \u2014 report\xE9 \xE0 2027.",
        handledAt: m(-4, 2),
        createdAt: m(-4, 1)
      }
    ]
  });
  console.log("[seed] Contenu du site\u2026");
  await db.siteContent.createMany({
    data: [
      { key: "hero.title", section: "hero", label: "Titre principal de l'accueil", value: "Votre vision, notre expertise.", type: "TEXT" },
      { key: "hero.subtitle", section: "hero", label: "Sous-titre de l'accueil", value: "Agence de design graphique, d\xE9veloppement num\xE9rique et formation professionnelle \xE0 Lom\xE9. Nous transformons vos id\xE9es en exp\xE9riences digitales m\xE9morables.", type: "TEXT" },
      { key: "stats.projects", section: "stats", label: "Statistique \u2014 projets livr\xE9s", value: "120", type: "NUMBER" },
      { key: "stats.clients", section: "stats", label: "Statistique \u2014 clients satisfaits", value: "65", type: "NUMBER" },
      { key: "stats.years", section: "stats", label: "Statistique \u2014 ann\xE9es d'exp\xE9rience", value: "8", type: "NUMBER" },
      { key: "stats.learners", section: "stats", label: "Statistique \u2014 apprenants form\xE9s", value: "200", type: "NUMBER" },
      { key: "contact.phone", section: "contact", label: "T\xE9l\xE9phone affich\xE9 sur le site", value: "+228 70 08 86 68", type: "TEXT" },
      { key: "contact.email", section: "contact", label: "Email affich\xE9 sur le site", value: "contact@rodlabstudio.tg", type: "TEXT" },
      { key: "contact.address", section: "contact", label: "Adresse affich\xE9e sur le site", value: "Bd du Mono, Tokoin \u2014 Lom\xE9, Togo", type: "TEXT" },
      { key: "cta.title", section: "cta", label: "Titre de l'appel \xE0 l'action", value: "Un projet en t\xEAte ? Parlons-en.", type: "TEXT" },
      { key: "cta.text", section: "cta", label: "Texte de l'appel \xE0 l'action", value: "D\xE9crivez-nous votre besoin en 2 minutes : nous revenons vers vous sous 24 h avec une premi\xE8re proposition.", type: "TEXT" }
    ]
  });
  console.log("[seed] RodLab Academy \u2014 catalogue de 6 cours, modules, le\xE7ons et quiz\u2026");
  const seededCourses = /* @__PURE__ */ new Map();
  for (const courseSeed of ACADEMY_COURSES) {
    const course = await db.course.create({
      data: {
        slug: courseSeed.slug,
        title: courseSeed.title,
        subtitle: courseSeed.subtitle,
        description: courseSeed.description,
        level: courseSeed.level,
        durationHours: courseSeed.durationHours,
        skills: JSON.stringify(courseSeed.skills),
        published: true
      }
    });
    const lessonIds = /* @__PURE__ */ new Map();
    for (const mod of courseSeed.modules) {
      const createdModule = await db.courseModule.create({
        data: {
          courseId: course.id,
          order: mod.order,
          title: mod.title,
          summary: mod.summary,
          minutes: mod.minutes,
          lessons: {
            create: mod.lessons.map((les) => ({
              order: les.order,
              title: les.title,
              minutes: les.minutes,
              content: les.content
            }))
          }
        },
        include: { lessons: true }
      });
      for (const les of createdModule.lessons) {
        lessonIds.set(`${mod.order}-${les.order}`, les.id);
      }
    }
    const quizSeed = quizSeedForCourse(courseSeed.slug);
    let quizId = null;
    if (quizSeed) {
      const quiz = await db.quiz.create({
        data: {
          courseId: course.id,
          title: quizSeed.title,
          passScore: quizSeed.passScore,
          questions: {
            create: quizSeed.questions.map((q, i) => ({
              order: i + 1,
              prompt: q.prompt,
              options: JSON.stringify(q.options),
              answer: q.answer,
              explanation: q.explanation
            }))
          }
        }
      });
      quizId = quiz.id;
    }
    seededCourses.set(courseSeed.slug, { id: course.id, slug: course.slug, lessonIds, quizId });
  }
  console.log("[seed] Academy \u2014 parcours de d\xE9monstration\u2026");
  const webCourse = seededCourses.get("site-web-professionnel");
  const enrAyaba = await db.enrollment.create({
    data: { userId: ayaba.id, courseId: webCourse.id, status: "COMPLETED", startedAt: d(-25), completedAt: d(-12) }
  });
  const allLessons = Array.from(webCourse.lessonIds.values());
  await db.lessonProgress.createMany({
    data: allLessons.map((lessonId, i) => ({
      userId: ayaba.id,
      lessonId,
      completedAt: d(-25 + Math.floor(i * 13 / allLessons.length))
    }))
  });
  await db.quizAttempt.create({
    data: {
      userId: ayaba.id,
      quizId: webCourse.quizId,
      enrollmentId: enrAyaba.id,
      answers: "{}",
      score: 88,
      correct: 21,
      total: ACADEMY_QUIZ.questions.length,
      passed: true,
      createdAt: d(-12)
    }
  });
  await db.certificate.create({
    data: {
      code: "RODLAB-WEB-A7K2MQ",
      userId: ayaba.id,
      courseId: webCourse.id,
      enrollmentId: enrAyaba.id,
      score: 88,
      holderName: ayaba.name,
      issuedAt: d(-12)
    }
  });
  await db.enrollment.create({
    data: { userId: kossi.id, courseId: webCourse.id, status: "ACTIVE", startedAt: d(-6) }
  });
  const kossiDone = ["1-1", "1-2", "1-3", "2-1"];
  await db.lessonProgress.createMany({
    data: kossiDone.map((key, i) => ({ userId: kossi.id, lessonId: webCourse.lessonIds.get(key), completedAt: d(-6 + i) })).filter((p) => Boolean(p.lessonId))
  });
  const communityCourse = seededCourses.get("community-management");
  if (communityCourse) {
    await db.enrollment.create({
      data: { userId: kossi.id, courseId: communityCourse.id, status: "ACTIVE", startedAt: d(-3) }
    });
    const kossiCommunityDone = ["1-1", "1-2"];
    await db.lessonProgress.createMany({
      data: kossiCommunityDone.map((key, i) => ({ userId: kossi.id, lessonId: communityCourse.lessonIds.get(key), completedAt: d(-3 + i) })).filter((p) => Boolean(p.lessonId))
    });
  }
  const designCourse = seededCourses.get("design-graphique-pro");
  if (designCourse) {
    await db.enrollment.create({
      data: { userId: palma.id, courseId: designCourse.id, status: "ACTIVE", startedAt: d(-2) }
    });
  }
  console.log("[seed] RodLab Live \u2014 sessions de formation \xE0 distance\u2026");
  await db.liveSession.createMany({
    data: [
      {
        slug: "masterclass-7-erreurs-site-web",
        title: "Masterclass gratuite : les 7 erreurs qui font fuir vos visiteurs",
        summary: "En 90 minutes, d\xE9cortiquons les d\xE9fauts qui co\xFBtent des clients aux sites togolais et africains \u2014 et les correctifs concrets \xE0 appliquer d\xE8s ce soir.",
        description: "Design surcharg\xE9, textes illisibles, site lent sur 3G, absence de bouton d'action : ces erreurs sont partout, et elles co\xFBtent cher. Cette masterclass passe en revue sept d\xE9fauts observ\xE9s sur de vrais sites de la sous-r\xE9gion, avec avant/apr\xE8s \xE0 l'appui.\n\nVous repartez avec une grille de contr\xF4le de 20 points \xE0 appliquer imm\xE9diatement sur votre site ou celui de vos clients.\n\n- Public : entrepreneurs, cr\xE9ateurs de sites, responsables communication\n- Niveau requis : aucun \u2014 la masterclass est ouverte \xE0 tous\n- Un lien d'acc\xE8s Zoom est envoy\xE9 apr\xE8s inscription, 24 h avant la session\n- Replay envoy\xE9 aux inscrits qui ne peuvent pas \xEAtre pr\xE9sents",
        platform: "ZOOM",
        joinUrl: "https://zoom.us/j/rodlab-demo-masterclass",
        startsAt: d(3),
        durationMin: 90,
        status: "SCHEDULED",
        capacity: 300
      },
      {
        slug: "atelier-landing-page-90-minutes",
        title: "Atelier live : construisez votre landing page en 90 minutes",
        summary: "Atelier pratique \xE0 50 places : HTML, CSS et une m\xE9thode rod\xE9e pour publier une page d'atterrissage qui convertit \u2014 de la maquette \xE0 la mise en ligne.",
        description: "Un atelier o\xF9 l'on code ensemble, cam\xE9ra coup\xE9e ou non. Objectif : chacun repart avec sa landing page publi\xE9e sur une URL gratuite.\n\nAu programme : structure de la page qui convertit (titre, promesse, preuves, formulaire), int\xE9gration HTML/CSS guid\xE9e pas \xE0 pas, adaptation mobile, mise en ligne sur Netlify.\n\n- Pr\xE9requis : suivre les modules 3 et 4 de la formation avant l'atelier\n- Places limit\xE9es \xE0 50 pour pouvoir r\xE9pondre \xE0 tout le monde\n- Apportez vos textes et votre logo : le reste est fourni\n- Google Meet, lien envoy\xE9 apr\xE8s inscription",
        platform: "MEET",
        joinUrl: "https://meet.google.com/rodlab-atelier-demo",
        startsAt: d(10),
        durationMin: 120,
        status: "SCHEDULED",
        capacity: 50
      },
      {
        slug: "qa-vivre-du-web-afrique-ouest",
        title: "Session Q&A : vivre du web en Afrique de l'Ouest",
        summary: "K.A.S. Rodrigue, fondateur de RodLab Studio, r\xE9pond en direct \xE0 vos questions : tarifs, clients difficiles, paiements \xE0 l'international, organisation du travail.",
        description: "Une session sans sujet impos\xE9 : vos questions, des r\xE9ponses franches, issues de huit ann\xE9es d'agence \xE0 Lom\xE9.\n\nExemples de questions trait\xE9es lors des pr\xE9c\xE9dentes \xE9ditions : comment se faire payer par un client \xE0 l'\xE9tranger ? Combien facturer son premier site ? Faut-il se sp\xE9cialiser ? Comment g\xE9rer un client qui ne valide jamais ?\n\n- Diffus\xE9 en direct sur YouTube et StreamYard\n- Posez vos questions \xE0 l'avance apr\xE8s inscription ou en direct dans le chat\n- Id\xE9al aussi pour les apprenants hors Togo : horaires pens\xE9s pour l'Europe et l'Am\xE9rique du Nord",
        platform: "STREAMYARD",
        joinUrl: "https://streamyard.com/rodlab-qa-demo",
        startsAt: d(17),
        durationMin: 60,
        status: "SCHEDULED",
        capacity: 500
      },
      {
        slug: "lancement-rodlab-academy",
        title: "Lancement de RodLab Academy : la m\xE9thode RodLab expliqu\xE9e",
        summary: "La session inaugurale : pourquoi RodLab ouvre sa formation, comment fonctionne le parcours par modules, et la d\xE9monstration compl\xE8te du certificat v\xE9rifiable.",
        description: "Lors de cette session inaugurale, l'\xE9quipe RodLab a pr\xE9sent\xE9 l'Academy : la p\xE9dagogie par modules, l'examen final de 24 questions et le certificat PDF v\xE9rifiable en ligne gr\xE2ce \xE0 son code unique.\n\nLe replay complet sera publi\xE9 ici. En attendant, le parcours complet est disponible dans l'application : cr\xE9ez votre compte, suivez les modules \xE0 votre rythme, puis passez l'examen.",
        platform: "YOUTUBE",
        joinUrl: null,
        startsAt: d(-8),
        durationMin: 75,
        status: "DONE",
        capacity: 300
      }
    ]
  });
  const firstSession = await db.liveSession.findUnique({ where: { slug: "masterclass-7-erreurs-site-web" } });
  if (firstSession) {
    await db.liveRegistration.create({
      data: {
        sessionId: firstSession.id,
        userId: kossi.id,
        name: kossi.name,
        email: kossi.email,
        country: "Togo"
      }
    });
  }
  console.log("[seed] Notifications de d\xE9monstration\u2026");
  await db.notification.createMany({
    data: [
      { userId: palma.id, title: "Nouveau devis re\xE7u", body: "Devis DV-2026-004 est en attente de votre d\xE9cision.", url: "/dashboard/devis", createdAt: m(0, 8) },
      { userId: palma.id, title: "Avancement du projet", body: "\xAB Site web & moteur de r\xE9servation \xBB est maintenant \xE0 65 % d'avancement.", url: "/dashboard/projets", createdAt: m(0, 9) },
      { userId: kossi.id, title: "Paiement confirm\xE9", body: "Votre facture FA-2026-006 a \xE9t\xE9 marqu\xE9e comme pay\xE9e. Merci !", url: "/dashboard/factures", createdAt: m(0, 1) },
      { userId: admin.id, title: "Devis accept\xE9", body: "Kossi Am\xE9gan a accept\xE9 le devis DV-2026-005.", url: "/admin/devis", createdAt: m(-1, 13) }
    ]
  });
  console.log("[seed] \u2705 Donn\xE9es de d\xE9monstration cr\xE9\xE9es.");
  console.log("[seed]    Admin      : admin@rodlabstudio.tg / demo1234");
  console.log("[seed]    Client     : kossi@chezkossi.tg / demo1234");
  console.log("[seed]    Entreprise : contact@hotelpalma.tg / demo1234");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  seedDemoData
});
