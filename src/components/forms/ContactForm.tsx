import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";

interface InquiryState {
  subject?: string;
  message?: string;
}

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  multiline?: boolean;
  delay?: number;
}

function Field({ id, label, type = "text", placeholder, value, onChange, required, multiline, delay = 0 }: FieldProps) {
  const [focused, setFocused] = useState(false);
  const base =
    "w-full bg-transparent pt-1 pb-3 text-base placeholder:text-muted-foreground/55 text-foreground focus:outline-none transition-colors duration-200 resize-none";

  return (
    <motion.div
      className="group min-w-0"
      initial={{ opacity: 0, y: 14 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <label
        className="mb-2 block font-mono font-medium text-[11px] text-muted-foreground uppercase tracking-[0.2em]"
        htmlFor={id}
      >
        {label}
      </label>

      {multiline ? (
        <textarea
          className={`${base} min-h-[140px]`}
          id={id}
          name={id}
          onBlur={() => setFocused(false)}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          required={required}
          value={value}
        />
      ) : (
        <input
          className={base}
          id={id}
          name={id}
          onBlur={() => setFocused(false)}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          required={required}
          type={type}
          value={value}
        />
      )}

      {/* Animated bottom border */}
      <div className="relative h-px">
        <div className="absolute inset-0 bg-border/25" />
        <motion.div
          animate={{ scaleX: focused ? 1 : 0 }}
          className="absolute inset-0 origin-left bg-primary"
          initial={{ scaleX: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  );
}

export default function ContactForm() {
  const { language } = useLanguage();
  const t = translations[language].contact.form;
  const location = useLocation();
  const inquiry = (location.state ?? null) as InquiryState | null;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: inquiry?.subject ?? "",
    message: inquiry?.message ?? "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch {
      toast({
        title: t.errorTitle,
        description: t.errorBody,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex h-full flex-col items-start justify-center py-12"
          exit={{ opacity: 0, y: -10 }}
          initial={{ opacity: 0, y: 20 }}
          key="success"
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <CheckCircle2 className="mb-6 h-10 w-10 text-primary" strokeWidth={1.5} />
          <h3 className="mb-3 font-semibold text-2xl tracking-tight">{t.successTitle}</h3>
          <p className="max-w-sm text-muted-foreground text-sm leading-relaxed">
            {t.successBody}
          </p>
          <button
            className="mt-8 font-medium font-mono text-[11px] text-muted-foreground uppercase tracking-[0.2em] transition-colors duration-200 hover:text-foreground"
            onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", subject: "", message: "" }); }}
          >
            {t.sendAnother}
          </button>
        </motion.div>
      ) : (
        <motion.form
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          key="form"
          className="min-w-0 space-y-8"
          onSubmit={handleSubmit}
          transition={{ duration: 0.3 }}
        >
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
            <Field
              delay={0.1}
              id="name"
              label={t.nameLabel}
              onChange={handleChange}
              placeholder={t.namePlaceholder}
              required
              value={formData.name}
            />
            <Field
              delay={0.15}
              id="email"
              label={t.emailLabel}
              onChange={handleChange}
              placeholder={t.emailPlaceholder}
              required
              type="email"
              value={formData.email}
            />
          </div>

          <Field
            delay={0.2}
            id="subject"
            label={t.subjectLabel}
            onChange={handleChange}
            placeholder={t.subjectPlaceholder}
            value={formData.subject}
          />

          <Field
            delay={0.25}
            id="message"
            label={t.messageLabel}
            multiline
            onChange={handleChange}
            placeholder={t.messagePlaceholder}
            required
            value={formData.message}
          />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <button
              className="group flex w-full items-center justify-center gap-3 rounded-lg bg-primary px-6 py-3.5 font-medium text-primary-foreground text-sm shadow-[0_2px_16px_hsl(var(--primary)/0.25)] transition-shadow duration-200 hover:shadow-[0_4px_28px_hsl(var(--primary)/0.38)] disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              <span className="truncate">{isSubmitting ? t.sending : t.send}</span>
              {isSubmitting ? (
                <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
              )}
            </button>
          </motion.div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
