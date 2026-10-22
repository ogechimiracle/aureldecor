import { integer, sqliteTable, text, index } from "drizzle-orm/sqlite-core";

/** Contact-form enquiries. Stored even when no email provider is configured. */
export const contactInquiries = sqliteTable(
  "contact_inquiries",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    service: text("service").notNull(),
    propertyType: text("property_type"),
    projectLocation: text("project_location"),
    budget: text("budget"),
    startDate: text("start_date"),
    description: text("description").notNull(),
    status: text("status", { enum: ["new", "read", "archived"] })
      .notNull()
      .default("new"),
    /** Whether an email notification was actually delivered. */
    emailSent: integer("email_sent", { mode: "boolean" }).notNull().default(false),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    index("contact_inquiries_status_idx").on(table.status),
    index("contact_inquiries_created_idx").on(table.createdAt),
  ],
);

export type ContactInquiry = typeof contactInquiries.$inferSelect;
export type NewContactInquiry = typeof contactInquiries.$inferInsert;
