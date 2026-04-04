import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  varchar,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

/* =========================
   ENUMS
========================= */

export const nodeTypeEnum = pgEnum("node_type", [
  "INITIAL",
  "MANUAL_TRIGGER",
  "HTTP_REQUEST",
  "GOOGLE_FORM_TRIGGER",
  "STRIPE_TRIGGER",
  "ANTHROPIC",
  "DEEPSEEK",

  "LLAMA",
  "QWEN",
  "DISCORD",
  "SLACK",

]);

export const credentialTypeEnum = pgEnum("credential_type", [
  "LLAMA",

  "DEEPSEEK",

  "QWEN",
]);

export const executionStatusEnum = pgEnum("execution_status", [
  "RUNNING",
  "COMPLETED",
  "FAILED",
  "CANCELLED",
]);

/* =========================
   USER
========================= */

/* =========================
   WORKFLOW
========================= */

export const workflows = pgTable("workflows", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/* =========================
   CREDENTIAL
========================= */

export const credentials = pgTable("credentials", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  type: credentialTypeEnum("type").notNull(),
  data: jsonb("data").notNull(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),


  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

});

/* =========================
   NODE
========================= */

export const nodes = pgTable("nodes", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  workflowId: varchar("workflow_id", { length: 255 })
    .notNull()
    .references(() => workflows.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: nodeTypeEnum("type").notNull(),
  position: jsonb("position").notNull(),
  data: jsonb("data").default({}).notNull(),

  credentialId: varchar("credential_id", { length: 255 }).references(
    () => credentials.id,
  ),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/* =========================
   CONNECTION
========================= */

export const connections = pgTable("connections", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  workflowId: varchar("workflow_id", { length: 255 })
    .notNull()
    .references(() => workflows.id, { onDelete: "cascade" }),

  fromNodeId: varchar("from_node_id", { length: 255 })
    .notNull()
    .references(() => nodes.id, { onDelete: "cascade" }),

  toNodeId: varchar("to_node_id", { length: 255 })
    .notNull()
    .references(() => nodes.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/* =========================
   NODE CONFIG
========================= */

export const nodeConfigs = pgTable("node_configs", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  workflowId: varchar("workflow_id", { length: 255 })
    .notNull()
    .references(() => workflows.id, { onDelete: "cascade" }),
  nodeId: varchar("node_id", { length: 255 })
    .notNull()
    .references(() => nodes.id, { onDelete: "cascade" }),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/* =========================
   EXECUTION
========================= */

export const executions = pgTable("executions", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  workflowId: varchar("workflow_id", { length: 255 })
    .notNull()
    .references(() => workflows.id, { onDelete: "cascade" }),
  status: executionStatusEnum("status").default("RUNNING").notNull(),
  error: text("error"),
  errorStack: text("error_stack"),
  startedAt: timestamp("started_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  inngestEventId: varchar("inngest_event_id", { length: 255 })
    .notNull()
    .unique(),
  output: jsonb("output"),
});

/* =========================
   RELATIONS
========================= */

export const workflowRelations = relations(workflows, ({ many, one }) => ({
  nodes: many(nodes),
  connections: many(connections),
  executions: many(executions),
  user: one(user, {
    fields: [workflows.userId],
    references: [user.id],
  }),
}));

export const nodeRelations = relations(nodes, ({ one, many }) => ({
  workflow: one(workflows, {
    fields: [nodes.workflowId],
    references: [workflows.id],
  }),
  credential: one(credentials, {
    fields: [nodes.credentialId],
    references: [credentials.id],
  }),
  outputConnections: many(connections, {
    relationName: "fromNode",
  }),
  inputConnections: many(connections, {
    relationName: "toNode",
  }),
  configs: many(nodeConfigs),
}));

export const connectionRelations = relations(connections, ({ one }) => ({
  workflow: one(workflows, {
    fields: [connections.workflowId],
    references: [workflows.id],
  }),
  fromNode: one(nodes, {
    fields: [connections.fromNodeId],
    references: [nodes.id],
    relationName: "fromNode",
  }),
  toNode: one(nodes, {
    fields: [connections.toNodeId],
    references: [nodes.id],
    relationName: "toNode",
  }),
}));
export const credentialRelations = relations(credentials, ({ one, many }) => ({
  user: one(user, {
    fields: [credentials.userId],
    references: [user.id],
  }),
  nodes: many(nodes),
}));

export const executionRelations = relations(executions, ({ one }) => ({
  workflow: one(workflows, {
    fields: [executions.workflowId],
    references: [workflows.id],
  }),
}));

export const nodeConfigRelations = relations(nodeConfigs, ({ one }) => ({
  workflow: one(workflows, {
    fields: [nodeConfigs.workflowId],
    references: [workflows.id],
  }),
  node: one(nodes, {
    fields: [nodeConfigs.nodeId],
    references: [nodes.id],
  }),
}));