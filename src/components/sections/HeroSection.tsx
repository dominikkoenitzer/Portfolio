import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      id="hero"
    >
      <div className="-z-10 absolute inset-0">
        <div className="-left-20 absolute top-20 h-[500px] w-[500px] animate-blob rounded-full bg-primary/5 opacity-70 mix-blend-normal blur-[100px] filter" />
        <div className="-right-20 animation-delay-2000 absolute bottom-20 h-[500px] w-[500px] animate-blob rounded-full bg-primary/10 opacity-70 mix-blend-normal blur-[100px] filter" />
      </div>

      <div className="-z-10 absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col items-center text-center">
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 sm:mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 font-medium text-primary text-xs sm:px-4 sm:text-sm">
              Software Engineer
            </span>
          </motion.div>

          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 px-2 font-bold text-3xl tracking-tight sm:mb-8 sm:text-5xl md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Dominik <span className="text-primary">Könitzer</span>
          </motion.h1>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 max-w-2xl px-4 text-base text-muted-foreground sm:mb-12 sm:text-xl md:text-2xl"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <TypeAnimation
              repeat={Number.POSITIVE_INFINITY}
              sequence={[
                "Building modern web applications",
                2000,
                "Creating responsive interfaces",
                2000,
                "Developing backend solutions",
                2000,
                "Crafting digital experiences",
                2000,
              ]}
              speed={50}
              wrapper="span"
            />
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex w-full flex-col space-y-3 px-4 sm:w-auto sm:flex-row sm:space-x-4 sm:space-y-0 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Button
              asChild
              className="w-full rounded-lg px-6 py-5 text-sm shadow-md transition-all hover:shadow-lg sm:w-auto sm:px-8 sm:py-6 sm:text-base"
              size="lg"
            >
              <a href="/contact">
                Get in Touch
                <svg
                  className="ml-2 h-4 w-4 transition-transform duration-700 ease-in-out group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </a>
            </Button>
            <Button
              asChild
              className="w-full rounded-lg border-2 px-6 py-5 text-sm shadow-sm transition-all hover:shadow-md sm:w-auto sm:px-8 sm:py-6 sm:text-base"
              size="lg"
              variant="outline"
            >
              <a href="/about">Learn More</a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
