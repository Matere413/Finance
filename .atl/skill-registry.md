# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| Creating a pull request, opening a PR, preparing changes for review | branch-pr | C:\Users\david\.claude\skills\branch-pr\SKILL.md |
| Writing Go tests, using teatest, adding test coverage | go-testing | C:\Users\david\.claude\skills\go-testing\SKILL.md |
| Creating a GitHub issue, reporting a bug, requesting a feature | issue-creation | C:\Users\david\.claude\skills\issue-creation\SKILL.md |
| "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen" | judgment-day | C:\Users\david\.claude\skills\judgment-day\SKILL.md |
| Creating a new skill, adding agent instructions, documenting patterns for AI | skill-creator | C:\Users\david\.claude\skills\skill-creator\SKILL.md |
| Any change to system boundaries, ownership, state flow, or cross-package responsibilities (Engram) | engram-architecture-guardrails | C:\Users\david\.claude\plugins\marketplaces\engram\skills\architecture-guardrails\SKILL.md |
| Auditing open issues or PRs, triaging backlog, reviewing contributor submissions | engram-backlog-triage | C:\Users\david\.claude\plugins\marketplaces\engram\skills\backlog-triage\SKILL.md |
| Any change affecting sync behavior, project controls, permissions, or memory semantics (Engram) | engram-business-rules | C:\Users\david\.claude\plugins\marketplaces\engram\skills\business-rules\SKILL.md |
| Any commit creation, review, or branch cleanup (Engram) | engram-commit-hygiene | C:\Users\david\.claude\plugins\marketplaces\engram\skills\commit-hygiene\SKILL.md |
| Starting substantial work, reviewing changes, or defining team conventions (Engram) | engram-cultural-norms | C:\Users\david\.claude\plugins\marketplaces\engram\skills\cultural-norms\SKILL.md |
| Any change to htmx attributes, partial updates, forms, or server-rendered browser UI (Engram) | engram-dashboard-htmx | C:\Users\david\.claude\plugins\marketplaces\engram\skills\dashboard-htmx\SKILL.md |
| Any code or workflow change that affects user or contributor behavior (Engram docs) | engram-docs-alignment | C:\Users\david\.claude\plugins\marketplaces\engram\skills\docs-alignment\SKILL.md |
| Decisions, bugfixes, discoveries, preferences, or session closure (Engram) | engram-memory-protocol | C:\Users\david\.claude\plugins\marketplaces\engram\skills\memory-protocol\SKILL.md |
| Changes in plugin scripts/hooks for Claude, OpenCode, Gemini, or Codex | engram-plugin-thin | C:\Users\david\.claude\plugins\marketplaces\engram\skills\plugin-thin\SKILL.md |
| Reviewing any external or internal contribution before merge (Engram) | engram-pr-review-deep | C:\Users\david\.claude\plugins\marketplaces\engram\skills\pr-review-deep\SKILL.md |
| Creating files, packages, handlers, templates, styles, or tests in Engram repo | engram-project-structure | C:\Users\david\.claude\plugins\marketplaces\engram\skills\project-structure\SKILL.md |
| Any route, handler, payload, or status code modification (Engram) | engram-server-api | C:\Users\david\.claude\plugins\marketplaces\engram\skills\server-api\SKILL.md |
| Implementing behavior changes in any package (Engram TDD) | engram-testing-coverage | C:\Users\david\.claude\plugins\marketplaces\engram\skills\testing-coverage\SKILL.md |
| Changes in model, update, view, navigation, or rendering (Engram TUI) | engram-tui-quality | C:\Users\david\.claude\plugins\marketplaces\engram\skills\tui-quality\SKILL.md |
| Adding or changing dashboard UI components or connected browsing flows (Engram) | engram-ui-elements | C:\Users\david\.claude\plugins\marketplaces\engram\skills\ui-elements\SKILL.md |
| Any dashboard styling, typography, spacing, or visual identity change (Engram) | engram-visual-language | C:\Users\david\.claude\plugins\marketplaces\engram\skills\visual-language\SKILL.md |
| Editing Go files in installer/internal/tui/, working on TUI screens, adding new UI features | gentleman-bubbletea | C:\Users\david\.claude\plugins\marketplaces\engram\skills\gentleman-bubbletea\SKILL.md |
| Responsive design, mobile layouts, breakpoints, viewport adaptation, cross-device compatibility | adapt | C:\Users\david\.agents\skills\adapt\SKILL.md |
| Adding animation, transitions, micro-interactions, motion design, hover effects, making UI feel more alive | animate | C:\Users\david\.agents\skills\animate\SKILL.md |
| Building interfaces inspired by Apple's aesthetic, light mode, Inter font, 4px grid | apple-ui-skills | C:\Users\david\.agents\skills\apple-ui-skills\SKILL.md |
| Accessibility check, performance audit, technical quality review | audit | C:\Users\david\.agents\skills\audit\SKILL.md |
| Design looks bland, generic, too safe, lacks personality, wants more visual impact | bolder | C:\Users\david\.agents\skills\bolder\SKILL.md |
| Confusing text, unclear labels, bad error messages, hard-to-follow instructions, better UX writing | clarify | C:\Users\david\.agents\skills\clarify\SKILL.md |
| Design looking gray, dull, lacking warmth, needing more color, vibrant palette | colorize | C:\Users\david\.agents\skills\colorize\SKILL.md |
| Review, critique, evaluate, or give feedback on a design or component | critique | C:\Users\david\.agents\skills\critique\SKILL.md |
| Adding polish, personality, micro-interactions, delight, making UI fun or memorable | delight | C:\Users\david\.agents\skills\delight\SKILL.md |
| Senior UI/UX bias-correcting frontend engineering, metric-based component rules | design-taste-frontend | C:\Users\david\.agents\skills\design-taste-frontend\SKILL.md |
| Simplify, declutter, reduce noise, remove elements, cleaner more focused UI | distill | C:\Users\david\.agents\skills\distill\SKILL.md |
| Extended animation sequences over 2000ms, cinematic intros, story sequences, premium experiences | dramatic-2000ms-plus | C:\Users\david\.agents\skills\dramatic-2000ms-plus\SKILL.md |
| Premium landing pages, Apple-style design, luxury tech brand, sophisticated corporate interfaces | elevated-design | C:\Users\david\.agents\skills\elevated-design\SKILL.md |
| UI polish, component design, animation decisions, invisible details (Emil Kowalski philosophy) | emil-design-eng | C:\Users\david\.agents\skills\emil-design-eng\SKILL.md |
| Building new FastAPI applications, setting up backend API projects, async Python APIs | fastapi-templates | C:\Users\david\.agents\skills\fastapi-templates\SKILL.md |
| Financial systems, FinTech, banking, payments, trading, accounting, regulatory compliance | finance-expert | C:\Users\david\.agents\skills\finance-expert\SKILL.md |
| Building web components, pages, artifacts, posters, or applications (HTML/CSS/React/Vue) | frontend-design | C:\Users\david\.agents\skills\frontend-design\SKILL.md |
| Building web components/pages/apps or when any design skill requires project context | impeccable | C:\Users\david\.agents\skills\impeccable\SKILL.md |
| Layout feeling off, spacing issues, visual hierarchy, crowded UI, alignment problems, composition | layout | C:\Users\david\.agents\skills\layout\SKILL.md |
| Visual motion systems, animation specifications, crafting beautiful meaningful movement (designer) | motion-designer | C:\Users\david\.agents\skills\motion-designer\SKILL.md |
| Writing, reviewing, or refactoring NestJS code, modules, controllers, services | nestjs-best-practices | C:\Users\david\.agents\skills\nestjs-best-practices\SKILL.md |
| Network architecture design, security implementation, zero-trust, VPC, VPN, cloud networking | network-engineer | C:\Users\david\.agents\skills\network-engineer\SKILL.md |
| Creating Node.js servers, REST APIs, GraphQL backends, microservices architectures | nodejs-backend-patterns | C:\Users\david\.agents\skills\nodejs-backend-patterns\SKILL.md |
| Slow, laggy, janky, performance, bundle size, load time, faster smoother experience | optimize | C:\Users\david\.agents\skills\optimize\SKILL.md |
| Wow, impress, go all-out, extraordinary, technically ambitious implementations | overdrive | C:\Users\david\.agents\skills\overdrive\SKILL.md |
| Polish, finishing touches, pre-launch review, something looks off, good to great | polish | C:\Users\david\.agents\skills\polish\SKILL.md |
| Too bold, too loud, overwhelming, aggressive, garish, wants calmer refined aesthetic | quieter | C:\Users\david\.agents\skills\quieter\SKILL.md |
| Integrating and building applications with shadcn/ui components | shadcn-ui | C:\Users\david\.agents\skills\shadcn-ui\SKILL.md |
| Planning UX and UI for a feature before writing code, design brief, discovery interview | shape | C:\Users\david\.agents\skills\shape\SKILL.md |
| SVG code, Lottie alternatives, vector illustrations, web-based motion graphics | svg-animation-engineer | C:\Users\david\.agents\skills\svg-animation-engineer\SKILL.md |
| Fonts, type, readability, text hierarchy, sizing looks off, polished intentional typography | typeset | C:\Users\david\.agents\skills\typeset\SKILL.md |
| UI structure, visual design decisions, interaction patterns, user experience quality control | ui-ux-pro-max | C:\Users\david\.agents\skills\ui-ux-pro-max\SKILL.md |
| React components, Next.js pages, data fetching, bundle optimization, performance improvements | vercel-react-best-practices | C:\Users\david\.agents\skills\vercel-react-best-practices\SKILL.md |
| After Effects, Premiere Pro, video titles, explainer videos, broadcast motion graphics | video-motion-graphics | C:\Users\david\.agents\skills\video-motion-graphics\SKILL.md |
| "review my UI", "check accessibility", "audit design", "review UX", "check my site against best practices" | web-design-guidelines | C:\Users\david\.agents\skills\web-design-guidelines\SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### branch-pr
- Every PR MUST link an issue with `status:approved` label — no exceptions; blank PRs are blocked by CI
- Branch naming: `type/description` format — regex: `^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)\/[a-z0-9._-]+$`
- PR MUST have exactly one `type:*` label (e.g. `type:feature`, `type:bug`, `type:docs`)
- Commit format: `type(scope): description` — conventional commits enforced by GitHub ruleset
- Never include `Co-Authored-By` trailers in commits
- PR body MUST include: `Closes #N`, type checkbox, 1-3 bullet summary, changes table, test plan
- Automated checks must pass: issue reference, status:approved, type label, shellcheck on scripts

