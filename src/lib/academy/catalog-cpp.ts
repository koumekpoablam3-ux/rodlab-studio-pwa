import type { CourseSeed } from "./types";

/**
 * RODLAB ACADEMY — Catalogue programmation
 * Cours : « C++ avancé »
 */
export const COURSE_CPP: CourseSeed = {
  "slug": "cpp-avance",
  "title": "C++ avancé : mémoire, templates et concurrence",
  "subtitle": "Pointeurs, smart pointers, templates génériques, STL avancée et multi-threading — le niveau attendu d'un développeur C++ professionnel.",
  "description": "Cette formation s'adresse à ceux qui connaissent déjà la syntaxe de base du C++ et veulent maîtriser ce qui distingue un développeur C++ senior : gestion fine de la mémoire, RAII et smart pointers, templates génériques, conteneurs et algorithmes de la STL, et une introduction sérieuse au multi-threading. 4 modules, 12 leçons, puis un examen final de 8 questions pour obtenir votre certificat RodLab Studio.",
  "level": "Avancé",
  "durationHours": 16,
  "skills": [
    "Comprendre et gérer la mémoire dynamique sans fuite",
    "Utiliser les smart pointers pour une gestion mémoire automatique et sûre",
    "Écrire des templates génériques réutilisables",
    "Exploiter les conteneurs et algorithmes de la STL efficacement",
    "Appliquer le polymorphisme et l'héritage de façon rigoureuse",
    "Introduire du multi-threading sûr avec mutex et RAII"
  ],
  "modules": [
    {
      "order": 1,
      "title": "Mémoire et pointeurs avancés",
      "summary": "La gestion manuelle de la mémoire est ce qui distingue le C++ de la plupart des langages modernes : bien comprise, elle donne un contrôle inégalé sur la performance.",
      "minutes": 48,
      "lessons": [
        {
          "order": 1,
          "title": "Pile, tas et durée de vie des objets",
          "minutes": 16,
          "content": "Une variable locale classique vit sur la pile (stack) : sa mémoire est allouée et libérée automatiquement à l'entrée et à la sortie de son bloc, à un coût quasi nul. Une allocation dynamique avec new vit sur le tas (heap) : sa durée de vie est contrôlée manuellement par le programmeur, et doit obligatoirement être libérée avec delete, sinon la mémoire reste occupée pour toute la durée du programme — une fuite mémoire.\n\n## Pourquoi ce choix a un coût réel\n\nAllouer sur le tas est plus lent que sur la pile (recherche d'un emplacement libre, gestion de la fragmentation), et introduit un risque d'oubli. La règle professionnelle moderne : préférer systématiquement la pile et les conteneurs de la STL, et ne recourir à new que lorsque la durée de vie d'un objet doit dépasser son bloc d'origine.\n\n- Un pointeur qui pointe vers une mémoire déjà libérée (dangling pointer) est une des causes de bug les plus graves en C++\n- delete[] doit toujours correspondre à new[] (tableau), jamais à un simple delete\n- Une variable de pile disparaît à la fermeture de l'accolade de son bloc, même si un pointeur y fait encore référence\n- Valgrind ou AddressSanitizer détectent fuites mémoire et accès invalides bien plus vite qu'une relecture manuelle"
        },
        {
          "order": 2,
          "title": "Smart pointers : unique_ptr, shared_ptr et RAII",
          "minutes": 17,
          "content": "RAII (Resource Acquisition Is Initialization) est le principe central du C++ moderne : une ressource (mémoire, fichier, verrou) est acquise dans le constructeur d'un objet et libérée automatiquement dans son destructeur, y compris en cas d'exception. Les smart pointers appliquent ce principe à la mémoire dynamique, rendant delete manuel quasiment obsolète dans du code moderne.\n\n## Choisir entre unique_ptr et shared_ptr\n\nstd::unique_ptr représente une propriété exclusive : un seul pointeur possède l'objet, et sa destruction libère automatiquement la mémoire — c'est le choix par défaut recommandé dans la grande majorité des cas. std::shared_ptr autorise plusieurs propriétaires simultanés via un compteur de références partagé, mais coûte plus cher en performance et peut créer des cycles de références qui empêchent toute libération.\n\n- std::make_unique<T>() et std::make_shared<T>() sont préférables à new direct : plus sûrs face aux exceptions\n- std::weak_ptr casse les cycles de référence en observant un shared_ptr sans en augmenter le compteur\n- Un unique_ptr ne peut pas être copié, seulement déplacé (std::move) : cela garantit l'unicité de propriété\n- Le C++ moderne (11 et plus) rend l'usage direct de new/delete rare, réservé à des cas très spécifiques"
        },
        {
          "order": 3,
          "title": "Références, const et sémantique de déplacement (move)",
          "minutes": 15,
          "content": "Passer un objet volumineux par valeur en copie son contenu entier, ce qui coûte cher pour de grandes structures. Passer par référence (T&) évite cette copie, et ajouter const (const T&) garantit en plus que la fonction appelée ne modifiera pas l'original — un contrat de lecture seule vérifié par le compilateur.\n\n## Le déplacement : transférer sans copier\n\nstd::move ne déplace physiquement rien : il transforme une référence en référence rvalue (T&&), signalant au compilateur qu'il peut « voler » les ressources internes de l'objet source plutôt que de les copier. Un vector de dix mille éléments retourné par une fonction se déplace ainsi en temps constant, plutôt que de copier chaque élément.\n\n- Une référence rvalue (T&&) apparaît dans les constructeurs et opérateurs d'affectation de déplacement\n- Après un std::move, l'objet source se retrouve dans un état valide mais indéterminé : ne plus s'y fier\n- Les conteneurs de la STL (vector, string) implémentent tous une sémantique de déplacement efficace depuis C++11\n- Passer par valeur reste parfaitement acceptable pour de petits types (int, bool, pointeurs) : la référence n'apporte alors aucun gain"
        }
      ]
    },
    {
      "order": 2,
      "title": "Programmation orientée objet avancée",
      "summary": "Le C++ pousse l'orientation objet plus loin que la plupart des langages, avec un contrôle fin du polymorphisme et du coût de chaque abstraction.",
      "minutes": 46,
      "lessons": [
        {
          "order": 1,
          "title": "Héritage, polymorphisme et fonctions virtuelles",
          "minutes": 16,
          "content": "Une fonction déclarée virtual dans une classe de base permet à une classe dérivée de la redéfinir, et garantit qu'un appel via un pointeur de type base exécutera bien la version de la classe réelle de l'objet — c'est le polymorphisme dynamique, résolu à l'exécution via une table de fonctions virtuelles (vtable) plutôt qu'à la compilation.\n\n## Le coût et les bonnes pratiques\n\nCe mécanisme a un coût mesurable (une indirection supplémentaire à chaque appel), justifié uniquement quand le polymorphisme dynamique est réellement nécessaire. Une classe de base destinée à être héritée doit presque toujours déclarer son destructeur virtual, sinon détruire un objet dérivé via un pointeur de base ne libère pas correctement les ressources de la partie dérivée.\n\n- override (C++11) sur une méthode dérivée fait vérifier par le compilateur qu'elle redéfinit bien une méthode virtuelle existante\n- Une classe avec au moins une méthode virtuelle pure (= 0) est abstraite : elle ne peut pas être instanciée directement\n- L'héritage multiple existe en C++ mais introduit des ambiguïtés (problème du « diamant ») à gérer avec l'héritage virtuel\n- Préférer la composition à l'héritage quand la relation n'est pas clairement polymorphique"
        },
        {
          "order": 2,
          "title": "Surcharge d'opérateurs : rendre une classe naturelle à utiliser",
          "minutes": 15,
          "content": "La surcharge d'opérateurs (operator+, operator==, operator<<) permet à une classe personnalisée (comme un type Vecteur2D ou Fraction) de s'utiliser avec la même syntaxe naturelle que les types natifs : v1 + v2 plutôt que v1.additionner(v2). Utilisée avec discipline, elle rend le code beaucoup plus lisible qu'une multiplication d'appels de méthodes.\n\n## Les règles de bon usage\n\nUn opérateur surchargé doit toujours respecter le sens intuitif de l'opérateur d'origine : surcharger + pour effectuer une soustraction serait un piège pour quiconque lit le code. operator<< surchargé sur std::ostream permet d'écrire std::cout << monObjet directement, un usage extrêmement fréquent en pratique pour le débogage.\n\n- Les opérateurs de comparaison (==, <) doivent être cohérents entre eux si plusieurs sont définis\n- operator= (affectation) doit être défini avec soin dès qu'une classe gère une ressource dynamique (règle des trois/cinq)\n- Ne surchargez un opérateur que si le résultat reste intuitif : dans le doute, une méthode nommée est plus claire\n- Les opérateurs d'incrémentation (++) existent en version préfixe et postfixe, avec des signatures légèrement différentes"
        },
        {
          "order": 3,
          "title": "La règle des trois, cinq et zéro",
          "minutes": 15,
          "content": "Dès qu'une classe gère une ressource manuellement (mémoire, fichier), le compilateur génère par défaut un constructeur de copie, un opérateur d'affectation et un destructeur — mais ces versions par défaut copient superficiellement les pointeurs, ce qui provoque des doubles libérations ou des fuites. La règle des trois impose de définir explicitement ces trois méthodes ensemble dès que l'une d'elles est nécessaire.\n\n## L'évolution vers la règle de cinq, puis de zéro\n\nC++11 ajoute le constructeur de déplacement et l'opérateur d'affectation par déplacement, formant la règle des cinq pour les classes qui gèrent des ressources et veulent être performantes. La règle de zéro, la plus élégante, consiste à ne définir aucune de ces méthodes en s'appuyant entièrement sur des membres qui les gèrent déjà eux-mêmes (comme unique_ptr ou vector) — c'est l'approche recommandée en C++ moderne.\n\n- Une classe qui suit la règle de zéro délègue toute la gestion de ressources à ses membres, jamais à elle-même directement\n- = default sur un constructeur ou destructeur force explicitement la version générée par le compilateur\n- = delete interdit explicitement une opération (empêcher la copie d'un objet, par exemple)\n- Bien appliquée, la règle de zéro élimine la quasi-totalité des bugs classiques de gestion mémoire en C++"
        }
      ]
    },
    {
      "order": 3,
      "title": "Templates et STL avancée",
      "summary": "Les templates et la bibliothèque standard sont ce qui rend le C++ à la fois performant et expressif — les comprendre en profondeur change la façon d'écrire du code réutilisable.",
      "minutes": 47,
      "lessons": [
        {
          "order": 1,
          "title": "Templates de fonctions et de classes : la généricité sans coût",
          "minutes": 16,
          "content": "Un template permet d'écrire une fonction ou une classe une seule fois pour n'importe quel type, sans perte de performance : le compilateur génère une version spécifique du code pour chaque type réellement utilisé (instanciation), ce qui élimine le coût d'indirection que d'autres langages paient avec des types génériques réellement dynamiques.\n\n## template<typename T> en pratique\n\ntemplate<typename T> T maximum(T a, T b) { return a > b ? a : b; } fonctionne indifféremment avec des int, des double ou tout type qui définit l'opérateur >, sans qu'aucune duplication de code ne soit nécessaire. Les classes suivent le même principe : std::vector<T> est elle-même un template, capable de contenir n'importe quel type sans réécrire son code.\n\n- Chaque instanciation d'un template génère du code binaire distinct : gain de performance contre une taille d'exécutable plus grande\n- Les erreurs de compilation sur les templates sont historiquement verbeuses ; les concepts (C++20) les rendent bien plus lisibles\n- Un template peut avoir des paramètres non-type (comme une taille de tableau fixe connue à la compilation)\n- La spécialisation de template permet un comportement différent pour un type précis, tout en gardant la version générique pour les autres"
        },
        {
          "order": 2,
          "title": "Conteneurs STL : choisir la bonne structure de données",
          "minutes": 16,
          "content": "std::vector offre un accès en temps constant par index et une excellente localité mémoire (les éléments sont contigus), ce qui en fait le conteneur par défaut recommandé dans la grande majorité des cas — même quand une insertion en milieu de liste semble justifier autre chose. std::list (liste doublement chaînée) n'excelle que pour des insertions/suppressions fréquentes au milieu, mais perd l'accès direct par index et la localité mémoire.\n\n## Map, set et leurs versions non ordonnées\n\nstd::map et std::set maintiennent leurs éléments triés (arbre équilibré, opérations en O(log n)), tandis que std::unordered_map et std::unordered_set utilisent une table de hachage (opérations en O(1) amorti, mais sans ordre garanti). Le choix dépend d'un besoin réel de tri ou non — sans ce besoin, la version non ordonnée est presque toujours plus rapide.\n\n- vector reste le choix par défaut : ne passez à un autre conteneur que si un profilage justifie le changement\n- reserve() sur un vector évite des réallocations répétées quand la taille finale est connue à l'avance\n- std::array offre la performance d'un tableau C classique avec la sécurité d'une taille connue à la compilation\n- Mesurer avant de choisir : l'intuition sur la structure « la plus rapide » se trompe souvent selon le contexte réel"
        },
        {
          "order": 3,
          "title": "Algorithmes STL et lambdas : écrire moins de boucles manuelles",
          "minutes": 15,
          "content": "La bibliothèque <algorithm> propose des fonctions génériques testées et optimisées (std::sort, std::find, std::transform, std::accumulate) qui remplacent la plupart des boucles for manuelles, avec un code plus court, plus lisible et souvent plus performant qu'une implémentation artisanale.\n\n## Lambdas : des fonctions anonymes sur mesure\n\nUne lambda ([capture](parametres) { corps }) définit une fonction inline directement à l'endroit où elle est utilisée, typiquement comme critère de tri ou de filtrage : std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; }) trie en ordre décroissant sans fonction nommée séparée. Les crochets de capture permettent d'utiliser des variables du contexte environnant à l'intérieur de la lambda.\n\n- std::for_each applique une fonction à chaque élément, mais une boucle for range-based (for (auto& x : v)) reste souvent plus lisible pour ce cas simple\n- Les itérateurs (begin(), end()) sont l'interface commune qui permet aux algorithmes de fonctionner sur n'importe quel conteneur\n- [&] capture toutes les variables par référence dans une lambda, [=] les capture toutes par valeur\n- Les algorithmes STL bien choisis expriment l'intention (trier, chercher, transformer) plus clairement qu'une boucle générique"
        }
      ]
    },
    {
      "order": 4,
      "title": "Concurrence et bonnes pratiques modernes",
      "summary": "Le multi-threading en C++ demande une rigueur particulière : ce module pose les bases sûres avant d'aborder des architectures concurrentes plus complexes.",
      "minutes": 45,
      "lessons": [
        {
          "order": 1,
          "title": "std::thread et la synchronisation avec mutex",
          "minutes": 16,
          "content": "std::thread lance une fonction sur un thread séparé, permettant à plusieurs tâches de s'exécuter en parallèle sur des cœurs différents. Mais dès que plusieurs threads accèdent à la même donnée en écriture, une condition de course (race condition) devient possible : deux threads qui modifient une même variable simultanément produisent un résultat imprévisible, différent à chaque exécution.\n\n## std::mutex : protéger l'accès partagé\n\nUn std::mutex garantit qu'un seul thread à la fois exécute la section de code qu'il protège : mutex.lock() avant l'accès partagé, mutex.unlock() après. En pratique, on utilise presque toujours std::lock_guard<std::mutex>, qui applique RAII (vu au module 1) pour garantir le déverrouillage même en cas d'exception, sans jamais oublier un unlock manuel.\n\n- Un verrou oublié (lock sans unlock correspondant) bloque définitivement tous les autres threads qui l'attendent (deadlock)\n- std::lock_guard verrouille à sa construction et déverrouille automatiquement à sa destruction : toujours préférable à un verrouillage manuel\n- join() sur un thread attend sa terminaison ; detach() le laisse s'exécuter indépendamment (à manier avec grande prudence)\n- Deux mutex verrouillés dans un ordre différent par deux threads différents peuvent produire un deadlock croisé"
        },
        {
          "order": 2,
          "title": "Variables atomiques et alternatives sans verrou",
          "minutes": 15,
          "content": "Pour une simple variable partagée (un compteur, un drapeau booléen), un mutex complet peut être excessif : std::atomic<int> garantit des opérations indivisibles (incrémentation, lecture, écriture) sans jamais nécessiter de verrouillage explicite, avec un coût de performance généralement inférieur à un mutex classique.\n\n## Quand un atomic suffit, quand il ne suffit pas\n\nstd::atomic convient parfaitement à une opération unique et indivisible comme compteur++, mais ne protège pas une séquence de plusieurs opérations liées entre elles (lire puis modifier puis écrire une structure complexe) — dans ce cas, un mutex reste nécessaire pour garantir la cohérence de l'ensemble de la séquence.\n\n- std::atomic<bool> convient parfaitement à un simple drapeau d'arrêt partagé entre threads\n- Les opérations atomiques composées (fetch_add, compare_exchange) évitent des verrous pour des cas précis et fréquents\n- La programmation sans verrou (lock-free) au-delà des types atomiques simples reste un domaine expert, à aborder avec prudence\n- Un profilage réel doit confirmer qu'un mutex est effectivement un goulot d'étranglement avant de le remplacer par de l'atomique"
        },
        {
          "order": 3,
          "title": "Bonnes pratiques modernes : C++17/20 et compilation",
          "minutes": 14,
          "content": "Le C++ moderne (11 à 20 et plus) a considérablement réduit le besoin de gestion manuelle risquée : auto pour l'inférence de type, les structured bindings pour décomposer une paire ou un tuple directement, std::optional pour représenter une valeur potentiellement absente sans recourir à un pointeur nul.\n\n## Ce qui distingue un code C++ senior aujourd'hui\n\nUn code C++ moderne évite presque totalement new/delete manuels (remplacés par les smart pointers), les tableaux C bruts (remplacés par vector et array), et les pointeurs nuls non vérifiés (remplacés par optional et des références). Activer les avertissements stricts du compilateur (-Wall -Wextra) et les traiter comme des erreurs révèle une quantité surprenante de bugs latents avant même l'exécution.\n\n- std::optional<T> évite de retourner un pointeur nul pour signaler une absence de valeur\n- structured bindings : auto [cle, valeur] = *map.begin(); décompose directement une paire\n- Les outils d'analyse statique (clang-tidy) détectent des erreurs de style et de sûreté avant la compilation\n- CMake reste l'outil de build standard de l'écosystème C++ moderne, indépendant du compilateur utilisé"
        }
      ]
    }
  ]
};
