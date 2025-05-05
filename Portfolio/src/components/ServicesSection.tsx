import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";
import { staggerContainer, staggerItem, scaleOnHover } from "@/lib/framer-animations";
import { Check } from "lucide-react";

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
      "Technical support"
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wrench">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    )
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
      "Technical guidance"
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-laptop">
        <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>
      </svg>
    )
  },
  {
    title: "Content Management",
    description: "Assistance with content updates and management on your website.",
    price: "40 CHF/hour",
    features: [
      "Regular content updates",
      "CMS maintenance",
      "Image optimization",
      "Layout improvements",
      "SEO-friendly content"
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" x2="8" y1="13" y2="13"/>
        <line x1="16" x2="8" y1="17" y2="17"/>
        <line x1="10" x2="8" y1="9" y2="9"/>
      </svg>
    )
  },
  {
    title: "Security Consultation",
    description: "Expert guidance on cybersecurity measures for business protection.",
    price: "60 CHF/hour",
    features: [
      "Security audit",
      "Vulnerability assessment",
      "Security best practices",
      "Risk mitigation strategies",
      "Compliance guidance"
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
      </svg>
    )
  },
  {
    title: "Data Loss Prevention & Backup",
    description: "Comprehensive data backup and recovery solutions to protect against data loss.",
    price: "200 CHF (setup) + 50 CHF/month",
    features: [
      "Automated backup system",
      "Secure cloud storage",
      "Data recovery protocols",
      "Regular backup testing",
      "Real-time monitoring"
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hard-drive">
        <line x1="22" x2="2" y1="12" y2="12"/>
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11"/>
        <line x1="6" x2="6.01" y1="16" y2="16"/>
        <line x1="10" x2="10.01" y1="16" y2="16"/>
      </svg>
    )
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
      "Performance reporting"
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
      </svg>
    )
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
      "Cross-browser compatibility"
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-code">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    )
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
      "Documentation"
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-server">
        <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
        <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
        <line x1="6" x2="6.01" y1="6" y2="6" />
        <line x1="6" x2="6.01" y1="18" y2="18" />
      </svg>
    )
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
      "Maintenance support"
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    )
  }
];

export default function ServicesSection() {
  return (
    <section id="services" className="section-padding">
      <SectionHeading 
        title="Services I Offer" 
        subtitle="Comprehensive web development and technical services to help your business thrive online."
      />
      
      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        {...staggerContainer}
      >
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            custom={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.5, 
              delay: 0.1 + index * 0.1,
              ease: [0.22, 1, 0.36, 1]
            }}
            whileHover={{ y: -8 }}
            className="glass-card rounded-xl p-4 sm:p-6 h-full flex flex-col transition-all duration-500"
          >
            <div className="flex items-center mb-4">
              <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mr-3">
                {service.icon}
              </div>
              <h3 className="text-base sm:text-lg font-semibold">{service.title}</h3>
            </div>
            
            <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-5 flex-grow">
              {service.description}
            </p>
            
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5">
              {service.features.map((feature, idx) => (
                <div key={idx} className="flex items-start">
                  <Check className="h-4 w-4 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-auto space-y-3 sm:space-y-4">
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium border border-primary/20">
                {service.price}
              </div>
              
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="block w-full text-center py-2 sm:py-2.5 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90"
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