### go-testing
- Table-driven tests for all pure functions: `tests := []struct{name, input, expected, wantErr}{}; for _, tt := range tests { t.Run(tt.name, ...) }`
- Bubbletea: test `Model.Update()` directly for state transitions (not just rendering)
- Use `teatest.NewTestModel` for full interactive TUI flow tests; `tm.Send()` + `tm.WaitFinished()`
- Golden files go in `testdata/*.golden` — update with `-update` flag
- Test file mirrors source: `model.go` → `model_test.go`; keep teatest tests in separate `teatest_test.go`
- Commands: `go test ./...`, `go test -cover ./...`, `go test -run TestName`, `go test -update ./...`

### issue-creation
- Blank issues disabled — MUST use `bug_report.yml` or `feature_request.yml` template
- New issues auto-get `status:needs-review`; maintainer MUST add `status:approved` before any PR can open
- Questions go to Discussions, NOT issues
- Always search for duplicates before creating: `gh issue list --search "keyword"`
- Required: pre-flight checkboxes, clear description, steps/proposed solution, affected area

### judgment-day
- Orchestrator NEVER reviews code itself — only launches judges and synthesizes results
- Launch TWO judge sub-agents in parallel (async/delegate) — never sequential; neither knows about the other
- Resolve skill registry FIRST (Pattern 0): search engram → fallback `.atl/skill-registry.md` → inject compact rules into BOTH judges and Fix Agent
- WARNING classification: `real` = normal user can trigger it; `theoretical` = requires contrived/malicious conditions → report as INFO, do NOT fix
- After Round 1: show verdict table to user, ASK before fixing — do not fix without confirmation
- APPROVED criteria: 0 confirmed CRITICALs + 0 confirmed real WARNINGs (theoretical and suggestions may remain)
- Fix Agent is a separate delegation — never reuse a judge as the fixer
- After 2 fix iterations with issues remaining: ASK user whether to continue — never auto-escalate
- Never push/commit after fixes until re-judgment completes

