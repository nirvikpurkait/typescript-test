import "dotenv/config";
import * as schema from "./schema";
import { db } from "./index";

(async () => {
  try {
    console.log("🌱 Seeding database...");

    await db.delete(schema.follows);
    await db.delete(schema.likes);
    await db.delete(schema.postsToTags);
    await db.delete(schema.comments);
    await db.delete(schema.posts);
    await db.delete(schema.profiles);
    await db.delete(schema.tags);
    await db.delete(schema.categories);
    await db.delete(schema.users);

    const users = await db
      .insert(schema.users)
      .values([
        { name: "Alice", email: "alice@example.com" },
        { name: "Bob", email: "bob@example.com" },
        { name: "Charlie", email: "charlie@example.com" },
        { name: "David", email: "david@example.com" },
        { name: "Emma", email: "emma@example.com" },
      ])
      .$returningId();

    const [alice, bob, charlie, david, emma] = users;

    await db.insert(schema.profiles).values([
      {
        userId: alice.id,
        bio: "Full-stack developer",
        avatarUrl: "https://example.com/alice.jpg",
      },
      {
        userId: bob.id,
        bio: "Backend engineer",
        avatarUrl: "https://example.com/bob.jpg",
      },
      {
        userId: charlie.id,
        bio: "Database enthusiast",
        avatarUrl: "https://example.com/charlie.jpg",
      },
      {
        userId: david.id,
        bio: "TypeScript developer",
        avatarUrl: "https://example.com/david.jpg",
      },
      {
        userId: emma.id,
        bio: "Frontend engineer",
        avatarUrl: "https://example.com/emma.jpg",
      },
    ]);

    const categories = await db
      .insert(schema.categories)
      .values([
        { name: "Technology" },
        { name: "Programming" },
        { name: "Database" },
      ])
      .$returningId();

    const [technology, programming, database] = categories;

    const posts = await db
      .insert(schema.posts)
      .values([
        {
          title: "Getting Started with TypeScript",
          content: "Learn the fundamentals of TypeScript.",
          authorId: alice.id,
          categoryId: programming.id,
        },
        {
          title: "Building APIs with Drizzle",
          content: "Learn how to use Drizzle ORM with MySQL.",
          authorId: bob.id,
          categoryId: technology.id,
        },
        {
          title: "Understanding MySQL Indexes",
          content: "A practical guide to MySQL indexes.",
          authorId: charlie.id,
          categoryId: database.id,
        },
        {
          title: "Node.js Backend Architecture",
          content: "How to structure a Node.js backend.",
          authorId: david.id,
          categoryId: technology.id,
        },
        {
          title: "TypeScript Advanced Types",
          content: "Explore advanced TypeScript types.",
          authorId: emma.id,
          categoryId: programming.id,
        },
      ])
      .$returningId();

    const [post1, post2, post3, post4, post5] = posts;

    const tags = await db
      .insert(schema.tags)
      .values([
        { name: "TypeScript" },
        { name: "Drizzle" },
        { name: "MySQL" },
        { name: "Backend" },
        { name: "JavaScript" },
      ])
      .$returningId();

    const [typescript, drizzle, mysqlTag, backend, javascript] = tags;

    await db.insert(schema.postsToTags).values([
      { postId: post1.id, tagId: typescript.id },
      { postId: post1.id, tagId: javascript.id },
      { postId: post2.id, tagId: drizzle.id },
      { postId: post2.id, tagId: mysqlTag.id },
      { postId: post2.id, tagId: backend.id },
      { postId: post3.id, tagId: mysqlTag.id },
      { postId: post4.id, tagId: backend.id },
      { postId: post4.id, tagId: javascript.id },
      { postId: post5.id, tagId: typescript.id },
    ]);

    await db.insert(schema.comments).values([
      {
        content: "Great introduction!",
        userId: bob.id,
        postId: post1.id,
      },
      {
        content: "This was very helpful.",
        userId: charlie.id,
        postId: post1.id,
      },
      {
        content: "I use Drizzle in my projects too.",
        userId: alice.id,
        postId: post2.id,
      },
      {
        content: "Indexes are really important.",
        userId: david.id,
        postId: post3.id,
      },
      {
        content: "Nice explanation!",
        userId: emma.id,
        postId: post4.id,
      },
      {
        content: "TypeScript is amazing.",
        userId: alice.id,
        postId: post5.id,
      },
    ]);

    await db.insert(schema.likes).values([
      { userId: alice.id, postId: post2.id },
      { userId: bob.id, postId: post1.id },
      { userId: bob.id, postId: post3.id },
      { userId: charlie.id, postId: post1.id },
      { userId: charlie.id, postId: post4.id },
      { userId: david.id, postId: post1.id },
      { userId: david.id, postId: post2.id },
      { userId: emma.id, postId: post3.id },
      { userId: emma.id, postId: post5.id },
    ]);

    await db.insert(schema.follows).values([
      { followerId: alice.id, followingId: bob.id },
      { followerId: alice.id, followingId: charlie.id },
      { followerId: bob.id, followingId: alice.id },
      { followerId: bob.id, followingId: david.id },
      { followerId: charlie.id, followingId: alice.id },
      { followerId: david.id, followingId: alice.id },
      { followerId: david.id, followingId: emma.id },
      { followerId: emma.id, followingId: alice.id },
    ]);

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exitCode = 1;
  }

  process.exit();
})();
