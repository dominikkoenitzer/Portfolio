import { motion } from "framer-motion";
import { Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    file: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, file: e.target.files![0] }));
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Formspree integration would go here in a real application
      // For now, we'll simulate a successful form submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        message: "",
        file: null,
      });
      setFileName("");
    } catch (error) {
      toast({
        title: "Error",
        description:
          "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      className="space-y-6"
      initial={{ opacity: 0 }}
      onSubmit={handleSubmit}
      viewport={{ once: true }}
      whileInView={{ opacity: 1 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <Label htmlFor="name">Name</Label>
        <Input
          className="mt-1"
          id="name"
          name="name"
          onChange={handleChange}
          placeholder="Your name"
          required
          value={formData.name}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <Label htmlFor="email">Email</Label>
        <Input
          className="mt-1"
          id="email"
          name="email"
          onChange={handleChange}
          placeholder="Your email address"
          required
          type="email"
          value={formData.email}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <Label htmlFor="message">Message</Label>
        <Textarea
          className="mt-1 min-h-[120px]"
          id="message"
          name="message"
          onChange={handleChange}
          placeholder="Your message"
          required
          value={formData.message}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <Label className="mb-1 block" htmlFor="file">
          Attachment (optional)
        </Label>
        <div className="flex items-center">
          <Label
            className="flex cursor-pointer items-center justify-center rounded-md border border-input bg-background px-4 py-2 font-medium text-sm transition-colors hover:bg-secondary"
            htmlFor="file"
          >
            <Paperclip className="mr-2 h-4 w-4" />
            Choose File
          </Label>
          <Input
            className="hidden"
            id="file"
            name="file"
            onChange={handleFileChange}
            type="file"
          />
          <span className="ml-3 text-muted-foreground text-sm">
            {fileName || "No file chosen"}
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <Button
          className="flex w-full items-center justify-center"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </>
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
}
