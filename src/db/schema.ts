import { defineRelations } from "drizzle-orm";
import {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
  primaryKey,
  unique,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const profiles = mysqlTable(
  "profiles",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    bio: text("bio"),
    avatarUrl: varchar("avatar_url", { length: 500 }),
  },
  (table) => [unique("profile_user_unique").on(table.userId)],
);

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
});

export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  authorId: int("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  categoryId: int("category_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  content: text("content").notNull(),
  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  postId: int("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade", onUpdate: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tags = mysqlTable("tags", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
});

export const postsToTags = mysqlTable(
  "posts_to_tags",
  {
    postId: int("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade", onUpdate: "cascade" }),
    tagId: int("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.postId, table.tagId] })],
);

export const likes = mysqlTable(
  "likes",
  {
    userId: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    postId: int("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade", onUpdate: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.postId] })],
);

export const follows = mysqlTable(
  "follows",
  {
    followerId: int("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    followingId: int("following_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.followerId, table.followingId] })],
);

export const relations = defineRelations(
  {
    users,
    profiles,
    categories,
    posts,
    comments,
    tags,
    postsToTags,
    likes,
    follows,
  },
  (r) => ({
    users: {
      profile: r.one.profiles({
        from: r.users.id,
        to: r.profiles.userId,
      }),
      posts: r.many.posts(),
      comments: r.many.comments(),
      likes: r.many.likes(),
      followers: r.many.follows({
        from: r.users.id,
        to: r.follows.followingId,
      }),
      following: r.many.follows({
        from: r.users.id,
        to: r.follows.followerId,
      }),
    },
    profiles: {
      user: r.one.users({
        from: r.profiles.userId,
        to: r.users.id,
      }),
    },
    categories: {
      posts: r.many.posts(),
    },
    posts: {
      author: r.one.users({
        from: r.posts.authorId,
        to: r.users.id,
      }),
      category: r.one.categories({
        from: r.posts.categoryId,
        to: r.categories.id,
      }),
      comments: r.many.comments(),
      tags: r.many.postsToTags(),
      likes: r.many.likes(),
    },
    comments: {
      user: r.one.users({
        from: r.comments.userId,
        to: r.users.id,
      }),
      post: r.one.posts({
        from: r.comments.postId,
        to: r.posts.id,
      }),
    },
    tags: {
      posts: r.many.postsToTags(),
    },
    postsToTags: {
      post: r.one.posts({
        from: r.postsToTags.postId,
        to: r.posts.id,
      }),
      tag: r.one.tags({
        from: r.postsToTags.tagId,
        to: r.tags.id,
      }),
    },
    likes: {
      user: r.one.users({
        from: r.likes.userId,
        to: r.users.id,
      }),
      post: r.one.posts({
        from: r.likes.postId,
        to: r.posts.id,
      }),
    },
    follows: {
      follower: r.one.users({
        from: r.follows.followerId,
        to: r.users.id,
      }),
      following: r.one.users({
        from: r.follows.followingId,
        to: r.users.id,
      }),
    },
  }),
);
