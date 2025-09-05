import { integer, pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Decks table - represents a collection of flashcards
export const decksTable = pgTable("decks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  userId: varchar({ length: 255 }).notNull(), // Clerk user ID
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// Cards table - individual flashcards within a deck
export const cardsTable = pgTable("cards", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  deckId: integer().notNull().references(() => decksTable.id, { onDelete: "cascade" }),
  front: text().notNull(), // Front side of the card (e.g., "Dog" or "When was the battle of hastings?")
  back: text().notNull(),  // Back side of the card (e.g., "Anjing" or "1066")
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// Relations
export const decksRelations = relations(decksTable, ({ many }) => ({
  cards: many(cardsTable),
}));

export const cardsRelations = relations(cardsTable, ({ one }) => ({
  deck: one(decksTable, {
    fields: [cardsTable.deckId],
    references: [decksTable.id],
  }),
}));
