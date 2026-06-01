import type { Language } from "@/config/languages";
import type { LocalizedContent } from "./types";

export const remnants: Record<Language, LocalizedContent> = {
  en: {
    tagline:
      "A browser-native code editor built for developers who think in files.",
    description:
      "Remnants is an in-browser IDE with persistent file tree management, multi-panel layouts, and syntax highlighting — a fully capable editing environment that lives entirely in your browser.",
    overview:
      "Remnants brings the IDE experience to the browser without any installation. Built with React and TypeScript, it delivers a familiar workspace with recursive file trees, split panel editing, quick-open navigation, and full syntax highlighting — all persisted locally across sessions.",
    roleSummary:
      "Full-stack frontend engineer architecting a production-grade in-browser development environment from scratch.",
    problemStatement:
      "Setting up a local development environment has a high barrier to entry. Remnants brings a capable, familiar editing workflow directly into the browser — instantly accessible from any device.",
    objectives: [
      "Build a persistent file tree with full create, rename, and delete operations that survives page reloads.",
      "Implement multi-panel layouts with independent scroll and focus state per panel.",
      "Deliver syntax-highlighted code editing with a responsive, IDE-like interface.",
    ],
    architectureDecisions: [
      "localStorage-backed persistence layer for both workspace tree structure and per-file content.",
      "Immutable recursive tree data structure enabling safe, predictable nested file operations.",
      "Component isolation between FileTree, Panel, and SyntaxHighlighter for independent scaling.",
    ],
    implementationHighlights: [
      "Built a fully recursive file tree with path-aware create, rename, delete, and duplicate prevention.",
      "Implemented quick-open functionality for fast keyboard-driven navigation across nested file structures.",
      "Delivered real-time syntax highlighting with a custom-styled monospace editing experience.",
    ],
    qualityAndSecurity: [
      "Path-aware recursive state updates with operation success tracking to prevent tree corruption.",
      "Input validation on file and folder naming to reject invalid or conflicting entries.",
      "Graceful degradation for empty workspace states and missing or malformed storage entries.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Maintaining correct tree state through deeply nested create, rename, and delete operations.",
        solution:
          "Built a path-aware recursive update system returning both the updated tree and an operation success flag, enabling reliable rollback on failure.",
      },
      {
        challenge:
          "Preserving editor content and scroll position when switching between open files.",
        solution:
          "Decoupled file content storage from panel rendering so each panel independently manages its own view state without cross-contamination.",
      },
    ],
    hiringSignals: [
      "Demonstrates ability to build complex stateful UIs with recursive tree data structures.",
      "Shows architectural thinking around component isolation and predictable data flow.",
      "Proves comfort building developer-facing tooling and editor-domain products.",
    ],
    nextIterations: [
      "Add real-time collaborative editing with cursor and selection sharing.",
      "Introduce file-type detection for smarter per-language syntax highlighting.",
      "Expand keyboard shortcut coverage for full power-user workflow parity.",
    ],
    tags: ["Dev Tools", "TypeScript", "Browser IDE"],
    impactHeading: "How This Project Creates Impact",
    impactPoints: [
      "Lowers the barrier to entry for coding by making a capable editor instantly accessible in any browser.",
      "Demonstrates deep mastery of complex tree-based UI state management at production quality.",
      "Reflects genuine developer empathy — building tools that developers themselves want to use.",
    ],
  },
  de: {
    tagline:
      "Ein browser-nativer Code-Editor für Entwickler, die in Dateien denken.",
    description:
      "Remnants ist eine im Browser laufende IDE mit persistentem Datei-Baum, Multi-Panel-Layouts und Syntax-Highlighting — eine voll funktionsfähige Editor-Umgebung, die komplett im Browser lebt.",
    overview:
      "Remnants bringt die IDE-Erfahrung ohne jegliche Installation in den Browser. Mit React und TypeScript gebaut, liefert es einen vertrauten Workspace mit rekursiven Datei-Bäumen, Split-Panel-Editing, Quick-Open-Navigation und vollständigem Syntax-Highlighting — alles lokal über Sessions hinweg persistent.",
    roleSummary:
      "Full-Stack-Frontend-Engineer, der eine produktionsreife In-Browser-Entwicklungs-Umgebung von Grund auf aufgebaut hat.",
    problemStatement:
      "Eine lokale Entwicklungs-Umgebung aufzusetzen hat eine hohe Einstiegshürde. Remnants bringt einen leistungsfähigen, vertrauten Editor-Workflow direkt in den Browser — sofort von jedem Gerät aus zugänglich.",
    objectives: [
      "Einen persistenten Datei-Baum mit vollständigen Create-, Rename- und Delete-Operationen bauen, der Seiten-Reloads übersteht.",
      "Multi-Panel-Layouts mit eigenem Scroll- und Fokus-State pro Panel umsetzen.",
      "Syntax-Highlighting-Editing mit einem responsiven, IDE-ähnlichen Interface liefern.",
    ],
    architectureDecisions: [
      "localStorage-basierte Persistenz für Baum-Struktur und Datei-Inhalte.",
      "Unveränderliche rekursive Baum-Datenstruktur für sichere, vorhersehbare verschachtelte Datei-Operationen.",
      "Komponenten-Isolation zwischen FileTree, Panel und SyntaxHighlighter für unabhängige Skalierung.",
    ],
    implementationHighlights: [
      "Voll rekursiver Datei-Baum mit pfadbasiertem Create, Rename, Delete und Duplikat-Prävention.",
      "Quick-Open-Funktion für schnelle Tastatur-Navigation durch verschachtelte Datei-Strukturen.",
      "Echtzeit-Syntax-Highlighting mit individuell gestyltem Monospace-Editing.",
    ],
    qualityAndSecurity: [
      "Pfadbasierte rekursive State-Updates mit Operation-Success-Tracking, um Baum-Korruption zu verhindern.",
      "Eingabe-Validierung bei Datei- und Ordner-Namen, um ungültige oder konfliktreiche Einträge abzulehnen.",
      "Graceful Degradation für leere Workspace-States und fehlende oder fehlerhafte Storage-Einträge.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Korrekten Baum-State über tief verschachtelte Create-, Rename- und Delete-Operationen erhalten.",
        solution:
          "Pfadbasiertes rekursives Update-System gebaut, das sowohl den aktualisierten Baum als auch ein Operation-Success-Flag zurückgibt — zuverlässiges Rollback bei Fehlern.",
      },
      {
        challenge:
          "Editor-Inhalt und Scroll-Position beim Wechsel zwischen geöffneten Dateien erhalten.",
        solution:
          "Datei-Content-Speicher von der Panel-Rendering entkoppelt, sodass jedes Panel seinen View-State unabhängig verwaltet — ohne Kreuzwirkung.",
      },
    ],
    hiringSignals: [
      "Beweist die Fähigkeit, komplexe stateful UIs mit rekursiven Baum-Strukturen zu bauen.",
      "Zeigt architektonisches Denken rund um Komponenten-Isolation und vorhersehbaren Datenfluss.",
      "Beweist Souveränität beim Bauen entwicklerorientierter Tools und Editor-Produkte.",
    ],
    nextIterations: [
      "Echtzeit-Collaborative-Editing mit Cursor- und Selection-Sharing ergänzen.",
      "Datei-Typ-Erkennung für smarteres sprachspezifisches Syntax-Highlighting einführen.",
      "Tastatur-Shortcut-Abdeckung für vollständige Power-User-Workflow-Parität ausbauen.",
    ],
    tags: ["Dev Tools", "TypeScript", "Browser-IDE"],
    impactHeading: "Wie dieses Projekt Wirkung erzeugt",
    impactPoints: [
      "Senkt die Einstiegshürde fürs Programmieren — ein leistungsfähiger Editor, sofort in jedem Browser nutzbar.",
      "Beweist tiefe Beherrschung komplexer baum-basierter UI-State-Verwaltung auf Produktionsqualität.",
      "Spiegelt echte Developer-Empathie — Tools bauen, die Entwickler selbst nutzen wollen.",
    ],
  },
  fr: {
    tagline:
      "Un éditeur de code natif au navigateur, conçu pour les développeurs qui pensent en fichiers.",
    description:
      "Remnants est un IDE dans le navigateur avec gestion persistante de l'arborescence, mises en page multi-panneaux et coloration syntaxique — un environnement d'édition complet qui vit entièrement dans votre navigateur.",
    overview:
      "Remnants apporte l'expérience IDE au navigateur sans aucune installation. Bâti avec React et TypeScript, il offre un espace de travail familier avec arborescences récursives, édition en panneaux fractionnés, navigation rapide et coloration syntaxique complète — le tout persisté localement entre sessions.",
    roleSummary:
      "Ingénieur frontend full-stack ayant architecturé de zéro un environnement de développement de qualité production dans le navigateur.",
    problemStatement:
      "Configurer un environnement de développement local représente une vraie barrière. Remnants apporte un workflow d'édition complet et familier directement dans le navigateur — instantanément accessible depuis n'importe quel appareil.",
    objectives: [
      "Construire une arborescence persistante avec des opérations complètes de création, renommage et suppression survivant aux rechargements de page.",
      "Implémenter des mises en page multi-panneaux avec scroll et focus indépendants par panneau.",
      "Offrir une édition de code avec coloration syntaxique dans une interface responsive de type IDE.",
    ],
    architectureDecisions: [
      "Couche de persistance basée sur localStorage pour la structure de l'arborescence et le contenu des fichiers.",
      "Structure de données arborescente récursive immuable pour des opérations imbriquées sûres et prévisibles.",
      "Isolation des composants entre FileTree, Panel et SyntaxHighlighter pour une montée en charge indépendante.",
    ],
    implementationHighlights: [
      "Arborescence entièrement récursive avec création, renommage, suppression et prévention de doublons conscients du chemin.",
      "Fonction de navigation rapide pour parcourir au clavier des structures de fichiers imbriquées.",
      "Coloration syntaxique en temps réel avec une expérience d'édition monospace stylisée sur mesure.",
    ],
    qualityAndSecurity: [
      "Mises à jour d'état récursives conscientes du chemin avec suivi de succès pour éviter la corruption de l'arborescence.",
      "Validation d'entrée pour les noms de fichiers et dossiers rejetant les entrées invalides ou en conflit.",
      "Dégradation gracieuse pour les espaces vides et les entrées de stockage manquantes ou mal formées.",
    ],
    challengesAndSolutions: [
      {
        challenge:
          "Maintenir un état d'arborescence correct à travers des opérations imbriquées profondes de création, renommage et suppression.",
        solution:
          "Système de mise à jour récursif conscient du chemin retournant à la fois l'arborescence mise à jour et un drapeau de succès, permettant un rollback fiable en cas d'échec.",
      },
      {
        challenge:
          "Préserver le contenu de l'éditeur et la position de scroll lors du basculement entre fichiers ouverts.",
        solution:
          "Découplage du stockage du contenu des fichiers et du rendu des panneaux, chaque panneau gérant indépendamment son état de vue sans contamination croisée.",
      },
    ],
    hiringSignals: [
      "Démontre la capacité à bâtir des UIs stateful complexes avec des structures arborescentes récursives.",
      "Montre une pensée architecturale autour de l'isolation des composants et d'un flux de données prévisible.",
      "Prouve l'aisance à construire des outils destinés aux développeurs et des produits du domaine éditeur.",
    ],
    nextIterations: [
      "Ajouter l'édition collaborative en temps réel avec partage de curseur et de sélection.",
      "Introduire la détection du type de fichier pour une coloration syntaxique plus intelligente par langage.",
      "Étendre la couverture des raccourcis clavier pour une parité totale avec les workflows power-user.",
    ],
    tags: ["Outils Dev", "TypeScript", "IDE Navigateur"],
    impactHeading: "Comment ce projet crée de l'impact",
    impactPoints: [
      "Réduit la barrière à l'entrée pour coder en rendant un éditeur compétent instantanément accessible dans n'importe quel navigateur.",
      "Démontre une maîtrise approfondie de la gestion d'état UI à base d'arborescences, à un niveau de qualité production.",
      "Reflète une vraie empathie développeur — créer des outils que les développeurs eux-mêmes ont envie d'utiliser.",
    ],
  },
  zh: {
    tagline: "为以文件为思考单位的开发者打造的浏览器原生代码编辑器。",
    description:
      "Remnants 是一个浏览器内的 IDE，具备持久化的文件树管理、多面板布局与语法高亮——一个完全运行在浏览器中的全功能编辑环境。",
    overview:
      "Remnants 把 IDE 体验带入浏览器，无需任何安装。基于 React 与 TypeScript 构建，提供熟悉的工作区，包括递归文件树、分屏面板编辑、快速打开导航与完整语法高亮，所有内容跨会话本地持久化。",
    roleSummary: "全栈前端工程师，从零搭建生产级的浏览器内开发环境。",
    problemStatement:
      "搭建本地开发环境门槛较高。Remnants 把成熟且熟悉的编辑工作流直接带入浏览器——任意设备即点即用。",
    objectives: [
      "构建可经受页面刷新的持久化文件树，支持完整的创建、重命名与删除操作。",
      "实现多面板布局，每个面板拥有独立的滚动与焦点状态。",
      "提供具备语法高亮的代码编辑体验，配以响应式、类 IDE 的界面。",
    ],
    architectureDecisions: [
      "基于 localStorage 的持久化层，存储工作区树结构与各文件内容。",
      "不可变的递归树数据结构，保证安全、可预期的嵌套文件操作。",
      "FileTree、Panel 与 SyntaxHighlighter 之间的组件隔离，便于独立扩展。",
    ],
    implementationHighlights: [
      "构建完全递归的文件树，支持路径感知的创建、重命名、删除与重名防护。",
      "实现快速打开功能，便于在嵌套结构中通过键盘高速导航。",
      "提供实时语法高亮，并以自定义样式的等宽字体打造编辑体验。",
    ],
    qualityAndSecurity: [
      "路径感知的递归状态更新，并跟踪操作成功状态，防止树结构损坏。",
      "对文件与文件夹命名进行输入校验，拒绝非法或冲突的条目。",
      "对空工作区与缺失或异常的存储条目提供优雅降级。",
    ],
    challengesAndSolutions: [
      {
        challenge: "在深层嵌套的创建、重命名与删除操作中保持正确的树状态。",
        solution:
          "构建路径感知的递归更新系统，同时返回更新后的树与操作成功标志，使失败时可可靠回滚。",
      },
      {
        challenge: "在切换打开的文件时保留编辑器内容与滚动位置。",
        solution:
          "将文件内容存储与面板渲染解耦，让每个面板独立管理自己的视图状态，避免互相干扰。",
      },
    ],
    hiringSignals: [
      "证明能够基于递归树结构构建复杂的有状态 UI。",
      "展示在组件隔离与可预期数据流方面的架构思维。",
      "说明在开发者向工具与编辑器类产品方面驾驭自如。",
    ],
    nextIterations: [
      "加入带光标与选区共享的实时协作编辑。",
      "引入文件类型识别，实现按语言更智能的语法高亮。",
      "扩展快捷键覆盖，达到完整的高级用户工作流对等。",
    ],
    tags: ["开发工具", "TypeScript", "浏览器 IDE"],
    impactHeading: "本项目如何创造价值",
    impactPoints: [
      "通过让一款完备的编辑器在任意浏览器中即点即用，降低编码门槛。",
      "在生产级质量上展示对复杂树状 UI 状态管理的深度掌握。",
      "体现真正的开发者同理心——构建开发者自己愿意使用的工具。",
    ],
  },
};
