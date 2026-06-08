export const corpusOverview = {
  interviews: 413,
  hours: 796,
  transcripts: 413,
  recommendations: 2124,
  guests: 323,
  years: 14,
  period: "2013-2026",
  thesis:
    "Thinkerview apparaît comme une machine à forcer le retour du réel dans des sociétés qui vivent de plus en plus dans l’illusion procédurale, narrative ou technologique.",
  shortThesis:
    "Rien ne sera sauvé sans réapprentissage du réel : matière, puissance, transmission, vérité.",
};

export const corpusEvidence = [
  {
    label: "Dépendance productive",
    text:
      "La désindustrialisation revient comme la matrice de plusieurs impasses : déficit commercial, fragilité des chaînes d'approvisionnement, perte de savoir-faire et restriction des marges politiques.",
  },
  {
    label: "Dépendance numérique",
    text:
      "Clouds, plateformes, données et infrastructures logicielles forment une souveraineté invisible : celui qui possède les couches techniques possède aussi une part du pouvoir économique, politique et cognitif.",
  },
  {
    label: "Dépendance éducative",
    text:
      "L'affaiblissement de l'école et des filières techniques empêche de reconstituer les compétences nécessaires à la réindustrialisation, à la science appliquée et à la continuité civique.",
  },
  {
    label: "Dépendance financière",
    text:
      "La dette permet de différer les arbitrages, mais elle finit par déplacer le pouvoir vers les créanciers, les marchés, les normes extérieures et les institutions de contrainte.",
  },
];

export const annualDominantes = [
  { year: 2013, interviews: 12, dominant: "Géopolitique, médias, démocratie", reading: "Installation d'un format centré sur la conflictualité internationale, la fabrique du récit et la défiance démocratique." },
  { year: 2014, interviews: 8, dominant: "Démocratie, numérique, géopolitique", reading: "La question institutionnelle se mêle déjà à la mutation technique et aux rapports de puissance." },
  { year: 2015, interviews: 12, dominant: "Sécurité, géopolitique, démocratie", reading: "Les attentats, les guerres périphériques et la sécurité intérieure structurent fortement la période." },
  { year: 2016, interviews: 17, dominant: "Géopolitique, médias, sécurité", reading: "Le corpus insiste sur l'information comme terrain de bataille et sur le recul de la lecture stratégique." },
  { year: 2017, interviews: 29, dominant: "Géopolitique, énergie, numérique", reading: "Montée des dépendances techniques : infrastructures, énergie, données, souveraineté industrielle." },
  { year: 2018, interviews: 55, dominant: "Numérique, géopolitique, démocratie", reading: "Année d'expansion forte : les plateformes, l'IA, les mouvements sociaux et les récits publics deviennent centraux." },
  { year: 2019, interviews: 48, dominant: "Économie, démocratie, géopolitique", reading: "Les tensions sociales, la dette, la monnaie et la légitimité démocratique prennent une place majeure." },
  { year: 2020, interviews: 31, dominant: "Géopolitique, sécurité, numérique", reading: "La pandémie révèle la dépendance sanitaire, logistique, numérique et la fragilité des institutions." },
  { year: 2021, interviews: 35, dominant: "Sécurité, géopolitique, démocratie", reading: "Le débat se durcit autour de l'ordre civil, de la guerre informationnelle et de la capacité de l'État." },
  { year: 2022, interviews: 33, dominant: "Géopolitique, énergie, économie", reading: "La guerre en Ukraine réactive le prix de l'énergie, les alliances, les sanctions et la puissance industrielle." },
  { year: 2023, interviews: 36, dominant: "Énergie, économie, géopolitique", reading: "L'interdépendance entre climat, souveraineté productive, prix de l'énergie et réindustrialisation devient explicite." },
  { year: 2024, interviews: 31, dominant: "Géopolitique, justice, énergie", reading: "Le corpus articule conflictualité extérieure, fractures internes, droit, sécurité et infrastructures vitales." },
  { year: 2025, interviews: 46, dominant: "Géopolitique, énergie, démocratie", reading: "Retour massif des sujets de puissance, avec une inquiétude accrue sur la cohésion politique et le coût réel des choix." },
  { year: 2026, interviews: 20, dominant: "Géopolitique, énergie, démocratie", reading: "La séquence récente prolonge l'idée d'un basculement durable vers la contrainte matérielle et stratégique." },
];

export const thematicHierarchy = [
  { theme: "Géopolitique", count: 219, share: 53, note: "Puissance, guerre, alliances, renseignement, sanctions et souveraineté." },
  { theme: "Démocratie", count: 165, share: 40, note: "Institutions, légitimité, consentement, liberté publique et crise représentative." },
  { theme: "Sécurité", count: 149, share: 36, note: "Ordre civil, terrorisme, renseignement, armée, police et continuité de l'État." },
  { theme: "Économie", count: 148, share: 36, note: "Dette, monnaie, mondialisation, fiscalité, classes moyennes et commerce extérieur." },
  { theme: "Énergie", count: 148, share: 36, note: "Nucléaire, pétrole, gaz, transition, infrastructures et coût physique de la puissance." },
  { theme: "Numérique", count: 139, share: 34, note: "Données, IA, plateformes, cloud, surveillance et dépendance technologique." },
  { theme: "Médias", count: 115, share: 28, note: "Récit public, propagande, attention, polarisation et fabrication de l'agenda." },
  { theme: "Industrie", count: 91, share: 22, note: "Production, usines, souveraineté productive, filières et compétences techniques." },
  { theme: "Justice", count: 87, share: 21, note: "État de droit, corruption, sanctions, normes, arbitrages et conflictualité sociale." },
  { theme: "Agriculture", count: 58, share: 14, note: "Alimentation, sols, autonomie, ruralité, normes et ressources." },
];

export const causalChains = [
  {
    title: "Chaîne productive",
    steps: ["Désindustrialisation", "Importations subies", "Déficit commercial", "Dette", "Perte de marges politiques", "Colère sociale", "Souveraineté diminuée"],
  },
  {
    title: "Chaîne numérique",
    steps: ["Plateformes étrangères", "Clouds et métadonnées", "Perte de contrôle des données", "Vulnérabilité cognitive", "Colonisation invisible"],
  },
  {
    title: "Chaîne éducative",
    steps: ["École affaiblie", "Baisse du niveau scientifique et technique", "Manque d'ingénieurs, techniciens et ouvriers", "Réindustrialisation entravée", "Dépendance stratégique"],
  },
  {
    title: "Chaîne financière",
    steps: ["Dette", "Paix sociale achetée", "Arbitrages reportés", "Réforme impossible", "Crise différée", "Rupture brutale"],
  },
  {
    title: "Chaîne sociale",
    steps: ["Assimilation fragile", "Ségrégation", "Impuissance publique", "Fragmentation normative", "Demande d'ordre", "Conflit politique accru"],
  },
];