### skill-creator
- Skill files go in `skills/{skill-name}/SKILL.md` (lowercase, hyphens)
- Required frontmatter: `name`, `description` (MUST include `Trigger:` text), `license: Apache-2.0`, `metadata.author`, `metadata.version`
- `description` field triggers auto-detection — Trigger keywords MUST be in frontmatter, not body
- After creating, add entry to `AGENTS.md` registry
- `references/` → local file paths only, never web URLs
- Don't create skills for one-off tasks or trivial/self-explanatory patterns

### engram-architecture-guardrails
- Local SQLite is the source of truth; cloud is replication and shared access only
- Keep plugin/adaptor layers thin — real behavior belongs in Go packages
- Local-only concern → `internal/store`; Cloud materialization → `internal/cloud/cloudstore`
- HTTP contract → `internal/cloud/cloudserver`; Browser UX → `internal/cloud/dashboard`; Background → `internal/cloud/autosync`
- Add regression tests for every boundary change; verify local, remote, and dashboard behavior tell the same story

### engram-backlog-triage
- Dispositions: MERGE | REQUEST CHANGES | CLOSE | NEEDS DESIGN | APPROVE ISSUE | REJECT ISSUE — assign exactly one
- Every PR must link a `status:approved` issue; no approved issue → CLOSE
- Reject scope-creep and vague issues; prefer 50-line focused PRs over 500-line multi-problem ones
- Request changes with specific, actionable items only — no vague "needs improvement"
- Non-negotiables: zero-config, local-first, single binary, terminal-first, thin adapters

