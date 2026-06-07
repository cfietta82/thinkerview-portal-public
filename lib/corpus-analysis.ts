export const corpusOverview = {
  interviews: 413,
  hours: 796,
  transcripts: 413,
  recommendations: 2124,
  guests: 323,
  years: 14,
  period: "2013-2026",
  thesis:
    "Le corpus raconte le retour du réel : une souveraineté formelle ne tient plus si elle n'est pas adossée à des capacités industrielles, énergétiques, éducatives, numériques, agricoles, militaires et morales.",
  shortThesis:
    "Un pays qui ne produit plus assez ne décide plus vraiment.",
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
  "La France conserve des institutions fortes, mais leur capacité réelle dépend de filières matérielles qu'elle a souvent laissé s'éroder.",
  "L'Europe protège parfois, contraint souvent et ne remplace pas mécaniquement une stratégie nationale claire.",
  "La mondialisation a rendu visibles ses gains pour le consommateur et invisibles ses coûts industriels, sociaux et stratégiques.",
  "Les crises récentes ont moins créé les fragilités qu'elles ne les ont révélées.",
  "La compétence technique, administrative et productive devient une ressource politique rare.",
];

export const majorWarnings = [
  "Confondre communication et puissance.",
  "Remplacer la production par la dette.",
  "Sous-estimer l'énergie dans les politiques publiques.",
  "Abandonner les données et infrastructures numériques à des acteurs extérieurs.",
  "Transformer les débats stratégiques en réflexes moraux ou partisans.",
  "Casser la transmission scolaire, professionnelle et civique.",
];

export const reconstructionLevers = [
  "Réindustrialiser autour de filières choisies et finançables.",
  "Former massivement aux métiers techniques, scientifiques, agricoles et industriels.",
  "Protéger les infrastructures critiques : énergie, eau, données, transport, santé, défense.",
  "Reprendre une culture de l'enquête : rapports, statistiques, archives, contradiction.",
  "Retrouver une planification compatible avec la démocratie et le débat public.",
  "Assumer les arbitrages au lieu de les déléguer au marché, au droit ou à la crise suivante.",
];

export const openQuestions = [
  "Quelle part de souveraineté doit être nationale, européenne ou alliée ?",
  "Comment réindustrialiser sans nier les contraintes climatiques et énergétiques ?",
  "Jusqu'où peut aller l'État stratège sans étouffer l'initiative locale et privée ?",
  "Comment défendre l'ordre civil sans sacrifier les libertés publiques ?",
  "Comment reconstruire une culture commune dans une société fragmentée par les récits, les réseaux et les inégalités ?",
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
