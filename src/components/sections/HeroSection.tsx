import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TypeAnimation } from 'react-type-animation';

export default function HeroSection() {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 sm:pt-0">
      
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-primary/5 rounded-full mix-blend-normal filter blur-[100px] opacity-70 animate-blob"></div>
        <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-primary/10 rounded-full mix-blend-normal filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>
      </div>
      
      
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] -z-10"></div>
      
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4 sm:mb-6"
          >
            <span className="inline-block py-1.5 px-3 sm:px-4 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium border border-primary/20">
              Software Engineer
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 tracking-tight px-2"
          >
            Dominik <span className="text-primary">Könitzer</span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mb-8 sm:mb-12 px-4"
          >
            <TypeAnimation
              sequence={[
                'Building modern web applications',
                2000,
                'Creating responsive interfaces',
                2000,
                'Developing backend solutions',
                2000,
                'Crafting digital experiences',
                2000
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 w-full sm:w-auto px-4 sm:px-0"
          >
            <Button size="lg" className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-lg shadow-md hover:shadow-lg transition-all" asChild>
              <a href="/contact">
                Get in Touch
                <svg
                  className="w-4 h-4 ml-2 transition-transform duration-700 ease-in-out group-hover:translate-x-1"
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
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-lg border-2 shadow-sm hover:shadow-md transition-all" asChild>
              <a href="/about">
                Learn More
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
