import type { CourseSeed } from "./types";

/**
 * RODLAB ACADEMY — Catalogue v8.6
 * Cours 3/6 : « Community management : animez vos réseaux sociaux »
 */
export const COURSE_COMMUNITY: CourseSeed = {
  slug: "community-management",
  title: "Community management : animez vos réseaux sociaux",
  subtitle:
    "Stratégie, ligne éditoriale, contenu qui engage, publicité à petit budget et rapports clients : la méthode complète pour gérer les réseaux d'une marque comme un professionnel.",
  description:
    "Une formation 100 % pratique où vous apprenez à comprendre les plateformes et leurs algorithmes, à construire une stratégie éditoriale, à produire du contenu qui engage, à animer une communauté et à présenter des résultats chiffrés à vos clients. Vous suivez 4 modules à votre rythme, leçon par leçon, puis vous validez vos connaissances avec un examen final de 10 questions. En cas de réussite, vous obtenez un certificat RodLab Studio vérifiable et téléchargeable en PDF.",
  level: "Débutant",
  durationHours: 9,
  skills: [
    "Comprendre les usages réels de chaque plateforme",
    "Définir des cibles, une ligne éditoriale et un ton",
    "Planifier un mois de publications en quelques heures",
    "Écrire des accroches et produire des vidéos courtes qui retiennent",
    "Lancer des campagnes sponsorisées à petit budget",
    "Mesurer, interpréter et présenter des résultats à un client",
  ],
  modules: [
    {
      order: 1,
      title: "Comprendre les réseaux sociaux",
      summary:
        "Chaque plateforme a ses codes, ses audiences et son algorithme. On les décortique sans jargon pour choisir où investir votre temps — et celui de vos clients.",
      minutes: 40,
      lessons: [
        {
          order: 1,
          title: "L'écosystème : plateformes, audiences, usages locaux",
          minutes: 14,
          content:
            "Gérer des réseaux, ce n'est pas « poster partout » : c'est être au bon endroit, avec le bon format, devant les bonnes personnes. Au Togo et en Afrique de l'Ouest, WhatsApp règne en maître pour la relation client directe, Facebook reste la première plateforme publique pour toucher les 25 ans et plus, Instagram porte les univers visuels (mode, food, déco, événementiel), TikTok concentre la jeunesse et la découverte, LinkedIn relie les professionnels et les entreprises sérieuses.\n\n## Trois familles d'usage\n\n- Découverte : TikTok, Reels — l'algorithme propose votre contenu à des inconnus\n- Relation : Facebook, WhatsApp Business — la communauté et le service client\n- Crédibilité : LinkedIn, Google Business — la preuve professionnelle\n\nUn restaurant utilisera Instagram pour l'appétit visuel, WhatsApp pour les commandes, Facebook pour les événements. Une agence B2B privilégiera LinkedIn et Facebook. Choisir, c'est déjà 50 % du travail — et c'est ce qu'un client attend d'un community manager payé pour son expertise.",
        },
        {
          order: 2,
          title: "L'algorithme sans mystère : ce qui fait la portée",
          minutes: 12,
          content:
            "Un algorithme de réseau social a une seule mission : garder les utilisateurs le plus longtemps possible sur la plateforme. Il met donc en avant le contenu qui déclenche des réactions rapides — vues complètes, likes, commentaires, partages — dans les premières minutes suivant la publication.\n\n## Les signaux qui comptent vraiment\n\n- La complétion : une vidéo regardée jusqu'au bout pèse plus que 100 likes\n- La rapidité des premières réactions : publiez quand votre audience est en ligne\n- Les commentaires (et vos réponses) : la conversation prolonge la portée\n- Les partages : le signal le plus fort, surtout sur Facebook et WhatsApp\n\nLes réflexes qui en découlent : accrocher dans les 2 premières secondes d'une vidéo, poser une vraie question en légende, répondre à chaque commentaire dans l'heure qui suit, publier régulièrement plutôt que par à-coups. Aucune astuce ne remplace la régularité : l'algorithme récompense les comptes fiables qui nourrissent la plateforme.",
        },
        {
          order: 3,
          title: "Choisir ses plateformes selon son objectif",
          minutes: 14,
          content:
            "Avant de créer un compte de plus, posez la question qui change tout : que doit rapporter cette plateforme ? Des clients (vente directe), de la notoriété (être connu), de la crédibilité (être choisi quand on cherche) ? Un objectif mal défini produit des comptes fantômes avec 40 abonnés et zéro vente.\n\n## Le tableau de décision du community manager\n\n- Vendre des produits physiques → Instagram + WhatsApp Business (catalogue, statut, commandes)\n- Remplir un restaurant ou un événement → Facebook (événements, groupes locaux) + TikTok local\n- Attirer des entreprises → LinkedIn + un site vitrine sérieux\n- Devenir une référence d'expert → TikTok ou YouTube (tutoriels) + relais WhatsApp\n\nMieux vaut deux plateformes bien tenues que cinq abandonnées. Pour chaque compte tenu, définissez une fréquence réaliste (3 à 5 posts par semaine) et un indicateur de succès (messages reçus, inscriptions, ventes). C'est ce cadrage, présenté au client au départ, qui vous protège des « pourquoi on n'a pas 10 000 abonnés en un mois ? ».",
        },
      ],
    },
    {
      order: 2,
      title: "Construire sa stratégie",
      summary:
        "La stratégie transforme le posting aléatoire en présence qui travaille. Personas, ligne éditoriale, calendrier : trois outils qui font la différence entre un compte actif et un compte rentable.",
      minutes: 45,
      lessons: [
        {
          order: 1,
          title: "Cibles et personas : à qui parlez-vous vraiment ?",
          minutes: 15,
          content:
            "« Tout le monde » n'est pas une cible. Un persona est un portrait précis de votre client idéal : son âge, sa ville, son métier, ses rêves, ses frustrations, ses habitudes numériques. Quand vous écrivez pour « Fatima, 28 ans, entrepreneure à Lomé, sans temps, qui veut plus de clients » — vos posts deviennent pertinents. Quand vous écrivez pour tout le monde, ils deviennent inoffensifs, donc invisibles.\n\n## Construire trois personas en une heure\n\n- Qui est-il ? (âge, ville, métier, niveau de revenu)\n- Que cherche-t-il ? (le résultat qu'il veut, pas votre produit)\n- Qu'est-ce qui le freine ? (prix, confiance, temps,complexité perçue)\n- Où passe-t-il son temps en ligne ? (plateforme, heures de connexion)\n\nChaque contenu doit répondre à une de ces cases : une frustration levée, un désir nommé, une objection traitée. Les clients répondent d'ailleurs rarement au produit : ils répondent à la transformation. « Des photos qui donnent faim » vend mieux que « photographe professionnel avec 10 ans d'expérience ».",
        },
        {
          order: 2,
          title: "La ligne éditoriale : ton, thèmes, rythme",
          minutes: 15,
          content:
            "La ligne éditoriale est le contrat invisible entre la marque et son audience : sur quoi on s'exprime, avec quelle voix, à quelle fréquence. C'est elle qui rend un compte reconnaissable dès la deuxième ligne — avant même de voir le logo.\n\n## Les trois colonnes de contenu\n\nLa règle éprouvée des agences : répartir la production en trois colonnes. Contenu utile (conseils, tutoriels, réponses aux questions fréquentes) — environ 40 %. Contenu preuve (réalisations, avis clients, avant/après, coulisses) — environ 30 %. Contenu lien (humour local, coulisses humaines, coups de cœur, vie de l'équipe) — environ 30 %. Cette répartition fait d'un compte une ressource que l'on suit, pas une publicité que l'on fuit.\n\n- Définissez 3 à 5 mots qui décrivent le ton (ex. : chaleureux, direct, décalé)\n- Listez 5 thèmes récurrents : c'est votre garde-manger de sujets\n- Choisissez une fréquence tenable : 3 posts/semaine tenus battent 7 posts abandonnés\n- Rédigez cette ligne sur une page et faites-la valider par le client : c'est votre référence en cas de désaccord",
        },
        {
          order: 3,
          title: "Le calendrier de publication : planifier un mois en 2 heures",
          minutes: 15,
          content:
            "Le calendrier éditorial transforme la création en production. Plutôt que de chercher chaque matin « qu'est-ce qu'on poste aujourd'hui ? », le community manager professionnel bloque deux heures, une fois par mois, pour planifier l'ensemble : dates, formats, sujets, visuels.\n\n## La méthode du bloc mensuel\n\nUn simple tableau suffit : date, plateforme, colonne (utile/preuve/lien), sujet, format (photo, carrousel, vidéo), statut (à produire, prêt, publié). Remplissez d'abord les dates fixes (promotions, événements, jours fériés), puis alternez les trois colonnes de contenu pour équilibrer. Réservez ensuite un bloc de production photo/vidéo : tourner 6 vidéos en une après-midi est trois fois plus rapide que six sessions séparées.\n\n- Les outils de programmation (Meta Business Suite, Buffer) publient à l'avance : libérez votre quotidien\n- Gardez 20 % de souplesse pour l'actualité et les tendances du moment\n- Recyclez vos succès : un post qui a marché redevient carrousel, puis vidéo, puis story\n- Relisez le calendrier chaque vendredi : ajustez la semaine suivante selon les statistiques",
        },
      ],
    },
    {
      order: 3,
      title: "Produire du contenu qui engage",
      summary:
        "Accroches, légendes, vidéo courte, hashtags : le module technique de production, avec les formats et les formules qui déclenchent réactions et messages.",
      minutes: 50,
      lessons: [
        {
          order: 1,
          title: "Le copywriting réseaux : accroches, légendes, appels à l'action",
          minutes: 18,
          content:
            "Sur les réseaux, la première ligne décide de tout : elle s'affiche avant le « voir plus », et c'est elle que l'œil lit en scannant son fil. Les professionnels utilisent des formules d'accroche éprouvées : la question directe (« Vous avez du mal à vendre en ligne ? »), le chiffre surprenant (« 80 % des sites togolais perdent leurs visiteurs en 5 secondes »), la promesse concrète (« Le menu que nous avons utilisé pour remplir ce restaurant »), l'opinion tranchée (« Arrêtez de poster tous les jours. »).\n\n## La structure de légende qui travaille\n\n- Accroche (1 ligne) : stoppe le défilement\n- Contexte (2-3 lignes) : raconte, explique, donne l'information\n- Valeur (le cœur) : le conseil, l'enseignement, la preuve\n- Appel à l'action (1 ligne) : « Commentez », « Envoie-nous un message », « Enregistre ce post »\n\nUn seul appel à l'action par post — deux actions possibles, c'est zéro action. Et écrivez comme vous parlez : le langage administré tue l'engagement. Les emojis sont utiles s'ils restent des ponctuations, pas des décorations d'arbre de Noël.",
        },
        {
          order: 2,
          title: "Vidéo courte : Reels, TikTok — le format roi",
          minutes: 16,
          content:
            "La vidéo courte est le format que les algorithmes poussent le plus : elle demande peu de matériel (un téléphone) mais beaucoup de méthode. La structure qui fonctionne tient en trois temps : le hook (0-2 secondes, une phrase ou une image qui surprend), le corps (5-20 secondes, une seule idée, montrée plutôt que racontée), la fin (un appel clair : suivre, commenter, cliquer le lien en bio).\n\n## Tourner sans matériel pro\n\n- Lumière naturelle en face du sujet, jamais derrière — une fenêtre suffit\n- Cadre vertical, sujet centré ou sur le tiers, arrière-plan propre\n- Son clair : un micro-cravate à 10 000 FCFA change tout ; sinon, tournez au calme\n- Des coupes toutes les 2-3 secondes : le rythme retient l'attention\n- Sous-titrez systématiquement : la majorité regarde sans le son\n\nNe cherchez pas la perfection, cherchez la régularité : trois vidéos simples par semaine surpassent une vidéo « cinématique » par mois. Les premières vidéos seront médiocres — c'est le prix d'entrée, et tout le monde l'a payé.",
        },
        {
          order: 3,
          title: "Hashtags, tendances et contenus UGC",
          minutes: 16,
          content:
            "Les hashtags classent votre contenu dans des communautés thématiques : ils servent la découverte par des inconnus, pas la satisfaction des abonnés existants. La bonne dose : 3 à 8 hashtags pertinents plutôt que 30 génériques. Mélangez trois niveaux : un large (#mode), un moyen (#modeLome), un spécifique (#couturetogo). Les hashtags locaux sont les plus rentables : moins de concurrence, audience exacte.\n\n## Les tendances, utilisées intelligemment\n\nUne tendance (son, format, mème) est un ticket d'entrée vers la portée — à condition de la lier à votre sujet. Demandez-vous toujours : « comment ce format raconte-t-il mon activité ? ». Un cabinet comptable peut reprendre un son tendance pour expliquer la TVA ; le même son sans lien avec son métier ne sert à rien.\n\n- Le contenu UGC (contenu créé par vos clients) est une mine : photos clients, avis, unboxings — republiez avec crédit\n- Créez un hashtag de marque unique pour regrouper vos contenus clients\n- Répondez aux commentaires dans la première heure : la conversation multiplie la portée\n- Archivez vos meilleurs posts dans un dossier « à recycler » : un succès se redéploie sous un autre format",
        },
      ],
    },
    {
      order: 4,
      title: "Animer, modérer, mesurer",
      summary:
        "La communauté se cultive après la publication : réponses, modération, premières campagnes payantes et rapports qui prouvent votre valeur au client.",
      minutes: 45,
      lessons: [
        {
          order: 1,
          title: "Communauté : répondre, modérer, fidéliser",
          minutes: 15,
          content:
            "Un compte qui publie sans jamais répondre est une affiche, pas une marque. La règle professionnelle simple : tout commentaire ou message reçoit une réponse sous 24 heures (idéalement sous une heure pour les messages privés — c'est souvent une vente qui attend). Chaque réponse est publique : les futurs visiteurs la lisent et jugent la marque sur votre manière de traiter les gens.\n\n## Gérer les cas difficiles\n\n- Question simple → réponse claire + lien vers l'info (prix, horaires, livraison)\n- Réclamation → accueil sans excuse excessive, passage en privé, résolution, retour public bref\n- Troll ou insulte → une réponse calme maximum, puis masquage ou suppression si l'abus continue\n- Faux avis → signalement à la plateforme, réponse factuelle posée pour les lecteurs futurs\n\nFidéliser coûte dix fois moins que conquérir : mentionnez vos abonnés fidèles, republiez leurs contenus avec crédit, créez des rendez-vous (le conseil du mardi, la promo du vendredi). Une communauté qui se sent vue défend la marque — et la recommande.",
        },
        {
          order: 2,
          title: "Publicité : premières campagnes à petit budget",
          minutes: 15,
          content:
            "La publicité organique a ses plafonds ; la pub payante les brise — même avec 2 000 FCFA par jour. Le principe : votre meilleur contenu organique, montré à une audience précise, avec un objectif unique. Ne sponsorisez jamais un post médiocre : la pub multiplie, elle ne corrige pas.\n\n## Lancer sa première campagne Meta\n\n- Objectif unique : messages (WhatsApp/Messenger) pour vendre, interactions pour nourrir, trafic pour un site\n- Audience : ville + intérêts + tranche d'âge de votre persona — pas « tout le monde »\n- Visuel : la vidéo courte performe mieux que l'image fixe dans la plupart des cas\n- Budget test : 2 000 à 5 000 FCFA/jour pendant 4 à 7 jours avant de juger\n- Mesure : coût par résultat (par message reçu, par clic) — c'est LE chiffre qui décide\n\nLancez deux variantes d'annonce (visuel ou accroche différent) et laissez la plateforme arbitrer. Après la période test, coupez la moins performante et réinvestissez. C'est en présentant ces chiffres simples — dépensé, messages reçus, coût par message — que le client comprend votre valeur et augmente le budget.",
        },
        {
          order: 3,
          title: "Statistiques et rapports clients : prouver vos résultats",
          minutes: 15,
          content:
            "Les statistiques transforment votre travail en résultat visible — et votre facture en évidence. Oubliez le « nombre d'abonnés » comme seul indicateur : il flatte mais ne vend pas. Ce qui intéresse un client, c'est le chemin vers l'argent : portée, engagement, messages reçus, ventes attribuées.\n\n## Le rapport mensuel d'une page\n\n- Chiffres de tête : portée totale, abonnés gagnés, messages reçus (avec évolution vs mois précédent)\n- Top 3 des publications : capture d'écran + pourquoi ça a marché\n- Actions réalisées : X posts, Y vidéos, Z campagnes, réponses sous 1 h\n- Le mois suivant : 3 recommandations concrètes (nouveaux formats, budget pub, événement)\n\nEnvoyez-le le premier jour du mois, en PDF, avec une phrase d'introduction honnête — y compris quand les résultats sont moyens : « les vidéos courtes ont doublé la portée ; les posts photos ont décroché, on bascule 70 % de l'effort sur la vidéo ». Cette transparence construit la confiance long terme — et la confiance renouvelle les contrats, qui sont le vrai business du community manager.",
        },
      ],
    },
  ],
};
