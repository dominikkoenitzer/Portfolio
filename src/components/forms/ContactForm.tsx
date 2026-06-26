import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/language-provider";
import { translations } from "@/lib/translations";

const CONTACT_EMAIL = "dominik.koenitzer@gmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EASE = [0.22, 1, 0.36, 1] as const;

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
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  required?: boolean;
  multiline?: boolean;
  delay?: number;
  autoComplete?: string;
  inputMode?: "text" | "email";
  error?: string;
}

function Field({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  multiline,
  delay = 0,
  autoComplete,
  inputMode,
  error,
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  const errorId = `${id}-error`;
  const base =
    "w-full bg-transparent pt-1 pb-3 text-base placeholder:text-muted-foreground/55 text-foreground focus:outline-none transition-colors duration-200 resize-none";

  const shared = {
    "aria-describedby": error ? errorId : undefined,
    "aria-invalid": error ? true : undefined,
    "aria-required": required || undefined,
    autoComplete,
    id,
    name: id,
    onBlur: () => setFocused(false),
    onChange,
    onFocus: () => setFocused(true),
    placeholder,
    required,
    value,
  } as const;

  return (
    <motion.div
      className="group min-w-0"
      initial={{ opacity: 0, y: 14 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
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
        <textarea className={`${base} min-h-[140px]`} {...shared} />
      ) : (
        <input className={base} inputMode={inputMode} type={type} {...shared} />
      )}

      {/* Animated bottom border — turns destructive when the field is invalid. */}
      <div className="relative h-px">
        <div
          className={`absolute inset-0 ${error ? "bg-destructive/50" : "bg-border/25"}`}
        />
        <motion.div
          animate={{ scaleX: focused ? 1 : 0 }}
          className="absolute inset-0 origin-left bg-primary"
          initial={{ scaleX: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        />
      </div>

      {error ? (
        <p className="mt-2 text-destructive text-xs" id={errorId}>
          {error}
        </p>
      ) : null}
    </motion.div>
  );
}

export function ContactForm() {
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
  // Honeypot: bots fill this hidden field, humans never see it.
  const [company, setCompany] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sendError, setSendError] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the confirmation when the form is replaced by the success view.
  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!formData.name.trim()) next.name = t.nameRequired;
    if (!EMAIL_RE.test(formData.email.trim())) next.email = t.emailInvalid;
    if (!formData.message.trim()) next.message = t.messageRequired;
    return next;
  };

  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    formData.subject || "Portfolio inquiry",
  )}&body=${encodeURIComponent(
    `${formData.message}\n\n— ${formData.name} (${formData.email})`,
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = next.name ? "name" : next.email ? "email" : "message";
      formRef.current?.querySelector<HTMLElement>(`#${first}`)?.focus();
      return;
    }

    setIsSubmitting(true);
    setSendError(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, company }),
      });
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }
      setSubmitted(true);
    } catch {
      setSendError(true);
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
          aria-live="polite"
          className="flex h-full flex-col items-start justify-center py-12"
          exit={{ opacity: 0, y: -10 }}
          initial={{ opacity: 0, y: 20 }}
          key="success"
          role="status"
          transition={{ duration: 0.5, ease: EASE }}
        >
          <CheckCircle2
            className="mb-6 h-10 w-10 text-primary"
            strokeWidth={1.5}
          />
          <h3
            className="mb-3 font-semibold text-2xl focus:outline-none"
            ref={successRef}
            tabIndex={-1}
          >
            {t.successTitle}
          </h3>
          <p className="max-w-sm text-muted-foreground text-sm leading-relaxed">
            {t.successBody}
          </p>
          <button
            className="mt-8 font-medium font-mono text-[11px] text-muted-foreground uppercase tracking-[0.2em] transition-colors duration-200 hover:text-foreground"
            onClick={() => {
              setSubmitted(false);
              setSendError(false);
              setErrors({});
              setFormData({ name: "", email: "", subject: "", message: "" });
            }}
            type="button"
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
          noValidate
          onSubmit={handleSubmit}
          ref={formRef}
          transition={{ duration: 0.3 }}
        >
          {/* Honeypot — visually hidden, off-screen, skipped by AT and tab order */}
          <input
            aria-hidden="true"
            autoComplete="off"
            className="absolute left-[-9999px] h-0 w-0 overflow-hidden opacity-0"
            name="company"
            onChange={(e) => setCompany(e.target.value)}
            tabIndex={-1}
            value={company}
          />

          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
            <Field
              autoComplete="name"
              delay={0.1}
              error={errors.name}
              id="name"
              label={t.nameLabel}
              onChange={handleChange}
              placeholder={t.namePlaceholder}
              required
              value={formData.name}
            />
            <Field
              autoComplete="email"
              delay={0.15}
              error={errors.email}
              id="email"
              inputMode="email"
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
            error={errors.message}
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
            transition={{ duration: 0.5, delay: 0.28, ease: EASE }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Button
              aria-busy={isSubmitting}
              className="group w-full gap-3 rounded-lg px-6 py-3.5"
              disabled={isSubmitting}
              type="submit"
              variant="cta"
            >
              <span className="truncate">
                {isSubmitting ? t.sending : t.send}
              </span>
              {isSubmitting ? (
                <div
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white"
                />
              ) : (
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
              )}
            </Button>

            {sendError ? (
              <p
                className="mt-4 text-muted-foreground text-sm"
                role="alert"
              >
                {t.errorBody}{" "}
                <a
                  className="text-primary underline underline-offset-4 hover:text-primary/80"
                  href={mailtoHref}
                >
                  {t.emailDirectly}
                </a>
                .
              </p>
            ) : null}
          </motion.div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
