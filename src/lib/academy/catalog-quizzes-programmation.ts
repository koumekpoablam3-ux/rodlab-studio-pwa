import type { CourseQuizSeed } from "./types";

/**
 * RODLAB ACADEMY — Catalogue programmation
 * Examens finaux des 5 cours de programmation (8 questions chacun, seuil 70 %).
 */
export const CATALOG_QUIZZES_PROGRAMMATION: CourseQuizSeed[] = [
  {
    "courseSlug": "html-css-avance",
    "title": "Examen final — HTML & CSS avancé",
    "passScore": 70,
    "questions": [
      {
        "prompt": "Pourquoi préférer <nav>, <article> ou <aside> à des <div> génériques ?",
        "options": [
          "Ils sont plus rapides à écrire",
          "Ils portent un sens exploité par le SEO et les lecteurs d'écran",
          "Ils s'affichent plus vite dans le navigateur",
          "Ils remplacent totalement le CSS"
        ],
        "answer": 1,
        "explanation": "Les balises sémantiques donnent du sens à la structure, ce qu'un <div> ne fait jamais : c'est exploité par les moteurs de recherche et les technologies d'assistance."
      },
      {
        "prompt": "Quelle est la règle d'or concernant ARIA ?",
        "options": [
          "En ajouter le plus possible par sécurité",
          "No ARIA is better than bad ARIA : ne pas mentir sur le comportement réel",
          "ARIA remplace le HTML sémantique",
          "ARIA ne concerne que les lecteurs d'écran mobiles"
        ],
        "answer": 1,
        "explanation": "Un attribut ARIA qui ne correspond à aucun vrai comportement JavaScript trompe l'utilisateur de technologie d'assistance : mieux vaut s'appuyer sur le HTML natif quand c'est possible."
      },
      {
        "prompt": "grid-template-areas sert principalement à :",
        "options": [
          "Colorer les zones de la grille",
          "Nommer des zones et réorganiser la mise en page sans toucher au HTML",
          "Créer des animations CSS",
          "Remplacer Flexbox"
        ],
        "answer": 1,
        "explanation": "Les zones nommées permettent de redessiner toute la mise en page (par exemple pour le mobile) en changeant uniquement le CSS, sans modifier le HTML."
      },
      {
        "prompt": "Pourquoi préférer transform et opacity pour animer un élément ?",
        "options": [
          "Ce sont les seules propriétés animables en CSS",
          "Elles s'exécutent sur le GPU sans recalculer la mise en page",
          "Elles fonctionnent uniquement sur mobile",
          "Elles remplacent JavaScript"
        ],
        "answer": 1,
        "explanation": "Contrairement à width ou margin, transform et opacity ne déclenchent pas de reflow : elles s'exécutent directement sur la carte graphique, pour une animation fluide."
      },
      {
        "prompt": "Que permettent les container queries que les media queries ne permettent pas ?",
        "options": [
          "Détecter la préférence de thème sombre",
          "Adapter un composant à la taille de son propre conteneur, pas à celle de l'écran",
          "Animer un élément au scroll",
          "Charger une police différente"
        ],
        "answer": 1,
        "explanation": "Les container queries raisonnent au niveau du composant et de son conteneur réel, utile quand ce composant peut être placé dans des contextes de largeurs différentes."
      },
      {
        "prompt": "En méthodologie BEM, que représente .carte--premium ?",
        "options": [
          "Un élément du bloc carte",
          "Un modificateur (variante) du bloc carte",
          "Un nouveau bloc indépendant",
          "Une erreur de syntaxe"
        ],
        "answer": 1,
        "explanation": "Le double tiret désigne un modificateur : une variante d'apparence du bloc .carte, sans changer sa structure HTML de base."
      },
      {
        "prompt": "Dans l'organisation ITCSS, les Utilities sont importées :",
        "options": [
          "En premier, avant tout le reste",
          "En dernier, pour pouvoir tout surcharger proprement",
          "Au milieu, avant les composants",
          "Jamais avec Tailwind"
        ],
        "answer": 1,
        "explanation": "ITCSS suit une pyramide de spécificité croissante ; les Utilities viennent en dernier pour garantir qu'elles peuvent surcharger sans recourir à !important."
      },
      {
        "prompt": "Quel réglage désactive les animations pour les utilisateurs qui le demandent ?",
        "options": [
          "will-change: transform",
          "prefers-reduced-motion: reduce",
          "color-scheme: light dark",
          "content-visibility: auto"
        ],
        "answer": 1,
        "explanation": "prefers-reduced-motion détecte la préférence système d'un utilisateur sensible au mouvement, et le CSS doit alors réduire ou désactiver les animations non essentielles."
      }
    ]
  },
  {
    "courseSlug": "javascript-avance",
    "title": "Examen final — JavaScript avancé",
    "passScore": 70,
    "questions": [
      {
        "prompt": "Quelle est la différence essentielle entre let et var concernant la portée ?",
        "options": [
          "Aucune différence réelle",
          "let a une portée de bloc, var a une portée de fonction",
          "var est plus rapide à l'exécution",
          "let ne peut pas être réassigné"
        ],
        "answer": 1,
        "explanation": "let (et const) sont limités au bloc {} où ils sont déclarés, alors que var remonte à toute la fonction englobante, source de bugs classiques dans les boucles."
      },
      {
        "prompt": "Pourquoi une arrow function utilisée comme callback évite-t-elle souvent des bugs de this ?",
        "options": [
          "Elle définit toujours this comme undefined",
          "Elle capture le this du contexte englobant au lieu d'en définir un nouveau",
          "Elle interdit l'usage de this",
          "Elle transforme this en variable globale"
        ],
        "answer": 1,
        "explanation": "Une arrow function n'a pas son propre this : elle hérite de celui du contexte où elle a été créée, ce qui évite la perte de contexte fréquente avec les fonctions classiques."
      },
      {
        "prompt": "Entre une microtask (Promise) et une macrotask (setTimeout), laquelle s'exécute en premier ?",
        "options": [
          "La macrotask, toujours",
          "La microtask, même si le setTimeout a un délai de 0 ms",
          "Cela dépend du navigateur",
          "Elles s'exécutent simultanément"
        ],
        "answer": 1,
        "explanation": "L'event loop traite toutes les microtasks en attente avant de passer à la macrotask suivante, quel que soit le délai déclaré du setTimeout."
      },
      {
        "prompt": "Quelle méthode de Promise attend que TOUTES les promesses se terminent, sans jamais échouer globalement ?",
        "options": [
          "Promise.all()",
          "Promise.race()",
          "Promise.allSettled()",
          "Promise.any()"
        ],
        "answer": 2,
        "explanation": "Promise.allSettled() retourne le statut de chaque promesse (réussie ou échouée) sans jamais rejeter globalement, contrairement à Promise.all() qui échoue à la première erreur."
      },
      {
        "prompt": "Qu'est-ce qu'une closure ?",
        "options": [
          "Une erreur de syntaxe fréquente",
          "Une fonction qui conserve l'accès aux variables de son contexte englobant après la fin de celui-ci",
          "Une méthode de classe uniquement",
          "Un type de boucle"
        ],
        "answer": 1,
        "explanation": "Une closure permet à une fonction interne de garder l'accès aux variables de la fonction externe même après que celle-ci a terminé son exécution — la base de l'encapsulation en JS."
      },
      {
        "prompt": "Le mot-clé class en JavaScript est :",
        "options": [
          "Un système totalement indépendant des prototypes",
          "Du sucre syntaxique au-dessus du système de prototypes existant",
          "Réservé à TypeScript",
          "Impossible à hériter"
        ],
        "answer": 1,
        "explanation": "JavaScript n'a pas de vraies classes au sens strict : class simplifie l'écriture, mais repose entièrement sur le système de prototypes du langage."
      },
      {
        "prompt": "Que fait fonction.bind(objet) ?",
        "options": [
          "Exécute immédiatement la fonction",
          "Retourne une nouvelle fonction où this est fixé de façon permanente sur objet",
          "Supprime le this de la fonction",
          "Transforme la fonction en Promise"
        ],
        "answer": 1,
        "explanation": "bind() crée une nouvelle fonction avec this verrouillé sur l'objet donné, très utile pour passer une méthode comme callback sans perdre son contexte."
      },
      {
        "prompt": "À quoi sert le debounce sur un champ de recherche ?",
        "options": [
          "Accélérer chaque frappe clavier",
          "Retarder l'exécution jusqu'à l'arrêt de la frappe, pour éviter une requête par caractère",
          "Bloquer totalement la recherche",
          "Mémoriser le résultat pour toujours"
        ],
        "answer": 1,
        "explanation": "Le debounce attend que l'utilisateur arrête de taper pendant un court délai avant de déclencher la recherche, évitant une requête réseau à chaque frappe."
      }
    ]
  },
  {
    "courseSlug": "python-avance",
    "title": "Examen final — Python avancé",
    "passScore": 70,
    "questions": [
      {
        "prompt": "Quel est l'intérêt principal de @property par rapport à un attribut public simple ?",
        "options": [
          "Elle rend l'attribut plus rapide",
          "Elle permet d'ajouter une logique de validation sans changer l'API vue par l'appelant",
          "Elle empêche toute lecture de l'attribut",
          "Elle transforme l'attribut en méthode statique"
        ],
        "answer": 1,
        "explanation": "@property garde une syntaxe d'accès simple (objet.attribut) tout en permettant d'exécuter une validation à la lecture ou à l'écriture, de façon transparente pour l'appelant."
      },
      {
        "prompt": "Que résout le MRO (Method Resolution Order) en Python ?",
        "options": [
          "La vitesse d'exécution des boucles",
          "L'ordre de résolution des méthodes en cas d'héritage multiple",
          "La gestion de la mémoire",
          "Le typage des variables"
        ],
        "answer": 1,
        "explanation": "Quand plusieurs classes parentes définissent la même méthode, le MRO (algorithme C3) détermine dans quel ordre Python la recherche, de façon cohérente et déterministe."
      },
      {
        "prompt": "Quel est l'avantage principal d'un générateur (yield) par rapport à une liste complète ?",
        "options": [
          "Il est plus rapide à écrire",
          "Il consomme une mémoire quasi constante en produisant les valeurs à la demande",
          "Il peut être parcouru plusieurs fois",
          "Il trie automatiquement les données"
        ],
        "answer": 1,
        "explanation": "Un générateur suspend son exécution entre chaque valeur produite, sans jamais matérialiser toute la séquence en mémoire — idéal pour de gros volumes de données."
      },
      {
        "prompt": "Que garantit l'instruction with (context manager) en Python ?",
        "options": [
          "Une exécution plus rapide du bloc",
          "La libération de la ressource même si une exception survient dans le bloc",
          "L'absence totale d'erreurs possibles",
          "Un typage automatique des variables"
        ],
        "answer": 1,
        "explanation": "with appelle systématiquement __exit__ à la sortie du bloc, qu'il y ait eu une exception ou non, garantissant que la ressource est correctement libérée."
      },
      {
        "prompt": "Pourquoi asyncio n'accélère-t-il pas un calcul intensif en CPU pur ?",
        "options": [
          "asyncio ne fonctionne que sur Windows",
          "asyncio excelle sur l'attente d'E/S, pas sur le calcul qui occupe réellement le processeur",
          "asyncio est plus lent que le code synchrone",
          "Il faut toujours combiner asyncio et multiprocessing"
        ],
        "answer": 1,
        "explanation": "asyncio libère le processeur pendant les attentes (réseau, disque), mais un calcul CPU-bound occupe le processeur en continu : aucune attente à libérer, donc aucun gain."
      },
      {
        "prompt": "Quelle est la différence essentielle entre threading et multiprocessing en Python ?",
        "options": [
          "Aucune, ce sont des synonymes",
          "Le GIL limite le threading pour le calcul pur ; multiprocessing utilise de vrais processus séparés",
          "multiprocessing est toujours plus lent",
          "threading ne fonctionne que sur Linux"
        ],
        "answer": 1,
        "explanation": "Le Global Interpreter Lock empêche un vrai parallélisme CPU avec des threads ; multiprocessing lance des processus séparés, chacun avec son propre GIL, pour un vrai parallélisme."
      },
      {
        "prompt": "Avant d'optimiser une fonction lente, quelle est la première étape recommandée ?",
        "options": [
          "Réécrire tout le code en C",
          "Profiler le code pour identifier le vrai goulot d'étranglement",
          "Ajouter des threads partout",
          "Supprimer les commentaires"
        ],
        "answer": 1,
        "explanation": "L'intuition sur ce qui est lent se trompe souvent : un outil comme cProfile révèle objectivement où le temps est réellement passé avant toute optimisation."
      },
      {
        "prompt": "Que permet mypy dans un projet Python ?",
        "options": [
          "Accélérer l'exécution du code au runtime",
          "Détecter des incohérences de type à partir des annotations, avant l'exécution",
          "Remplacer pytest",
          "Générer automatiquement la documentation"
        ],
        "answer": 1,
        "explanation": "mypy analyse statiquement les type hints pour repérer des erreurs de type avant même de lancer le programme, sans influencer l'exécution réelle du code."
      }
    ]
  },
  {
    "courseSlug": "cpp-avance",
    "title": "Examen final — C++ avancé",
    "passScore": 70,
    "questions": [
      {
        "prompt": "Que se passe-t-il si un objet alloué avec new n'est jamais libéré avec delete ?",
        "options": [
          "Rien, le langage le libère automatiquement",
          "C'est une fuite mémoire : la mémoire reste occupée pour toute la durée du programme",
          "Le programme s'arrête immédiatement",
          "L'objet est déplacé automatiquement sur la pile"
        ],
        "answer": 1,
        "explanation": "Contrairement à la pile, le tas n'est pas libéré automatiquement : oublier delete laisse la mémoire occupée jusqu'à la fin du programme, une fuite mémoire classique."
      },
      {
        "prompt": "Quel principe les smart pointers appliquent-ils à la gestion mémoire ?",
        "options": [
          "Le polymorphisme dynamique",
          "RAII : la ressource est libérée automatiquement à la destruction de l'objet",
          "La surcharge d'opérateurs",
          "L'héritage multiple"
        ],
        "answer": 1,
        "explanation": "Les smart pointers acquièrent la mémoire à leur construction et la libèrent automatiquement à leur destruction, y compris en cas d'exception — le principe RAII."
      },
      {
        "prompt": "Quelle est la différence entre std::unique_ptr et std::shared_ptr ?",
        "options": [
          "Aucune différence pratique",
          "unique_ptr autorise un seul propriétaire, shared_ptr en autorise plusieurs via un compteur de références",
          "shared_ptr est toujours plus rapide",
          "unique_ptr ne peut jamais être détruit"
        ],
        "answer": 1,
        "explanation": "unique_ptr représente une propriété exclusive et ne peut pas être copié ; shared_ptr partage la propriété entre plusieurs pointeurs via un compteur de références."
      },
      {
        "prompt": "Pourquoi une classe de base destinée à être héritée doit-elle déclarer un destructeur virtual ?",
        "options": [
          "Pour accélérer la compilation",
          "Pour garantir que détruire un objet dérivé via un pointeur de base libère correctement toutes ses ressources",
          "C'est purement une convention de style sans effet réel",
          "Pour interdire l'héritage multiple"
        ],
        "answer": 1,
        "explanation": "Sans destructeur virtual, détruire un objet dérivé via un pointeur de type base n'appelle que le destructeur de base, laissant les ressources de la partie dérivée non libérées."
      },
      {
        "prompt": "Que garantit la règle de zéro en C++ moderne ?",
        "options": [
          "Ne jamais utiliser de pointeurs",
          "Ne définir aucun constructeur de copie, destructeur ou opérateur d'affectation en s'appuyant sur des membres qui les gèrent déjà",
          "Utiliser zéro bibliothèque externe",
          "Compiler sans aucun avertissement"
        ],
        "answer": 1,
        "explanation": "En s'appuyant sur des membres comme unique_ptr ou vector qui gèrent déjà leurs ressources, une classe n'a besoin de définir aucune des méthodes spéciales elle-même."
      },
      {
        "prompt": "Un template en C++ permet principalement de :",
        "options": [
          "Ralentir volontairement le code pour le déboguer",
          "Écrire une fonction ou une classe générique sans perte de performance grâce à l'instanciation par le compilateur",
          "Remplacer complètement les classes",
          "Éviter d'utiliser la STL"
        ],
        "answer": 1,
        "explanation": "Le compilateur génère une version spécifique du code pour chaque type utilisé, ce qui donne la généricité des templates sans le coût d'indirection d'un typage dynamique."
      },
      {
        "prompt": "Pourquoi std::vector est-il recommandé comme conteneur par défaut ?",
        "options": [
          "Il est toujours trié automatiquement",
          "Il offre un accès en temps constant et une excellente localité mémoire pour la majorité des usages",
          "Il ne peut contenir que des entiers",
          "Il empêche toute modification après création"
        ],
        "answer": 1,
        "explanation": "vector combine accès rapide par index et éléments contigus en mémoire, ce qui le rend performant dans la grande majorité des cas, contrairement à list par exemple."
      },
      {
        "prompt": "À quoi sert std::lock_guard avec un mutex ?",
        "options": [
          "Accélérer l'exécution du thread",
          "Garantir le déverrouillage automatique du mutex même en cas d'exception, via RAII",
          "Remplacer complètement le besoin de threads",
          "Empêcher la création de nouveaux threads"
        ],
        "answer": 1,
        "explanation": "lock_guard verrouille à sa construction et déverrouille automatiquement à sa destruction, évitant un oubli de unlock qui bloquerait définitivement les autres threads."
      }
    ]
  },
  {
    "courseSlug": "developpement-mobile-avance",
    "title": "Examen final — Développement mobile avancé",
    "passScore": 70,
    "questions": [
      {
        "prompt": "Quel est l'avantage d'organiser un projet mobile par fonctionnalité plutôt que par type technique ?",
        "options": [
          "Le code s'exécute plus vite",
          "Une équipe peut travailler sur une fonctionnalité sans naviguer dans tout le projet",
          "Cela supprime le besoin de tests",
          "C'est obligatoire pour publier sur les stores"
        ],
        "answer": 1,
        "explanation": "Regrouper écrans, état et appels réseau d'une même fonctionnalité dans un dossier dédié limite les allers-retours dans tout le projet et facilite la collaboration."
      },
      {
        "prompt": "À quoi sert le deep linking dans une app mobile ?",
        "options": [
          "Accélérer le démarrage de l'app",
          "Ouvrir directement un écran précis avec ses paramètres depuis un lien externe",
          "Chiffrer les données locales",
          "Réduire la taille de l'app"
        ],
        "answer": 1,
        "explanation": "Un deep link (notification, email, réseau social) ouvre directement l'écran concerné avec ses paramètres, sans repasser par l'écran d'accueil."
      },
      {
        "prompt": "Pourquoi modéliser un appel réseau avec trois états explicites (chargement, succès, erreur) plutôt qu'un simple booléen isLoading ?",
        "options": [
          "C'est plus court à écrire",
          "Cela force à gérer explicitement chaque cas, sans oubli possible, notamment avec un typage strict",
          "Cela accélère la requête réseau elle-même",
          "Ce n'est utile que pour Flutter"
        ],
        "answer": 1,
        "explanation": "Un type unique regroupant les trois états oblige chaque composant à gérer tous les cas, contrairement à un booléen combiné à des vérifications manuelles dispersées et oubliables."
      },
      {
        "prompt": "Quel principe commun partagent Redux, Zustand, Bloc et Provider ?",
        "options": [
          "Ils sont tous spécifiques à Flutter",
          "Un état centralisé, accessible sans prop drilling, modifié via des actions explicites",
          "Ils remplacent entièrement les tests",
          "Ils ne fonctionnent que hors ligne"
        ],
        "answer": 1,
        "explanation": "Toutes ces solutions de state management partagent le même principe de fond : centraliser l'état et le modifier de façon prévisible, plutôt que de le faire remonter manuellement composant par composant."
      },
      {
        "prompt": "Pourquoi react-native-reanimated est-il plus fluide que des animations calculées sur le thread JavaScript classique ?",
        "options": [
          "Il n'anime que des images statiques",
          "Il exécute les animations directement sur le thread d'interface natif, indépendamment de la charge JavaScript",
          "Il désactive complètement JavaScript",
          "Il ne fonctionne que sur iOS"
        ],
        "answer": 1,
        "explanation": "En s'exécutant sur le thread natif via des worklets, Reanimated garantit une fluidité à 60 fps même si le thread JavaScript est occupé par une autre tâche."
      },
      {
        "prompt": "Quelle est la bonne pratique concernant les demandes de permission (caméra, position) ?",
        "options": [
          "Les demander toutes au premier lancement de l'app",
          "Les demander au moment où la fonctionnalité correspondante est réellement utilisée",
          "Ne jamais les demander pour éviter le refus",
          "Les demander uniquement sur Android"
        ],
        "answer": 1,
        "explanation": "Demander une permission au moment pertinent, avec un contexte clair, augmente le taux d'acceptation et respecte l'utilisateur, contrairement à une demande générique dès le lancement."
      },
      {
        "prompt": "Pourquoi les tests bout en bout (Detox, integration_test) restent-ils peu nombreux dans une app mobile ?",
        "options": [
          "Ils sont interdits par les stores",
          "Ils sont lents et plus fragiles qu'un test unitaire, donc réservés aux parcours critiques",
          "Ils ne fonctionnent pas sur mobile",
          "Ils remplacent totalement les tests unitaires"
        ],
        "answer": 1,
        "explanation": "Un test bout en bout pilote toute l'app comme un utilisateur réel : plus lent et plus sensible aux changements d'interface, donc réservé aux parcours les plus critiques (paiement, inscription)."
      },
      {
        "prompt": "Qu'est-ce qui est obligatoire sur l'App Store et le Play Store dès qu'une app collecte des données personnelles ?",
        "options": [
          "Un compte développeur payant sur les deux plateformes",
          "Une politique de confidentialité claire",
          "Un code source ouvert (open source)",
          "Une note minimale de 4 étoiles"
        ],
        "answer": 1,
        "explanation": "Les deux plateformes exigent une politique de confidentialité claire et accessible dès qu'une app collecte la moindre donnée personnelle, sous peine de rejet lors de la revue."
      }
    ]
  }
];
