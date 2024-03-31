import {
  mysqlTable,
  serial,
  timestamp,
  varchar,
  binary,
  json,
  mysqlEnum,
  float,
  primaryKey,
  boolean,
  int,
  text,
  mediumint,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import 'dotenv';
import { integer } from 'drizzle-orm/pg-core';

export const roles = mysqlEnum('roles', ['ADMIN', 'CLIENT']);
export const languages = mysqlEnum('languages', ['ENGLISH', 'SPANISH']);

export const users = mysqlTable('users', {
  id: varchar('id', { length: 256 }).unique().primaryKey().notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).unique().notNull(),
  password: varchar('password', { length: 256 }).notNull(),
  role: roles.notNull(),
  createdAt: timestamp('createdAt', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).onUpdateNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  library: many(library),
  likedVideos: many(likedVideos),
  reviews: many(review),
}));

export const books = mysqlTable('books', {
  id: varchar('id', { length: 256 }).unique().primaryKey().notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  author: varchar('author', { length: 256 }).notNull(),
  summary: text('summary').notNull().default(''),
  thumbnailSquare: varchar('thumbnailSquare', { length: 256 }).notNull(),
  thumbnailLong: varchar('thumbnailLong', { length: 256 }).notNull(),
  bookDurationInSeconds: float('bookDurationInSeconds').notNull(),
  price: float('price').notNull(),
  numberOfChapters: int('numberOfChapters').notNull(),
  rating: float('rating').notNull().default(5),
  createdAt: timestamp('createdAt', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).onUpdateNow(),
  favourite: boolean('favourite').notNull().default(false)
});

export const review = mysqlTable('review', {
  id: varchar('id', { length: 256 }).unique().primaryKey().notNull(),
  bookId: varchar('bookId', { length: 256 }).notNull(),
  userId: varchar('userId', { length: 256 }).notNull(),
  title: varchar('title', { length: 256 }).notNull(),
  text: text('author').notNull(),
  rating: int('rating'),
  createdAt: timestamp('createdAt', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).onUpdateNow(),
});

export const reviewRelations = relations(review, ({ one }) => ({
  user: one(users, {
    fields: [review.userId],
    references: [users.id],
  }),

  book: one(books, {
    fields: [review.bookId],
    references: [books.id],
  }),
}));

export const chapters = mysqlTable('chapters', {
  id: varchar('id', { length: 256 }).unique().primaryKey().notNull(),
  bookId: varchar('bookId', { length: 256 }).notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  number: int('number').notNull(),
  createdAt: timestamp('createdAt', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).onUpdateNow(),
});

export const booksRelations = relations(books, ({ many }) => ({
  library: many(library),
  generesBooks: many(generesBooks),
  chapters: many(chapters),
  reviews: many(review),
}));

export const chapterRelations = relations(chapters, ({ many, one }) => ({
  audiobooks: many(audiobooks),
  book: one(books, {
    fields: [chapters.bookId],
    references: [books.id],
  }),
  chapterProgressList: many(chapterProgress),
}));

export const library = mysqlTable('library', {
  id: varchar('id', { length: 256 }).notNull().unique().primaryKey(),
  bookId: varchar('bookId', { length: 256 }).notNull(),
  userId: varchar('userId', { length: 256 }).notNull(),
  favourite: boolean('favourite').notNull().default(false),
  lastChapterProgessId: varchar('lastChapterProgessId', { length: 256 }),
  rating: float('rating'),
  ratingTitle: text('ratingTitle'),
  ratingDescription: text('ratingDescription'),
  createdAt: timestamp('createdAt', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).onUpdateNow(),
});

export const chapterProgress = mysqlTable('chapterProgress', {
  id: varchar('id', { length: 256 }).notNull().unique().primaryKey(),
  librayId: varchar('librayId', { length: 256 }).notNull(),
  chapterId: varchar('chapterId', { length: 256 }).notNull(),
  lastSecondListend: mediumint('lastSecondListend').notNull().default(0),
  subsId: varchar('subsId', { length: 256 }),
  audiobookId: varchar('audiobookId', { length: 256 }), 
  createdAt: timestamp('createdAt', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).onUpdateNow(),
});

