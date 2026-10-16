import type { CourseSeed } from "./types";

/**
 * RODLAB ACADEMY — Catalogue programmation
 * Cours : « JavaScript avancé »
 */
export const COURSE_JAVASCRIPT: CourseSeed = {
  "slug": "javascript-avance",
  "title": "JavaScript avancé : maîtriser le langage en profondeur",
  "subtitle": "Closures, prototypes, event loop, async/await, patterns et performance — les mécanismes internes que tout développeur senior doit comprendre.",
  "description": "Cette formation s'adresse à ceux qui écrivent déjà du JavaScript mais veulent comprendre ce qui se passe sous le capot : comment fonctionne réellement l'asynchrone, pourquoi this change de valeur, comment structurer un code qui reste maintenable à grande échelle. 4 modules, 12 leçons, puis un examen final de 8 questions pour obtenir votre certificat RodLab Studio.",
  "level": "Avancé",
  "durationHours": 15,
  "skills": [
    "Comprendre et exploiter les closures et la portée lexicale",
    "Maîtriser les prototypes, les classes et le fonctionnement réel de this",
    "Écrire du code asynchrone fiable avec Promises et async/await",
    "Comprendre l'event loop pour diagnostiquer les blocages et lenteurs",
    "Appliquer des design patterns JavaScript reconnus",
    "Optimiser les performances (debounce, throttle, mémoïsation)"
  ],
  "modules": [
    {
      "order": 1,
      "title": "JavaScript moderne : ES6+ en profondeur",
      "summary": "Les syntaxes modernes (let/const, arrow functions, destructuring, modules) ne sont pas de simples raccourcis : elles changent la portée, le comportement de this et l'organisation du code.",
      "minutes": 46,
      "lessons": [
        {
          "order": 1,
          "title": "let, const et la portée de bloc : ce que var ne faisait pas",
          "minutes": 15,
          "content": "var a une portée de fonction et subit le hoisting de façon à créer des bugs classiques dans les boucles (une closure dans un for capture toujours la même variable). let et const ont une portée de bloc réelle : chaque itération d'une boucle crée sa propre liaison, ce qui règle ce problème historique sans aucune astuce supplémentaire.\n\n## const ne signifie pas « immuable »\n\nconst empêche uniquement la réassignation de la variable elle-même, pas la modification de son contenu : const tableau = [1,2] permet tableau.push(3) sans erreur, mais interdit tableau = [4,5]. Pour une vraie immutabilité d'objet, il faut Object.freeze(), et encore uniquement en surface (les propriétés imbriquées restent modifiables).\n\n- Préférez systématiquement const, et let uniquement quand une réassignation est prévue\n- N'utilisez plus var dans du code moderne, sauf contrainte de compatibilité extrême\n- Le hoisting de let/const existe mais crée une « zone morte temporelle » qui lève une erreur si utilisé trop tôt\n- Cette zone morte est une protection, pas un bug : elle empêche d'utiliser une variable avant sa déclaration"
        },
        {
          "order": 2,
          "title": "Arrow functions et this : la vraie différence",
          "minutes": 16,
          "content": "Une fonction classique (function () {}) définit sa propre valeur de this au moment de son appel, ce qui dépend de qui l'appelle. Une arrow function (() => {}) ne définit jamais son propre this : elle capture celui du contexte englobant au moment de sa création, pour toujours. C'est ce détail qui explique pourquoi les callbacks dans les classes ou les gestionnaires d'événements se comportent différemment selon la syntaxe choisie.\n\n## Le cas classique du setTimeout dans une classe\n\nDans une méthode de classe, this.valeur fonctionne, mais un setTimeout(function() { this.valeur }, 1000) classique perd this (il devient undefined ou l'objet global). Remplacer par une arrow function règle le problème immédiatement, car elle hérite du this de la méthode englobante.\n\n- N'utilisez jamais d'arrow function comme méthode d'objet si vous avez besoin de this dynamique\n- Les arrow functions n'ont pas d'objet arguments propre : utilisez les paramètres rest (...args)\n- Elles ne peuvent pas servir de constructeur (new ne fonctionne pas dessus)\n- Ce comportement les rend idéales pour les callbacks, pas pour les méthodes d'API publique d'un objet"
        },
        {
          "order": 3,
          "title": "Destructuring, spread et modules ES : organiser le code",
          "minutes": 15,
          "content": "Le destructuring (const { nom, email } = utilisateur) extrait des valeurs sans répéter le nom de l'objet à chaque ligne, et fonctionne aussi sur les tableaux (const [premier, ...reste] = liste). Combiné aux valeurs par défaut (const { role = \"CLIENT\" } = data), il remplace élégamment de nombreuses vérifications manuelles.\n\n## Les modules ES : import/export natifs\n\nAvant les modules ES, le JavaScript navigateur n'avait aucun système natif d'imports : tout dépendait de scripts globaux ou d'outils externes. export const et import { x } from \"./fichier.js\" apportent un vrai système de dépendances, avec un chargement différé (tree-shaking) qui retire le code jamais utilisé du bundle final.\n\n- Le spread (...) copie superficiellement un objet ou un tableau : { ...original, statut: \"actif\" }\n- Les exports nommés (export const) sont préférables aux exports par défaut pour la clarté des imports\n- Un module ES s'exécute une seule fois même importé plusieurs fois : son état est partagé (singleton naturel)\n- Les imports dynamiques (import(\"./module.js\")) permettent le code-splitting à la demande"
        }
      ]
    },
    {
      "order": 2,
      "title": "Programmation asynchrone et event loop",
      "summary": "L'asynchrone est la source la plus fréquente de bugs difficiles à diagnostiquer en JavaScript. Comprendre l'event loop rend ces bugs prévisibles plutôt que mystérieux.",
      "minutes": 48,
      "lessons": [
        {
          "order": 1,
          "title": "L'event loop : pourquoi JavaScript n'est jamais vraiment bloqué",
          "minutes": 17,
          "content": "JavaScript exécute son code sur un seul thread, mais il ne se bloque presque jamais grâce à l'event loop : les opérations longues (requêtes réseau, timers, lecture de fichiers) sont déléguées à l'environnement (navigateur ou Node.js) qui prévient JavaScript une fois le résultat prêt, via une file d'attente de callbacks traitée entre chaque tour de boucle.\n\n## Microtasks et macrotasks : l'ordre qui surprend\n\nLes Promises créent des « microtasks », traitées avant les « macrotasks » comme setTimeout, même si le setTimeout a un délai de 0 ms. C'est pourquoi console.log(\"A\"); setTimeout(() => console.log(\"B\"), 0); Promise.resolve().then(() => console.log(\"C\")); affiche toujours A, C, B — un piège classique en entretien technique.\n\n- Le thread principal ne peut traiter qu'une chose à la fois : un calcul lourd bloque tout, y compris l'affichage\n- requestAnimationFrame se synchronise avec le rafraîchissement de l'écran, contrairement à setTimeout\n- Node.js utilise le même principe d'event loop, avec des phases supplémentaires (I/O, timers, close callbacks)\n- Un callback qui prend 200 ms bloque toute interaction utilisateur pendant ces 200 ms"
        },
        {
          "order": 2,
          "title": "Promises : au-delà de .then() basique",
          "minutes": 16,
          "content": "Une Promise représente une valeur qui sera disponible plus tard, dans l'un de trois états : pending, fulfilled ou rejected — et une fois réglée (fulfilled ou rejected), son état ne change plus jamais. Promise.all() attend que toutes les promesses réussissent (et échoue dès la première erreur), tandis que Promise.allSettled() attend toutes les promesses sans jamais échouer, en retournant le statut de chacune.\n\n## Quand utiliser quoi\n\nPromise.race() retourne le résultat de la première promesse réglée, utile pour implémenter un timeout manuel sur une requête. Promise.any() retourne la première qui réussit et ignore les échecs, sauf si toutes échouent. Ces variantes évitent d'écrire à la main une logique de coordination souvent buguée.\n\n- Un .catch() en fin de chaîne attrape toute erreur survenue plus haut dans la chaîne\n- Oublier de retourner une promesse dans un .then() casse le chaînage silencieusement\n- Une erreur non catchée dans une Promise déclenche un avertissement « Unhandled Rejection »\n- new Promise((resolve, reject) => {}) sert à transformer une API basée sur des callbacks en Promise"
        },
        {
          "order": 3,
          "title": "async/await : la syntaxe qui cache la complexité (sans la supprimer)",
          "minutes": 15,
          "content": "async/await est du sucre syntaxique au-dessus des Promises : une fonction async retourne toujours une Promise, et await suspend l'exécution de cette fonction (pas du programme entier) jusqu'à ce que la Promise attendue soit réglée. Le code se lit alors comme du synchrone, ce qui réduit énormément les erreurs de logique par rapport aux chaînes de .then() imbriquées.\n\n## Gérer les erreurs et le parallélisme\n\ntry/catch autour d'un await capture les rejets de Promise exactement comme une exception classique — c'est plus lisible que .catch() pour une séquence de plusieurs étapes. Pour paralléliser plusieurs appels indépendants, il faut explicitement les lancer avant d'attendre : const [a, b] = await Promise.all([fetchA(), fetchB()]), sinon deux await consécutifs s'exécutent en série et doublent le temps d'attente.\n\n- Un await placé dans une boucle for classique attend chaque itération : souvent une erreur de performance\n- for await...of existe pour consommer proprement des flux asynchrones itérables\n- Une fonction async retourne toujours une Promise, même si elle ne contient aucun await\n- Ne mélangez pas .then() et await sur la même chaîne : choisissez un style et restez cohérent"
        }
      ]
    },
    {
      "order": 3,
      "title": "Concepts internes : closures, prototypes et this",
      "summary": "Ce module démonte les mécanismes que la plupart des développeurs utilisent sans les comprendre pleinement — la base de toute question d'entretien technique avancé.",
      "minutes": 45,
      "lessons": [
        {
          "order": 1,
          "title": "Closures : la mémoire cachée des fonctions",
          "minutes": 15,
          "content": "Une closure se produit quand une fonction interne conserve l'accès aux variables de la fonction qui l'entoure, même après que cette fonction externe a terminé son exécution. Ce n'est pas une fonctionnalité qu'on active : c'est le comportement par défaut de JavaScript, qui explique pourquoi un compteur créé par une fonction fabrique peut garder un état privé sans aucune classe.\n\n## L'usage pratique : encapsulation sans classe\n\nfunction creerCompteur() { let n = 0; return () => ++n; } produit une fonction qui incrémente une variable totalement inaccessible depuis l'extérieur — une vraie encapsulation, plus stricte que les propriétés « privées » de beaucoup de langages. C'est le principe derrière les hooks React (useState) et de nombreux patterns de modules.\n\n- Chaque appel à une fonction fabrique crée une nouvelle closure indépendante, avec son propre état\n- Les closures dans une boucle avec var capturaient historiquement la même variable : let règle ce problème\n- Une closure garde en mémoire tout son environnement lexical, pas seulement la variable utilisée : attention aux fuites mémoire\n- Les modules ES sont eux-mêmes une forme de closure au niveau du fichier"
        },
        {
          "order": 2,
          "title": "Prototypes et classes : ce qui se passe vraiment derrière class",
          "minutes": 15,
          "content": "JavaScript n'a pas de vraies classes au sens de Java ou C++ : le mot-clé class est du sucre syntaxique au-dessus du système de prototypes existant depuis les origines du langage. Chaque objet possède un lien caché (__proto__) vers un autre objet, et une propriété non trouvée sur l'objet est recherchée automatiquement le long de cette chaîne de prototypes.\n\n## Pourquoi comprendre ça change la façon de déboguer\n\nQuand une méthode semble « disparaître » sur un objet, c'est souvent parce que la chaîne de prototypes a été cassée (par exemple en réassignant complètement .prototype après la définition de méthodes). Object.create(), Object.getPrototypeOf() et instanceof deviennent des outils de diagnostic une fois ce mécanisme compris, plutôt que de la magie opaque.\n\n- class MaClasse extends Autre crée en réalité une chaîne de prototypes derrière le rideau\n- Les méthodes définies dans une classe vivent sur le prototype, pas sur chaque instance : elles sont partagées et économes en mémoire\n- super() dans un constructeur appelle le constructeur parent avant d'accéder à this\n- Les champs privés (#nom) sont une vraie encapsulation récente, distincte du système de prototypes"
        },
        {
          "order": 3,
          "title": "this : les quatre règles qui expliquent tout",
          "minutes": 15,
          "content": "La valeur de this en JavaScript ne dépend jamais de l'endroit où une fonction est définie, mais de comment elle est appelée — c'est la source de confusion la plus fréquente du langage. Quatre règles suffisent à la déterminer dans presque tous les cas : appel simple (this = undefined en mode strict, ou l'objet global sinon), appel de méthode (this = l'objet avant le point), appel avec new (this = la nouvelle instance), et appel explicite via call/apply/bind.\n\n## bind, call et apply : reprendre le contrôle\n\nfonction.call(objet, arg1) exécute immédiatement la fonction avec this fixé sur objet. fonction.bind(objet) retourne une nouvelle fonction où this est fixé de façon permanente, très utile pour passer une méthode de classe comme callback sans perdre son contexte. apply fait comme call mais accepte les arguments sous forme de tableau.\n\n- Un gestionnaire d'événement DOM classique reçoit this = l'élément qui a déclenché l'événement\n- Les arrow functions n'ont pas leur propre this : elles héritent de celui du contexte englobant (vu au module 1)\n- bind() une fois dans un constructeur de classe règle définitivement les soucis de this dans les callbacks\n- En mode strict (implicite dans les modules ES et les classes), this vaut undefined plutôt que l'objet global lors d'un appel simple"
        }
      ]
    },
    {
      "order": 4,
      "title": "Design patterns et performance",
      "summary": "Les mêmes problèmes reviennent dans tous les projets JavaScript de taille : ce module donne les solutions éprouvées, reconnues par toute équipe senior.",
      "minutes": 44,
      "lessons": [
        {
          "order": 1,
          "title": "Patterns essentiels : Module, Observer, Singleton",
          "minutes": 15,
          "content": "Le pattern Module encapsule un état privé et n'expose qu'une API publique volontaire — c'est exactement ce que permettent les closures vues plus haut, ou plus simplement les modules ES avec leurs exports choisis. Le pattern Observer (ou Pub/Sub) découple un émetteur d'événements de ses abonnés : un système d'événements DOM classique, ou une librairie de state management, applique ce pattern sans le nommer.\n\n## Singleton : à utiliser avec prudence\n\nUn Singleton garantit qu'une seule instance d'un objet existe dans toute l'application (une connexion à une base de données, une configuration globale). En JavaScript, un module ES est déjà un singleton naturel puisqu'il ne s'exécute qu'une fois — inutile de réinventer un pattern de classe compliqué pour ce besoin précis.\n\n- L'Observer est à la base de tous les frameworks réactifs (React, Vue) sous une forme ou une autre\n- Un pattern n'est utile que s'il résout un vrai problème : ne pas en abuser par principe\n- Le pattern Factory centralise la création d'objets complexes derrière une seule fonction\n- Documenter le pattern utilisé dans les commentaires aide énormément une équipe qui reprend le code"
        },
        {
          "order": 2,
          "title": "Debounce, throttle et mémoïsation : les optimisations qui comptent",
          "minutes": 15,
          "content": "Un événement scroll ou resize peut se déclencher des centaines de fois par seconde : exécuter une logique lourde à chaque déclenchement fait ramer n'importe quelle page. Le debounce retarde l'exécution jusqu'à ce que l'événement cesse pendant un délai donné (idéal pour une recherche en temps réel), tandis que le throttle garantit une exécution au maximum une fois par intervalle (idéal pour un scroll continu).\n\n## La mémoïsation : ne jamais recalculer deux fois\n\nLa mémoïsation met en cache le résultat d'une fonction pure selon ses arguments : si elle est rappelée avec les mêmes arguments, le résultat en cache est retourné immédiatement, sans recalcul. C'est le principe derrière useMemo en React, mais il s'implémente aussi à la main avec une simple Map en dehors de tout framework.\n\n- Un debounce de 300 ms sur un champ de recherche évite une requête réseau par caractère tapé\n- Le throttle protège aussi les API externes des dépassements de quota\n- La mémoïsation ne fonctionne bien que sur des fonctions pures (même entrée = même sortie, toujours)\n- Une Map se vide rarement seule : prévoir une limite de taille pour éviter une fuite mémoire à long terme"
        },
        {
          "order": 3,
          "title": "Tests unitaires et qualité de code JavaScript",
          "minutes": 14,
          "content": "Un test unitaire vérifie qu'une fonction isolée produit le résultat attendu pour des entrées données, sans dépendre du reste de l'application. Des librairies comme Vitest ou Jest structurent ces tests avec describe() (regroupement) et it() ou test() (cas individuel), et fournissent des assertions expressives comme expect(resultat).toBe(valeurAttendue).\n\n## Ce qui rend un test vraiment utile\n\nUn bon test unitaire couvre le cas normal, un cas limite (tableau vide, valeur nulle) et un cas d'erreur attendu — trois lignes de défense contre les régressions futures. Les mocks remplacent une dépendance externe (appel réseau, base de données) par une version contrôlée, pour tester la logique sans dépendre d'un service réel qui pourrait échouer indépendamment du code testé.\n\n- Un code difficile à tester est souvent un signal que sa structure devrait être revue\n- La couverture de test (coverage) est un indicateur utile, jamais un objectif en soi\n- Testez le comportement observable (l'entrée et la sortie), pas les détails d'implémentation internes\n- Un pipeline d'intégration continue qui lance les tests à chaque push évite les régressions silencieuses"
        }
      ]
    }
  ]
};
