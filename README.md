# BizTrack RW – Phase 0 Setup

This is the foundation of BizTrack RW.

## Getting Started

1. **Clone the repository**
2. **Install dependencies** (from root):
   ```bash
   yarn install

# Complete MonoRep
biztrack-rw/
├── docker-compose.yml
├── package.json
├── yarn.lock (generated)
├── .gitignore
├── .env.example (root)
├── packages/
│   ├── backend/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── nest-cli.json
│   │   ├── .env.example
│   │   └── src/
│   │       └── main.ts (minimal)
│   ├── frontend/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   ├── postcss.config.js
│   │   ├── .env.example
│   │   └── src/
│   │       └── app/
│   │           └── page.tsx (basic)
│   ├── database/
│   │   ├── package.json
│   │   ├── prisma/
│   │   │   ├── schema.prisma (complete schema)
│   │   │   └── seed.ts (optional)
│   │   └── .env.example
│   └── shared/
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           └── index.ts (empty for now)
└── .github/ (optional, not needed now)