export const chapterProgressRelation = relations(
  chapterProgress,
  ({ one }) => ({
    library: one(library, {
      fields: [chapterProgress.librayId],
      references: [library.id],
    }),
    chapter: one(chapters, {
      fields: [chapterProgress.chapterId],
      references: [chapters.id],
    }),
  }),
);

export const generes = mysqlTable('generes', {
  id: varchar('id', { length: 256 }).unique().notNull().primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
});

export const generesBooks = mysqlTable('generesBooks', {
  id: varchar('id', { length: 256 }).unique().notNull().primaryKey(),
  bookId: varchar('bookId', { length: 256 }).notNull(),
  genereId: varchar('genereId', { length: 256 }).notNull(), 
  createdAt: timestamp('createdAt', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).onUpdateNow(),
});

export const genereBooksRelations = relations(generesBooks, ({ one }) => ({
  book: one(books, {
    fields: [generesBooks.bookId],
    references: [books.id],
  }),
  genre: one(generes, {
    fields: [generesBooks.genereId],
    references: [generes.id],
  }),
}));

export const libraryRelations = relations(library, ({ one, many }) => ({
  books: one(books, {
    fields: [library.bookId],
    references: [books.id],
  }),

  users: one(users, {
    fields: [library.userId],
    references: [users.id],
  }),
  chapterProgressList: many(chapterProgress),
}));

export const audiobooks = mysqlTable('audiobooks', {
  id: varchar('id', { length: 256 }).unique().primaryKey().notNull(),
  author: varchar('author', { length: 256 }).notNull(),
  chapterId: varchar('chapterId', { length: 256 }).notNull(),
  language: languages.notNull(),
  createdAt: timestamp('createdAt', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).onUpdateNow(),
});

export const audiobookSubs = mysqlTable('audiobookSubs', {
  id: varchar('id', { length: 256 }).unique().primaryKey().notNull(),
  audiobookId: varchar('audiobookId', { length: 256 }).notNull(),
  language: languages.notNull(),
  createdAt: timestamp('createdAt', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).onUpdateNow(),
});

export const audiobooksRelations = relations(audiobooks, ({ one, many }) => ({
  chapter: one(chapters, {
    fields: [audiobooks.chapterId],
    references: [chapters.id],
  }),

  audiobookSubs: many(audiobookSubs),
}));

export const audiobookSubsRelations = relations(audiobookSubs, ({ one }) => ({
  audiobook: one(audiobooks, {
    fields: [audiobookSubs.audiobookId],
    references: [audiobooks.id],
  }),
}));

export const videos = mysqlTable('videos', {
  id: varchar('id', { length: 256 }).primaryKey().unique().notNull(),
  path: varchar('path', { length: 256 }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).onUpdateNow(),
});

export const videosRelations = relations(videos, ({ many }) => ({
  likedVideos: many(likedVideos),
  videoTags: many(videoTags),
}));

export const likedVideos = mysqlTable('likedVideos', {
  id: varchar('id', { length: 256 }).primaryKey().unique().notNull(),
  videoId: varchar('videoId', { length: 256 }).notNull(),
  userId: varchar('userId', { length: 256 }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).onUpdateNow(),

});

export const tags = mysqlTable('tags', {
  id: varchar('id', { length: 256 }).primaryKey().unique().notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).onUpdateNow(),
});

export const tagsRelations = relations(tags, ({ many }) => ({
  videoTags: many(videoTags),
}));

export const videoTags = mysqlTable('videoTags', {
  id: varchar('id', { length: 256 }).primaryKey().unique().notNull(),
  tagId: varchar('tagId', { length: 256 }).notNull(),
  videoId: varchar('videoId', { length: 256 }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).onUpdateNow(),
});

export const videoTagsRelations = relations(videoTags, ({ one }) => ({
  tags: one(tags, {
    fields: [videoTags.tagId],
    references: [tags.id],
  }),
  videos: one(videos, {
    fields: [videoTags.videoId],
    references: [videos.id],
  }),
}));

export const likedVideosRelations = relations(likedVideos, ({ one }) => ({
  videos: one(videos, {
    fields: [likedVideos.videoId],
    references: [videos.id],
  }),

  users: one(users, {
    fields: [likedVideos.userId],
    references: [users.id],
  }),
}));
