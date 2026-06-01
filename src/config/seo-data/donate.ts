import type { Language } from "@/config/languages";
import type { FAQItem, HowToSchema } from "@/types/seo";
import type { LocaleRecord } from "./types";

export const DONATE_FAQS: LocaleRecord<FAQItem[]> = {
  en: [
    {
      question: "Why should I donate to support this portfolio?",
      answer:
        "Donations directly support ongoing software project development, hosting costs, tooling, and time invested in shipping higher-quality features, better performance, and more useful public work.",
    },
    {
      question: "What does my donation help fund?",
      answer:
        "Your contribution helps fund infrastructure, software subscriptions, development tools, and focused build time for new projects, improvements, and educational engineering content.",
    },
    {
      question: "How can I donate?",
      answer:
        "You can donate securely via PayPal using the donation options on this page, or choose a custom amount through the main PayPal donation button.",
    },
  ],
  de: [
    {
      question: "Warum sollte ich für dieses Portfolio spenden?",
      answer:
        "Spenden unterstützen direkt die laufende Entwicklung von Software-Projekten, Hosting-Kosten, Tools und Zeit für hochwertige Features, bessere Performance und nützlichere öffentliche Arbeit.",
    },
    {
      question: "Wofür wird meine Spende verwendet?",
      answer:
        "Dein Beitrag finanziert Infrastruktur, Software-Abos, Entwicklungs-Tools sowie fokussierte Build-Zeit für neue Projekte, Verbesserungen und Engineering-Inhalte.",
    },
    {
      question: "Wie kann ich spenden?",
      answer:
        "Du kannst sicher über PayPal mit den Optionen auf dieser Seite spenden oder über den PayPal-Hauptbutton einen beliebigen Betrag wählen.",
    },
  ],
  fr: [
    {
      question: "Pourquoi soutenir ce portfolio par un don ?",
      answer:
        "Les dons soutiennent directement le développement continu des projets, les frais d'hébergement, l'outillage et le temps consacré à livrer des fonctionnalités de meilleure qualité, plus performantes et plus utiles publiquement.",
    },
    {
      question: "À quoi sert mon don ?",
      answer:
        "Votre contribution finance l'infrastructure, les abonnements logiciels, les outils de développement et un temps de build dédié à de nouveaux projets, des améliorations et du contenu pédagogique d'ingénierie.",
    },
    {
      question: "Comment faire un don ?",
      answer:
        "Vous pouvez faire un don de manière sécurisée via PayPal grâce aux options proposées sur cette page, ou choisir un montant personnalisé via le bouton principal PayPal.",
    },
  ],
  zh: [
    {
      question: "为什么要捐款支持这个作品集？",
      answer:
        "捐款直接支持软件项目的持续开发、托管费用、工具开销，以及投入到更高质量功能、更好性能与更有用公开作品上的时间。",
    },
    {
      question: "我的捐款会用于哪些方面？",
      answer:
        "您的支持将用于基础设施、软件订阅、开发工具，以及用于新项目、改进与工程教育内容的专注开发时间。",
    },
    {
      question: "如何进行捐款？",
      answer:
        "您可以通过本页面上的捐款选项使用 PayPal 安全捐款，或通过主 PayPal 按钮选择自定义金额。",
    },
  ],
};

export const DONATE_HOW_TO: LocaleRecord<HowToSchema> = {
  en: {
    name: "How to Support Dominik Konitzer's Work",
    description:
      "Simple steps to donate and support ongoing software projects and portfolio development.",
    step: [
      {
        name: "Choose Donation Option",
        text: "Select one of the suggested donation amounts or choose a custom amount.",
      },
      {
        name: "Open Secure PayPal Checkout",
        text: "Click a donation button to continue through PayPal's secure payment flow.",
      },
      {
        name: "Complete Donation",
        text: "Confirm your payment details and complete the donation.",
      },
      {
        name: "Support Ongoing Work",
        text: "Your contribution helps fund future project development, maintenance, and technical content.",
      },
    ],
  },
  de: {
    name: "So unterstützt du Dominik Konitzers Arbeit",
    description:
      "Einfache Schritte, um zu spenden und laufende Software-Projekte sowie die Portfolio-Entwicklung zu unterstützen.",
    step: [
      {
        name: "Spendenoption wählen",
        text: "Wähle einen der vorgeschlagenen Beträge oder gib einen individuellen Betrag ein.",
      },
      {
        name: "Sicheren PayPal-Checkout öffnen",
        text: "Klicke auf einen Spendenbutton, um den sicheren PayPal-Zahlungsprozess fortzusetzen.",
      },
      {
        name: "Spende abschliessen",
        text: "Bestätige deine Zahlungsdetails und schliesse die Spende ab.",
      },
      {
        name: "Laufende Arbeit unterstützen",
        text: "Dein Beitrag finanziert künftige Projektentwicklung, Wartung und technische Inhalte.",
      },
    ],
  },
  fr: {
    name: "Comment soutenir le travail de Dominik Konitzer",
    description:
      "Étapes simples pour faire un don et soutenir les projets logiciels en cours ainsi que le développement du portfolio.",
    step: [
      {
        name: "Choisir une option de don",
        text: "Sélectionnez l'un des montants suggérés ou choisissez un montant personnalisé.",
      },
      {
        name: "Ouvrir le paiement sécurisé PayPal",
        text: "Cliquez sur un bouton de don pour poursuivre via le flux de paiement sécurisé PayPal.",
      },
      {
        name: "Finaliser le don",
        text: "Vérifiez les détails de paiement et finalisez le don.",
      },
      {
        name: "Soutenir le travail en cours",
        text: "Votre contribution aide à financer le développement futur, la maintenance et le contenu technique.",
      },
    ],
  },
  zh: {
    name: "如何支持 Dominik Konitzer 的工作",
    description: "通过简单的步骤进行捐款，支持持续的软件项目与作品集开发。",
    step: [
      {
        name: "选择捐款方式",
        text: "选择推荐的捐款金额之一，或选择自定义金额。",
      },
      {
        name: "打开安全的 PayPal 结账",
        text: "点击捐款按钮，通过 PayPal 安全支付流程继续操作。",
      },
      {
        name: "完成捐款",
        text: "确认您的支付信息并完成捐款。",
      },
      {
        name: "支持持续工作",
        text: "您的支持将帮助资助未来的项目开发、维护与技术内容。",
      },
    ],
  },
};

export const getDonateFaqs = (lang: Language) =>
  DONATE_FAQS[lang] ?? DONATE_FAQS.en;
export const getDonateHowTo = (lang: Language) =>
  DONATE_HOW_TO[lang] ?? DONATE_HOW_TO.en;
