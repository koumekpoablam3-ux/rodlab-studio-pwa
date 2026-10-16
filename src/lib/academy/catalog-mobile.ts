import type { CourseSeed } from "./types";

/**
 * RODLAB ACADEMY — Catalogue programmation
 * Cours : « Développement mobile avancé »
 */
export const COURSE_MOBILE: CourseSeed = {
  "slug": "developpement-mobile-avance",
  "title": "Développement mobile avancé : React Native & Flutter",
  "subtitle": "Architecture d'application, state management, performance native et publication sur les stores — le niveau attendu d'un développeur mobile professionnel.",
  "description": "Cette formation s'adresse à ceux qui ont déjà créé une première app mobile et veulent atteindre un niveau professionnel : architecture propre, gestion d'état avancée, performance et animations natives, puis publication réelle sur les stores. Les deux grands frameworks multiplateformes — React Native et Flutter — sont couverts en parallèle pour comprendre leurs forces respectives. 4 modules, 12 leçons, puis un examen final de 8 questions pour obtenir votre certificat RodLab Studio.",
  "level": "Avancé",
  "durationHours": 16,
  "skills": [
    "Structurer l'architecture d'une app mobile pour qu'elle reste maintenable",
    "Gérer un état applicatif complexe (Redux, Zustand, Bloc, Provider)",
    "Optimiser les performances et les animations natives",
    "Communiquer avec les API natives via les bridges React Native et les plugins Flutter",
    "Tester une app mobile (unitaire, intégration, bout en bout)",
    "Publier une application sur l'App Store et le Google Play Store"
  ],
  "modules": [
    {
      "order": 1,
      "title": "Architecture d'une application mobile professionnelle",
      "summary": "Une app qui grossit sans architecture claire devient vite ingérable. Ce module pose les fondations qui permettent à un projet mobile de tenir sur la durée.",
      "minutes": 46,
      "lessons": [
        {
          "order": 1,
          "title": "Organiser un projet mobile à grande échelle",
          "minutes": 15,
          "content": "Un projet mobile qui grossit sans organisation finit par mélanger logique métier, appels réseau et composants d'interface dans les mêmes fichiers, rendant chaque modification risquée. L'architecture en couches sépare clairement la présentation (écrans, composants), le domaine (logique métier, règles de validation) et les données (appels API, stockage local) — chaque couche ne connaît que celle immédiatement en dessous.\n\n## Une structure de dossiers qui tient à l'échelle\n\nOrganiser par fonctionnalité (features/authentification, features/profil, features/paiement) plutôt que par type technique (tous les écrans ensemble, tous les composants ensemble) permet à une équipe de travailler sur une fonctionnalité sans devoir naviguer dans tout le projet. Chaque dossier de fonctionnalité regroupe ses propres écrans, son état et ses appels réseau.\n\n- Séparez toujours les appels réseau (couche data) des composants d'affichage (couche UI)\n- Un composant d'écran ne doit jamais appeler directement une API : il passe par une couche intermédiaire (service, repository)\n- Centralisez les constantes (couleurs, espacements, endpoints API) dans des fichiers dédiés, jamais en dur dans les écrans\n- Cette architecture facilite énormément les tests, car chaque couche peut être testée indépendamment des autres"
        },
        {
          "order": 2,
          "title": "Navigation avancée : piles, onglets et deep linking",
          "minutes": 16,
          "content": "Une app mobile professionnelle combine généralement plusieurs types de navigation : une pile (stack) pour empiler des écrans avec retour arrière naturel, des onglets (tabs) pour basculer entre sections principales, et parfois un tiroir (drawer) pour des options secondaires. React Navigation (React Native) et le Navigator de Flutter permettent de combiner ces patterns en imbriquant les navigateurs les uns dans les autres.\n\n## Le deep linking : ouvrir directement un écran précis\n\nLe deep linking permet à un lien externe (notification push, email, réseau social) d'ouvrir directement un écran précis de l'app avec ses paramètres — par exemple monapp://produit/123 ouvre directement la fiche du produit 123, sans repasser par l'écran d'accueil. C'est indispensable pour toute app qui envoie des notifications ou partage des liens.\n\n- Une pile de navigation mal gérée provoque des retours arrière incohérents : testez systématiquement ce parcours\n- Les paramètres passés entre écrans doivent être typés pour éviter des erreurs silencieuses à l'exécution\n- Universal Links (iOS) et App Links (Android) permettent d'ouvrir l'app depuis un vrai lien https, pas seulement un schéma personnalisé\n- Testez le deep linking dans les deux cas : app déjà ouverte en arrière-plan, et app totalement fermée"
        },
        {
          "order": 3,
          "title": "Gestion des erreurs et des états de chargement à grande échelle",
          "minutes": 15,
          "content": "Une app mobile professionnelle ne montre jamais un écran blanc ou figé pendant un chargement : chaque appel réseau doit gérer explicitement trois états possibles — chargement, succès, erreur — et l'interface doit refléter clairement lequel est actif à tout moment.\n\n## Un pattern réutilisable pour chaque écran de données\n\nModéliser ces trois états dans un type unique ({ statut: \"chargement\" } | { statut: \"succes\", donnees } | { statut: \"erreur\", message }) force chaque composant à gérer les trois cas, sans oubli possible — le compilateur (avec TypeScript ou Dart) refuse de compiler si un cas est ignoré. C'est bien plus sûr qu'un simple booléen isLoading combiné à des vérifications manuelles dispersées.\n\n- Un message d'erreur générique (« Une erreur est survenue ») frustre l'utilisateur : préférez un message actionnable avec un bouton « réessayer »\n- Les squelettes de chargement (skeleton screens) réduisent la perception d'attente mieux qu'un simple indicateur de rotation\n- Une perte de connexion doit être détectée et affichée clairement, distincte d'une erreur serveur\n- Centralisez la gestion des erreurs réseau (401, 500, timeout) dans une couche unique plutôt que de la dupliquer partout"
        }
      ]
    },
    {
      "order": 2,
      "title": "Gestion d'état avancée",
      "summary": "Passé une certaine taille, une app ne peut plus se contenter de l'état local des composants : ce module couvre les solutions de state management professionnelles.",
      "minutes": 47,
      "lessons": [
        {
          "order": 1,
          "title": "Pourquoi l'état local des composants ne suffit plus",
          "minutes": 15,
          "content": "L'état local (useState en React Native, setState en Flutter) fonctionne parfaitement pour un composant isolé, mais devient ingérable dès que plusieurs écrans éloignés doivent partager et réagir à la même donnée — un panier d'achat visible dans l'en-tête, l'écran produit et l'écran de paiement, par exemple. Faire remonter cet état de composant en composant (« prop drilling ») rend le code fragile et difficile à faire évoluer.\n\n## Le principe commun à toutes les solutions de state management\n\nToutes les solutions professionnelles (Redux, Zustand, Bloc, Provider, Riverpod) partagent le même principe : un état centralisé, accessible depuis n'importe quel composant sans passer par des props intermédiaires, et modifié uniquement via des actions explicites et prévisibles plutôt que des mutations directes dispersées dans le code.\n\n- Un état partagé mal centralisé provoque des bugs où deux écrans affichent des données incohérentes entre elles\n- Le state management ne remplace pas l'état local : un champ de formulaire simple reste très bien géré localement\n- Une règle utile : si une donnée n'intéresse qu'un seul composant, elle reste locale ; si plusieurs écrans la partagent, elle devient globale\n- Changer de solution de state management en cours de projet coûte cher : le choix initial mérite réflexion"
        },
        {
          "order": 2,
          "title": "Redux et Zustand côté React Native",
          "minutes": 16,
          "content": "Redux impose un flux strict et prévisible : un unique store centralisé, des actions qui décrivent « ce qui s'est passé » (pas « ce qui doit changer »), et des reducers, des fonctions pures qui calculent le nouvel état à partir de l'ancien et de l'action reçue. Cette rigidité, souvent critiquée pour sa verbosité, garantit une traçabilité totale : chaque changement d'état provient d'une action identifiable, rejouable et débogable.\n\n## Zustand : la simplicité pour la majorité des projets\n\nZustand propose un état global avec une API minimale, sans reducers ni actions formelles obligatoires — un simple hook expose l'état et les fonctions qui le modifient. Pour la majorité des apps mobiles de taille moyenne, Zustand offre l'essentiel des bénéfices de Redux (état centralisé, réactivité) avec beaucoup moins de code répétitif.\n\n- Redux Toolkit modernise Redux et réduit sa verbosité historique, sans abandonner sa rigueur\n- Un store trop volumineux et non découpé devient lui-même un problème : séparez par domaine fonctionnel (slices)\n- Les sélecteurs mémoïsés évitent des re-rendus inutiles quand seule une petite partie de l'état change\n- Le choix entre Redux et Zustand dépend surtout de la taille de l'équipe et du besoin de traçabilité stricte"
        },
        {
          "order": 3,
          "title": "Bloc et Provider côté Flutter",
          "minutes": 16,
          "content": "Le pattern Bloc (Business Logic Component) sépare strictement les événements (ce que l'utilisateur fait) des états (ce que l'interface doit afficher), avec une logique métier entièrement testable indépendamment de tout widget Flutter. Un widget émet un événement, le Bloc le traite et émet un nouvel état, et l'interface se contente d'écouter et de réagir — une séparation très proche de l'esprit Redux.\n\n## Provider et Riverpod : une approche plus légère\n\nProvider expose un état à travers l'arbre de widgets Flutter sans prop drilling, avec une API plus simple que Bloc pour les besoins courants. Riverpod, son successeur, corrige plusieurs limitations de Provider (dépendance au contexte, sécurité de type) et devient le choix recommandé pour les nouveaux projets Flutter en 2026.\n\n- Bloc convient particulièrement aux équipes qui veulent une traçabilité stricte et des tests unitaires poussés\n- Provider et Riverpod conviennent à des besoins plus directs, avec une courbe d'apprentissage plus douce\n- flutter_bloc fournit des widgets prêts à l'emploi (BlocBuilder, BlocListener) pour connecter l'état à l'interface\n- Comme pour React Native, le choix dépend de la taille du projet et des préférences de rigueur de l'équipe"
        }
      ]
    },
    {
      "order": 3,
      "title": "Performance, animations et accès natif",
      "summary": "Une app mobile professionnelle se distingue par sa fluidité et sa capacité à exploiter les fonctionnalités natives du téléphone au-delà du simple affichage.",
      "minutes": 46,
      "lessons": [
        {
          "order": 1,
          "title": "Listes performantes : FlatList et ListView.builder",
          "minutes": 15,
          "content": "Afficher une liste de mille éléments en créant les mille composants d'un coup ferait ramer n'importe quel téléphone. FlatList (React Native) et ListView.builder (Flutter) appliquent tous deux le même principe de virtualisation : seuls les éléments actuellement visibles à l'écran (plus une petite marge) sont réellement construits en mémoire, les autres sont recyclés au défilement.\n\n## Les pièges classiques de performance sur les listes\n\nUne fonction renderItem qui recrée un nouvel objet de style à chaque rendu, ou un composant enfant non mémoïsé, annulent une partie du bénéfice de la virtualisation en forçant des reconstructions inutiles. La prop key (React Native) ou l'usage cohérent d'un identifiant unique (Flutter) permet au framework de reconnaître un élément déplacé plutôt que de le détruire et le recréer.\n\n- keyExtractor doit retourner un identifiant stable et unique, jamais l'index de la liste si l'ordre peut changer\n- React.memo ou const constructors (Flutter) évitent des reconstructions de composants dont les props n'ont pas changé\n- getItemLayout (FlatList) accélère le calcul de position quand la hauteur des éléments est connue à l'avance\n- Une image non redimensionnée côté serveur avant l'affichage dans une liste est une cause fréquente de lenteur"
        },
        {
          "order": 2,
          "title": "Animations natives : Reanimated et l'API Animation de Flutter",
          "minutes": 16,
          "content": "Une animation calculée sur le thread JavaScript (React Native classique) peut saccader dès que ce même thread est occupé par une autre tâche — c'est pourquoi react-native-reanimated exécute les animations directement sur le thread d'interface natif (UI thread), garantissant une fluidité à 60 fps même sous charge JavaScript.\n\n## Flutter : la fluidité native par conception\n\nFlutter compile directement en code natif et dessine chaque frame lui-même via son moteur de rendu (Skia), ce qui lui donne un avantage structurel en matière de fluidité d'animation par rapport à un pont JavaScript-natif. Les classes AnimationController et Tween offrent un contrôle précis du minutage et de la courbe d'accélération de chaque animation.\n\n- Reanimated utilise des « worklets », des fonctions qui s'exécutent directement sur le thread natif, pas JavaScript\n- Une animation basée sur transform et opacity (comme vu en CSS) reste la plus performante sur mobile aussi\n- Le profileur de performance intégré (Flutter DevTools, Flipper pour React Native) révèle les frames qui dépassent 16 ms\n- Testez toujours les animations sur un appareil physique bas de gamme, pas seulement sur un simulateur puissant"
        },
        {
          "order": 3,
          "title": "Accès natif : caméra, géolocalisation et notifications push",
          "minutes": 15,
          "content": "React Native et Flutter exposent les fonctionnalités natives du téléphone (caméra, GPS, capteurs, notifications) via des modules ou plugins qui font le pont entre le code multiplateforme et le code natif spécifique à iOS et Android. Comprendre ce pont aide à diagnostiquer les comportements qui diffèrent subtilement entre les deux plateformes.\n\n## Les autorisations : le point de friction le plus fréquent\n\nChaque accès natif sensible (caméra, position, notifications) nécessite une autorisation explicite de l'utilisateur, demandée au moment opportun — jamais au premier lancement de l'app avant que l'utilisateur comprenne pourquoi. iOS et Android ont des flux de permission différents et des textes de justification obligatoires (Info.plist côté iOS, manifeste côté Android) à renseigner avec précision.\n\n- Demandez une permission uniquement au moment où la fonctionnalité correspondante est réellement utilisée\n- Une permission refusée doit être gérée gracieusement, avec une explication claire plutôt qu'un blocage silencieux\n- Les notifications push nécessitent un service distinct (Firebase Cloud Messaging le plus souvent) pour les deux plateformes\n- Testez systématiquement le comportement « permission refusée » : c'est un cas fréquent en usage réel, pas une exception rare"
        }
      ]
    },
    {
      "order": 4,
      "title": "Tests et publication professionnelle",
      "summary": "Une app n'est vraiment terminée qu'une fois testée sérieusement et publiée sur les stores — ce module couvre les deux étapes trop souvent négligées par les débutants.",
      "minutes": 45,
      "lessons": [
        {
          "order": 1,
          "title": "Tests unitaires et de composants mobiles",
          "minutes": 15,
          "content": "Comme en développement web, les tests unitaires vérifient qu'une fonction ou un hook isolé produit le résultat attendu — Jest pour React Native, le package test natif pour Flutter. Les tests de composants (React Native Testing Library, WidgetTester en Flutter) vérifient qu'un écran affiche correctement les bons éléments selon les données reçues, sans lancer un simulateur complet.\n\n## Ce qui mérite le plus d'être testé sur mobile\n\nLa logique métier pure (calcul de prix, validation de formulaire, transformation de données) doit être testée en priorité, car elle est rapide à tester et souvent réutilisée dans plusieurs écrans. Les tests de composants viennent ensuite pour vérifier les cas de chargement, succès et erreur vus au module 1, avant les tests bout en bout, plus lents et plus coûteux à maintenir.\n\n- Un test qui dépend d'un vrai appel réseau est fragile : mockez systématiquement les appels API dans les tests unitaires\n- WidgetTester (Flutter) simule des interactions complètes (tap, scroll) sans lancer un vrai appareil\n- La pyramide de tests (beaucoup d'unitaires, moins d'intégration, très peu de bout en bout) s'applique aussi au mobile\n- Un test instable (« flaky »), qui échoue parfois sans raison claire, doit être corrigé en priorité : il détruit la confiance dans toute la suite de tests"
        },
        {
          "order": 2,
          "title": "Tests bout en bout : Detox et integration_test",
          "minutes": 15,
          "content": "Les tests bout en bout (end-to-end) automatisent un vrai parcours utilisateur sur un simulateur ou un appareil réel : ouvrir l'app, taper des identifiants, valider un formulaire, vérifier l'écran final. Detox (React Native) et integration_test (Flutter) pilotent l'app comme le ferait un utilisateur, capturant les régressions qu'aucun test unitaire ne peut détecter.\n\n## Pourquoi ces tests restent peu nombreux mais précieux\n\nUn test bout en bout est lent (plusieurs secondes à minutes) et plus fragile qu'un test unitaire (un léger changement d'interface peut le casser), c'est pourquoi on réserve cette catégorie aux parcours critiques : inscription, paiement, parcours d'achat complet — pas à chaque interaction mineure de l'app.\n\n- Un test bout en bout doit rester indépendant : ne jamais dépendre du résultat d'un test précédent\n- Ces tests s'exécutent idéalement en intégration continue avant chaque publication, pas seulement en local\n- Nommez chaque test selon le parcours utilisateur qu'il vérifie, pas selon l'implémentation technique interne\n- Un parcours critique cassé en production coûte largement plus cher que le temps investi à l'automatiser en amont"
        },
        {
          "order": 3,
          "title": "Publier sur l'App Store et le Google Play Store",
          "minutes": 15,
          "content": "Publier sur l'App Store exige un compte développeur Apple payant (renouvelé annuellement), la génération de certificats de signature, et une revue manuelle par Apple qui peut prendre de un à plusieurs jours et rejeter une app pour des raisons parfois strictes (design, confidentialité, contenu). Le Google Play Store demande un compte développeur avec des frais uniques, et sa revue est généralement plus rapide et plus automatisée.\n\n## Ce qui prépare une publication sans accroc\n\nUne politique de confidentialité claire est obligatoire sur les deux plateformes dès qu'une app collecte la moindre donnée personnelle. Les captures d'écran, la description et les mots-clés du store ont un impact réel sur les téléchargements — les traiter comme un vrai travail marketing, pas une simple formalité technique de fin de projet.\n\n- Préparez les identifiants visuels (icône, splash screen) dans toutes les résolutions requises bien avant la soumission\n- Les versions bêta (TestFlight pour iOS, tests internes pour Android) permettent de faire tester l'app avant la publication publique\n- Une mise à jour ultérieure suit le même processus de revue : prévoyez ce délai dans tout planning de correction urgente\n- Documentez précisément les permissions demandées : les stores rejettent des apps qui demandent des accès non justifiés dans la description"
        }
      ]
    }
  ]
};
