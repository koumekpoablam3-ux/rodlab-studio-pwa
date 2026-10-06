import type { ModuleSeed } from "./types";

/**
 * RODLAB ACADEMY — Contenu du cours, modules 5 à 8
 * « Créez votre premier site web professionnel »
 */
export const MODULES_5_8: ModuleSeed[] = [
  {
    order: 5,
    title: "Design UI : couleurs, typographie et composants",
    summary:
      "Passez du « ça fonctionne » au « c'est beau et crédible » : palettes maîtrisées, typographie lisible et composants réutilisables qui donnent une allure professionnelle.",
    minutes: 55,
    lessons: [
      {
        order: 1,
        title: "Construire une palette qui inspire confiance",
        minutes: 18,
        content:
          "Une palette réussie ne compte pas beaucoup de couleurs : une dominante (l'identité), une couleur d'accent (l'action), un ou deux fonds neutres et deux ou trois gris pour le texte. C'est la restriction qui crée l'harmonie — pas la quantité.\n\nPour choisir, partez de la marque : si le logo est vert forêt et or, le site l'assumera. Sinon, appuyez-vous sur la signification courante des couleurs dans votre secteur : le vert inspire confiance et croissance (agriculture, finance, santé), le terracotta la chaleur et l'artisanat, le bleu la technologie et la rigueur.\n\n- Dominante : en-têtes, titres, pieds de page — environ 60 % des surfaces colorées\n- Accent : uniquement les boutons et liens actifs — elle doit rester rare pour rester visible\n- Neutres : fonds crème ou blanc cassé, plus doux qu'un blanc pur\n- Contraste : vérifiez la lisibilité texte/fond (le blanc sur gris moyen se lit mal)\n\nNotez vos couleurs en variables CSS (:root { --forest: #276144; }) : une seule place à modifier si la charte évolue, et tout le site suit. C'est exactement ainsi que travaillent les agences, RodLab inclus.",
      },
      {
        order: 2,
        title: "Typographie web : la lisibilité avant tout",
        minutes: 17,
        content:
          "Le texte est la matière première du web : un site élégant mais pénible à lire est un site raté. La règle fondatrice : deux polices maximum — une expressive pour les titres, une sobre et très lisible pour le corps (par exemple Fraunces + Inter, la combinaison du site RodLab).\n\nLe corps de texte se règle entre 16 et 18 px, avec une hauteur de ligne de 1,6 environ et des lignes de 60 à 80 caractères maximum : plus longues, l'œil se perd ; plus courtes, la lecture saccade. Justifiez rarement : le texte aligné à gauche respire mieux sur le web.\n\n- Hiérarchie visible : le titre principal est nettement plus grand que les sous-titres, eux-mêmes plus grands que le texte\n- Interligne et marges généreux : l'espace blanc n'est pas du gâchis, c'est du confort\n- Poids : deux à trois graisses suffisent (normal, semi-bold, bold)\n- Google Fonts offre des familles gratuites pensées pour le web ; limitez-vous aux graisses réellement utilisées pour ne pas ralentir la page\n\nOuvrez un site que vous admirez et observez sa typographie : tailles relatives, espacements, rythme. Vous lirez désormais les pages autrement.",
      },
      {
        order: 3,
        title: "Composants réutilisables : boutons, cartes et formulaires",
        minutes: 20,
        content:
          "Un professionnel ne dessine pas chaque bouton séparément : il construit des composants — des briques visuelles réutilisées partout avec le même style. C'est ce qui donne cette impression de cohérence sur les bons sites.\n\nLe bouton : fond uni (la couleur d'accent), texte blanc, coins arrondis, padding généreux (12–16 px), et un état au survol légèrement plus foncé. Un seul style de bouton principal par site ; les actions secondaires se contentent d'une bordure.\n\nLa carte : fond blanc ou crème, bordure discrète ou ombre douce, padding régulier, une icône ou une image, un titre, deux lignes de texte, un lien. Elle se prête aux services, aux articles, aux témoignages — d'où son omniprésence.\n\nLe formulaire : labels au-dessus des champs, placeholders explicites, messages d'erreur en rouge sous le champ concerné, bouton d'envoi impossible à rater.\n\n## Le système d'espacement\nFixez des valeurs d'espacement par paliers (4, 8, 16, 24, 48, 96 px) et n'utilisez que celles-là. Les marges régulières sont la signature silencieuse du travail soigné — le visiteur ne sait pas pourquoi, mais il sent que c'est professionnel.",
      },
    ],
  },
  {
    order: 6,
    title: "Les outils qui accélèrent : CMS et no-code",
    summary:
      "Quand le code n'est pas la voie la plus rapide : WordPress, constructeurs de pages et outils no-code — leurs forces, leurs limites, et comment choisir en connaissance de cause.",
    minutes: 40,
    lessons: [
      {
        order: 1,
        title: "WordPress et les constructeurs de pages",
        minutes: 20,
        content:
          "WordPress fait tourner plus de 40 % du web. C'est un CMS — un système de gestion de contenu : la structure technique est installée une fois, puis le propriétaire modifie textes et images sans toucher au code. Pour un client qui veut être autonome, c'est souvent l'argument décisif.\n\nUn site WordPress s'assemble avec un thème (l'habillage) et des extensions (les fonctions : formulaire, boutique avec WooCommerce, référencement). Les constructeurs de pages comme Elementor ajoutent l'édition visuelle par glisser-déposer.\n\n- Forces : autonomie du client, énorme écosystème, idéal blog et vitrine évolutive\n- Coûts réels : thème et extensions premium payants, mises à jour régulières indispensables\n- Vigilance : beaucoup d'extensions = site lent et surface d'attaque accrue ; maintenance à prévoir (sauvegardes, mises à jour de sécurité)\n\nLa règle de RodLab : WordPress se justifie quand le client publie souvent ou veut éditer son site seul. Quand le contenu est stable et la performance critique, un site codé sur mesure reste plus rapide, plus sûr et moins coûteux à entretenir sur la durée.",
      },
      {
        order: 2,
        title: "No-code : Webflow, Framer — et quand passer au code",
        minutes: 20,
        content:
          "Les outils no-code permettent de produire des sites visuellement aboutis sans écrire de HTML ni CSS : Webflow et Framer traduisent vos gestes en code propre, Framer excelle pour les pages animées et les prototypes, Webflow pour les sites vitrines complets avec CMS intégré.\n\nCes outils sont de vrais alliés pour tester une idée en quelques jours, livrer une landing page d'événement, ou produire maquettes et sites pour des clients au budget serré. Le coût est l'abonnement mensuel par site, et la dépendance : le site vit chez l'éditeur.\n\n## Comment choisir ?\n- Besoin ponctuel, budget limité, design soigné exigé → no-code est légitime\n- Client propriétaire de son outillage, performance maximale, fonctions métier → code\n- Site d'entreprise durable avec référencement exigeant → code ou WordPress bien maintenu\n\nLe bon professionnel n'est ni « pour » ni « contre » : il choisit l'outil du projet. Et comprenne le code ou non, celui qui connaît HTML/CSS/JS obtient toujours plus des outils no-code — parce qu'il comprend ce qu'ils fabriquent. C'est précisément votre cas, maintenant.",
      },
    ],
  },
  {
    order: 7,
    title: "Mettre son site en ligne",
    summary:
      "Du disque dur au monde entier : choisir domaine et hébergement, déployer avec HTTPS, créer l'e-mail professionnel — puis être trouvé grâce aux bases du SEO.",
    minutes: 50,
    lessons: [
      {
        order: 1,
        title: "Nom de domaine et hébergement",
        minutes: 15,
        content:
          "Le nom de domaine est l'adresse officielle : court, mémorable, sans tirets inutiles. Au Togo, le .tg affirme l'ancrage local ; le .com reste la valeur sûre internationale. L'enregistrement annuel tourne autour de 5 000–12 000 FCFA selon l'extension — chez un registrar reconnu (Namecheap, OVH, registre togolais CAFAtech pour le .tg).\n\nL'hébergement, lui, loge vos fichiers. Trois familles : l'hébergement mutualisé (partagé, 20 000–60 000 FCFA/an, parfait pour un vitrine WordPress), le VPS (serveur dédié virtuel, plus puissant, demande des compétences d'administration) et l'hébergement statique gratuit ou presque (Netlify, Vercel, GitHub Pages) — idéal pour les sites HTML/CSS/JS sans base de données.\n\n- Le domaine se renouvelle chaque année : programmez un rappel, un domaine expiré = site mort\n- Distinguez le registrar (le domaine) de l'hébergeur (les fichiers) : ils peuvent être différents\n- Le renvoi DNS se propage en quelques minutes à 48 h après configuration\n\nBudget annuel réaliste d'un site vitrine : 30 000 à 80 000 FCFA tout compris. Intégrez-le dès le devis — c'est une ligne que beaucoup de débutants oublient, au prix de leur marge.",
      },
      {
        order: 2,
        title: "Déployer son site : FTP, HTTPS et e-mail professionnel",
        minutes: 20,
        content:
          "Déployer, c'est copier vos fichiers vers le serveur. Sur un hébergement mutualisé, le logiciel FileZilla (FTP) fait le transfert : vous vous connectez avec les identifiants fournis par l'hébergeur, et vous déposez vos fichiers dans le dossier racine (souvent public_html). Sur Netlify ou Vercel, glisser-déposer le dossier du site suffit — et chaque mise à jour prend une minute.\n\nDès la mise en ligne, activez HTTPS : le cadenas du navigateur est devenu un standard de crédibilité et un critère Google. Les certificats Let's Encrypt sont gratuits et la plupart des hébergeurs les installent en un clic.\n\n## L'e-mail professionnel\ncontact@votredomaine.tg vaut mieux que votredomaine@gmail.com : l'adresse au nom de domaine rassure instantanément. Les hébergeurs la proposent souvent incluse ; les suites (Google Workspace, Zoho) offrent plus d'espace et d'outils pour quelques milliers de FCFA par mois.\n\nVérifiez enfin la version mobile, testez le formulaire de contact avec une vraie adresse, et faites visiter le site à une personne extérieure avant l'annonce officielle. Une mise en ligne réussie est une mise en ligne testée.",
      },
      {
        order: 3,
        title: "Performance et SEO : se faire trouver",
        minutes: 15,
        content:
          "Un site invisible n'existe pas. Le SEO (référencement naturel) rassemble les pratiques qui font remonter votre site dans Google — gratuitement, mais avec constance.\n\nCommencez par les fondations techniques : un titre <title> unique et descriptif par page, une meta description qui donne envie de cliquer, une seule balise <h1> par page, des images avec attribut alt, des adresses propres. Créez ensuite votre fiche Google Business Profile : c'est elle qui fait apparaître l'entreprise sur Maps et dans les recherches locales — décisif pour une activité à Lomé comme ailleurs.\n\n- Vitesse : compressez les images, limitez les extensions, testez sur PageSpeed Insights\n- Contenu : une page par service, rédigée pour répondre aux vraies questions des clients\n- Régularité : un blog actif nourrit le référencement mieux que mille astuces\n- Mesure : installez Google Analytics ou une alternative légère pour suivre les visites\n\nLe SEO est un marathon de six mois, pas un sprint d'une semaine. Mais chaque fondation posée aujourd'hui travaille gratuitement pour vous pendant des années.",
      },
    ],
  },
  {
    order: 8,
    title: "Vivre de sa compétence",
    summary:
      "Transformer la technique en revenus : trouver les premiers clients, chiffrer un devis rentable sans se sous-vendre, et construire une réputation qui fait venir les projets à vous.",
    minutes: 45,
    lessons: [
      {
        order: 1,
        title: "Trouver ses premiers clients",
        minutes: 15,
        content:
          "Vos premiers clients existent déjà autour de vous : commerces sans site, artisans tout au plus sur WhatsApp, associations aux affiches fades, amis d'amis qui lancent une activité. Listez quinze entreprises de votre entourage, identifiez ce que leur présence en ligne a de raté, et proposez une amélioration concrète et chiffrée.\n\nLe portefeuille est votre arme principale : trois réalisations soignées — même fictives ou faites bénévolement — prouvent votre valeur mieux que n'importe quel discours. Publiez-les sur une page dédiée, sur LinkedIn et dans les groupes Facebook professionnels de votre ville.\n\n- Le réflexe gagnant : montrer avant de vendre — une maquette rapide du « site idéal » du prospect ouvre dix fois plus de portes qu'un tarif annoncé\n- Demandez systématiquement une recommandation écrite à chaque client satisfait\n- Les partenariats rapportent : graphistes, imprimeurs, agences événementielles débordent parfois de demandes web\n- Fixez-vous un rituel : trois prospections par jour, cinq jours par semaine, quoi qu'il arrive\n\nLes premières ventes viennent rarement de la publicité : elles viennent de la constance et de la preuve. Votre travail bien montré, répété, finit toujours par trouver preneur.",
      },
      {
        order: 2,
        title: "Chiffrer un devis rentable",
        minutes: 15,
        content:
          "Le piège du débutant est de casser ses prix pour obtenir le contrat. Un devis rentable se calcule, il ne se devine pas. Partez de votre objectif de revenu mensuel, divisez par vos heures productives réelles (120 à 140 h), et obtenez votre taux horaire plancher — puis gardez-le.\n\nEstimez chaque projet en lots : conception (réunion, cahier des charges, maquettes), production (pages, intégration), contenus (rédaction, photos — souvent sous-estimés), mise en ligne, et reprise. Multipliez vos heures estimées par votre taux, ajoutez 20 % d'imprévus — il y en aura —, puis présentez un forfait clair par phases.\n\n- Modèle RodLab pour un vitrine : 450 000 FCFA, 3 semaines, paiement 40 % à la commande, 30 % à la validation du design, 30 % à la livraison\n- Chaque aller-retour de retouches au-delà du forfait se facture — c'est écrit dans le devis\n- Les annuels (domaine, hébergement, maintenance) se répercutent clairement sur une ligne dédiée\n- Un acompte de 40 % filtre les clients qui ne sont pas sérieux\n\nUn prix bas n'achète pas la fidélité : il achète des clients difficiles. Le bon prix, expliqué avec confiance, est le premier signe de professionnalisme que votre client recherchait.",
      },
      {
        order: 3,
        title: "Livrer, fidéliser et bâtir sa réputation",
        minutes: 15,
        content:
          "La livraison est un moment stratégique, pas une fin. Formez le client à ses outils (30 minutes suffisent), remettez un dossier propre (fichiers sources, accès, mots de passe, facture), et fixez ensemble ce que couvre la garantie (typiquement 30 jours de corrections) et ce qui relève d'une nouvelle demande.\n\nLe suivi fait naître les revenus récurrents : une offre de maintenance à 15 000–30 000 FCFA/mois (mises à jour, sauvegardes, petites modifications) transforme un client unique en revenu stable — et cinq clients en maintenance valent mieux que dix projets dispersés.\n\n- Programmez un point gratuit à J+30 après la livraison : problèmes réels, recommandations, opportunités\n- Chaque projet livré nourrit votre vitrine : capture d'écran, témoignage demandé au bon moment (juste après la satisfaction)\n- Restez visible : une publication hebdomadaire sur votre activité (avant/après, coulisses, conseils) entretient votre notoriété sans effort commercial\n- Visez la recommandation : le client comblé vous amène son réseau — le canal le moins cher et le plus fiable qui soit\n\nVotre réputation est votre vraie boutique. Chaque projet terminé avec soin est un commercial silencieux qui travaille pour vous la nuit — et c'est ainsi qu'une compétence devient un métier.",
      },
    ],
  },
];