export const thoughtBlocks = [
  { title: "Géopolitique, guerre, renseignement", text: "Le monde n'est pas pacifié par le commerce : il reste structuré par la puissance, les rapports de force, l'information, les alliances et la préparation des chocs." },
  { title: "Industrie, énergie, production", text: "La souveraineté commence dans les usines, les réseaux, les mines, les centrales, les compétences et les chaînes logistiques." },
  { title: "Numérique, données, IA", text: "La couche numérique est devenue une infrastructure politique : elle organise l'accès au réel, aux marchés, à l'attention et à la mémoire collective." },
  { title: "Économie, finance, dette", text: "Le débat économique du corpus ramène la monnaie, la dette et le commerce extérieur à leur dimension politique." },
  { title: "Médias, récit, information", text: "Le récit public n'est pas secondaire : il sélectionne les problèmes visibles, fabrique l'urgence et rend certaines décisions pensables ou impensables." },
  { title: "Écologie, ressources, agriculture", text: "La contrainte écologique est traitée comme une contrainte physique, non comme un supplément moral : énergie, sols, eau, alimentation et climat fixent les limites." },
  { title: "École, transmission, formation", text: "La reconstruction dépend d'une capacité à transmettre des savoirs exigeants, des métiers, des habitudes de vérification et une culture historique." },
  { title: "Identité, immigration, sécurité", text: "Les entretiens relient cohésion sociale, ordre public et projet politique sans réduire ces sujets à des slogans partisans." },
];

export const adviceKeywords = [
  { word: "SOUVERAINETÉ", weight: 100, axis: "Comprendre les dépendances" },
  { word: "PRODUIRE", weight: 96, axis: "Retrouver une capacité d'action" },
  { word: "COMPRENDRE", weight: 91, axis: "Former son jugement" },
  { word: "APPRENDRE", weight: 88, axis: "Se rendre utile" },
  { word: "VÉRIFIER", weight: 84, axis: "Résister au bruit" },
  { word: "HISTOIRE", weight: 80, axis: "Sortir du présentisme" },
  { word: "ÉNERGIE", weight: 76, axis: "Voir les contraintes physiques" },
  { word: "NUMÉRIQUE", weight: 73, axis: "Reprendre la main technique" },
  { word: "LIBERTÉ", weight: 70, axis: "Garder un horizon politique" },
  { word: "DONNÉES", weight: 67, axis: "Protéger les infrastructures invisibles" },
  { word: "LIRE", weight: 65, axis: "Construire une bibliothèque mentale" },
  { word: "MÉTIER", weight: 62, axis: "S'ancrer dans le concret" },
  { word: "TRANSMISSION", weight: 60, axis: "Préserver les savoirs" },
  { word: "COURAGE", weight: 58, axis: "Accepter le coût du réel" },
  { word: "PROTÉGER", weight: 55, axis: "Défendre le commun" },
  { word: "CONSTRUIRE", weight: 53, axis: "Sortir du commentaire" },
  { word: "DOUTER", weight: 49, axis: "Éviter les réflexes idéologiques" },
  { word: "TRAVAIL", weight: 47, axis: "Faire durer l'effort" },
];

export const adviceAxes = [
  { title: "Lire et vérifier", text: "Croiser les sources primaires, remonter aux rapports, aux lois, aux données et aux textes longs plutôt que vivre seulement dans le flux." },
  { title: "Apprendre un métier", text: "Acquérir une compétence rare, transmissible et utile : technique, industrielle, agricole, scientifique, logistique, juridique ou éducative." },
  { title: "Comprendre l'histoire", text: "Replacer les crises dans des trajectoires longues pour éviter l'amnésie stratégique et le commentaire émotionnel." },
  { title: "Se former à la technique", text: "Comprendre l'énergie, le numérique, la production, les réseaux et les infrastructures qui conditionnent la liberté concrète." },
  { title: "Cultiver une discipline personnelle", text: "Tenir dans la durée, se protéger du cynisme, travailler son attention et refuser la facilité du pur spectacle." },
  { title: "S'ancrer localement", text: "Réparer, produire, coopérer, transmettre et reconstruire aussi à l'échelle des lieux réels." },
  { title: "Se protéger numériquement", text: "Maîtriser ses données, ses outils, ses dépendances logicielles et son exposition informationnelle." },
  { title: "Défendre le commun", text: "Penser la liberté avec les institutions, les services publics, l'ordre civil, la souveraineté et la responsabilité." },
];

export const readingTypeNotes = [
  { type: "Livres et auteurs", note: "Textes longs, classiques, essais structurants et auteurs cités comme socle de formation intellectuelle." },
  { type: "Médias et documentaires", note: "Supports audiovisuels ou journalistiques utiles pour suivre les enquêtes, récits et controverses publiques." },
  { type: "Rapports et données", note: "Sources primaires : statistiques, commissions, rapports publics, publications institutionnelles et jeux de données." },
  { type: "Recherche et essais", note: "Travaux académiques, notes longues, papiers spécialisés et analyses de fond." },
  { type: "Sources à explorer", note: "Pistes ouvertes par les invités : institutions, archives, textes stratégiques, corpus et références à approfondir." },
];

export const synthesisIdeas = [
  { title: "La souveraineté redevient matérielle", text: "Produire, transporter, former, alimenter, soigner, protéger et calculer comptent davantage que les discours de souveraineté." },
  { title: "La démocratie dépend d'une base productive", text: "Une société qui perd ses capacités concrètes voit ses choix politiques se réduire à la gestion de contraintes extérieures." },
  { title: "Le numérique est un territoire", text: "Les données, clouds, plateformes et IA forment une géographie de pouvoir aussi décisive que les routes, ports et réseaux d'énergie." },
  { title: "L'énergie est le socle de tout le reste", text: "Industrie, agriculture, transport, défense, logement et niveau de vie dépendent d'un système énergétique fiable, pilotable et assumé." },
  { title: "L'information est un champ de bataille", text: "Les récits organisent l'attention collective, hiérarchisent les peurs et déterminent ce qui peut être débattu." },
  { title: "La dette remplace mal la production", text: "Elle peut amortir les conflits sociaux, mais elle ne fabrique ni machines, ni compétences, ni souveraineté durable." },
  { title: "L'école est une infrastructure stratégique", text: "La transmission des savoirs, des métiers et de l'esprit critique conditionne la capacité de reconstruction." },
  { title: "L'écologie impose une politique du réel", text: "Ressources, sols, climat, eau et énergie exigent des arbitrages physiques, pas seulement des postures morales." },
  { title: "La cohésion devient une condition de puissance", text: "Sans confiance, normes communes et sécurité civile, les politiques longues deviennent presque impossibles." },
  { title: "La reconstruction reste possible", text: "Le corpus est sombre, mais il contient une doctrine d'action : produire, former, relocaliser, débattre, protéger, transmettre." },
];

