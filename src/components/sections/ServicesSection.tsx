import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { staggerContainer } from "@/lib/framer-animations";
import { SectionHeading } from "../layout/SectionHeading";

interface Service {
  title: string;
  description: string;
  price: string;
  icon: React.ReactNode;
  features: string[];
}

const services: Service[] = [
  {
    title: "Website Maintenance",
    description: "Regular updates, security patches, and bug fixes.",
    price: "50 CHF/month",
    features: [
      "Regular security updates",
      "Bug fixes & troubleshooting",
      "Performance monitoring",
      "Content updates",
      "Technical support",
    ],
    icon: (
      <svg
        className="lucide lucide-wrench"
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
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    title: "Technical Support",
    description: "Reliable, quick help for technical issues.",
    price: "30 CHF/hour",
    features: [
      "Fast response time",
      "Bug fixes & troubleshooting",
      "Code optimization",
      "Software integration",
      "Technical guidance",
    ],
    icon: (
      <svg
        className="lucide lucide-laptop"
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
        <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
      </svg>
    ),
  },
  {
    title: "Content Management",
    description:
      "Assistance with content updates and management on your website.",
    price: "40 CHF/hour",
    features: [
      "Regular content updates",
      "CMS maintenance",
      "Image optimization",
      "Layout improvements",
      "SEO-friendly content",
    ],
    icon: (
      <svg
        className="lucide lucide-file-text"
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
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" x2="8" y1="13" y2="13" />
        <line x1="16" x2="8" y1="17" y2="17" />
        <line x1="10" x2="8" y1="9" y2="9" />
      </svg>
    ),
  },
  {
    title: "Security Consultation",
    description:
      "Expert guidance on cybersecurity measures for business protection.",
    price: "60 CHF/hour",
    features: [
      "Security audit",
      "Vulnerability assessment",
      "Security best practices",
      "Risk mitigation strategies",
      "Compliance guidance",
    ],
    icon: (
      <svg
        className="lucide lucide-shield"
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
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      </svg>
    ),
  },
  {
    title: "Data Loss Prevention & Backup",
    description:
      "Comprehensive data backup and recovery solutions to protect against data loss.",
    price: "200 CHF (setup) + 50 CHF/month",
    features: [
      "Automated backup system",
      "Secure cloud storage",
      "Data recovery protocols",
      "Regular backup testing",
      "Real-time monitoring",
    ],
    icon: (
      <svg
        className="lucide lucide-hard-drive"
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
        <line x1="22" x2="2" y1="12" y2="12" />
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11" />
        <line x1="6" x2="6.01" y1="16" y2="16" />
        <line x1="10" x2="10.01" y1="16" y2="16" />
      </svg>
    ),
  },
  {
    title: "SEO Optimization",
    description: "Improve website visibility and ranking on search engines.",
    price: "150 CHF (one-time)",
    features: [
      "Keyword research & analysis",
      "On-page SEO optimization",
      "Technical SEO audit",
      "Content recommendations",
      "Performance reporting",
    ],
    icon: (
      <svg
        className="lucide lucide-search"
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
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
  {
    title: "Web Development",
    description: "Comprehensive website creation, design, and hosting support.",
    price: "300 CHF (one-time)",
    features: [
      "Responsive design",
      "Modern user interface",
      "SEO-friendly structure",
      "Fast loading speed",
      "Cross-browser compatibility",
    ],
    icon: (
      <svg
        className="lucide lucide-code"
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
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    title: "Server Setup",
    description: "Server setup and configuration for your web applications.",
    price: "350 CHF (one-time)",
    features: [
      "Server installation",
      "Security configuration",
      "Performance optimization",
      "Monitoring setup",
      "Documentation",
    ],
    icon: (
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
    ),
  },
  {
    title: "Custom Software Development",
    description: "End-to-end software solutions tailored to business needs.",
    price: "500 CHF (project-based)",
    features: [
      "Requirements analysis",
      "Custom solution design",
      "Development & testing",
      "Deployment assistance",
      "Maintenance support",
    ],
    icon: (
      <svg
        className="lucide lucide-settings"
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
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
];

export default function ServicesSection() {
  return (
    <section className="section-padding" id="services">
      <SectionHeading
        subtitle="Comprehensive web development and technical services to help your business thrive online."
        title="Services I Offer"
      />

      <motion.div
        className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
        {...staggerContainer}
      >
        {services.map((service, index) => (
          <motion.div
            className="glass-card flex h-full flex-col rounded-xl p-4 transition-all duration-500 sm:p-6"
            custom={index}
            initial={{ opacity: 0, y: 20 }}
            key={service.title}
            transition={{
              duration: 0.5,
              delay: 0.1 + index * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="mb-4 flex items-center">
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-12 sm:w-12">
                {service.icon}
              </div>
              <h3 className="font-heading font-semibold text-base sm:text-lg">
                {service.title}
              </h3>
            </div>

            <p className="mb-4 flex-grow text-muted-foreground text-sm sm:mb-5 sm:text-base">
              {service.description}
            </p>

            <div className="mb-4 space-y-2 sm:mb-5 sm:space-y-3">
              {service.features.map((feature, idx) => (
                <div className="flex items-start" key={idx}>
                  <Check className="mt-1 mr-2 h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-xs sm:text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto space-y-3 sm:space-y-4">
              <div className="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 font-medium text-primary text-xs sm:text-sm">
                {service.price}
              </div>

              <motion.a
                className="block w-full rounded-lg bg-primary px-4 py-2 text-center font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90 sm:py-2.5"
                href="/contact"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Contact Now
              </motion.a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
