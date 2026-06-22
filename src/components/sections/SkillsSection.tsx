import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";
import { SectionHeading } from "../layout/SectionHeading";

function SkillDots({
  proficiency,
  index,
}: {
  proficiency: number;
  index: number;
}) {
  const filled = Math.round(proficiency / 20);
  return (
    <div className="flex shrink-0 items-center gap-[3px]">
      {Array.from({ length: 5 }, (_, i) => (
        <motion.span
          className={`block h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
            i < filled
              ? "bg-primary group-hover:bg-primary/90"
              : "bg-muted-foreground/20 group-hover:bg-muted-foreground/30"
          }`}
          initial={{ opacity: 0, scale: 0 }}
          key={i}
          transition={{
            duration: 0.25,
            delay: Math.min(0.1 + index * 0.03, 0.2) + i * 0.03,
            ease: [0.22, 1, 0.36, 1],
          }}
          viewport={{ once: true, margin: "-30px" }}
          whileInView={{ opacity: 1, scale: 1 }}
        />
      ))}
    </div>
  );
}

type DescKey = keyof typeof translations.en.skills.descriptions;
type LangKey = keyof typeof translations.en.skills.langNames;
type CategoryKey = keyof typeof translations.en.skills.categories;

interface Skill {
  name: string;
  descKey: DescKey;
  proficiency: number;
}

interface LanguageSkill {
  langKey: LangKey;
  descKey: DescKey;
  proficiency: number;
}

interface SkillCategory {
  key: CategoryKey;
  icon: JSX.Element;
  skills: Skill[];
}

