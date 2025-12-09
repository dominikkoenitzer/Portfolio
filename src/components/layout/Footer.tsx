import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border/30 border-t bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 md:px-12 lg:px-16">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <motion.div
            className="mb-6 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Link className="font-bold text-xl tracking-tight" to="/">
              Dominik Könitzer
            </Link>
            <p className="mt-1 text-muted-foreground text-sm">
              Creative Web Developer
            </p>
          </motion.div>

          <motion.div
            className="mb-6 flex space-x-6 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <a
              aria-label="GitHub"
              className="text-muted-foreground transition-colors hover:text-primary"
              href="https://github.com/dominikkoenitzer"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                className="lucide lucide-github"
                fill="none"
                height="20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a
              aria-label="Journal"
              className="text-muted-foreground transition-colors hover:text-primary"
              href="https://senbon.ch/"
              rel="noopener noreferrer"
              target="_blank"
              title="My Journal - A zen garden for thoughts and notes"
            >
              <svg
                className="lucide lucide-book-open"
                fill="none"
                height="20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </a>
          </motion.div>
        </div>

        <motion.div
          className="mt-8 flex flex-col items-center justify-between border-border/40 border-t pt-8 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <p className="mb-4 text-muted-foreground text-sm sm:mb-0">
            © {currentYear} Dominik Könitzer. All rights reserved.
          </p>

          <div className="flex space-x-6">
            <Link
              className="text-muted-foreground text-sm transition-colors hover:text-primary"
              to="/privacy"
            >
              Privacy Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
