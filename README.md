# Fulll Technical Test

## Exercises

### 1. Algo — FizzBuzz

Located in `algo/`.

```bash
cd algo
bun install
bun test
bun run index.ts 100
```

### 2. Backend — Vehicle Fleet Parking Management

Located in `backend/`.

A DDD/CQRS application for managing vehicle fleets and their parking locations.

#### Architecture

```
backend/src/
├── Domain/          → Business rules (no external dependencies)
│   ├── Models/      → Fleet (aggregate root), Vehicle (entity), Location (value object)
│   └── Ports/       → Repository interfaces
├── App/             → Orchestration (imports Domain only)
│   └── Commands/    → CreateFleet, RegisterVehicle, ParkVehicle
└── Infra/           → Technical implementation (imports Domain only)
    ├── InMemory/    → In-memory repository adapters (for BDD tests)
    ├── Postgres/    → PostgreSQL repository adapters + schema
    └── Cli/         → CLI entry point
```

**Import rules:** Domain imports nothing. App imports Domain. Infra imports Domain.

#### Prerequisites

- Node.js 22+
- PostgreSQL

#### Setup

```bash
cd backend
npm install
cp .env.example .env
createdb fulll_fleet
```

#### CLI

```bash
# Create a fleet (returns fleetId)
DATABASE_URL=postgresql://localhost/fulll_fleet ./fleet create <userId>

# Register a vehicle in a fleet
DATABASE_URL=postgresql://localhost/fulll_fleet ./fleet register-vehicle <fleetId> <vehiclePlateNumber>

# Park a vehicle at a location
DATABASE_URL=postgresql://localhost/fulll_fleet ./fleet localize-vehicle <fleetId> <vehiclePlateNumber> lat lng [alt]
```

Without `DATABASE_URL`, the CLI falls back to in-memory storage (data is lost between calls).

#### Tests

```bash
npm test                # Run all BDD tests (in-memory)
npm run test:in-memory  # Run only in-memory tests
npm run test:infra      # Run only infrastructure tests (requires PostgreSQL)
```

#### Quality

```bash
npm run lint    # ESLint with strict TypeScript rules
npm run format  # Prettier
```

### Quality tools (Step 3)

#### Recommended tools

- **ESLint** — Industry-standard linter for JavaScript/TypeScript. Catches code quality issues and enforces consistent patterns across the codebase.
- **Prettier** — Opinionated code formatter. Removes style debates from code reviews and ensures uniform formatting.
- **Cucumber.js** — BDD testing framework. Bridges the gap between business requirements (Gherkin scenarios) and implementation. Keeps tests readable by non-developers.
- **TypeScript strict mode** — Catches type errors at compile time. Combined with `noUncheckedIndexedAccess` and `noImplicitAny`, it eliminates an entire class of runtime bugs.

For production projects, adding **SonarQube** would provide code coverage tracking, security vulnerability detection, and code smell analysis in a single tool.

#### CI/CD process

The ideal CI/CD pipeline depends on the team organization and branching strategy. For a production project:

**On push (feature branch):**
1. Lint — catch code quality issues early
2. Format check — ensure consistent style
3. Tests — unit, integration, BDD
4. Build — verify compilation succeeds (tests can pass while the build fails due to misconfigured environment variables)

**On PR (merge to main):**
- Same pipeline + human code review
- Optional: preview app deployment to test the feature in isolation

**On merge to main:**
- Deploy to staging/preprod
- Run post-deploy verification
- If green: promote to production
- If deploy fails: offer a one-click rollback to the deployer

**Additional considerations:**
- CI runners cost credits (GitHub Actions, GitLab CI) — a self-hosted runner is worth considering for high-frequency projects
- Database migrations should be a dedicated pipeline step, run before the deploy
- Post-deploy health checks verify the application is actually working, not just deployed

### Feedback

This was my first experience with **Cucumber.js** and **BDD** (Behavior-Driven Development). I found the approach particularly interesting — writing business scenarios in Gherkin before any implementation code forces you to think about the expected behavior first, not the technical solution. The clear separation between specification (.feature files) and implementation (step definitions) makes the test suite readable and maintainable.

For the rest of the project, I aimed to stay as close as possible to the requirements given in the test instructions.
