import { getCachedSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function getWriteBlogData() {
  const session = await getCachedSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  let author = await prisma.blogAuthorProfile.findUnique({
    where: {
      userId: session.user.id,
    },
    include: {
      user: true,
    },
  });

  if (!author) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (user) {
      const emailPrefix = user.email ? user.email.split("@")[0] : "author";
      const baseUsername = emailPrefix.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      let username = baseUsername || "author";
      let isUnique = false;
      let counter = 0;

      while (!isUnique) {
        const potentialUsername = counter === 0 ? username : `${username}${counter}`;
        const check = await prisma.blogAuthorProfile.findUnique({
          where: { username: potentialUsername },
        });
        if (!check) {
          isUnique = true;
          username = potentialUsername;
        } else {
          counter++;
        }
      }

      author = await prisma.blogAuthorProfile.create({
        data: {
          userId: user.id,
          displayName: user.name || "Anonymous Author",
          username,
          avatarUrl: user.image || null,
        },
        include: {
          user: true,
        },
      });
    } else {
      redirect("/login");
    }
  } else {
    // If the profile already exists, update display name or avatarUrl if they are missing
    const user = author.user;
    let needsUpdate = false;
    const updateData: any = {};

    if (!author.displayName && user?.name) {
      updateData.displayName = user.name;
      needsUpdate = true;
    }
    if (!author.avatarUrl && user?.image) {
      updateData.avatarUrl = user.image;
      needsUpdate = true;
    }

    if (needsUpdate) {
      author = await prisma.blogAuthorProfile.update({
        where: { id: author.id },
        data: updateData,
        include: {
          user: true,
        },
      });
    }
  }

  const [categories, tags, brands] = await Promise.all([
    prisma.blogCategory.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
      },
    }),

    prisma.blogTag.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),

    prisma.blogBrand.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        avatarUrl: true,
      },
    }),
  ]);

  return {
    author,
    categories,
    tags,
    brands,
  };
}