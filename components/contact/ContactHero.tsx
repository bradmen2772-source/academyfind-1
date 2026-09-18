export default function ContactHero() {
  return (
    <section
      className="
        relative
        overflow-hidden
        border-b
        border-amber-100
        bg-linear-to-b
        from-amber-50
        via-background
        to-background
      "
    >
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />

      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-orange-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 py-24 text-center">
        <div
          className="
            inline-flex
            rounded-full
            border
            border-amber-200
            bg-white
            px-4
            py-2
            text-sm
            font-medium
            text-amber-700
            shadow-sm
          "
        >
          Contact AcademyFind
        </div>

        <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
          We'd Love To Hear
          <span className="text-amber-500"> From You</span>
        </h1>

        <p className="mx-auto mt-6 text-lg text-muted-foreground">
          Questions, feedback, partnerships or support. Reach out and we'll get back to you.
      </p>
      </div>
    </section>
  );
}