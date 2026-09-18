const faqs = [
  "What are the fees?",
  "Is hostel available?",
  "Are scholarships offered?",
  "What is batch size?",
];

export default function FAQsSection() {
  return (
    <section>
      <h2 className="mb-8 text-3xl font-bold">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq}
            className="rounded-2xl border bg-white p-5"
          >
            <p className="font-medium">{faq}</p>
          </div>
        ))}
      </div>
    </section>
  );
}