export const recurringFindings = [
  "L’énergie est la base matérielle de la puissance, de la production et de la stabilité sociale.",
  "La mondialisation heureuse est terminée ; le monde redevient un champ de rapports de force.",
  "L’Europe s’est pensée comme norme avant de se penser comme puissance, et cette hiérarchie lui coûte très cher.",
  "La France a perdu une partie de sa souveraineté en abandonnant des leviers industriels, énergétiques et numériques.",
  "La désindustrialisation n’est pas qu’un problème économique ; c’est une perte de liberté politique.",
  "Le numérique n’est pas immatériel ; il repose sur des infrastructures physiques et des dépendances géopolitiques.",
  "La vie privée n’est pas un luxe ; elle conditionne l’exercice réel des autres libertés.",
  "Les médias souffrent moins d’un complot unique que d’une combinaison de concentration, d’autocensure, de plateformisation et de perte de méthode.",
  "Les élites françaises gèrent souvent les procédures mieux que les conséquences stratégiques.",
  "La dette et la monnaie peuvent différer le choc du réel, mais pas l’abolir.",
  "Les systèmes trop optimisés deviennent fragiles ; la robustesse exige des redondances et des contreperformances.",
  "Les sanctions, le droit extraterritorial et les normes sont devenus des armes de puissance.",
  "L’agriculture et les sols sont des infrastructures stratégiques, pas des questions périphériques.",
  "Les chaînes d’approvisionnement pharmaceutiques et industrielles mondialisées rendent les crises sanitaires et productives plus dangereuses.",
  "L’immigration devient explosive quand elle rencontre l’impuissance administrative, la violence et la dégradation des services de base.",
  "La sécurité intérieure dépend autant de la justice, de la prison et du renseignement humain que de la force policière.",
  "L’IA ouvre une compétition stratégique mondiale, mais aussi une crise cognitive et anthropologique.",
  "L’école et la transmission sont des sujets de souveraineté avant d’être des sujets pédagogiques.",
  "Les outre-mer ne sont pas des marges ; ils sont des multiplicateurs de puissance et des révélateurs de l’état réel de la France.",
  "Les crises contemporaines ne s’additionnent pas ; elles se renforcent mutuellement en polycrise."
];

export const majorWarnings = [
  "Si la France continue à traiter l’énergie comme un sujet symbolique, elle s’enfoncera dans le déclassement industriel.",
  "Si l’Europe reste un espace de normes sans stratégie, elle deviendra une zone de vassalisation économique.",
  "Si la réindustrialisation reste un slogan, la dépendance productive s’aggravera.",
  "Si la dette continue de masquer l’absence de création réelle de valeur, l’ajustement sera brutal.",
  "Si les écoles n’assurent plus la transmission, les inégalités cognitives deviendront irréversibles.",
  "Si la vie privée cède devant l’argument sécuritaire, la démocratie restera formelle mais perdra sa substance.",
  "Si l’information continue d’être absorbée par le bruit, les sociétés deviendront maniables par saturation plus que par conviction.",
  "Si l’on traite l’IA comme un simple gain de productivité, on accélérera simultanément dépendance, surveillance et dépossession cognitive.",
  "Si l’on nie la géologie de la transition, la transition deviendra un récit trompeur.",
  "Si les agriculteurs restent la variable d’ajustement des choix commerciaux et géopolitiques, la souveraineté alimentaire reculera.",
  "Si le narcotrafic et l’économie criminelle gagnent encore en profondeur, l’État perdra des morceaux de souveraineté interne.",
  "Si les outre-mer restent traités comme des annexes, la France affaiblira sa présence maritime et diplomatique.",
  "Si les élites continuent à confondre expertise médiatique et compétence stratégique, elles répéteront les mêmes erreurs.",
  "Si l’on continue à parler de guerre sans mémoire historique, on préparera de nouveaux engrenages.",
  "Si l’on remplace la politique par la conformité juridique, les puissances plus cyniques dicteront les faits.",
  "Si l’on sacrifie les métiers techniques et productifs, toute stratégie de souveraineté restera vide.",
  "Si l’on persiste à optimiser tous les systèmes, chaque choc local aura des effets systémiques disproportionnés.",
  "Si le débat migratoire reste pris entre déni moral et surenchère, il nourrira à la fois chaos et radicalisation.",
  "Si les citoyens perdent le sens de l’histoire longue, ils deviendront captifs de l’instant et des manipulations.",
  "Si la société s’accroche au mythe du retour à la normale, elle ratera la construction du monde robuste dont elle a besoin."
];

export const reconstructionLevers = [
  "Refaire de l’énergie pilotable, des réseaux et de la maintenance une priorité nationale.",
  "Utiliser la commande publique pour soutenir des acteurs industriels, logiciels et stratégiques européens.",
  "Reconstituer des filières industrielles et des chaînes de sous-traitance, pas seulement des marques.",
  "Redonner un statut central à l’apprentissage, aux métiers techniques et à la transmission intergénérationnelle.",
  "Réarmer l’intelligence économique de l’État et des entreprises.",
  "Relocaliser les capacités critiques en santé, pharmacie et équipements essentiels.",
  "Financer réellement l’enquête journalistique et protéger juridiquement les rédactions qui l’assument.",
  "Généraliser l’hygiène numérique, le chiffrement et la protection des métadonnées.",
  "Réorienter la transition écologique vers la sobriété, la réparabilité et les chaînes matérielles assumées.",
  "Restaurer les sols, l’eau et la juste rémunération des producteurs.",
  "Repenser la finance comme auxiliaire de la production et des communs, non comme centre de gravité du système.",
  "Renforcer la continuité police-justice-prison-renseignement humain plutôt que multiplier les annonces.",
  "Distinguer clairement solidarité, asile, immigration de travail, criminalité transfrontalière et menaces hybrides.",
  "Traiter les outre-mer comme un cœur stratégique de la puissance française.",
  "Former les citoyens aux ordres de grandeur physiques, énergétiques et logistiques.",
  "Réhabiliter l’histoire longue, les archives, la géographie et la culture stratégique.",
  "Reconstruire des collectifs locaux robustes capables d’encaisser les perturbations.",
  "Considérer l’Europe comme un terrain de rapport de force, pas comme une providence automatique.",
  "Remettre l’école au centre du projet national, non pour la nostalgie, mais pour la capacité future du pays.",
  "Remplacer le culte de la performance par une politique explicite de robustesse."
];