### engram-business-rules
- Local-first is the default mental model — no cloud dependency by default
- Org-wide security controls belong in cloud, not only in local clients
- When a policy blocks sync, fail loudly — never silently drop data
- UI controls must map to real business rules — never fake toggles or decorative controls

### engram-commit-hygiene
- Commit format: `^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\([a-z0-9\._-]+\))?!?: .+` — enforced by GitHub ruleset
- Branch format: `type/description` — lowercase, `a-z0-9._-` only — enforced on push
- Never include `Co-Authored-By` trailers; never commit generated/temp/local files
- Description: imperative mood ("add", not "added"); explains WHY, not just what
- One logical change per commit

### engram-cultural-norms
- Product coherence beats local cleverness — every feature must feel connected to the full Engram experience
- Push back on fake UX and fake controls
- If a rule is organizational, enforce it on the server — not just in the client
- If a pattern repeats, capture it as a skill or project convention

### engram-dashboard-htmx
- Server-rendered HTML is the product; htmx enhances it, does not replace it
- Prefer simple `hx-get` + `hx-include` over custom client-side state
- Forms that mutate state must still work as plain HTTP posts
- Partial endpoints return meaningful HTML independently — no hidden JS dependencies

### engram-docs-alignment
- Docs describe current behavior, not intended behavior
- Update docs in the same PR as the code change — no deferred doc updates
- Validate examples before publishing; remove references to deprecated files, endpoints, or scripts
- Check: endpoint names match routes, script names match repo paths, cross-agent notes are still accurate

### engram-memory-protocol
- Call `mem_save` immediately after: decision, bugfix, pattern/discovery, config/preference — do not wait
- Use stable `topic_key` for evolving topics (upserts, not duplicates)
- On recall: `mem_context` first (fast), then `mem_search` (keyword), then `mem_get_observation` (full content)
- On first user message referencing project/feature/problem: proactive `mem_search` before responding
- Before saying done/listo: call `mem_session_summary` with goal, discoveries, accomplished, next steps, files

### engram-plugin-thin
- Keep adapters thin: parse input, call Go API/tool, return — no business logic in scripts
- Put complex logic in Go core: `store`, `server`, or `mcp` packages
- Reuse shared contract across all supported agents (Claude, OpenCode, Gemini, Codex)
- Verify all agent flows still work after plugin changes

### engram-pr-review-deep
- Read full diff, not only summary
- Run relevant tests locally before approving; validate API/contracts and migration safety
- Flag commit hygiene violations; check docs match implementation
- Merge only when: checks green, risk understood, blockers resolved, scope coherent
- Otherwise: request changes with specific, actionable items

### engram-project-structure
- Put behavior near its domain, not near the caller
- Templates: `internal/cloud/dashboard/*.templ` (generated `_templ.go` files checked in)
- HTTP handlers in server packages — not in store packages
- Persistence queries in store/cloudstore — not in handlers
- New route → handler + tests in dashboard/server; New DB → store/cloudstore + tests; New templ → component + generated file

### engram-server-api
- Every new or changed endpoint must have tests covering success and error paths
- Keep scripts and docs aligned with real handler routes
- Do not reference non-existent endpoints in plugins or hooks
- If payload or route changes, update docs in the same PR

### engram-testing-coverage
- TDD loop: write failing test → minimal implementation → refactor → edge/error-path tests
- Cover happy path + error paths + edge cases
- Prefer deterministic tests over flaky integration paths; add seams only when branches can't be triggered naturally
- Commands: `go test ./...` and `go test -cover ./...` — report coverage in PR

