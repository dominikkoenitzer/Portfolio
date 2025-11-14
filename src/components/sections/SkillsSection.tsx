
import { motion } from "framer-motion";
import { SectionHeading } from "../layout/SectionHeading";
import { staggerContainer, staggerItem } from "@/lib/framer-animations";

interface Skill {
  name: string;
  description: string;
  proficiency?: number;
}

interface SkillCategory {
  name: string;
  icon: JSX.Element;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    name: "Frontend Development",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
    skills: [
      {
        name: "React",
        description: "Building dynamic user interfaces",
        proficiency: 95
      },
      {
        name: "Next.js",
        description: "Client-side scripting and interactive functionality",
        proficiency: 90
      },
      {
        name: "shadcn/ui",
        description: "Accessible and customizable UI components",
        proficiency: 90
      },
      {
        name: "Tailwind CSS",
        description: "Creating modern, utility-first styling",
        proficiency: 85
      },
      {
        name: "TypeScript",
        description: "Adding static typing for more robust code",
        proficiency: 80
      },
      {
        name: "JavaScript (ES6+)",
        description: "Modern JavaScript features and best practices",
        proficiency: 75
      },
      {
        name: "Framer Motion",
        description: "Advanced animations and interactive UI effects in React",
        proficiency: 75
      },
      {
        name: "Lighthouse",
        description: "Web performance, accessibility, and SEO auditing",
        proficiency: 70
      }
    ].sort((a, b) => (b.proficiency || 0) - (a.proficiency || 0))
  },
  {
    name: "Professional Skills",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-briefcase">
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    skills: [
      {
        name: "Customer Service",
        description: "Ensuring client satisfaction and positive experiences",
        proficiency: 90
      },
      {
        name: "Communication",
        description: "Clear and effective verbal and written communication",
        proficiency: 90
      },
      {
        name: "Project Management",
        description: "Planning and executing projects efficiently",
        proficiency: 85
      },
      {
        name: "Microsoft Excel",
        description: "Data analysis and spreadsheet management",
        proficiency: 85
      },
      {
        name: "Direct Sales",
        description: "Person-to-person sales and relationship building",
        proficiency: 80
      },
      {
        name: "Social Media Outreach",
        description: "Engaging audiences through social platforms",
        proficiency: 80
      },
      {
        name: "SEO Copywriting",
        description: "Writing content optimized for search engines",
        proficiency: 75
      },
      {
        name: "Video Editing",
        description: "Creating and editing video content",
        proficiency: 70
      }
    ].sort((a, b) => (b.proficiency || 0) - (a.proficiency || 0))
  },
  {
    name: "Backend Development",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-server">
        <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
        <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
        <line x1="6" x2="6.01" y1="6" y2="6" />
        <line x1="6" x2="6.01" y1="18" y2="18" />
      </svg>
    ),
    skills: [
      {
        name: "Java",
        description: "Backend programming for applications",
        proficiency: 90
      },
      {
        name: "Spring Framework",
        description: "Java-based framework for creating microservices",
        proficiency: 85
      },
      {
        name: "Node.js",
        description: "Building server-side applications",
        proficiency: 85
      },
      {
        name: "Bash",
        description: "Scripting for automating tasks on Linux systems",
        proficiency: 80
      },
      {
        name: "GraphQL",
        description: "Efficient data querying and manipulation",
        proficiency: 75
      },
      {
        name: "Python",
        description: "Versatile programming for backend and automation",
        proficiency: 75
      },
      {
        name: "C#",
        description: "Backend development with .NET framework",
        proficiency: 70
      },
      {
        name: "C++",
        description: "System-level programming and performance-critical applications",
        proficiency: 60
      }
    ].sort((a, b) => (b.proficiency || 0) - (a.proficiency || 0))
  },
  {
    name: "Operating Systems & DevOps",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-terminal">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" x2="20" y1="19" y2="19" />
      </svg>
    ),
    skills: [
      {
        name: "Windows Server",
        description: "Windows Server management and administration",
        proficiency: 85
      },
      {
        name: "Hardware Installation",
        description: "Setting up and configuring computer hardware",
        proficiency: 85
      },
      {
        name: "Jenkins",
        description: "Automation server for building, deploying, and CI/CD pipelines",
        proficiency: 80
      },
      {
        name: "Linux Server",
        description: "Linux Server management and administration",
        proficiency: 80
      },
      {
        name: "Ubuntu",
        description: "Ubuntu distribution management and configuration",
        proficiency: 80
      },
      {
        name: "Kali Linux",
        description: "Security-focused Linux distribution",
        proficiency: 75
      },
      {
        name: "Grafana",
        description: "Metrics visualization and monitoring platform",
        proficiency: 65
      }
    ].sort((a, b) => (b.proficiency || 0) - (a.proficiency || 0))
  },
  {
    name: "Database Management & Version Control",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-database">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    skills: [
      {
        name: "Git",
        description: "Version control system for tracking changes in code",
        proficiency: 90
      },
      {
        name: "Docker",
        description: "Containerization platform for developing and deploying applications",
        proficiency: 85
      },
      {
        name: "SQLite",
        description: "Lightweight, serverless embedded database engine",
        proficiency: 85
      },
      {
        name: "PostgreSQL",
        description: "Advanced open-source relational database management system",
        proficiency: 80
      },
      {
        name: "MongoDB",
        description: "NoSQL document database for flexible data storage",
        proficiency: 80
      },
      {
        name: "Redis",
        description: "In-memory data structure store for caching",
        proficiency: 75
      }
    ].sort((a, b) => (b.proficiency || 0) - (a.proficiency || 0))
  },
  {
    name: "Languages",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-languages">
        <path d="m5 8 6 6" />
        <path d="m4 14 6-6 2-3" />
        <path d="M2 5h12" />
        <path d="M7 2h1" />
        <path d="m22 22-5-10-5 10" />
        <path d="M14 18h6" />
      </svg>
    ),
    skills: [
      {
        name: "English",
        description: "Native proficiency",
        proficiency: 90
      },
      {
        name: "German",
        description: "Native proficiency",
        proficiency: 85
      },
      {
        name: "Chinese/Mandarin",
        description: "Fluent proficiency",
        proficiency: 70
      },
      {
        name: "French",
        description: "Basic proficiency",
        proficiency: 45
      }
    ].sort((a, b) => (b.proficiency || 0) - (a.proficiency || 0))
  }
];


