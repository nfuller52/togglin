# Togglin MVP TODO List

Togglin is a developer-first feature flag platform with Cloudflare edge evaluation, audit logs, DAG support, and dev-mode overrides.

---

## ✅ Monorepo Setup (Complete)

- [x] Monorepo initialized
- [x] Node/Express backend set up
- [x] React frontend app scaffolded
- [x] Shared packages directory created (for shared types and evaluation engine)

---

## Functional Requirements

### Core Flag System

- [ ] Define `FeatureFlag` schema (with DAG, A/B, and time-based rules)
- [ ] Implement the Flag Evaluation Engine (shared module):
  - [ ] Pure function to evaluate flags (given context + input)
  - [ ] Supports DAG resolution
  - [ ] Supports time-based and A/B rules
- [ ] Express API:
  - [ ] CRUD operations for flags
  - [ ] Promote flags between environments
  - [ ] API to serve raw flag configs for Workers
- [ ] Cloudflare Worker:
  - [ ] Load flag config from KV
  - [ ] Use shared evaluation engine
  - [ ] Return flag status (true/false with reason)

### SDKs

- [ ] TypeScript SDK:
  - [ ] `isEnabled(flagName)`
  - [ ] Local fallback with `.togglin/dev-flags.json`
  - [ ] Use shared evaluation engine
  - [ ] Log unused flags in dev mode
- [ ] Python SDK with equivalent functionality

### Flag Behavior Features

- [ ] DAG support (flag dependencies)
- [ ] Time-based rollout (`starts_at`, `ends_at`)
- [ ] A/B testing (percent rollout, cohort rules)

### Observability and Auditing

- [ ] Audit log system (Postgres or append-only store)
  - [ ] Track: actor, action, timestamp, env, diff
- [ ] API endpoints for audit access
- [ ] React dashboard:
  - [ ] Auth (email/password or magic link)
  - [ ] Project/env selector
  - [ ] Flag table with edit/toggle
  - [ ] Audit log viewer
  - [ ] Promote flow

### Developer Experience

- [ ] `.togglinrc` or `.env` config support
- [ ] Config-as-code support: `togglin.config.ts/json`
- [ ] Dev override file support (`.togglin/dev-flags.json`)
- [ ] Type-safe autocomplete in TypeScript SDK
- [ ] Tooling to warn on unused flags (dev only)
- [ ] Flag mocking support for tests

---

## Non-Functional Requirements

### Performance

- [ ] Cloudflare Worker response <10ms
- [ ] Lightweight SDKs (tree-shakeable, fast init)
- [ ] Efficient use of KV with versioning or ETag

### Security and Access Control

- [ ] API key per project/env
- [ ] Scoped access to flags
- [ ] Auth required for dashboard and writes

### Reliability and Consistency

- [ ] Versioned flag configs with rollback
- [ ] Safe promotion workflow
- [ ] Consistency guarantees in Worker

### Infrastructure and Deployability

- [ ] Cloudflare Worker deployable via CI
- [ ] Express API deployable (Fly.io, Railway, etc.)
- [ ] Self-hostable with setup docs
- [ ] CI:
  - [ ] SDK builds
  - [ ] Worker deploy
  - [ ] Shared package build

### Compliance and Audit

- [ ] Exportable audit logs (CSV/JSON)
- [ ] Filter by actor, flag, environment
- [ ] Retention-ready structure

### Business Readiness

- [ ] Free tier: 10 flags or 10k evals/month
- [ ] Optional hosted GUI + Worker
- [ ] OSS license for CLI/SDK
- [ ] Billing-ready API hooks (for Stripe, Paddle, etc.)

---

## Build Order

### Milestone 1: Flag Evaluation Engine (shared logic)

- [x] Monorepo initialized
- [ ] Define `FeatureFlag` schema and types
- [ ] Implement pure eval function
- [ ] Write test cases for DAG, A/B, time rollout

### Milestone 2: TypeScript SDK

- [ ] Use shared eval engine
- [ ] Load local flag config
- [ ] Add logging and mocking
- [ ] Prepare for remote config pull

### Milestone 3: Cloudflare Worker

- [ ] Read flag config from KV
- [ ] Use shared eval engine
- [ ] Return eval result with metadata
- [ ] Publish test flags manually to KV

### Milestone 4: Express API

- [ ] CRUD endpoints for flags
- [ ] Promote endpoint (publish to KV)
- [ ] Audit logging on all writes

### Milestone 5: React Dashboard

- [ ] Auth system (email/password or magic link)
- [ ] Project/env switcher
- [ ] Flag management UI
- [ ] Audit viewer
- [ ] Promote button with confirmation

### Milestone 6: Python SDK + Final Polish

- [ ] Python SDK with same logic
- [ ] Finalize dev tooling (unused check, tests)
- [ ] Documentation and OSS packaging
- [ ] Launch

---

## Launch Goals

- Flag logic powered by shared engine
- SDKs with local dev and typed DX
- Worker with <10ms eval
- Web dashboard for teams
- Full support for DAGs, A/B, time rollouts
- Logging and audit system complete
