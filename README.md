# Nodebase ⚡

**Nodebase** is a modern automation platform—similar to Zapier—designed for developers and teams who want powerful workflows with built-in AI capabilities. It enables you to connect apps, automate tasks, and build intelligent workflows using a fast, type-safe, and scalable stack.

Built with **Next.js**, **tRPC**, **Drizzle ORM**, and **BetterAuth**, Nodebase focuses on performance, developer experience, and extensibility.

---

## ✨ Features

- 🔗 **Workflow Automation** – Create trigger → action pipelines across services.
- 🤖 **AI-Powered Automations** – Integrate AI steps for decision-making and text generation.
- 🧩 **Modular Nodes** – Build workflows using reusable, composable nodes.
- 🌊 **Event-Driven** – Powered by Inngest for reliable background jobs and queues.
- 🔐 **Authentication & Authorization** – Secure auth powered by BetterAuth.
- ⚡ **Type-Safe API** – End-to-end type safety with tRPC.
- 🗄️ **Database Management** – Drizzle ORM with Neon PostgreSQL.

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **API Layer**: tRPC
- **Database**: PostgreSQL (**Neon**)
- **ORM**: Drizzle ORM
- **Queue/Workflows**: **Inngest**
- **Authentication**: BetterAuth
- **AI Integration**: **OpenRouter** (Exclusive Provider)
- **Language**: TypeScript

---

## 📦 Installation

### Prerequisites

- Node.js (>= 18)
- PostgreSQL (Neon recommended)
- pnpm / npm / yarn

### Clone the Repository

```bash
git clone https://github.com/Aarenrishikdevloper/Nodebase.git
cd Nodebase
pnpm install
```

---

## 🔑 Configuration & AI Credentials

This project utilizes **OpenRouter** to power its AI capabilities. To ensure granular control and reliability, we use a **per-model credential system** rather than a single global key.

### API Key & Credentials
By default, OpenRouter allows a single API key to be used across multiple models. However, in Nodebase, keys are configured per model within the **Credentials** section. This design choice allows you to:
* **Isolate usage**: Prevent a single key exhaustion from breaking all workflows.
* **Cost Management**: Better track and manage credits per specific model.
* **Flexibility**: Assign different keys to different nodes if necessary.

> [!IMPORTANT]
> You cannot rely on a single global API key. Even if you use the same OpenRouter key for everything, it must be added and assigned separately for each model/node in the Credentials UI.

### Setup Steps
1. Navigate to the **Credentials** section in the dashboard.
2. Add your OpenRouter API key for each model you plan to use.
3. Assign the appropriate credentials to each specific AI node in your workflow.

### Model Maintenance
AI models via OpenRouter may be deprecated or updated over time. If you encounter errors during execution:
1. Verify the model is still active at [OpenRouter Models](https://openrouter.ai/models).
2. Update the model names in the `execution.ts` file of the corresponding AI nodes.

---

## 🚀 Deployment

The project is optimized for deployment on **Vercel**, utilizing **Neon** for serverless Postgres and **Inngest** for workflow orchestration.