### engram-tui-quality
- Keyboard behavior must be consistent across all screens
- Empty, loading, and error states must be explicit and readable
- No TUI behavior change ships without deterministic tests
- Add `update` tests for new key transitions, `view` tests for new rendering branches, `model` tests for async data-loading

### engram-ui-elements
- Every list item should lead somewhere useful when domain relationships exist
- Empty states must explain what is missing and what unlocks data
- Metrics must reflect real system state — no decorative counters
- Use cards for browsable entities, tables for dense comparative admin data
- Keep action controls close to the entity they affect

### engram-visual-language
- Dashboard must feel like Engram, not a generic SaaS admin panel
- Use the TUI-inspired palette and mono/display accents intentionally
- Format machine timestamps and raw identifiers into human-scannable UI
- Avoid box-inside-box repetition unless it clarifies information hierarchy
- Important text must never touch borders or feel cramped; metrics should read instantly

### gentleman-bubbletea
- All screens defined as `Screen` constants in `model.go` using `iota`
- `Model` struct holds ALL application state — no global state
- All input handling through `Update()` with a type switch on `tea.Msg`
- Key handlers return `(Model, tea.Cmd)` — always return the updated model, not a pointer
- Use `m.PrevScreen` for back navigation; reset `m.Cursor` on screen transition

### adapt
- Invoke /impeccable FIRST — gather target platform, device, input method, and connection constraints
- Mobile: single column, full-width components, 44x44px min touch targets, bottom nav, thumbs-first design
- NEVER use `h-screen` for Hero — use `min-h-[100dvh]` to prevent iOS Safari layout jump
- Standardize breakpoints: `sm`, `md`, `lg`, `xl`; use CSS Grid over flexbox percentage math
- Adaptation is NOT scaling — it's rethinking the experience for the new context

### animate
- Invoke /impeccable FIRST — gather performance constraints and brand personality
- ALWAYS respect `prefers-reduced-motion` — provide non-animated fallbacks
- One well-orchestrated hero animation beats scattered micro-interactions everywhere
- Animate ONLY `transform` and `opacity` — never `width`, `height`, `top`, `left` (causes layout thrash)
- Entrance: stagger 100-150ms delays; micro-interactions: <300ms; page transitions: 300-500ms

### apple-ui-skills
- Background: `#FFFFFF` (`surface-base`); Primary action: `#155BD0` (`accent`)
- Font: Inter exclusively; Headings: 51px/700; Body: 27px/500
- Use `text-balance` for headings, `text-pretty` for body; `tabular-nums` for numeric data
- NEVER modify letter-spacing unless explicitly requested
- Max 10 distinct colors; text contrast ratio ≥ 4.5:1

### audit
- Invoke /impeccable FIRST; this is a documentation pass — do NOT fix issues, only report them
- Score 5 dimensions 0-4: Accessibility, Performance, Theming, Responsive Design, Anti-Patterns
- Severity: P0 (critical/blocker), P1 (high), P2 (medium), P3 (low)
- A11y: contrast ratios, ARIA labels, keyboard nav, semantic HTML, alt text, form labels
- Performance: `transform/opacity` animations only (no layout props), lazy loading, bundle size

### bolder
- Invoke /impeccable FIRST — understand brand personality and constraint limits
- "Bolder" = distinctive and intentional, NOT random chaos or generic AI effects
- BANNED: cyan/purple gradients, glassmorphism, neon on dark, gradient text — these are generic, not bold
- Typography: extreme scale jumps (3x-5x), weight contrast (900 vs 200); pick ONE hero focal point
- Bold design must still be usable — impact without function is decoration

### clarify
- Invoke /impeccable FIRST — gather audience technical level and user mental state
- Error messages: explain what happened AND what to do next; never just error codes
- Avoid jargon, passive voice, ambiguity; prefer active and imperative voice
- Primary message first, action needed second, tone matches context (helpful/apologetic/encouraging)
- Good UX copy is invisible — users understand without noticing the words

### colorize
- Invoke /impeccable FIRST — gather existing brand colors
- 60-30-10 rule: dominant (60%), secondary (30%), accent (10%); max 2-4 colors beyond neutrals
- Every color must have a purpose: semantic, hierarchy, categorization, emotional tone, or wayfinding
- Semantic: success=green, error=red/pink, warning=orange/amber, info=blue, neutral=gray
- More color ≠ better — strategic color beats rainbow vomit

