export default function AboutHero() {
  return (
    <section
      className="
        relative
        overflow-hidden
        border-b
        border-amber-100
        bg-gradient-to-b
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
          About AcademyFind
        </div>

        <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
          Helping Students Find The
          <span className="text-amber-500"> Right Institute</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          AcademyFind is a discovery platform designed to help students, parents, and lifelong learners find the right coaching institutes, tuition centers, skill-development programs, and extracurricular classes.
        </p>
      </div>
    </section>
  );
}