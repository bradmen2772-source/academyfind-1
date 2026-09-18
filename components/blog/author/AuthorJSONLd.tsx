type AuthorJsonLdProps = {
  author: {
    displayName: string;
    username: string;
    bio: string | null;
    avatarUrl: string | null;

    websiteUrl: string | null;
    twitterUrl: string | null;
    linkedinUrl: string | null;

    designation: string | null;
    specialization: string | null;

    totalPosts: number;
    totalViews: number;

    createdAt: Date;
  };
};

export default function AuthorJsonLd({
  author,
}: AuthorJsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL!;

  const pageUrl = `${siteUrl}/blog/author/${author.username}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",

        "@id": `${pageUrl}#author`,

        name: author.displayName,

        alternateName: author.username,

        description: author.bio,

        image: author.avatarUrl,

        url: pageUrl,

        jobTitle: author.designation,

        knowsAbout: author.specialization
          ? [author.specialization]
          : undefined,

        sameAs: [
          author.websiteUrl,
          author.twitterUrl,
          author.linkedinUrl,
        ].filter(Boolean),

        interactionStatistic: [
          {
            "@type": "InteractionCounter",
            interactionType: {
              "@type": "ViewAction",
            },
            userInteractionCount: author.totalViews,
          },
        ],
      },

      {
        "@type": "CollectionPage",

        "@id": `${pageUrl}#collection`,

        url: pageUrl,

        name: `${author.displayName} Articles`,

        description:
          author.bio ??
          `Articles written by ${author.displayName}`,

        about: {
          "@id": `${pageUrl}#author`,
        },

        inLanguage: "en-IN",

        isPartOf: {
          "@type": "WebSite",
          name: "AcademyFind",
          url: siteUrl,
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

            name: "Authors",

            item: `${siteUrl}/blog/authors`,
          },
          {
            "@type": "ListItem",

            position: 3,

            name: author.displayName,

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