### critique
- Invoke /impeccable FIRST — gather what the interface is trying to accomplish
- Run TWO independent assessments (LLM design review + automated detection); neither sees the other
- AI slop detection is CRITICAL: check against ALL DON'T guidelines in impeccable skill first
- Score Nielsen's 10 heuristics 0-4 each; run 8-item cognitive load checklist (4+ items = critical)
- Output: AI slop verdict, heuristic scores, what's working (2-3), priority issues (3-5 with fix), minor observations

### delight
- Invoke /impeccable FIRST — gather brand personality and what's appropriate for the domain
- Delight AMPLIFIES usability, never obscures it; delight moments must be <1 second
- Natural moments: success states, empty states, loading states, hover interactions, milestones
- Never delay core functionality for delight; make delight skippable or subtle
- ALWAYS respect `prefers-reduced-motion` for all delight animations

### design-taste-frontend
- Check `package.json` BEFORE importing any 3rd party library; output install command if missing
- NEVER use `h-screen` for Hero — use `min-h-[100dvh]`; NEVER use flexbox percentage math, use CSS Grid
- ANTI-EMOJI POLICY [CRITICAL]: NEVER use emojis in code, markup, or text — use Phosphor/Radix icons instead
- Typography: Geist/Outfit/Cabinet Grotesk/Satoshi for display (NOT Inter for "premium"); serif BANNED for dashboards
- COLOR: max 1 accent, saturation <80%; "AI Purple/Blue" (purple glows, neon gradients) STRICTLY BANNED
- ANTI-CENTER BIAS: centered H1s BANNED when LAYOUT_VARIANCE>4 — use split-screen or asymmetric layouts
- Tailwind version check: v4 uses `@tailwindcss/postcss`, NOT `tailwindcss` plugin in postcss.config.js
- Icons: use exclusively `@phosphor-icons/react` or `@radix-ui/react-icons`

### distill
- Invoke /impeccable FIRST — identify the single primary user goal
- Remove elements that don't serve the primary purpose: competing CTAs, redundant info, visual clutter
- Use progressive disclosure — hide complexity until actually needed
- Every element must justify its existence; simplicity ≠ feature removal

### dramatic-2000ms-plus
- Use ONLY for brand-defining moments — cinematic intros, story sequences, premium experiences where animation IS the product
- Apply Disney principles at full scale: squash/stretch 40%+, anticipation 400-600ms wind-up, 120+ frames at 60fps
- Multi-phase narrative easing: `cubic-bezier(0.22, 0.61, 0.36, 1)`; building drama: `cubic-bezier(0.55, 0.06, 0.68, 0.19)`
- All element paths intentionally choreographed in arcs — never robotic linear motion
- MUST respect `prefers-reduced-motion`

### elevated-design
- Generous whitespace: space communicates confidence; elements float with individual breathing room
- Typography: light-regular weights (300-400), tight tracking (-0.02em) for headlines, never pure #000000
- 12-column grid with intentional 7-5 or 8-4 asymmetric splits — avoid centering everything
- Color: predominantly white/light backgrounds, dark rich accents, minimal palette, no decorative color
- Motion: one purposeful subtle interaction that fully justifies itself; nothing gratuitous

### emil-design-eng
- Review format MUST use markdown table with Before/After/Why columns — NEVER a list with Before/After on separate lines
- `transition: all` → specify exact properties only: `transition: transform 200ms ease-out`
- Nothing in UI appears from nothing — use `scale(0.95) + opacity: 0`, NOT `scale(0)`
- `ease-in` feels sluggish; use `ease-out` with custom curve for instant responsive feedback
- Buttons MUST have `:active` states — `transform: scale(0.97)` minimum
- Popovers scale from trigger `transform-origin`; modals stay centered — they are different

### fastapi-templates
- Project structure: `api/v1/endpoints/`, `core/`, `models/`, `schemas/`, `services/`, `repositories/`, `main.py`
- Always use `async def` for route handlers and all DB operations
- Dependency injection via `Depends()` for shared concerns (auth, DB sessions)
- Global error handling via exception handlers; raw exceptions must never reach the client
- Separate Pydantic schemas for request/response; never reuse DB models as API contracts

### finance-expert
- ALWAYS use `Decimal` (never `float`) for monetary calculations — floating-point errors cause real money bugs
- Stripe amounts are in cents: `int(amount * 100)`; always include idempotency keys for payment operations
- Verify webhook signatures for all payment provider callbacks; never trust payload alone
- Never store raw card data; log audit trails for all financial transactions
- Design for high availability (99.999%): idempotent operations, failover, and retry with backoff

