import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";
import ContactForm from "./ContactForm";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent -z-10"></div>
      
      <SectionHeading 
        title="Get In Touch" 
        subtitle="Feel free to reach out with any questions or project inquiries."
      />
      
      <div className="grid md:grid-cols-12 gap-8 md:gap-12">
        <motion.div 
          className="md:col-span-5"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
          <div className="glass-card rounded-xl p-8 h-full">
            <h3 className="text-2xl font-semibold mb-8">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mr-4">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-lg">Email</p>
                  <a 
                    href="mailto:dominik.koenitzer@wiss-edu.ch" 
                    className="text-muted-foreground hover:text-primary transition-colors link-hover inline-block"
                  >
                    dominik.koenitzer@wiss-edu.ch
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mr-4">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-lg">Location</p>
                  <p className="text-muted-foreground">
                    Zurich, Switzerland
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <h4 className="font-medium mb-4 text-lg">Follow Me</h4>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/dominikkoenitzer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 w-12 rounded-full bg-background/50 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300 group"
                  aria-label="GitHub"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github group-hover:scale-110 transition-transform duration-300">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="md:col-span-7"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
          <div className="glass-card rounded-xl p-8">
            <h3 className="text-2xl font-semibold mb-8">Send Me a Message</h3>
            <ContactForm />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
