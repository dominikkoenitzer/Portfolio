import { motion } from "framer-motion";
import { SectionHeading } from "../layout/SectionHeading";
import { fadeInUp, fadeInLeft, fadeInRight } from "@/lib/framer-animations";
import { Calendar, Award, GraduationCap } from "lucide-react";
import { Button } from "../ui/button";

export default function AboutSection() {
  return (
    <section id="about" className="section-padding">
      <SectionHeading 
        title="About Me" 
        subtitle="Get to know me better and what drives my passion for web development."
      />
      
      <div className="grid md:grid-cols-12 gap-8 md:gap-10 items-center">
        <motion.div 
          className="md:col-span-5 lg:col-span-5"
          {...fadeInLeft}
        >
          <div className="relative mx-auto max-w-xs md:max-w-none">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-lg bg-background/80">
              <div className="w-full h-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent flex items-center justify-center">
                <motion.img 
                  src="/Favicon.png"
                  alt="Dominik Könitzer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="w-3/4 h-3/4 object-contain"
                />
              </div>
            </div>
            <motion.div 
              className="absolute -bottom-4 -right-4 h-24 w-24 rounded-xl bg-primary/5 backdrop-blur-sm -z-10 border border-primary/10"
              initial={{ opacity: 0, x: 20, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <motion.div 
              className="absolute -top-4 -left-4 h-24 w-24 rounded-xl border border-primary/10 -z-10"
              initial={{ opacity: 0, x: -20, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>

          <div className="mt-8 md:mt-10 space-y-4 md:space-y-6">
            <InfoCard 
              icon={<GraduationCap className="h-5 w-5" />}
              title="Education"
              subtitle="4-year program at WISS"
              delay={0.1}
            />
            
            <InfoCard 
              icon={<Award className="h-5 w-5" />}
              title="Specialized In"
              subtitle="Modern Web Development"
              delay={0.2}
            />
          </div>
        </motion.div>
        
        <motion.div 
          className="md:col-span-7 lg:col-span-7"
          {...fadeInRight}
        >
          <motion.div 
            className="glass-card rounded-2xl p-6 sm:p-8 border border-border/20 shadow-sm backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.h3 
              className="text-xl sm:text-2xl font-semibold tracking-tight mb-4 sm:mb-6 font-heading"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Passionate <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Software Engineer</span>
            </motion.h3>
            
            <div className="space-y-4 sm:space-y-5">
              <motion.p 
                className="text-sm sm:text-base text-muted-foreground leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                viewport={{ once: true }}
              >
                I'm Dominik Könitzer, a 17-year-old software engineer at WISS Schulen für Wirtschaft Informatik Immobilien, currently in my <span className="font-medium text-foreground">fifth</span> semester of a 4-year software engineering program.
              </motion.p>
              
              <motion.p 
                className="text-sm sm:text-base text-muted-foreground leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                viewport={{ once: true }}
              >
                The first two years of my program focus on coursework, followed by two years of practical internship with ongoing studies. Throughout this journey, I'm developing a strong foundation in both theoretical knowledge and hands-on experience.
              </motion.p>
              
              <motion.p 
                className="text-sm sm:text-base text-muted-foreground leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                viewport={{ once: true }}
              >
                I enjoy creating <span className="font-medium text-foreground">clean</span>, <span className="font-medium text-foreground">functional</span>, and <span className="font-medium text-foreground">visually appealing</span> websites and applications that provide real value to users. Beyond technical skills, I value continuous learning, problem-solving, and effective communication.
              </motion.p>
            </div>
            
            <motion.div 
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Button 
                variant="default" 
                className="group"
                asChild
              >
                <a href="/skills">
                  Explore my skills
                  <svg
                    className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </Button>
              <Button 
                variant="outline" 
                className="group"
                asChild
              >
                <a 
                  href="https://senbon.ch/journal" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Read my journal
                  <svg
                    className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Info Card Component for better organization
interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  delay: number;
}

function InfoCard({ icon, title, subtitle, delay }: InfoCardProps) {
  return (
    <motion.div 
      className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border border-border/30 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 hover:border-primary/20 hover:shadow-sm shadow-primary/5 transform hover:-translate-y-1"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="h-9 sm:h-10 w-9 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-sm sm:text-base">{title}</h4>
        <p className="text-xs sm:text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </motion.div>
  );
}