### frontend-design
- Choose a BOLD aesthetic direction before coding — commit fully, no generic defaults
- NEVER use: Inter/Roboto/Arial/system fonts, purple gradients on white, predictable card grids
- Pair a distinctive display font with a refined body font; vary aesthetics across generations
- Motion: CSS-only for HTML; Motion library for React; one orchestrated page load > scattered micro-interactions
- NEVER converge on common choices (Space Grotesk, dark+blue, centered hero) — every design must be different

### impeccable
- Context Gathering Protocol FIRST: check loaded instructions → read `.impeccable.md` → run `/impeccable teach`
- REQUIRED before any design work: target audience, use cases, brand personality/tone — cannot be inferred from code
- Fluid `clamp()` for marketing/content headings; fixed `rem` scales for app UIs and dashboards
- Line-height scales inversely with line length; light text on dark needs +0.05-0.1 to line-height
- Cap line length at 65-75ch; use 5-step type scale with ≥1.25 ratio between steps
- Run `node .agents/skills/impeccable/scripts/cleanup-deprecated.mjs` once after an update

### layout
- Invoke /impeccable FIRST
- Squint test: blur eyes — can you still identify the most important element and groupings?
- Related elements grouped tightly; generous space BETWEEN groups; not uniform padding everywhere
- Avoid identical card grids (icon + heading + text × N) — vary section structure
- Density must match content: data-dense UI = tight; marketing/editorial = more air
- Consult `reference/spatial-design.md` in impeccable skill for detailed grid and rhythm guidance

### motion-designer
- Apply all 12 Disney principles: squash/stretch, anticipation, staging, follow-through, slow-in/out, arcs, secondary action, timing, exaggeration, solid drawing, appeal
- Fast timing = light/agile; slow timing = heavy/dramatic; vary for contrast; consistent timing = rhythm
- Living things move in arcs — avoid robotic linear paths; use `auto-orient` to path for natural rotation
- Nothing in UI stops at once — stagger element arrivals; heavier elements lag behind
- Deliver: motion style guide with easing curves, timing specs, and implementation code

### nestjs-best-practices
- Organize by feature module (controllers/services/modules together), NOT by technical layer
- Avoid circular dependencies; use `forwardRef()` only as absolute last resort
- Use Repository pattern to abstract DB logic; inject repositories via DI
- Use Guards for auth/authz, Interceptors for cross-cutting concerns, Pipes for validation
- Enable `ValidationPipe` globally with `whitelist: true`; use class-validator on all DTOs

### network-engineer
- Zero-trust principles: verify explicitly, least privilege, assume breach
- Segment with VPCs/subnets; security groups + NACLs at every boundary
- DNS: health checks + failover on every record; never single-point DNS dependencies
- All network config via Infrastructure as Code (Terraform/CDK) — no manual console changes
- BGP for dynamic routing in multi-cloud; static routes only for predictable single-path scenarios

### nodejs-backend-patterns
- Always use `helmet()`, `cors()` with explicit origin allowlist, `compression()` in middleware stack
- Use async/await consistently; never mix callbacks and promises in the same flow
- Global error handler catches all unhandled errors; never leak raw stack traces to clients
- Validate all inputs at the boundary with Joi/Zod; sanitize before any DB query
- Use connection pooling for DB; never create new connections per request

### optimize
- Measure before optimizing: Core Web Vitals (LCP, FID/INP, CLS), bundle size, frame rate
- Images: WebP/AVIF, `srcset` + `sizes`, `loading="lazy"` for below-fold, CDN delivery
- Animate ONLY `transform` and `opacity` — never layout properties (width, height, top, left)
- Lazy-load routes and heavy components with dynamic imports
- Use `will-change: transform` sparingly — only right before animation, remove it after

### overdrive
- Invoke /impeccable FIRST — context determines what "extraordinary" means here
- MANDATORY: propose 2-3 directions with tradeoffs BEFORE writing any code; get user confirmation
- Use browser automation to visually verify — expect multiple iteration rounds; gap between "works" and "extraordinary" closes through iteration
- Functional UI "wow": View Transitions for dialogs, virtual scrolling for 100k+ rows, spring physics for drag/drop
- Visual UI "wow": scroll-driven reveals, shader backgrounds, cursor-responsive generative art

### polish
- Invoke /impeccable FIRST; polish is the LAST step — feature must be functionally complete first
- Discover the design system first: tokens, spacing scale, typography styles, component API
- Align with the design system: replace hard-coded values with tokens; eliminate custom duplicates
- Work through systematically: alignment, spacing, interaction states, copy consistency, edge cases (empty/error/loading)
- Calibrate effort to quality bar: MVP polish ≠ flagship polish

