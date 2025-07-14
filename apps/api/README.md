## Standards

### Table of Contents

1. [Directory Structure](#directory-structure)
2. [Module Structure](#module-structure)

### Directory Structure

### Module Structure

Each module lives in its own directory under

```sh
src/modules/
└── {moduleName}/
    ├── tests/                      # Tets for this module
    ├── index.ts                    # Public interface: export services/types for other modules
    ├── {moduleName}.module.ts      # Initializes the module (wires up router + services)
    ├── {moduleName}.router.ts      # Express routes -> controller mapping
    ├── {moduleName}.controller.ts  # Handles validation, ACL, and dispatches to service
    ├── {moduleName}.acl.ts         # Defines access control rules for the module
    ├── {moduleName}.service.ts     # Business logic (pure functions, reusable)
    ├── {moduleName}.data.ts        # DB/cache access using Kysely, Redis, etc.
    ├── {moduleName}.schemas.ts     # Input/output Zod schemas
    └── types.ts                    # Internal module types
```

**Example Usage**

```typescript
// src/app.ts
import { initFlagsModule } from "@modules/flags"

initFlagsModule(app, context);

// src/modules/flags/flags.module.ts
import { FlagsService } from "./flags.services.ts";

export function initFlagsModule(app: Express, context: AppContext) {
  const router = createFlagsRouter({ ...context, services: { FlagsService }});
  app.use(router);
}
```
