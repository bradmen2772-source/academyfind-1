type TagJsonLdProps = {
  tag: {
    name: string;
    slug: string;
    postCount: number;
    totalViews: number;
  };
};

export default function TagJsonLd({
  tag,
}: TagJsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const pageUrl = `${siteUrl}/blog/tag/${tag.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type": "CollectionPage",

        "@id": `${pageUrl}#collection`,

        url: pageUrl,

        name: `${tag.name} Articles`,

        description: `Browse all articles tagged with ${tag.name} on AcademyFind.`,

        isPartOf: {
          "@type": "WebSite",
          name: "AcademyFind",
          url: siteUrl,
        },

        about: {
          "@id": `${pageUrl}#tag`,
        },
      },

      {
        "@type": "DefinedTerm",

        "@id": `${pageUrl}#tag`,

        name: tag.name,

        url: pageUrl,

        inDefinedTermSet: `${siteUrl}/blog`,
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
            name: tag.name,
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