### quieter
- Invoke /impeccable FIRST — understand what's working and preserve it
- "Quieter" = refined and sophisticated, NOT boring or generic — think luxury, not laziness
- Reduce saturation or shift to sophisticated tones; never desaturate everything uniformly
- Keep very few elements bold; increase the CONTRAST between bold and quiet, don't flatten everything
- Remove decoration entirely before trying to tone it down; subtlety requires precision

### shadcn-ui
- shadcn/ui is NOT a component library — components live in YOUR codebase; install with `npx shadcn@latest add [component]`
- Use `list_components` / `get_component_metadata` MCP tools to discover available components BEFORE implementing custom ones
- Components go in `components/ui/`; `components.json` config updates on install
- Use Radix UI primitives — they handle ARIA, keyboard nav, and focus management automatically
- Check MCP tools for component demos before writing usage code from memory

### shape
- Invoke /impeccable FIRST — run Context Gathering Protocol
- This skill plans UX/UI ONLY — it does NOT write code; output is a design brief
- Phase 1 Discovery: purpose, users, success metrics, user mental state, content ranges, edge cases
- Phase 2 Design Brief: primary goal, navigation model, key screens/states, interaction patterns, visual direction
- Design brief is the handoff artifact to `/impeccable craft` or implementation skills

### svg-animation-engineer
- Output pure SVG code with complete XML header, `<defs>`, `<style>`, `<g>` groups — no preamble, direct code block only
- Visual style: Flat Design + Vector Illustration strictly; geometric shapes only (circles, capsules, Bezier curves); no realism
- Layer structure: foreground (hero/moving) + midground (terrain) + background (parallax) → 2.5D depth illusion
- Apply: secondary action (clothing/hair follow), overlapping action (`animation-delay` stagger), squash & stretch
- Palette: high contrast, medium saturation; soft linear gradient for background atmosphere

### typeset
- Invoke /impeccable FIRST
- Avoid invisible defaults: Inter, Roboto, Arial, Open Sans, system fonts — choose fonts that match brand personality
- Maximum 2-3 font families; strong weight contrast (900 vs 300, not 600 vs 400)
- Fixed `rem` scales for app UIs; fluid `clamp()` for marketing/content headings only
- Body text minimum 16px; line length 45-75ch; consult `reference/typography.md` in impeccable skill

### ui-ux-pro-max
- Use when task changes how a feature looks, feels, moves, or is interacted with
- Contains 50+ styles, 161 palettes, 57 font pairings, 161 product types, 99 UX guidelines, 25 chart types
- Covers 10 stacks: React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui, HTML/CSS
- Use shadcn/ui MCP for component search and examples when applicable
- Skip for: pure backend, API/DB-only, DevOps, or non-visual automation work

### vercel-react-best-practices
- Eliminate waterfalls: `Promise.all()` for independent async ops; start promises early, `await` late
- Bundle: import directly (avoid barrel files); use `next/dynamic` for heavy components; tree-shake aggressively
- Server-side: prefer Server Components; use `cache()` for deduplication; Suspense to stream content incrementally
- Client data fetching: use SWR or React Query; avoid raw `fetch` in `useEffect`
- Re-renders: use `React.memo`, `useCallback`, `useMemo` ONLY when profiling proves benefit — not preemptively

### video-motion-graphics
- Apply Disney 12 principles: squash/stretch, anticipation, follow-through, slow-in/out, arcs, secondary action
- NEVER use linear keyframes — master the Graph Editor; Easy Ease is the starting point, customize Bezier curves
- Stagger layer animation with offset; secondary elements continue 4-8 frames past primary stop
- 24fps = cinematic (motion blur essential); 30fps = broadcast; 60fps = digital-first
- `valueAtTime()` expressions for lag/follow-through; auto-orient rotation to path for natural arcs

### web-design-guidelines
- Fetch fresh guidelines EVERY time from: `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
- NEVER use cached or memorized rules — always fetch live before reviewing
- Apply ALL rules from the fetched guidelines to the specified files
- Output findings in terse `file:line` format as specified in the fetched guidelines
- If no files specified: ask user which files to review BEFORE fetching guidelines

## Project Conventions

No project-level convention files found (CLAUDE.md, AGENTS.md, .cursorrules, GEMINI.md) in this project root.
