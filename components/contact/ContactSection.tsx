import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";

export default function ContactSection() {
  return (
    <section className="grid gap-8 lg:grid-cols-[380px_1fr]">
      <ContactInfo />
      <ContactForm />
    </section>
  );
}