# Initial Concept

TeknoPulse — a production Tech & AI news and review site for the Indonesian market. Delivers daily technology updates, tool reviews, comparisons, and opinionated analysis in Bahasa Indonesia. Built with Astro v5 + TypeScript + Tailwind v3.

---

# Product Guide: TeknoPulse

## Vision

TeknoPulse is the go-to Indonesian-language technology news and review platform, delivering opinionated analysis, practical tool comparisons, and daily tech updates to a curious Indonesian audience. The site empowers readers to make informed technology decisions through accessible yet insightful content written in Bahasa Indonesia.

## Target Audience

Indonesian tech enthusiasts — developers, IT professionals, students, and general consumers — who are curious about technology trends, practical daily tools, and want to stay informed in their native language. These readers value actionable insights over raw news dumps.

## Core Content Pillars

### 1. Tool Reviews & Comparisons
The primary content focus: hands-on reviews and head-to-head comparisons of tools, services, and platforms. Content helps readers choose the right tools for their needs — from development environments to cloud services to AI assistants.

### 2. Opinionated Tech Analysis
Strong editorial perspective on technology trends, industry shifts, and policy decisions. TeknoPulse doesn't just report — it takes a stance and helps readers understand *why* things matter.

### 3. Flexible Topic Coverage (Tag-Based)
Instead of rigid categories, content is organized through a flexible **tag-based taxonomy**. Posts can be tagged with multiple topics, allowing articles to span domains naturally. Current high-level topic areas include (but are not limited to):

- **AI & Machine Learning** — Models, tools, research, practical applications
- **Cloud & Infrastructure** — Services, pricing, migration, DevOps
- **Security** — Threats, vulnerabilities, compliance, best practices
- **Developer Tools** — IDEs, CLIs, workflows, productivity
- **Tech Policy** — Regulations, digital policy, legal developments
- **Mobile & Apps** — App reviews, mobile tech, OS updates
- **Hardware** — Gadgets, components, benchmarks

New tags can be introduced organically as topics emerge without requiring code or schema changes.

> **Note (Current State):** The existing codebase uses a fixed `category` enum (`AI | Cloud | Security | DevTools | Policy`) enforced in the Zod schema. Migrating to a fully tag-based system is a future track that will require schema changes. Until then, the current categories serve as primary topic groupings while `tags` provide flexible secondary classification.

## Content Formats

| Format | Indonesian Label | Purpose |
|--------|-----------------|----------|
| News | `berita` | Fast, concise daily updates |
| Roundup | `rangkuman` | Curated summaries of key developments |
| Analysis | `konteks` | In-depth contextual analysis with editorial opinion |
| Reader Guide | `panduan-pembaca` | Practical guides and tutorials for tools/topics |

## Editorial Voice

- **Opinionated but fair** — strong perspectives backed by evidence and reasoning
- **Accessible Bahasa Indonesia** — technical topics explained clearly, no unnecessary jargon
- **Practical focus** — content always ties back to "what does this mean for you?"
- **Concise and scannable** — respect the reader's time with structured, well-organized articles

## Business & Growth Objectives

1. **SEO Leadership** — Grow organic search traffic by producing SEO-optimized content in Bahasa Indonesia, targeting technology keywords underserved in the Indonesian content market
2. **Brand Authority** — Establish TeknoPulse as the definitive Indonesian-language source for tech news, reviews, and analysis
3. **Monetization Readiness** — Build toward revenue through ads, sponsorships, and/or premium content while maintaining editorial independence

## Technical Identity

- **URL:** https://teknopulse.id
- **Locale:** `id-ID` (Indonesian)
- **Tagline:** "Review dan analisis teknologi untuk pengguna Indonesia."
- **Social Presence:** X (@teknopulse_id), Threads (@teknopulse.id), GitHub (TeknoPulse)
