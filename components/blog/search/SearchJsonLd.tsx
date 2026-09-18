type SearchJsonLdProps = {
  query?: string;
};

export default function SearchJsonLd({
  query,
}: SearchJsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const pageUrl = query
    ? `${siteUrl}/blog/search?q=${encodeURIComponent(query)}`
    : `${siteUrl}/blog/search`;

  const jsonLd = {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type": "SearchResultsPage",

        "@id": `${pageUrl}#search`,

        url: pageUrl,

        name: query
          ? `Search results for "${query}"`
          : "Blog Search",

        description: query
          ? `Search results for "${query}" on AcademyFind Blog.`
          : "Search articles, tutorials, guides, and insights on AcademyFind Blog.",

        isPartOf: {
          "@type": "WebSite",
          name: "AcademyFind",
          url: siteUrl,
        },
      },

      {
        "@type": "WebSite",

        "@id": `${siteUrl}#website`,

        url: siteUrl,

        name: "AcademyFind",

        potentialAction: {
          "@type": "SearchAction",

          target: `${siteUrl}/blog/search?q={search_term_string}`,

          "query-input": "required name=search_term_string",
        },
      },

      {
        "@type": "BreadcrumbList",

        itemListElement: [
          {
            "@type": "ListItem",

            position: 1,

            name: "Blog",

            item: `${siteUrl}/blog`,
          },
          {
            "@type": "ListItem",

            position: 2,

            name: "Search",

            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  );
}