const frontendIcon = (
  <svg
    className="lucide lucide-layout"
    fill="none"
    height="24"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect height="18" rx="2" width="18" x="3" y="3" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
  </svg>
);
const professionalIcon = (
  <svg
    className="lucide lucide-briefcase"
    fill="none"
    height="24"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect height="14" rx="2" ry="2" width="20" x="2" y="7" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const backendIcon = (
  <svg
    className="lucide lucide-server"
    fill="none"
    height="24"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect height="8" rx="2" ry="2" width="20" x="2" y="2" />
    <rect height="8" rx="2" ry="2" width="20" x="2" y="14" />
    <line x1="6" x2="6.01" y1="6" y2="6" />
    <line x1="6" x2="6.01" y1="18" y2="18" />
  </svg>
);
const devopsIcon = (
  <svg
    className="lucide lucide-terminal"
    fill="none"
    height="24"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" x2="20" y1="19" y2="19" />
  </svg>
);
const databasesIcon = (
  <svg
    className="lucide lucide-database"
    fill="none"
    height="24"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);
const languagesIcon = (
  <svg
    className="lucide lucide-languages"
    fill="none"
    height="24"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="m5 8 6 6" />
    <path d="m4 14 6-6 2-3" />
    <path d="M2 5h12" />
    <path d="M7 2h1" />
    <path d="m22 22-5-10-5 10" />
    <path d="M14 18h6" />
  </svg>
);

const skillCategories: SkillCategory[] = [
  {
    key: "frontend",
    icon: frontendIcon,
    skills: (
      [
        { name: "React", descKey: "react", proficiency: 95 },
        { name: "Next.js", descKey: "nextjs", proficiency: 90 },
        { name: "shadcn/ui", descKey: "shadcn", proficiency: 90 },
        { name: "Tailwind CSS", descKey: "tailwind", proficiency: 85 },
        { name: "TypeScript", descKey: "typescript", proficiency: 80 },
        { name: "JavaScript (ES6+)", descKey: "javascript", proficiency: 75 },
        { name: "Framer Motion", descKey: "framerMotion", proficiency: 75 },
        { name: "Lighthouse", descKey: "lighthouse", proficiency: 70 },
      ] satisfies Skill[]
    ).sort((a, b) => b.proficiency - a.proficiency),
  },
  {
    key: "professional",
    icon: professionalIcon,
    skills: (
      [
        {
          name: "Customer Service",
          descKey: "customerService",
          proficiency: 90,
        },
        { name: "Communication", descKey: "communication", proficiency: 90 },
        {
          name: "Project Management",
          descKey: "projectManagement",
          proficiency: 85,
        },
        { name: "Microsoft Excel", descKey: "excel", proficiency: 85 },
        { name: "Direct Sales", descKey: "directSales", proficiency: 80 },
        {
          name: "Social Media Outreach",
          descKey: "socialMedia",
          proficiency: 80,
        },
        { name: "SEO Copywriting", descKey: "seoCopywriting", proficiency: 75 },
        { name: "Video Editing", descKey: "videoEditing", proficiency: 70 },
      ] satisfies Skill[]
    ).sort((a, b) => b.proficiency - a.proficiency),
  },
  {
    key: "backend",
    icon: backendIcon,
    skills: (
      [
        { name: "Java", descKey: "java", proficiency: 90 },
        { name: "Spring Framework", descKey: "spring", proficiency: 85 },
        { name: "Node.js", descKey: "nodejs", proficiency: 85 },
        { name: "Bash", descKey: "bash", proficiency: 80 },
        { name: "GraphQL", descKey: "graphql", proficiency: 75 },
        { name: "Python", descKey: "python", proficiency: 75 },
        { name: "C#", descKey: "csharp", proficiency: 70 },
        { name: "C++", descKey: "cpp", proficiency: 60 },
      ] satisfies Skill[]
    ).sort((a, b) => b.proficiency - a.proficiency),
  },
  {
    key: "devops",
    icon: devopsIcon,
    skills: (
      [
        { name: "Windows Server", descKey: "windowsServer", proficiency: 85 },
        { name: "Hardware Installation", descKey: "hardware", proficiency: 85 },
        { name: "Jenkins", descKey: "jenkins", proficiency: 80 },
        { name: "Linux Server", descKey: "linux", proficiency: 80 },
        { name: "Ubuntu", descKey: "ubuntu", proficiency: 80 },
        { name: "Kali Linux", descKey: "kali", proficiency: 75 },
        { name: "Grafana", descKey: "grafana", proficiency: 65 },
      ] satisfies Skill[]
    ).sort((a, b) => b.proficiency - a.proficiency),
  },
  {
    key: "databases",
    icon: databasesIcon,
    skills: (
      [
        { name: "Git", descKey: "git", proficiency: 90 },
        { name: "Docker", descKey: "docker", proficiency: 85 },
        { name: "SQLite", descKey: "sqlite", proficiency: 85 },
        { name: "PostgreSQL", descKey: "postgres", proficiency: 80 },
        { name: "MongoDB", descKey: "mongo", proficiency: 80 },
        { name: "Redis", descKey: "redis", proficiency: 75 },
      ] satisfies Skill[]
    ).sort((a, b) => b.proficiency - a.proficiency),
  },
];

const languageSkills: LanguageSkill[] = (
  [
    { langKey: "english", descKey: "langEnglish", proficiency: 95 },
    { langKey: "german", descKey: "langGerman", proficiency: 90 },
    { langKey: "chinese", descKey: "langChinese", proficiency: 70 },
    { langKey: "french", descKey: "langFrench", proficiency: 60 },
  ] satisfies LanguageSkill[]
).sort((a, b) => b.proficiency - a.proficiency);

export function SkillsSection() {
  const { language } = useLanguage();
  const t = translations[language].skills;

  return (
    <section className="section-padding relative overflow-hidden" id="skills">
      <div className="-z-10 absolute inset-0 bg-gradient-to-b from-transparent via-muted/10 to-transparent" />

      <SectionHeading subtitle={t.subheading} title={t.heading} />

      <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skillCategories.map((category, catIndex) => (
          <motion.div
            className="glass-card h-full rounded-2xl p-5 sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            key={category.key}
            transition={{
              duration: 0.6,
              delay: Math.min(catIndex * 0.1, 0.4),
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ once: true, margin: "-50px" }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="mb-5 flex items-center border-border/20 border-b pb-3 sm:mb-6">
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-12 sm:w-12">
                {category.icon}
              </div>
              <h3 className="font-semibold text-lg sm:text-xl">
                {t.categories[category.key]}
              </h3>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {category.skills.map((skill, index) => (
                <motion.div
                  className="group"
                  initial={{ opacity: 0, y: 10 }}
                  key={skill.name}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(0.1 + index * 0.05, 0.3),
                  }}
                  viewport={{ once: true, margin: "-30px" }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <span className="truncate font-medium text-sm transition-colors duration-300 group-hover:text-primary sm:text-base">
                        {skill.name}
                      </span>
                    </div>
                    <SkillDots proficiency={skill.proficiency} index={index} />
                  </div>
                  <span className="mt-0.5 block text-muted-foreground text-xs">
                    {t.descriptions[skill.descKey]}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Languages category — skill name itself is translated */}
        <motion.div
          className="glass-card h-full rounded-2xl p-5 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          transition={{
            duration: 0.6,
            delay: Math.min(skillCategories.length * 0.1, 0.4),
            ease: [0.22, 1, 0.36, 1],
          }}
          viewport={{ once: true, margin: "-50px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="mb-5 flex items-center border-border/20 border-b pb-3 sm:mb-6">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-12 sm:w-12">
              {languagesIcon}
            </div>
            <h3 className="font-semibold text-lg sm:text-xl">
              {t.categories.languages}
            </h3>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {languageSkills.map((skill, index) => (
              <motion.div
                className="group"
                initial={{ opacity: 0, y: 10 }}
                key={skill.langKey}
                transition={{
                  duration: 0.4,
                  delay: Math.min(0.1 + index * 0.05, 0.3),
                }}
                viewport={{ once: true, margin: "-30px" }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="truncate font-medium text-sm transition-colors duration-300 group-hover:text-primary sm:text-base">
                      {t.langNames[skill.langKey]}
                    </span>
                    <span className="mt-0.5 block text-muted-foreground text-xs">
                      {t.descriptions[skill.descKey]}
                    </span>
                  </div>
                  <SkillDots proficiency={skill.proficiency} index={index} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
