import type { CourseSeed } from "./types";

/**
 * RODLAB ACADEMY — Catalogue programmation
 * Cours : « Python avancé »
 */
export const COURSE_PYTHON: CourseSeed = {
  "slug": "python-avance",
  "title": "Python avancé : POO, décorateurs, async et packaging",
  "subtitle": "Programmation orientée objet poussée, décorateurs, générateurs, asyncio et bonnes pratiques de test — le niveau attendu d'un développeur Python professionnel.",
  "description": "Cette formation s'adresse à ceux qui connaissent déjà les bases de Python et veulent écrire du code de niveau professionnel : POO avancée avec propriétés et mixins, décorateurs et générateurs, programmation asynchrone avec asyncio, tests et packaging. 4 modules, 12 leçons, puis un examen final de 8 questions pour obtenir votre certificat RodLab Studio.",
  "level": "Avancé",
  "durationHours": 16,
  "skills": [
    "Concevoir des hiérarchies de classes propres avec héritage et mixins",
    "Créer et utiliser des décorateurs pour éviter la duplication de code",
    "Écrire des générateurs efficaces en mémoire pour de gros volumes de données",
    "Programmer de façon asynchrone avec asyncio",
    "Structurer, tester et packager un projet Python professionnel",
    "Appliquer les bonnes pratiques PEP 8 et le typage statique (type hints)"
  ],
  "modules": [
    {
      "order": 1,
      "title": "Programmation orientée objet avancée",
      "summary": "Au-delà des classes de base, Python offre des mécanismes puissants (propriétés, mixins, méthodes spéciales) qui permettent d'écrire un code orienté objet réellement élégant.",
      "minutes": 48,
      "lessons": [
        {
          "order": 1,
          "title": "Propriétés et encapsulation : @property en profondeur",
          "minutes": 16,
          "content": "Python n'impose aucune restriction d'accès stricte (pas de vrai « private ») : la convention _nom signale une intention interne, mais reste accessible. Le décorateur @property transforme une méthode en attribut en apparence simple, tout en gardant la possibilité d'exécuter une logique de validation à chaque lecture ou écriture — sans jamais changer l'API vue par l'utilisateur de la classe.\n\n## Un exemple qui justifie son usage\n\nclass Compte: def __init__(self, solde): self._solde = solde puis @property def solde(self): return self._solde et @solde.setter def solde(self, valeur): si valeur < 0 : lever une erreur, sinon assigner. L'appelant écrit toujours compte.solde = 100 de façon naturelle, sans savoir qu'une validation s'exécute derrière.\n\n- @property permet de démarrer avec un attribut public simple et d'ajouter une validation plus tard sans casser le code appelant\n- Un attribut en lecture seule s'obtient en définissant @property sans setter correspondant\n- Les propriétés calculées (par exemple une surface dérivée de largeur et hauteur) évitent de stocker une donnée redondante\n- Trop de propriétés avec une logique lourde nuit à la lisibilité : réserver ce mécanisme aux vraies validations"
        },
        {
          "order": 2,
          "title": "Héritage, mixins et méthode de résolution (MRO)",
          "minutes": 16,
          "content": "Python autorise l'héritage multiple, ce que peu de langages orientés objet permettent aussi simplement. Un mixin est une classe conçue pour apporter une fonctionnalité ponctuelle (par exemple JournalisationMixin qui ajoute une méthode log()) à combiner avec l'héritage principal, sans former une hiérarchie « is-a » complète.\n\n## Comment Python résout les conflits d'héritage multiple\n\nQuand plusieurs classes parentes définissent la même méthode, Python suit le MRO (Method Resolution Order), calculé par l'algorithme C3, et consultable via MaClasse.__mro__. Ce mécanisme garantit un ordre cohérent et déterministe, même dans des hiérarchies complexes à plusieurs niveaux.\n\n- Un mixin ne doit jamais avoir de constructeur __init__ qui exige des arguments obligatoires\n- super() appelle la méthode suivante dans l'ordre du MRO, pas nécessairement le parent direct\n- Préférez la composition à l'héritage quand la relation n'est pas clairement « est un »\n- Les mixins fonctionnent particulièrement bien pour ajouter des comportements transverses (sérialisation, comparaison, logs)"
        },
        {
          "order": 3,
          "title": "Méthodes spéciales (dunder) : personnaliser le comportement natif",
          "minutes": 16,
          "content": "Les méthodes entourées de doubles underscores (__init__, __str__, __eq__, __len__) permettent à une classe personnalisée de se comporter comme un type natif : print(objet) appelle automatiquement __str__, len(objet) appelle __len__, objet1 == objet2 appelle __eq__. C'est ce mécanisme qui rend Python si cohérent entre ses types natifs et les classes personnalisées.\n\n## Les dunder les plus utiles au quotidien\n\n__repr__ doit retourner une représentation non ambiguë utile au débogage (souvent le code qui recréerait l'objet), tandis que __str__ retourne une version lisible pour l'utilisateur final — les deux servent des publics différents. __eq__ et __hash__ doivent être définis ensemble : un objet comparé par valeur doit aussi être hashable de façon cohérente pour fonctionner dans un set ou comme clé de dict.\n\n- @dataclass génère automatiquement __init__, __repr__ et __eq__ pour les classes qui stockent surtout des données\n- __enter__ et __exit__ implémentent le protocole des context managers utilisé par with\n- __iter__ et __next__ rendent un objet itérable, exploitable dans une boucle for\n- Ne redéfinissez ces méthodes que si le comportement natif ne convient pas : la sur-ingénierie nuit à la lisibilité"
        }
      ]
    },
    {
      "order": 2,
      "title": "Décorateurs, générateurs et context managers",
      "summary": "Ces trois mécanismes distinguent souvent un code Python débutant d'un code Python idiomatique et efficace en mémoire.",
      "minutes": 47,
      "lessons": [
        {
          "order": 1,
          "title": "Décorateurs : envelopper une fonction sans la modifier",
          "minutes": 16,
          "content": "Un décorateur est une fonction qui prend une autre fonction en argument et retourne une version enrichie de celle-ci, sans jamais toucher au code source original. C'est le mécanisme derrière @property vu précédemment, mais aussi derrière la journalisation automatique, la mesure de temps d'exécution ou la mise en cache — des besoins transverses qui reviennent dans presque tout projet.\n\n## Écrire son premier décorateur utile\n\ndef chronometre(fonction): def wrapper(*args, **kwargs): debut = time.time(); resultat = fonction(*args, **kwargs); print(time.time() - debut); return resultat; return wrapper. Appliqué avec @chronometre au-dessus d'une fonction, ce décorateur mesure et affiche son temps d'exécution à chaque appel, sans une seule ligne modifiée dans la fonction elle-même.\n\n- functools.wraps préserve le nom et la documentation de la fonction originale à travers le décorateur\n- Un décorateur peut accepter ses propres arguments en ajoutant un niveau de fonction supplémentaire\n- functools.lru_cache est un décorateur natif de mémoïsation, prêt à l'emploi sur les fonctions pures\n- Plusieurs décorateurs s'empilent et s'appliquent du plus proche de la fonction vers le plus éloigné"
        },
        {
          "order": 2,
          "title": "Générateurs et yield : traiter des données sans tout charger en mémoire",
          "minutes": 16,
          "content": "Une fonction contenant yield devient un générateur : au lieu de retourner une valeur unique et de terminer, elle produit une séquence de valeurs à la demande, en suspendant son exécution entre chaque appel. Pour traiter un fichier de plusieurs gigaoctets ligne par ligne, un générateur consomme une mémoire quasi constante, contrairement à une liste qui chargerait tout d'un coup.\n\n## Expressions génératrices et pipelines de traitement\n\n(x * 2 for x in range(1000000)) crée un générateur sans jamais matérialiser la liste complète — la syntaxe ressemble à une liste en compréhension, mais avec des parenthèses au lieu de crochets. Plusieurs générateurs peuvent s'enchaîner en pipeline, chaque étape ne traitant qu'un élément à la fois, ce qui garde une empreinte mémoire minimale même sur des volumes énormes.\n\n- yield from délègue à un autre générateur, utile pour composer des générateurs imbriqués\n- Un générateur ne peut être parcouru qu'une seule fois : il s'épuise après consommation complète\n- next(generateur) avance manuellement d'un pas ; une boucle for le fait automatiquement jusqu'à épuisement\n- Les générateurs sont la base des itérateurs paresseux (lazy evaluation) très utilisés en traitement de données"
        },
        {
          "order": 3,
          "title": "Context managers : garantir le nettoyage avec with",
          "minutes": 15,
          "content": "L'instruction with garantit qu'une ressource (fichier, connexion réseau, verrou) est correctement libérée même si une exception survient au milieu du bloc — c'est l'équivalent Python d'un try/finally systématique, mais bien plus lisible. with open(\"fichier.txt\") as f: ferme automatiquement le fichier à la sortie du bloc, qu'il y ait erreur ou non.\n\n## Créer son propre context manager\n\nUne classe implémentant __enter__ (exécuté à l'entrée du bloc) et __exit__ (exécuté à la sortie, même en cas d'exception) devient utilisable avec with. Le module contextlib propose aussi @contextmanager, qui transforme une simple fonction génératrice en context manager complet, souvent plus rapide à écrire qu'une classe entière pour un besoin ponctuel.\n\n- __exit__ reçoit les informations de l'exception éventuelle et peut décider de la propager ou de l'absorber\n- Plusieurs context managers peuvent se combiner sur une seule ligne : with open(a) as fa, open(b) as fb:\n- Les verrous de threading (threading.Lock) s'utilisent presque toujours via with pour éviter un oubli de libération\n- contextlib.suppress(Exception) simplifie l'ignorance volontaire d'un type d'erreur précis"
        }
      ]
    },
    {
      "order": 3,
      "title": "Programmation asynchrone et concurrence",
      "summary": "Python propose plusieurs modèles de concurrence, chacun adapté à un type de problème différent — les confondre est une source fréquente d'erreurs de performance.",
      "minutes": 46,
      "lessons": [
        {
          "order": 1,
          "title": "asyncio : async/await pour les opérations d'entrée-sortie",
          "minutes": 16,
          "content": "asyncio permet d'exécuter de nombreuses opérations d'entrée-sortie (requêtes réseau, accès disque) de façon concurrente sur un seul thread, en libérant le processeur pendant chaque attente au lieu de le bloquer. Une fonction définie avec async def devient une coroutine, qui ne s'exécute pas immédiatement à l'appel mais doit être awaited ou planifiée sur une boucle d'événements.\n\n## Lancer plusieurs tâches en parallèle\n\nasyncio.gather(tache1(), tache2(), tache3()) exécute plusieurs coroutines de façon concurrente et attend qu'elles se terminent toutes, ce qui peut réduire drastiquement le temps total par rapport à des appels séquentiels avec await successifs. C'est le principe le plus rentable d'asyncio : de nombreuses attentes réseau qui se superposent plutôt que de s'additionner.\n\n- asyncio n'apporte aucun bénéfice sur du calcul pur (CPU-bound) : il excelle uniquement sur l'attente d'entrées-sorties\n- asyncio.sleep() doit remplacer time.sleep() dans une coroutine, sinon toute la boucle d'événements se bloque\n- Un projet asyncio mélange rarement du code synchrone bloquant sans l'isoler explicitement (run_in_executor)\n- FastAPI et de nombreux frameworks web modernes en Python s'appuient nativement sur asyncio"
        },
        {
          "order": 2,
          "title": "Threading vs multiprocessing : choisir le bon modèle",
          "minutes": 15,
          "content": "Le Global Interpreter Lock (GIL) empêche deux threads Python d'exécuter du bytecode Python simultanément sur plusieurs cœurs — ce qui rend le threading efficace pour l'attente d'entrées-sorties (un thread peut attendre pendant qu'un autre travaille) mais inutile pour accélérer du calcul pur intensif en CPU.\n\n## Quand utiliser multiprocessing\n\nPour un calcul lourd (traitement d'image, calcul scientifique) qui doit exploiter plusieurs cœurs réellement, multiprocessing lance des processus séparés, chacun avec son propre interpréteur Python et donc son propre GIL — un vrai parallélisme, au prix d'une communication inter-processus plus coûteuse que le partage de mémoire d'un thread.\n\n- I/O-bound (attente réseau, disque) → threading ou asyncio ; CPU-bound (calcul intensif) → multiprocessing\n- concurrent.futures.ThreadPoolExecutor et ProcessPoolExecutor offrent une API unifiée simple pour les deux modèles\n- Les processus ne partagent pas la mémoire par défaut : il faut des mécanismes explicites (Queue, Value) pour communiquer\n- Un mauvais choix de modèle ne provoque pas d'erreur visible, seulement une absence de gain de performance"
        },
        {
          "order": 3,
          "title": "Profiling : mesurer avant d'optimiser",
          "minutes": 15,
          "content": "Optimiser sans mesurer conduit presque toujours à optimiser la mauvaise partie du code : l'intuition sur ce qui est lent se trompe très souvent. Le module cProfile exécute un programme et rapporte le temps cumulé passé dans chaque fonction, révélant les vrais points chauds (« hot paths ») plutôt que des suppositions.\n\n## Une méthode simple et fiable\n\npython -m cProfile -s cumulative mon_script.py affiche un classement des fonctions les plus coûteuses en temps cumulé. Une fois le vrai goulot d'étranglement identifié, souvent 80 % du temps se concentre dans 20 % du code — inutile d'optimiser le reste, l'effort doit se concentrer sur cette portion précise.\n\n- timeit mesure précisément le temps d'un petit fragment de code, utile pour comparer deux implémentations\n- Une structure de données mal choisie (liste au lieu de set pour une recherche d'appartenance) coûte souvent plus qu'un algorithme mal écrit\n- line_profiler va plus loin que cProfile en détaillant le coût ligne par ligne d'une fonction\n- Ne micro-optimisez jamais avant d'avoir un profil réel : le code lisible doit rester la priorité par défaut"
        }
      ]
    },
    {
      "order": 4,
      "title": "Qualité, tests et packaging professionnel",
      "summary": "Un code Python avancé ne se limite pas à la syntaxe : il doit être testé, typé et packagé pour être réutilisable en production ou partagé avec une équipe.",
      "minutes": 45,
      "lessons": [
        {
          "order": 1,
          "title": "Tests avec pytest : fixtures, paramétrage et mocks",
          "minutes": 16,
          "content": "pytest simplifie l'écriture de tests par rapport au module unittest natif : une fonction préfixée test_ suffit, avec de simples instructions assert, sans classe obligatoire ni méthodes de configuration verbeuses. Les fixtures (@pytest.fixture) préparent des données ou des ressources réutilisables entre plusieurs tests, injectées automatiquement en argument de la fonction de test.\n\n## Paramétrer un test pour couvrir plusieurs cas d'un coup\n\n@pytest.mark.parametrize(\"entree,attendu\", [(1, 2), (2, 4), (0, 0)]) exécute la même fonction de test pour chaque tuple de valeurs, évitant de dupliquer le même test trois fois avec seulement les données qui changent. Cette approche rend visible d'un coup d'œil l'ensemble des cas couverts par un test.\n\n- unittest.mock.patch remplace temporairement une dépendance externe (appel API, accès disque) par une version contrôlée\n- Une fixture avec yield exécute du code de nettoyage après le test, comme un context manager\n- pytest découvre automatiquement les fichiers test_*.py sans configuration supplémentaire\n- Un test qui dépend de l'ordre d'exécution des autres tests cache presque toujours un problème de conception"
        },
        {
          "order": 2,
          "title": "Type hints et vérification statique avec mypy",
          "minutes": 15,
          "content": "Python reste un langage dynamiquement typé à l'exécution, mais les annotations de type (def additionner(a: int, b: int) -> int) documentent l'intention et permettent à un outil comme mypy de détecter des incohérences avant même de lancer le programme — un filet de sécurité précieux sur un projet de taille importante.\n\n## Types avancés utiles au quotidien\n\nOptional[str] indique une valeur qui peut être une chaîne ou None ; Union[int, str] accepte plusieurs types possibles ; list[dict[str, int]] type précisément une structure imbriquée. TypedDict permet de typer un dictionnaire avec des clés précises, très utile pour documenter la forme d'une réponse d'API sans créer une classe complète.\n\n- Les type hints ne changent rien à l'exécution : Python les ignore totalement au runtime par défaut\n- mypy s'exécute en ligne de commande ou en intégration continue, indépendamment des tests unitaires\n- Protocol permet de typer un « duck typing » structurel sans exiger d'héritage explicite\n- Un projet peut adopter les type hints progressivement, fichier par fichier, sans tout réécrire d'un coup"
        },
        {
          "order": 3,
          "title": "Packaging : environnements virtuels et publication d'un paquet",
          "minutes": 14,
          "content": "Un environnement virtuel (python -m venv .venv) isole les dépendances d'un projet du reste du système, évitant les conflits de versions entre deux projets qui utiliseraient des bibliothèques différentes. C'est une pratique non négociable dès qu'un projet Python dépasse un simple script personnel.\n\n## Structurer un paquet installable\n\nUn projet packagé suit une structure reconnue : un fichier pyproject.toml décrivant le nom, la version et les dépendances, un dossier src/ contenant le code source, et éventuellement un dossier tests/ séparé. pip install -e . installe le projet en mode « éditable », pratique pendant le développement actif.\n\n- requirements.txt liste les dépendances exactes pour un déploiement reproductible\n- Séparer les dépendances de développement (tests, linters) des dépendances de production évite un déploiement alourdi\n- Un paquet publiable sur PyPI nécessite un nom unique, une licence et une documentation minimale (README)\n- Les outils modernes comme uv ou poetry simplifient la gestion des environnements et du packaging par rapport à pip seul"
        }
      ]
    }
  ]
};