export const openQuestions = [
  "L’Europe peut-elle devenir une puissance sans se disloquer politiquement ?",
  "Une démocratie libérale peut-elle rester stable dans un monde de contraction énergétique ?",
  "La France peut-elle se réindustrialiser sans recourir à une forme dure de dirigisme ?",
  "Une transition écologique populaire est-elle possible si l’énergie devient structurellement plus chère ?",
  "Peut-on développer une IA souveraine sans approfondir la surveillance et l’automatisation sociale ?",
  "Quelle articulation durable entre high-tech stratégique et low-tech robuste ?",
  "Jusqu’où protéger la vie privée dans des sociétés traversées par la peur sécuritaire ?",
  "Comment restaurer la confiance médiatique sans tomber dans la censure ou dans le relativisme intégral ?",
  "Quelle forme de représentation politique pour les classes et territoires invisibilisés ?",
  "Quel mix énergétique permet réellement souveraineté, climat et prix soutenables ?",
  "Jusqu’où relocaliser les médicaments, les métaux et les équipements critiques ?",
  "Comment protéger agriculteurs et consommateurs sans reconduire les impasses du productivisme ?",
  "Comment gouverner les migrations à l’ère des chocs climatiques, démographiques et géopolitiques ?",
  "Comment combattre le narcotrafic sans basculer dans un État de pure réaction ?",
  "Quelle doctrine française pour les outre-mer, entre protection sociale, projection maritime et sécurité régionale ?",
  "Les sanctions et l’extraterritorialité peuvent-elles être remplacées par une vraie stratégie diplomatique ?",
  "Comment réintroduire le fait scientifique dans la décision sans verser dans la technocratie ?",
  "Peut-on encore produire un monde commun sous régime de plateformes et d’individualisme algorithmique ?",
  "Quelles institutions peuvent encore apprendre des échecs au lieu de les recycler en communication ?",
  "La France veut-elle réellement redevenir une puissance, ou seulement continuer à en conserver le vocabulaire ?"
];

export const finalCorpusSentence = "Une société qui perd en même temps le sens du réel, la maîtrise de ses dépendances, la transmission de ses savoirs et la souveraineté sur ses infrastructures finit gouvernée par des puissances, des technologies et des crises qu’elle ne comprend plus.";

