export const fr = {
  nav: {
    about: "À propos",
    skills: "Compétences",
    projects: "Projets",
    services: "Services",
    contact: "Contact",
    donate: "Pourboire",
    menu: "Menu",
    navigation: "Navigation",
    currentPage: "Page actuelle",
    privacyPolicy: "Politique de confidentialité",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    goHome: "Aller à la page d'accueil",
  },
  toggles: {
    theme: "Changer de thème",
    themes: "Thèmes",
    language: "Changer de langue",
    useSystem: "Utiliser la langue du système",
  },
  hero: {
    greeting: "Bonjour, je suis Dominik Könitzer",
    roles: [
      { line1: "Ingénieur", line2: "logiciel." },
      { line1: "Développeur", line2: "Full-Stack." },
      { line1: "Artisan du", line2: "Clean Code." },
      { line1: "Architecte", line2: "de systèmes." },
    ] as { line1: string; line2: string }[],
    hireMe: "Engagez-moi",
    viewWork: "Voir le travail",
    stats: {
      projects: "Projets",
      yearsCoding: "Années de code",
      technologies: "Technologies",
    },
  },
  about: {
    heading: "À propos de moi",
    subheading:
      "Apprenez à mieux me connaître et découvrez ce qui anime ma passion pour le développement web.",
    passionate: "Passionné",
    passionateRole: "Ingénieur logiciel",
    intro1Before:
      "Je suis Dominik Könitzer, ingénieur logiciel de 18 ans à la WISS Schulen für Wirtschaft Informatik Immobilien, actuellement dans mon ",
    intro1Highlight: "sixième",
    intro1After: " semestre d'un programme d'ingénierie logicielle de 4 ans.",
    intro2:
      "Les deux premières années du programme sont consacrées aux cours, suivies de deux années de stage pratique avec poursuite des études. Tout au long de ce parcours, je développe une base solide à la fois en connaissances théoriques et en expérience pratique.",
    intro3Before: "J'aime créer des sites web et applications ",
    intro3Word1: "propres",
    intro3Comma1: ", ",
    intro3Word2: "fonctionnels",
    intro3Comma2: " et ",
    intro3Word3: "visuellement attrayants",
    intro3After:
      " qui apportent une vraie valeur aux utilisateurs. Au-delà des compétences techniques, je valorise l'apprentissage continu, la résolution de problèmes et une communication efficace.",
    exploreSkills: "Découvrir mes compétences",
    readJournal: "Lire mon journal",
    cards: {
      educationTitle: "Formation",
      educationSubtitle: "Programme de 4 ans à la WISS",
      specializedTitle: "Spécialisé en",
      specializedSubtitle: "Développement web moderne",
    },
  },
  skills: {
    heading: "Compétences techniques",
    subheading:
      "Mon expertise couvre diverses technologies, avec un accent sur des solutions efficaces et élégantes.",
    categories: {
      frontend: "Développement Frontend",
      professional: "Compétences professionnelles",
      backend: "Développement Backend",
      devops: "Systèmes d'exploitation & DevOps",
      databases: "Gestion de bases de données & contrôle de version",
      languages: "Langues",
    },
    descriptions: {
      react: "Création d'interfaces utilisateur dynamiques",
      nextjs: "Scripts côté client et fonctionnalités interactives",
      shadcn: "Composants UI accessibles et personnalisables",
      tailwind: "Style moderne utility-first",
      typescript: "Typage statique pour un code plus robuste",
      javascript: "Fonctionnalités JavaScript modernes et bonnes pratiques",
      framerMotion: "Animations avancées et effets UI interactifs dans React",
      lighthouse: "Audit performance, accessibilité et SEO",
      customerService: "Assurer la satisfaction et des expériences positives",
      communication: "Communication orale et écrite claire et efficace",
      projectManagement: "Planification et exécution efficace des projets",
      excel: "Analyse de données et tableurs",
      directSales: "Vente directe et création de relations",
      socialMedia: "Engager le public via les plateformes sociales",
      seoCopywriting:
        "Rédaction de contenu optimisé pour les moteurs de recherche",
      videoEditing: "Création et montage vidéo",
      java: "Programmation backend pour applications",
      spring: "Framework Java pour microservices",
      nodejs: "Développement d'applications côté serveur",
      bash: "Scripts pour automatiser des tâches Linux",
      graphql: "Requêtes et manipulation de données efficaces",
      python: "Programmation polyvalente backend et automatisation",
      csharp: "Développement backend avec .NET",
      cpp: "Programmation système et applications critiques en performance",
      windowsServer: "Gestion et administration de Windows Server",
      hardware: "Installation et configuration de matériel informatique",
      jenkins:
        "Serveur d'automatisation pour pipelines de build, déploiement et CI/CD",
      linux: "Gestion et administration de serveurs Linux",
      ubuntu: "Gestion et configuration de la distribution Ubuntu",
      kali: "Distribution Linux axée sécurité",
      grafana: "Plateforme de visualisation de métriques et monitoring",
      git: "Système de contrôle de version pour suivre les modifications de code",
      docker:
        "Plateforme de conteneurisation pour le développement et le déploiement",
      sqlite: "Moteur de base de données embarqué léger et sans serveur",
      postgres:
        "Système de gestion de base de données relationnelle open-source avancé",
      mongo: "Base de données documentaire NoSQL pour stockage flexible",
      redis:
        "Magasin de structures de données en mémoire pour la mise en cache",
      langEnglish: "Niveau natif",
      langGerman: "Niveau natif",
      langChinese: "Maîtrise courante",
      langFrench: "Niveau conversationnel",
    },
    langNames: {
      english: "Anglais",
      german: "Allemand",
      chinese: "Chinois/Mandarin",
      french: "Français",
    },
  },
  projects: {
    heading: "Projets",
    subheading:
      "Une sélection ciblée de produits conçus avec clarté, cohérence et performance.",
    disclosureEyebrow: "Avant de faire défiler",
    disclosureBody:
      "Cette page ne montre que la part publique de ce que j'ai construit. Quelques autres projets se trouvent derrière des NDA, dans des dépôts privés ou sur des infrastructures clients que je préfère ne pas exposer — ils n'apparaissent donc pas ici. Tout ce que vous voyez ci-dessous est personnel : de petites choses que je bricole le soir et le week-end, par curiosité et avec l'espoir discret de rendre la journée de quelqu'un un tout petit peu plus légère. Si l'un d'eux y parvient pour vous, mission accomplie.",
    source: "Source",
    live: "Live",
    details: "Détails",
    openRepo: "Ouvrir le dépôt {name}",
    openLive: "Ouvrir le site live de {name}",
    viewDetails: "Voir les détails de {name}",
  },
  projectDetails: {
    home: "Accueil",
    projects: "Projets",
    back: "Retour",
    overview: "Aperçu",
    notes: "Notes",
    links: "Liens",
    visitSite: "Visiter le site",
    sourceCode: "Code source",
    moreProjects: "Plus de projets",
    present: "Présent",
  },
  services: {
    eyebrow: "Ce que je propose",
    heading: "Services",
    filters: {
      all: "Tous les services",
      build: "Construire",
      protect: "Protéger",
      grow: "Développer",
    },
    categoryMeta: {
      build: { label: "Construire", desc: "Design & développement" },
      protect: { label: "Protéger", desc: "Sécurité & fiabilité" },
      grow: { label: "Développer", desc: "Visibilité & performance" },
    },
    ctaTitle: "Construisons quelque chose ensemble",
    ctaEyebrow: "Un projet en tête ?",
    ctaButton: "Prendre contact",
    getInTouch: "Prendre contact",
    items: {
      webDev: {
        title: "Développement web",
        description:
          "Création de sites web de bout en bout — responsives, rapides et conçus pour convertir.",
        features: [
          "Design responsive",
          "Optimisé SEO",
          "Chargement rapide",
          "Multi-navigateurs",
        ],
      },
      customSoftware: {
        title: "Logiciel sur mesure",
        description:
          "Logiciels sur mesure conçus précisément selon vos besoins métiers.",
        features: [
          "Analyse des besoins",
          "Architecture sur mesure",
          "Tests complets",
          "Transfert",
        ],
      },
      serverSetup: {
        title: "Configuration serveur",
        description:
          "Configuration serveur production-ready avec sécurité et monitoring intégrés.",
        features: [
          "Installation",
          "Renforcement sécurité",
          "Réglage performance",
          "Monitoring",
        ],
      },
      security: {
        title: "Consultation en sécurité",
        description:
          "Trouvez les vulnérabilités avant les attaquants. Audits avec correctifs concrets.",
        features: [
          "Audit de sécurité",
          "Scan de vulnérabilités",
          "Réduction des risques",
          "Conformité",
        ],
      },
      maintenance: {
        title: "Maintenance de site web",
        description:
          "Gardez votre site sécurisé, patché et performant chaque mois.",
        features: [
          "Mises à jour de sécurité",
          "Corrections de bugs",
          "Monitoring de disponibilité",
          "Mises à jour de contenu",
        ],
      },
      backup: {
        title: "Sauvegarde & restauration",
        description:
          "Sauvegardes automatisées et restauration testée — la perte de données n'est pas une option.",
        features: [
          "Sauvegardes automatisées",
          "Stockage cloud",
          "Protocoles de restauration",
          "Alertes en temps réel",
        ],
      },
      seo: {
        title: "Optimisation SEO",
        description:
          "Améliorez le classement organique avec SEO technique, mots-clés et performance.",
        features: [
          "Recherche de mots-clés",
          "SEO on-page",
          "Audit technique",
          "Reporting",
        ],
      },
      cms: {
        title: "Gestion de contenu",
        description:
          "Mises à jour de contenu continues et maintenance CMS pour garder votre site frais.",
        features: [
          "Maintenance CMS",
          "Optimisation d'images",
          "Mises à jour de mise en page",
          "Contenu SEO",
        ],
      },
      support: {
        title: "Support technique",
        description:
          "Aide rapide et fiable lorsqu'un problème survient ou qu'une optimisation est nécessaire.",
        features: [
          "Réponse rapide",
          "Corrections de bugs",
          "Optimisation de code",
          "Aide à l'intégration",
        ],
      },
    },
    inquiry: {
      subjectPrefix: "Demande de projet →",
      greeting: "Salut Dominik,",
      intro:
        "je suis tombé sur ton travail et je suis assez convaincu que {service} est exactement ce qu'il faut à mon projet.",
      discuss: "Voici ce qui a retenu mon attention :",
      closing:
        "Ça te dirait un court appel pour passer en revue les détails ? Dis-moi ce qui te convient.\n\n— À bientôt",
    },
  },
  contact: {
    headlineLine1: "Travaillons",
    headlineLine2: "ensemble.",
    intro:
      "Un projet, une idée, ou juste envie de dire bonjour ? Je suis toujours ouvert à de nouvelles missions et à des conversations intéressantes.",
    emailLabel: "Email",
    basedLabel: "Basé à",
    basedLocation: "Zurich, Suisse",
    form: {
      nameLabel: "Nom",
      namePlaceholder: "Votre nom",
      emailLabel: "Email",
      emailPlaceholder: "votre@email.com",
      subjectLabel: "Objet",
      subjectPlaceholder: "De quoi s'agit-il ?",
      messageLabel: "Message",
      messagePlaceholder: "Parlez-moi de votre projet ou idée...",
      send: "Envoyer le message",
      sending: "Envoi...",
      successTitle: "Message reçu.",
      successBody: "Merci de m'avoir contacté. Je vous réponds sous 24 heures.",
      sendAnother: "Envoyer un autre →",
      errorTitle: "Une erreur est survenue",
      errorBody: "Veuillez réessayer ou m'envoyer un email directement.",
    },
  },
  donate: {
    eyebrow: "Pourboire",
    headlineLine1: "Si quelque chose",
    headlineLine2: "vous a parlé.",
    intro:
      "Les pourboires reposent sur la confiance et les petites attentions. Si un projet ici vous a fait gagner du temps, appris quelque chose ou simplement souri — lâchez quelques francs. Aucune pression, juste de la gratitude.",
    pickAmount: "Choisissez un montant",
    currency: "CHF",
    tiers: {
      tier5: { label: "Ça compte vraiment" },
      tier15: { label: "Vraiment utile" },
      tier30: { label: "Plus que généreux" },
    },
    anyAmount: {
      symbol: "∞",
      title: "Libre",
      label: "Ce qui vous semble juste",
    },
    sponsorBiggerLead: "Un projet plus grand en tête ?",
    sponsorBiggerCta: "Écrivez-moi plutôt",
    paypalNote: "Géré en toute sécurité par PayPal. Merci — vraiment.",
  },
  github: {
    contributionsSuffix: "contributions sur la dernière année",
    activityNote: "Activité GitHub sur les 12 derniers mois",
    recentActivity: "Activité récente",
    loadError: "Échec du chargement des contributions GitHub",
    less: "Moins",
    more: "Plus",
    contribution: "contribution",
    contributions: "contributions",
  },
  footer: {
    tagline: "Développeur web créatif",
    rights: "Tous droits réservés.",
    privacyPolicy: "Politique de confidentialité",
  },
  privacy: {
    title: "Politique de confidentialité",
    sections: {
      intro: {
        heading: "Introduction",
        body: "Ce site portfolio personnel présente mes projets et services. Cette politique de confidentialité explique comment vos données sont traitées lorsque vous visitez ce site.",
        controllerLabel: "Responsable du traitement :",
        controllerValue: "Dominik Könitzer, Suisse",
        contactLabel: "Contact :",
      },
      collection: {
        heading: "Collecte de données",
        hostingLabel: "Hébergement & analytics :",
        hostingBody:
          "Ce site est hébergé par Vercel. Les journaux serveur (adresse IP, type de navigateur, heure d'accès) sont stockés à des fins de sécurité et de fiabilité. Les statistiques de visiteurs sont collectées via Vercel Analytics avec uniquement des données anonymisées — aucun cookie ni identifiant de suivi n'est utilisé.",
        contactLabel: "Formulaire de contact :",
        contactBody:
          "Si vous me contactez via le formulaire ou par e-mail, je conserve les informations fournies (nom, e-mail, message) uniquement pour traiter votre demande et répondre aux questions de suivi.",
      },
      rights: {
        heading: "Vos droits",
        body: "Vous avez le droit d'accéder, de rectifier ou de supprimer vos données personnelles. Vous pouvez également demander la limitation du traitement ou vous y opposer.",
        contactPrompt: "Pour exercer ces droits, veuillez me contacter à ",
      },
      impressum: {
        heading: "Impressum",
        responsibleFor: "Responsable de ce site :",
        name: "Dominik Könitzer",
        city: "Zurich, Suisse",
        emailLabel: "Email : ",
      },
      lastUpdated: "Dernière mise à jour : ",
    },
  },
  seo: {
    home: {
      title: "Ingénieur logiciel & développeur web",
      description:
        "Dominik Könitzer - Ingénieur logiciel spécialisé en développement web moderne. Basé en Suisse, actuellement étudiant à la WISS. Expert en React, TypeScript et développement full-stack. Découvrez mon portfolio, mes projets et mes compétences.",
      keywords:
        "Dominik Könitzer, ingénieur logiciel, développeur web, développeur React, développeur TypeScript, développeur full-stack, Suisse, développeur suisse, ingénieur logiciel Suisse, services de développement web, développeur frontend, développeur backend, portfolio",
    },
    about: {
      title: "À propos de moi",
      description:
        "Découvrez Dominik Könitzer - ingénieur logiciel de 17 ans étudiant à la WISS Schulen für Wirtschaft Informatik Immobilien. Actuellement dans le sixième semestre d'un programme d'ingénierie logicielle de 4 ans, spécialisé en développement web moderne.",
      keywords:
        "à propos de Dominik Könitzer, biographie ingénieur logiciel, étudiant WISS, étudiant ingénierie logicielle Suisse, parcours développeur web, formation ingénieur logiciel",
    },
    skills: {
      title: "Compétences & technologies",
      description:
        "Explorez les compétences techniques et l'expertise de Dominik Könitzer. Maîtrise de React, TypeScript, JavaScript, Node.js et des technologies modernes de développement web. Développeur full-stack avec expertise frontend et backend.",
      keywords:
        "compétences ingénieur logiciel, compétences React, compétences TypeScript, développeur JavaScript, développeur Node.js, compétences développeur full-stack, technologies de développement web, langages de programmation, expertise ingénierie logicielle",
    },
    projects: {
      title: "Projets",
      description:
        "Explorez les projets logiciels à fort impact de Dominik Konitzer, incluant Zephyr, Spectrum et Entropy. Consultez les déploiements live et le code source qui démontrent une réflexion produit réelle, l'optimisation des performances et une exécution d'ingénierie professionnelle.",
      keywords:
        "portfolio ingénieur logiciel, projets de développement web à fort impact, projet Zephyr, projet Spectrum, projet Entropy, portfolio React TypeScript, ingénieur frontend Suisse, engager un ingénieur logiciel",
    },
    services: {
      title: "Services",
      description:
        "Services professionnels d'ingénierie logicielle et de développement web par Dominik Könitzer. Développement frontend, backend, solutions full-stack et applications web modernes. Basé en Suisse, au service de clients dans le monde entier.",
      keywords:
        "services d'ingénierie logicielle, services de développement web, services de développement frontend, services de développement backend, développement full-stack, services de développement React, développement TypeScript, applications web sur mesure, développement logiciel Suisse",
    },
    contact: {
      title: "Contact",
      description:
        "Contactez Dominik Könitzer pour des projets d'ingénierie logicielle et de développement web. Basé en Suisse, disponible pour du freelance, des collaborations et des missions de conseil.",
      keywords:
        "contacter Dominik Könitzer, contact ingénieur logiciel, contact développeur web, engager un ingénieur logiciel, développeur freelance Suisse, conseil en ingénierie logicielle",
    },
    donate: {
      title: "Faire un don",
      description:
        "Soutenez les projets logiciels de Dominik Konitzer par un don. Votre contribution finance de nouvelles réalisations, des améliorations, l'hébergement et un travail de développement à long terme.",
      keywords:
        "donner à un développeur, soutenir des projets logiciels, soutenir un développeur open source, don PayPal, soutenir Dominik Konitzer",
    },
    privacy: {
      title: "Politique de confidentialité",
      description:
        "Politique de confidentialité pour dominikkoenitzer.ch. Découvrez comment vos données sont collectées, utilisées et protégées lorsque vous visitez ce site. Conforme à la LPD suisse et au RGPD de l'UE.",
      keywords:
        "politique de confidentialité, protection des données, RGPD, LPD, déclaration de confidentialité, confidentialité des données, confidentialité Suisse",
    },
    projectDetailsKeywordsSuffix:
      "projet, étude de cas en ingénierie logicielle, portfolio de développement web",
  },
} as const;