export default function SkillsSection() {
  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/10 to-transparent -z-10"></div>
      
      <SectionHeading 
        title="Technical Skills" 
        subtitle="My expertise spans across various technologies with a focus on creating efficient and elegant solutions."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {skillCategories.map((category, catIndex) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: Math.min(catIndex * 0.1, 0.4),
              ease: [0.22, 1, 0.36, 1] 
            }}
            viewport={{ once: true, margin: "-50px" }}
            className="glass-card rounded-xl p-5 sm:p-6 h-full"
          >
            <div className="flex items-center mb-5 sm:mb-6 border-b border-border/20 pb-3">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mr-3"
              >
                {category.icon}
              </motion.div>
              <h3 className="text-lg sm:text-xl font-semibold font-heading">{category.name}</h3>
            </div>
            
            <div className="space-y-4 sm:space-y-5">
              {category.skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(0.1 + index * 0.05, 0.3) }}
                  viewport={{ once: true, margin: "-30px" }}
                  className="group"
                >
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                      <div className="flex flex-col max-w-[calc(100%-60px)]">
                        <span className="font-medium text-sm sm:text-base group-hover:text-primary transition-colors duration-300 truncate">
                          {skill.name}
                        </span>
                        {category.name === "Languages" && (
                          <span className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2 group-hover:text-muted-foreground/80 transition-colors duration-300 line-clamp-2">
                            {skill.description}
                          </span>
                        )}
                      </div>
                      {skill.proficiency && (
                        <div className="relative">
                          <span className="text-xs bg-background/80 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-border/30 transition-colors duration-300 group-hover:border-primary/30">
                            <span className="text-primary font-medium">{skill.proficiency}</span>
                            <span className="text-muted-foreground">%</span>
                          </span>
                        </div>
                      )}
                    </div>
                    {skill.proficiency && (
                      <div className="w-full h-1.5 sm:h-2 bg-muted/30 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full rounded-full bg-primary/90`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          transition={{ 
                            duration: 0.8, 
                            ease: "easeOut", 
                            delay: Math.min(0.1 + index * 0.03, 0.2) 
                          }}
                          viewport={{ once: true, margin: "-30px" }}
                        />
                      </div>
                    )}
                    {category.name !== "Languages" && (
                      <span className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2 group-hover:text-muted-foreground/80 transition-colors duration-300 line-clamp-2">
                        {skill.description}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
