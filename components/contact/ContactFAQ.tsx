const faqs = [
  {
    q: "How can institutes claim their profile?",
    a: "Institutes can contact us directly to verify and manage their listings.",
  },
  {
    q: "Can I request corrections to institute information?",
    a: "Yes. Send us details and we will review them.",
  },
  {
    q: "How are institute rankings determined?",
    a: "Rankings are based on multiple factors including reviews, reputation and available information.",
  },
];

export default function ContactFAQ() {
  return (
    <section>
      <div className="text-center">
        <h2 className="text-4xl font-bold">
          Frequently Asked Questions
        </h2>

        <p className="mt-3 text-muted-foreground">
          Common questions from students and institutes.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-4xl space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.q}
            className="
              rounded-2xl
              border
              border-amber-100
              bg-white
              p-6
            "
          >
            <h3 className="font-semibold">
              {faq.q}
            </h3>

            <p className="mt-3 text-muted-foreground">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}