export const detailedSynthesisSections = [
  {
    "title": "Thinkerview comme machine d’intelligibilité",
    "paragraphs": [
      "Thinkerview n’apparaît pas, dans ce corpus, comme un média de commentaire, encore moins comme un média de divertissement politique. C’est un dispositif de désillusion. Son mouvement de fond consiste à reprendre des sujets que le discours public présente comme sectoriels — Internet, retraites, Ukraine, métadonnées, nucléaire, agriculture, IA, Mayotte, inflation, désinformation — pour montrer qu’ils relèvent tous d’une même question : qui tient réellement les infrastructures, les chaînes matérielles, les récits, les normes, les seuils de violence et les appareils de décision ? Dès les premières années, le corpus attaque sur trois fronts : la surveillance numérique, la propagande médiatique et l’épaisseur géopolitique des crises internationales. Les entretiens fondateurs sur Prism, les lois de renseignement, la Syrie, l’Irak, les embargos ou la censure économique du journalisme installent très tôt l’idée que le monde visible n’est jamais le monde réel ; le visible est un théâtre, et le réel se cache dans les protocoles, les contrats, les services, les sanctions, les chaînes de commandement et les intérêts matériels.",
      "C’est pourquoi Thinkerview, comme objet intellectuel, ne croit jamais à la séparation confortable des domaines. La géopolitique n’est pas extérieure à l’économie ; l’économie n’est pas détachable de l’énergie ; l’énergie n’est pas indépendante de l’industrie ; l’industrie n’existe pas sans matières, sans compétences et sans réseaux ; les réseaux techniques reconfigurent les libertés ; les libertés dépendent de la qualité de l’information ; la qualité de l’information dépend de la propriété des médias, des plateformes et de la capacité des citoyens à lire des dossiers plutôt qu’à réagir à des flux. Le corpus avance ainsi par destruction des compartiments. Ce n’est pas un trait accidentel : c’est sa méthode de vérité.",
      "Cette logique de décloisonnement explique aussi une singularité rare : la convergence partielle d’invités très différents. La page d’évolution du portail montre que les entretiens classés “centre” sont dominés par l’économie, l’énergie, l’industrie et la géopolitique, que ceux classés “droite” sont dominés par la géopolitique, la sécurité, la démocratie, le numérique et les médias, et que ceux classés “gauche” se structurent autour de l’économie, de la démocratie, de la justice, des médias et de l’écologie. Or, malgré ces familles, les diagnostics les plus lourds se recoupent : dépendances dangereuses, fragilité des chaînes de valeur, impuissance européenne, corrosion du débat public, retour des rapports de force, épuisement du récit de la mondialisation heureuse, crise de la transmission, perte de contact avec la matérialité du monde. Autrement dit : les désaccords portent souvent sur les remèdes, moins que sur la gravité du diagnostic.",
      "La meilleure définition de Thinkerview, au terme du corpus, est donc celle-ci : une machine à forcer le retour du réel dans des sociétés qui vivent de plus en plus dans l’illusion procédurale, narrative ou technologique. Ce retour du réel n’est pas seulement énergétique ou économique. Il est physique, géopolitique, psychologique, anthropologique et moral. Il dit : les lois de la matière reviendront ; les puissances reviendront ; les frontières reviendront ; les coûts reviendront ; les ennemis reviendront ; les pénuries reviendront ; les effets de structure reviendront ; le tragique reviendra. Et si l’on ne veut pas que ce retour prenne la forme du chaos pur, il faut réapprendre à voir avant de prétendre gouverner."
    ]
  },
  {
    "title": "La grammaire profonde du corpus",
    "paragraphs": [
      "Le premier grand attracteur de Thinkerview est le retour du réel. Le corpus martèle que les sociétés occidentales se sont raconté, pendant plusieurs décennies, qu’elles pouvaient vivre dans l’abstraction : argent sans production, numérique sans matière, écologie sans extraction, Europe sans puissance, démocratie sans peuple, information sans enquête, croissance sans énergie, souveraineté sans frontières, solidarité sans capacité. À ce récit, Thinkerview oppose une contre-grammaire obstinée : il faut mesurer, comparer, compter, regarder les infrastructures, les réseaux, les coûts, les stocks, les rendements, les approvisionnements, les sols, les métaux, les navires, les raffineries, les centrales, les ports, les prisons, les câbles, les serveurs, les classes, les corps. Autrement dit, le corpus rappelle que le monde ne repose pas sur les mots qu’on lui donne, mais sur les supports matériels qui le rendent possible.",
      "Le deuxième attracteur est le retour de la puissance. Thinkerview ne cesse de répéter, sous des formes variées, que la parenthèse post-historique occidentale se ferme. La guerre n’a pas disparu ; elle a simplement changé de formes et parfois de vocabulaire. Elle peut prendre la figure de sanctions, d’extraterritorialité juridique, de sabotage, de guerre économique, de guerre cognitive, de guerre des normes, de guerre des données, de guerre de l’énergie, de guerre des récits, de guerre des chaînes logistiques. Ce que le corpus reproche d’abord aux élites européennes, ce n’est pas tant leur immoralité que leur naïveté : elles ont voulu administrer un monde redevenu tragique comme s’il s’agissait d’un espace de conformité. Or les États-Unis, la Chine, la Russie, les puissances régionales, les traders de matières premières, les acteurs du renseignement et les plateformes n’habitent plus ce monde-là.",
      "Le troisième attracteur est la souveraineté, mais entendue au sens large, presque total. Dans Thinkerview, la souveraineté n’est jamais seulement monétaire, ni seulement territoriale. Elle est énergétique, industrielle, numérique, sanitaire, agricole, informationnelle, cognitive, juridique, pénitentiaire, maritime, éducative. Une nation peut garder un drapeau et perdre sa souveraineté si elle ne tient plus ses usines, ses réseaux, ses données, ses chaînes d’approvisionnement, sa justice, ses écoles, ses ports, ses capacités de planification ou ses infrastructures critiques. Le corpus répète ainsi que la perte de souveraineté est moins spectaculaire qu’une invasion, mais plus dangereuse, parce qu’elle avance par délégation, par normes, par contrats, par fusions, par dépendances et par capture des appareils publics par des intérêts privés ou étrangers.",
      "Le quatrième attracteur est la trahison ou l’abdication des élites, au sens où le corpus voit revenir partout la même figure : des classes dirigeantes capables de gérer les apparences, mais incapables d’assumer les conséquences stratégiques de leurs décisions. Plusieurs familles d’invités divergent sur les motifs et sur les responsabilités exactes, mais convergent sur le fond : les hauts fonctionnaires pantouflent, les dispositifs judiciaires et réglementaires sont parfois détournés, les choix énergétiques sont incohérents, les privatisations ou quasi-privatisations sacrifient des actifs collectifs, la commande publique n’est pas utilisée comme levier de souveraineté, le débat médiatique fuit la structure pour se réfugier dans l’écume, et la politique professionnelle perd le contact avec les activités productives. Thinkerview parle ici moins d’un complot organisé que d’une combinaison de cooptation, de conformisme, de technocratie et de désinvolture stratégique.",
      "Le cinquième attracteur est la fragilité des systèmes complexes. Le corpus explique sans cesse qu’un système optimisé pour l’efficacité immédiate devient, tôt ou tard, vulnérable aux perturbations. C’est vrai des chaînes logistiques mondialisées, du système hospitalier, de la production pharmaceutique, du système électrique, des marchés financiers, des réseaux numériques, du journalisme, des sols agricoles, des chaînes minières et des systèmes politiques. Le Covid, les pénuries de médicaments, l’énergie, les ruptures d’approvisionnement, les pandémies, les dissolutions policières ou judiciaires, les plates-formes numériques et les catastrophes minières sont autant de preuves d’une même leçon : l’optimisation a détruit les redondances, les stocks, les buffers, les savoir-faire, les marges de manœuvre. D’où l’importance croissante, dans les dernières années du corpus, de la robustesse contre la performance.",
      "Le sixième attracteur est enfin la crise de la transmission et de l’attention. Thinkerview ne réduit jamais le problème du monde contemporain aux seules structures matérielles ; il répète qu’une civilisation meurt aussi par perte de langage, perte d’histoire, perte de lecture, perte de discipline mentale, perte de capacité à relier. C’est un thème majeur de Stiegler, Sadin, Morin, Bellamy, Onfray, Laurent Alexandre, Villani et même de nombreux entretiens géopolitiques qui reviennent sur la nécessité de l’histoire longue. Le corpus considère que des sociétés saturées d’écrans, de flux, de commentaires et de réactions immédiates deviennent littéralement ingouvernables, parce qu’elles perdent la faculté de hiérarchiser les causes, de tenir un récit commun et de former des citoyens capables d’endurer la complexité. La crise politique est donc aussi une crise cognitive."
    ]
  },
  {
    "title": "La France, l’Europe et l’Occident selon Thinkerview",
    "paragraphs": [
      "La France, vue par Thinkerview, n’est pas un pays forcément condamné, mais un pays qui a dissipé une partie de sa puissance par inconséquence stratégique. Le corpus revient en boucle sur le même réquisitoire : vente ou affaiblissement d’actifs industriels, incapacité à protéger des secteurs clés, abandon de la planification énergétique, désindustrialisation, dépendance pharmaceutique, fracture entre centre administratif et territoires, confusion entre ouverture et abdication, dégradation de la chaîne justice-police-prison, perte du lien entre école, métier, production et nation. La formule varie selon les invités, mais le motif reste stable : la France a gardé l’appareil discursif d’une puissance, sans toujours conserver les leviers concrets qui font la puissance.",
      "Cette France est décrite comme un pays de grands mots et de petites prises. Elle sait encore parler de République, de modèle social, d’indépendance, de grandeur, d’humanisme, d’innovation ; mais dès que l’on suit les filières, on découvre la dépendance. Dépendance aux États-Unis pour le droit, les logiciels, certaines infrastructures et parfois la doctrine stratégique ; dépendance à la Chine pour les chaînes industrielles et minières ; dépendance à des marchés mondiaux pour l’énergie, les matières premières ou la pharmacie ; dépendance à des règles européennes construites parfois contre ses propres avantages comparatifs ; dépendance à des oligarchies médiatiques et financières dans l’espace intérieur. D’où un ton récurrent : la France n’est pas seulement affaiblie, elle est désarmée intellectuellement face à sa propre dépendance.",
      "L’Europe occupe dans Thinkerview une place profondément contradictoire. Elle n’est presque jamais pensée comme une pure solution, mais elle n’est pas non plus simplement rejetée comme un ennemi extérieur. Le corpus la voit plutôt comme une construction qui a voulu remplacer la puissance par la norme, et qui paie aujourd’hui cette illusion. Dans les entretiens énergétiques et industriels, l’Europe apparaît comme un espace qui a parfois désorganisé des outils efficaces au nom de la concurrence, en particulier dans l’électricité. Dans les entretiens géopolitiques, elle apparaît comme une entité qui parle le langage du droit dans un monde qui reparle celui du rapport de force. Dans les entretiens sur l’Union elle-même, elle apparaît tantôt comme un champ de bataille à reconquérir, tantôt comme une machine devenue trop large, trop divergente, trop abstraite pour gouverner efficacement.",
      "L’Occident, enfin, n’est pas regardé par Thinkerview dans la logique simpliste de l’auto-flagellation ou du narcissisme civilisateur. Le corpus tient ensemble deux jugements. D’un côté, il voit dans l’Occident moderne un espace qui a produit des libertés publiques, de la recherche, du droit, des méthodes d’enquête, une culture scientifique et critique qu’il faut défendre. C’est très visible dans les entretiens sur la vie privée, le journalisme, l’IA, les lanceurs d’alerte ou l’investigation. De l’autre, il estime que l’Occident s’est décrédibilisé par son hypocrisie stratégique : Irak, embargos, Syrie, Gaza, interventions mal pensées, arrogance post-1991, croyance à la fin de l’histoire, usage extraterritorial du droit, confusion entre puissance et morale. Résultat : l’Occident n’a pas perdu toute puissance, mais il a perdu le monopole moral qui lui permettait de la présenter comme universelle.",
      "Ce que Thinkerview reproche le plus durement à l’Occident, au fond, c’est moins ses fautes que son incapacité à apprendre de ses fautes. Le corpus revient sans cesse à l’idée que les mensonges d’État, les guerres ratées, les sanctions inefficaces, les illusions de marché, les dénis énergétiques et les sous-estimations géopolitiques ne sont jamais vraiment intégrés. Les mêmes recettes reviennent, les mêmes experts erronés reviennent, les mêmes simplifications morales reviennent. Cette incapacité à mémoriser l’échec est l’un des moteurs de la tonalité Thinkerview : le problème n’est pas seulement que les choses vont mal ; c’est que les sociétés semblent ne plus savoir corriger leurs cadres d’analyse."
    ]
  },
  {
    "title": "L’énergie, l’économie, l’industrie et l’agriculture comme soubassement du monde",
    "paragraphs": [
      "S’il fallait isoler un socle matériel dans tout le corpus, ce serait l’énergie. Thinkerview dit, encore et encore, que l’énergie est la base cachée de toute puissance. Non pas un secteur parmi d’autres, mais la condition de tous les autres secteurs : transport, santé, agriculture, numérique, industrie, armée, confort domestique, école, logistique, eau, communication. Le corpus est particulièrement insistant sur ce point parce qu’il estime que le débat public français et européen traite l’énergie de façon moraliste, technocratique ou fragmentée, alors qu’elle devrait être abordée comme une question de civilisation. Jancovici, Meilhan, Bihouix, Machenaud, Proglio, Le Floch-Prigent, Charlez, Perrin, Blas et d’autres, malgré leurs divergences, convergent ici puissamment : on ne vote pas contre les ordres de grandeur.",
      "De cette centralité découle une autre thèse forte : l’économie standard ment lorsqu’elle fait croire que la monnaie, la dette ou l’innovation peuvent suspendre les contraintes physiques. Le corpus ne dit pas que la finance est sans effet ; il dit au contraire qu’elle a un effet redoutable, mais de camouflage. Elle peut reporter, lisser, déplacer, gonfler, compenser, racheter du temps. Elle ne crée pas l’énergie, les métaux, les sols vivants, les camionneurs, les machines, les lignes électriques ou les molécules. Thinkerview revient donc souvent à cette phrase implicite : une société peut beaucoup s’endetter, elle ne peut pas durablement s’endetter contre le réel. Les entretiens sur l’inflation, la dette, les taux, les banques centrales, les marchés, les “zombies” économiques et la sacralisation de la finance ne servent pas à produire un catéchisme monétaire unique ; ils servent à rappeler que la monnaie ne remplace jamais la production.",
      "Le thème de la désindustrialisation est alors l’autre face du thème énergétique. Thinkerview considère que la France et, plus largement, l’Europe ont cru pouvoir devenir riches en abandonnant une partie de la production matérielle au reste du monde, tout en gardant chez elles la conception, la finance, la norme et le service. Le corpus juge ce pari intenable. Il voit dans la perte de filières, de machines, de compétences, de sous-traitants, d’ingénieurs, de maintenance et de savoir-faire une perte de souveraineté directe. De là la récurrence de cas emblématiques : Alstom, EDF, le photovoltaïque européen, l’industrie pharma, les métaux critiques, les turbines, les réseaux, les compétences nucléaires. Thinkerview dit ici quelque chose de simple et presque brutal : un pays qui ne produit plus suffisamment finit par dépendre politiquement de ceux qui produisent.",
      "Mais la réindustrialisation du corpus n’est pas un simple vieux productivisme repeint. Elle évolue, surtout après 2020, vers une idée plus exigeante : il ne s’agit pas de refaire le même modèle avec un drapeau différent ; il s’agit de reconstruire des capacités productives compatibles avec les limites physiques. C’est là que les thèmes low-tech, réparabilité, circularité, prolongation des durées de vie, formation professionnelle, métiers industriels, robustesse et réorientation de la commande publique deviennent centraux. Dans cette version tardive du corpus, l’industrie n’est plus l’ennemie de l’écologie ; elle devient l’une des conditions d’une écologie non infantile, parce qu’on ne décarbonera rien, on ne réparera rien, on ne maintiendra rien sans appareils productifs, électriciens, ingénieurs, chaudronniers, soudeurs, réseaux et financement de long terme.",
      "L’agriculture occupe une place plus resserrée quantitativement dans le corpus, mais elle y est pensée d’une manière décisive : comme point de condensation de toutes les contradictions. Les sols, l’eau, les intrants, les normes, la grande distribution, la dette paysanne, les accords commerciaux, les prédateurs, la PAC, les bassines, les importations, l’énergie et la transmission s’y croisent. Thinkerview ne regarde pas l’agriculture comme une rubrique rurale ; il la regarde comme la jonction entre biologie, souveraineté, classe sociale, commerce international et lien national. Quand les Bourguignon parlent de sols à l’agonie, quand Ruffin parle de destruction des régulations, quand Mercadal parle des paysans comme variable d’ajustement, c’est au fond la même idée qui revient : une civilisation qui détruit ses sols et ruine ceux qui la nourrissent organise elle-même sa dépendance future."
    ]
  },
  {
    "title": "Technologie, médias, données et intelligence artificielle",
    "paragraphs": [
      "Le grand récit technologique de Thinkerview n’est pas technophobe ; il est anti-naïf. Dès les premiers entretiens, le corpus dit que le numérique n’est pas un espace libre par essence, mais un champ de pouvoir. La vie privée y apparaît comme condition des autres libertés ; l’opacité technique comme avantage politique pour les acteurs dominants ; la concentration des flux comme vulnérabilité démocratique ; la dépendance aux plateformes étrangères comme perte de souveraineté ; le couplage entre entreprises du numérique et appareils de renseignement comme fait structurel du monde contemporain. De Jérémie Zimmermann à Benjamin Bayart, de Tariq Krim et Bernard Benhamou à Alexis Roussel, le noyau dur reste constant : une société qui ne comprend pas l’architecture de ses réseaux n’est pas libre, même si elle vote encore.",
      "Dans cette perspective, les médias ne sont pas extérieurs au problème technologique ; ils en sont un prolongement. Thinkerview raconte la crise de l’information comme une triple crise. D’abord une crise de propriété et de pression économique : concentration, autocensure, dépendance à des propriétaires, coût juridique de l’enquête, fragilité des rédactions. Ensuite une crise de méthode : perte du contexte, transformation des journalistes en commentateurs, confusion entre plateau, éditorial, militantisme et investigation. Enfin une crise d’architecture : les plateformes redessinent l’attention, la viralité et la hiérarchie de la vérité. Le corpus ne tombe pas pour autant dans le fantasme d’un “grand complot médiatique” uniforme ; il distingue fortement entre critique structurelle des médias et imaginaire totalisant de manipulation absolue. Mais il tient une ligne sévère : sans contre-pouvoir médiatique robuste, la démocratie devient administrativement libre et cognitivement capturée.",
      "Sur l’intelligence artificielle, l’évolution du corpus est particulièrement éclairante. Dans les années 2017-2018, l’IA apparaît d’abord comme un enjeu de compétition mondiale, de souveraineté, de données, de commande publique, de biais et d’éducation. Villani veut éviter l’abstention européenne, Laurent Alexandre insiste sur la bataille éducative et les inégalités d’apprentissage. Le ton est déjà inquiet, mais encore assez centré sur la stratégie publique et la mutation du travail.",
      "À partir de 2020, le cadrage s’élargit. Avec Stiegler et Sadin, l’algorithme n’est plus seulement un outil ou une menace sectorielle ; il devient un opérateur de désindividuation, de captation de l’attention, de substitution de l’expression à l’action, de destruction du monde commun. Puis, dans les années 2024-2025, avec Pitron, Hamant, Alexis Roussel ou les entretiens sur les métadonnées, l’IA et le numérique sont rebranchés sur la matière, l’énergie, la guerre cognitive, la surveillance et la collusion plateforme-État. Le corpus cesse alors complètement de croire à l’immatérialité : l’IA devient à la fois problématique énergétique, extractive, stratégique, politique et anthropologique. Elle n’est plus seulement “disruptive” ; elle devient question de civilisation.",
      "Au total, Thinkerview tient sur la technologie une position complexe mais cohérente. Il ne dit pas qu’il faut arrêter l’IA ou sortir du numérique comme on sortirait du monde. Il dit deux choses plus exigeantes. Premièrement, on ne peut pas se permettre l’abstention stratégique : renoncer, c’est se coloniser soi-même. Deuxièmement, on ne peut pas se permettre la fascination : déployer sans limites, c’est détruire les bases humaines, cognitives et démocratiques qui rendent la technique habitable. Le corpus demande donc une subordination stricte de la technique à des finalités de souveraineté, de liberté, de robustesse et de transmission. C’est très différent de l’optimisme startup ou du refus romantique."
    ]
  },
  {
    "title": "Immigration, sécurité, identité et cohésion",
    "paragraphs": [
      "Le traitement de l’immigration dans Thinkerview n’est pas uniforme, mais il obéit à une structure récurrente : le sujet n’est jamais ramené à une morale de principe abstraite, il est rebranché sur la capacité effective d’un corps politique à accueillir, protéger, intégrer, arbitrer et faire respecter des règles communes. Le cas de Mayotte, en particulier, joue dans le corpus le rôle d’une vérité grossissante : quand un territoire manque d’eau, de sécurité, de continuité administrative, de contrôle des frontières, de santé publique et de lisibilité stratégique, les grands mots se défont. Le sujet migratoire y apparaît inséparable des gangs, de l’école, des maladies, de l’urbanisation informelle, des relations régionales, du canal du Mozambique, de la ZEE française et de la géopolitique indo-pacifique. Thinkerview dit alors : l’humanitaire sans État devient parfois un alibi pour l’impuissance.",
      "La sécurité intérieure, dans le corpus, suit la même logique de matérialisation. Le thème n’est pas d’abord “l’autorité” comme slogan ; c’est la capacité réelle d’un État à faire tenir ensemble prévention, renseignement humain, justice rapide, prison, droit, premiers secours, chaîne de commandement, courage institutionnel et lisibilité publique. De la critique précoce de la loi renseignement à la dénonciation récente du narcotrafic, de la fragilité carcérale et de l’explosion des violences, Thinkerview laisse émerger l’idée d’une souveraineté interne qui se fissure. Le danger n’est pas seulement l’attentat ou la délinquance isolée ; c’est la possibilité qu’un archipel de zones d’impuissance, de marchés criminels et de brouillards informationnels remplace progressivement la continuité régalienne.",
      "Sur l’identité et la civilisation, le corpus n’est pas univoque, mais il est obsédé par la même question : peut-on encore faire société quand il n’y a plus de récit commun, plus d’école commune, plus de confiance médiatique, plus de rapport clair à la loi, plus de production, plus de transmission et plus de limites reconnues ? Les réponses diffèrent. Certains invités insistent sur l’enracinement, la question civilisationnelle, les conditions concrètes d’accueil, la continuité historique, la neutralité des institutions ou l’épuisement spirituel de l’Europe. D’autres rappellent les causalités coloniales, la dimension sociale des fractures, le poids des injustices internationales ou le danger d’une lecture purement identitaire. Mais la contradiction n’est pas stérile : elle révèle que Thinkerview pense la cohésion comme un problème de structure, pas comme une querelle de morale. Une société tient par des formes communes ; si ces formes cèdent, les conflits d’origine, de classe, de croyance ou de territoire deviennent explosifs.",
      "C’est pourquoi, derrière les désaccords apparents, le corpus formule une vérité sévère : on ne gouverne pas une société fragmentée par la seule communication. Il faut des écoles, des règles, des métiers, des institutions crédibles, des frontières administrées, une justice qui tranche, des médias qui enquêtent, des services qui fonctionnent, des territoires qui ne soient pas méprisés, et un effort de vérité sur les capacités réelles du pays. Là encore, le thème central est moins l’idéologie que la perte de contrôle."
    ]
  },
  {
    "title": "L’évolution du corpus et ses contradictions intérieures",
    "paragraphs": [
      "Sur quatorze ans, la trajectoire du corpus est très lisible. La page d’évolution du portail montre qu’entre 2013 et 2016 dominent d’abord la géopolitique, les médias, la démocratie et la sécurité ; entre 2017 et 2019 montent fortement l’énergie, le numérique, l’économie et la fracture démocratique ; entre 2020 et 2021 le corpus se reconfigure autour du Covid, de la sécurité, du numérique et de la faillite de l’appareil occidental ; à partir de 2022, l’énergie, l’économie et la géopolitique s’imposent comme le cœur dur ; en 2024-2026, la géopolitique domine plus encore, tandis que l’énergie reste centrale et que les thèmes de démocratie, justice, IA, sécurité intérieure, outre-mer et cohésion prennent un tour plus frontal. Dit autrement : ce qui était d’abord pressenti devient ensuite structurant, puis urgent.",
      "La séquence 2013-2016 est celle du dévoilement. Snowden, Prism, Syrie, Irak, embargos, propagande, lois de renseignement, censure et géopolitique du terrorisme forment le premier noyau. Le corpus apprend alors à son audience que le monde n’est pas gouverné par les principes affichés, mais par des architectures cachées de surveillance, d’influence et de puissance. La séquence 2017-2019 ajoute la matérialité : climat, énergie, low-tech, effondrement, IA, dette, oligarchie française, perte de souveraineté industrielle. La séquence 2020-2021 transforme cette critique en expérience vécue : pandémie, stocks, logistique, hôpital, corruption, fragilité médiatique, souveraineté numérique, explosion des affects individuels, fin du monde commun. Enfin, 2022-2026 est la phase de durcissement : guerre d’Ukraine, retour explicite du tragique géopolitique, crise énergétique, relecture de l’Europe, métaux critiques, robustesse, IA matérialisée, dégradation sécuritaire, outre-mer, narcotrafic, volonté de réarmement intellectuel. Ce qui se renforce le plus nettement au fil du temps, c’est la conviction que les crises ne sont plus sectorielles mais systémiques.",
      "Cette évolution radicalise aussi certains thèmes. L’énergie passe d’un sujet de lucidité physique à un principe stratégique global. Le numérique passe de la vie privée et du web libre à la guerre cognitive, aux métadonnées, à la collusion plateformes-États et à l’IA comme problème civilisationnel. La géopolitique passe de la critique des narratifs occidentaux à l’idée d’un monde post-occidental déjà en formation. L’immigration passe d’un sujet de droit et de morale à un sujet de souveraineté territoriale visible. L’industrie passe du regret de la désindustrialisation au mot d’ordre de réindustrialisation. L’école et la transmission, longtemps diffuses, deviennent à la fin un nœud stratégique. Ce qui disparaît relativement, ce n’est pas un thème ; c’est l’illusion qu’un ajustement technique suffirait encore.",
      "Les contradictions internes du corpus sont réelles, mais elles sont fécondes. Première contradiction : souveraineté nationale contre robustesse locale. Certains pensent la reprise en main par l’État, d’autres par les marges, les coopératives, les territoires et les métiers. Deuxième contradiction : high-tech stratégique contre low-tech robuste. Villani ou certains acteurs industriels veulent une puissance technologique européenne ; Bihouix, Pitron ou Hamant rappellent que l’obsession technologique peut reproduire le problème. Troisième contradiction : Europe champ de bataille ou Europe impossible. Bellamy veut la combattre de l’intérieur ; Proglio, Machenaud, Baverez ou Juillet soulignent parfois son caractère profondément dysfonctionnel. Quatrième contradiction : ordre et sécurité contre libertés et vie privée. Le corpus héberge à la fois une tradition libertaire numérique et une montée de la demande d’ordre. Cinquième contradiction : humanité universaliste contre retour des appartenances. Les tensions sur immigration, guerre, colonialité, sionisme ou frontières ne sont pas résolues ; elles révèlent simplement qu’un universalisme sans puissance ni structure commune devient verbal, tandis qu’un identitarisme sans justice devient destructeur.",
      "La doctrine implicite d’action qui sort de cette masse est pourtant assez nette. Elle dit aux jeunes générations : lire, historiser, apprendre les ordres de grandeur, comprendre les protocoles, coder si nécessaire, protéger sa vie privée, maîtriser les infrastructures, choisir des métiers qui construisent, accepter les limites physiques, entrer dans des collectifs, ne pas croire aux solutions magiques, ne pas se laisser capturer par les flux, articuler enracinement et ouverture, préférer les preuves aux récits et la stratégie aux indignations. Ce n’est pas une doctrine révolutionnaire au sens romantique ; c’est une doctrine de réarmement intellectuel, productif, civique et moral. Elle n’appelle pas d’abord à “prendre le pouvoir”, mais à redevenir capable d’habiter le réel."
    ]
  },
  {
    "title": "Conclusion générale",
    "paragraphs": [
      "Au terme du corpus, Thinkerview ne dit pas seulement que le monde va mal. Il dit quelque chose de plus précis et de plus exigeant : la modernité occidentale a voulu croire qu’elle pouvait découpler la liberté de ses supports matériels, la prospérité de la production, la souveraineté de la puissance, l’écologie de la géologie, la démocratie de l’attention, l’information de l’enquête et l’humanité de la limite. Le choc des quatorze années d’entretiens est là : tout ce qui paraissait secondaire redevient premier. L’énergie revient avant la monnaie. Les ports reviennent avant les discours. Les métaux reviennent avant les applications. Les sols reviennent avant les slogans verts. Les frontières reviennent avant les proclamations universalistes. Les chaînes de commandement reviennent avant les hashtags. La guerre revient avant les règlements. Et l’école revient avant toutes les réformes, parce qu’une société qui ne transmet plus ne sait rapidement plus rien défendre.",
      "Mais il serait faux de réduire Thinkerview à une pensée de la chute. Le corpus, malgré son ton souvent sombre, n’est pas une religion de l’effondrement. Il porte au contraire une idée de salut profane : un pays peut encore se redresser s’il accepte de revoir ses priorités. Il ne s’agit pas de revenir au passé, ni de sauver l’ancien monde par nostalgie. Il s’agit de reconstruire des capacités : énergétiques, industrielles, cognitives, agricoles, médiatiques, territoriales, démocratiques. Le mot qui résume le mieux cette possibilité, dans la phase tardive du corpus, est sans doute celui de robustesse : moins de performance spectaculaire, plus de marges ; moins de dépendances opaques, plus de prises ; moins de flux subis, plus de capacités d’encaissement ; moins de récit, plus d’ossature.",
      "Si Thinkerview pense réellement quelque chose de l’avenir, c’est ceci : l’avenir n’appartiendra ni aux plus moraux en paroles, ni aux plus innovants en présentation, ni aux plus réglementaires en surface. Il appartiendra à ceux qui sauront relier puissance, production, transmission, vérité et limites. Le pessimisme du corpus n’est donc pas un goût pour la catastrophe ; c’est une méthode pour sortir du déni.",
      "Si l’on devait condenser 796 heures d’entretiens Thinkerview en une seule phrase, la voici :",
      "Une société qui perd en même temps le sens du réel, la maîtrise de ses dépendances, la transmission de ses savoirs et la souveraineté sur ses infrastructures finit gouvernée par des puissances, des technologies et des crises qu’elle ne comprend plus.",
      "Cette phrase condense le noyau énergétique, souverain, informationnel et civilisationnel du corpus."
    ]
  }
];

export const corpusTensions = [
  "Souveraineté nationale contre souveraineté européenne.",
  "Décroissance, sobriété et low-tech contre réindustrialisation.",
  "Défiance envers l'État contre besoin d'un État stratège.",
  "Libertés publiques contre demande d'ordre.",
  "Critique de l'hégémonie américaine contre besoin d'alliances occidentales.",
  "Universalisme républicain contre retour des identités.",
  "Critique du capitalisme financier contre besoin massif d'investissement.",
  "Pessimisme civilisationnel contre possibilité de reconstruction.",
];
