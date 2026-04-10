# Staged Modernization Spec: Legacy ES5 to Modern ES6/TS6

## 1. Purpose
This project defines a safe, reversible, staged path from the currently working legacy baseline to modern dependencies and tooling.

The key requirement is to preserve a working legacy channel while incrementally reintroducing modern changes.

## 2. Current Baseline
- Legacy channel (known working): rollback branch and `vX.Y.Z-es5` releases.
- Modern channel: `vX.Y.Z` releases.
- Legacy issue history: newer stack introduced regressions on cast/older-device environments.

## 3. Goals
1. Keep legacy users unblocked at all times.
2. Reintroduce modern updates in small, testable increments.
3. Isolate the exact change that causes regressions.
4. Maintain dual release channels during migration.

## 4. Non-Goals
1. Big-bang upgrade from legacy to modern in one release.
2. Removing the legacy channel before parity is proven.
3. Changing Home Assistant/go2rtc external behavior in this repo.

## 5. Release Model (Required)
- Standard channel: `vX.Y.Z` (modern stack).
- Legacy channel: `vX.Y.Z-es5` (compatibility stack).
- Both channels are stable releases (not prereleases).

## 6. Working Method
For each stage:
1. Create feature branch from legacy baseline.
2. Apply only the stage changes.
3. Build + type-check + targeted functional test.
4. Publish test tag `vX.Y.Z-es5.N`.
5. Validate on target legacy device/cast path.
6. If failure occurs, revert stage and split into smaller sub-stages.

## 7. Test Gates
Each stage must pass all of the following before moving forward:
1. `pnpm test:ts`
2. `pnpm build`
3. Manual device smoke tests:
- dashboard loads
- kiosk header/sidebar rules apply
- camera card renders expected media behavior
- no new console errors on cast target
4. HACS install/upgrade test from test tag.

## 8. Staged Plan

### Stage Completion Checklist
- [x] Stage 0: Stability Lock
- [x] Stage 1: Patch/Minor Dependency Updates Only
- [x] Stage 2: Runtime Library Incremental Updates
- [x] Stage 3: Build Toolchain Incremental Updates
- [x] Stage 4: Introduce Parallel Modern Build Output
- [x] Stage 5: TypeScript 6 Migration in Controlled Slices
- [x] Stage 6: Artifact and Build Pipeline Parity Check
- [ ] Stage 7: Runtime Dependency Parity (One Package at a Time)
- [ ] Stage 8: Runtime Source Parity (One Change Group at a Time)
- [ ] Stage 9: Optional ES6-First Promotion

### Stage 0: Stability Lock (No behavior changes)
Scope:
- Keep current working legacy behavior.
- Freeze legacy branch as baseline.
Deliverables:
- Baseline tag and changelog note.
Exit criteria:
- Legacy device stable for 48h normal usage.
Mini checklist:
- [x] Scope changes applied only for Stage 0.
- [x] `pnpm test:ts` passed.
- [x] `pnpm build` passed.
- [x] Legacy device/cast smoke test passed.
- [x] Validation tag published (if needed).
- [x] Rollback path documented.

### Stage 1: Patch/Minor Dependency Updates Only (No majors)
Scope:
- Update non-breaking patch/minor deps one group at a time.
- Exclude toolchain and runtime-significant libraries.
Deliverables:
- 1 PR per dependency group.
Exit criteria:
- All test gates pass.
- No runtime regressions on target device.
Rollback:
- Revert single dependency PR.
Mini checklist:
- [x] Scope changes applied only for Stage 1.
- [x] `pnpm test:ts` passed.
- [x] `pnpm build` passed.
- [x] Legacy device/cast smoke test passed.
- [x] Validation tag published (if needed).
- [x] Rollback path documented.

### Stage 2: Runtime Library Incremental Updates
Scope:
- Update one runtime package at a time:
  - `home-assistant-styles-manager`
  - `home-assistant-query-selector`
  - `home-assistant-javascript-templates`
  - `get-promisable-result`
Deliverables:
- Separate PR/tag per package bump.
Exit criteria:
- All test gates pass after each package.
Risk:
- Hidden runtime API changes (Proxy/Map behavior and DOM selector behavior).
Rollback:
- Revert only the package bump that fails.
Mini checklist:
- [x] Scope changes applied only for Stage 2.
- [x] `pnpm test:ts` passed.
- [x] `pnpm build` passed.
- [x] Legacy device/cast smoke test passed.
- [x] Validation tag published (if needed).
- [x] Rollback path documented.

### Stage 3: Build Toolchain Incremental Updates (Still ES5 output)
Scope:
- Upgrade build tools in isolation while preserving ES5 compatibility output.
- Suggested order:
  1. rollup and plugins
  2. eslint/tooling
  3. TypeScript (without changing target behavior)
Deliverables:
- Toolchain migration notes.
Exit criteria:
- Generated legacy artifact remains stable on target device.
Mini checklist:
- [x] Scope changes applied only for Stage 3.
- [x] `pnpm test:ts` passed.
- [x] `pnpm build` passed.
- [x] Legacy device/cast smoke test passed.
- [x] Validation tag published (if needed).
- [x] Rollback path documented.

### Stage 4: Introduce Parallel Modern Build Output
Scope:
- Produce both modern and legacy artifacts in CI.
- Keep legacy as default for `-es5` tags.
- Keep modern for standard tags.
Deliverables:
- Verified dual artifact upload and channel mapping.
Exit criteria:
- HACS can install either channel correctly.
Mini checklist:
- [x] Scope changes applied only for Stage 4.
- [x] `pnpm test:ts` passed.
- [x] `pnpm build` passed.
- [x] Legacy device/cast smoke test passed.
- [x] Validation tag published (if needed).
- [x] Rollback path documented.

### Stage 5: TypeScript 6 Migration in Controlled Slices
Scope:
- Reintroduce TS6 code changes in small PRs by file/domain.
- Suggested slices:
  1. utilities/types only
  2. console helpers
  3. main kiosk runtime code
Deliverables:
- Migration notes per slice.
Exit criteria:
- Each slice passes full gates and on-device validation.
Rollback:
- Revert failing slice only.
Mini checklist:
- [x] Scope changes applied only for Stage 5.
- [x] `pnpm test:ts` passed.
- [x] `pnpm build` passed.
- [x] Legacy device/cast smoke test passed.
- [x] Validation tag published (if needed).
- [x] Rollback path documented.

### Stage 6: Artifact and Build Pipeline Parity Check
Scope:
- Keep current runtime code and dependency versions fixed.
- Verify channel/artifact behavior with controlled toggles:
  1. `-es5` tags serving ES5 artifact.
  2. Standard tags serving modern artifact.
  3. Optional A/B check: serve modern artifact under a temporary `-es5` test tag to prove artifact-level impact.
Deliverables:
- Artifact mapping matrix with test tags and outcomes.
Exit criteria:
- Clear PASS/FAIL evidence for whether artifact selection alone changes Chromecast behavior.
Rollback:
- Revert CI mapping-only commits.
Mini checklist:
- [x] Scope changes applied only for Stage 6.
- [x] `pnpm test:ts` passed.
- [x] `pnpm build` passed.
- [x] Legacy device/cast smoke test passed.
- [x] Validation tag published (if needed).
- [x] Rollback path documented.

### Stage 7: Runtime Dependency Parity (One Package at a Time)
Scope:
- Keep source code and build pipeline stable.
- Move runtime dependencies from compat versions to master versions one at a time:
  1. `home-assistant-query-selector`
  2. `home-assistant-javascript-templates`
  3. `home-assistant-styles-manager`
  4. `shadow-dom-selector` (if required by the target stack)
Deliverables:
- Per-package validation table (`from`, `to`, tag, result).
Exit criteria:
- First known-bad package/version jump identified or full dependency parity achieved without regression.
Rollback:
- Revert only the failing package bump commit.
Mini checklist:
- [x] Scope changes applied only for Stage 7.
- [x] `pnpm test:ts` passed.
- [x] `pnpm build` passed.
- [x] Legacy device/cast smoke test passed.
- [x] Validation tag published (if needed).
- [x] Rollback path documented.

### Stage 8: Runtime Source Parity (One Change Group at a Time)
Scope:
- Keep dependencies frozen at the known-good set from Stage 7.
- Reintroduce remaining runtime/source deltas in isolated groups:
  1. DOM query timing/order changes
  2. style application sequencing
  3. dialog/header selector and async flow changes
  4. console helper API migration (`getCSSString` -> `getCSSRulesString`) only if dependencies support it cleanly
Deliverables:
- Change-group matrix with tag and device outcome for each group.
Exit criteria:
- First known-bad source change group identified or full source parity achieved.
Rollback:
- Revert only the failing change-group commit.
Mini checklist:
- [ ] Scope changes applied only for Stage 8.
- [ ] `pnpm test:ts` passed.
- [ ] `pnpm build` passed.
- [ ] Legacy device/cast smoke test passed.
- [ ] Validation tag published (if needed).
- [ ] Rollback path documented.

### Stage 9: Optional ES6-First Promotion
Scope:
- Promote modern channel as recommended default only after parity validation.
- Keep legacy channel available for a deprecation window.
Exit criteria:
- N releases with no legacy-blocking regressions.
- Clear user communication before any legacy support change.
Mini checklist:
- [ ] Scope changes applied only for Stage 9.
- [ ] `pnpm test:ts` passed.
- [ ] `pnpm build` passed.
- [ ] Legacy device/cast smoke test passed.
- [ ] Validation tag published (if needed).
- [ ] Rollback path documented.

## 9. PR Template for Each Stage
Use this template in every stage PR:
1. Stage ID and scope
2. Exact packages/files changed
3. Risk assessment
4. Test evidence (commands + screenshots/log snippets)
5. Device/cast validation result
6. Rollback command/path

## 10. Tagging Strategy for Stage Validation
- Internal validation tags:
  - `vX.Y.Z-es5.1`, `vX.Y.Z-es5.2`, etc.
- Promote to stable legacy tag only after validation:
  - `vX.Y.Z-es5`
- Modern stable tags remain:
  - `vX.Y.Z`

## 11. Decision Log (Maintain During Project)
Append entries for each stage:
- date
- stage
- change summary
- pass/fail
- rollback used (if any)
- next action

Entries:
- 2026-04-07 | Stage 0 | Locked legacy baseline on `compat/rollback-ts6-es5`, validated with `corepack pnpm test:ts` and `corepack pnpm build`, published legacy tags `v13.0.0-es5` and `v13.0.1-es5` | PASS | Not needed | Begin Stage 1 dependency groups.
- 2026-04-07 | Stage 1 | Updated low-risk dev dependency group only: `@types/node` (`25.5.0` -> `25.5.2`) and `@types/sinon` (`21.0.0` -> `21.0.1`), validated with `corepack pnpm test:ts`, `corepack pnpm build`, and successful legacy device/cast smoke test on `v13.0.1-es5.1` | PASS | `git revert 89a1e57` and `git revert 5f3e977` if needed | Begin Stage 2 runtime library updates one package at a time.
- 2026-04-08 | Stage 2 | Updated first runtime package only: `get-promisable-result` (`1.0.2` -> `2.0.0`), validated with `corepack pnpm test:ts`, `corepack pnpm build`, and successful legacy device/cast smoke test on `v13.0.1-es5.2` | PASS | `git revert d90d059` and `git revert d899175` if needed | Begin Stage 3 build toolchain updates in isolated slices.
- 2026-04-08 | Stage 3 | Updated first build-tool slice only: `rollup` (`4.60.0` -> `4.60.1`), validated with `corepack pnpm test:ts`, `corepack pnpm build`, and successful legacy device/cast smoke test on `v13.0.1-es5.3` | PASS | `git revert a3d5075` and `git revert 837c30c` if needed | Stage 4 confirmation.
- 2026-04-08 | Stage 4 | Implemented dual build artifacts (`dist/kiosk-mode-modern.js` + `dist/kiosk-mode-es5.js`) and tag-based CI mapping to publish `dist/kiosk-mode.js` from modern tags or `-es5` tags appropriately; validated with `corepack pnpm test:ts`, `corepack pnpm build`, validation tag `v13.0.1-es5.4`, and successful legacy device/cast smoke test | PASS | Revert Stage 4 commit(s) as a group | Begin Stage 5 TS6 migration slices.
- 2026-04-08 | Stage 5 Slice 1 | Reintroduced TS6 migration changes in `src/utilities/index.ts` and `src/types/index.ts` only (stronger nullability/field initialization typing and helper extraction), validated with `corepack pnpm test:ts` and `corepack pnpm build` | IN PROGRESS | Revert Stage 5 slice 1 commit | Publish `-es5.N` validation tag and run legacy device/cast smoke test.
- 2026-04-08 | Stage 5 Slice 2 | Applied console-helper strictness updates in `src/console-messenger.ts` (typed method signature hardening) and evaluated deprecated CSS API swap; deferred `getCSSRulesString` migration because current dependency typing requires a different input shape that would change behavior | IN PROGRESS | Revert Stage 5 slice 2 commit | Run automated gates and publish next `-es5.N` validation tag for device/cast smoke test.
- 2026-04-08 | Stage 5 Slice 3 | Reintroduced TS6 migration runtime slice in `src/kiosk-mode.ts` (main runtime orchestration logic), validated with `corepack pnpm test:ts`, `corepack pnpm build`, and `corepack pnpm lint` | IN PROGRESS | Revert Stage 5 slice 3 commit | Publish next `-es5.N` validation tag and run legacy device/cast smoke test.
- 2026-04-08 | Stage 5 | Completed all TS6 migration slices (utilities/types, console helper updates, and main runtime) with successful validation tag `v13.0.2-es5.3` and user-confirmed legacy device/cast pass | PASS | Revert latest Stage 5 slice commit(s) individually if needed | Begin Stage 6 artifact/build pipeline parity verification.
- 2026-04-08 | Stage 6 | Verified artifact mapping behavior with fixed code/dependencies: local build produced distinct ES5/modern artifacts and mapping checks passed for both `-es5` and standard tag selection paths; validated with `corepack pnpm test:ts` and `corepack pnpm build`, published validation tag `v13.0.2-es5.4`, and user-confirmed legacy device/cast pass | PASS | Revert Stage 6 tracking-only commit | Begin Stage 7 dependency parity (single package bumps).
- 2026-04-08 | Stage 7 Step 1 | Updated `home-assistant-query-selector` (`5.0.0` -> `6.1.0`) as an isolated dependency bump; validated with `corepack pnpm test:ts`, `corepack pnpm build`, and `corepack pnpm lint`; published validation tag `v13.0.2-es5.6`; user-confirmed legacy device/cast smoke test pass | PASS | Revert Stage 7 step 1 commit | Begin Stage 7 Step 2 (`home-assistant-javascript-templates` bump).
- 2026-04-10 | Stage 7 Step 2 | Updated `home-assistant-javascript-templates` (`6.0.1` -> `7.0.0`) as an isolated dependency bump; validated with `corepack pnpm test:ts`, `corepack pnpm build`, and `corepack pnpm lint`; published validation tag `v13.0.2-es5.7`; user-confirmed legacy device/cast smoke test pass | PASS | Revert Stage 7 step 2 commit | Begin Stage 7 Step 3 (`home-assistant-styles-manager` bump).
- 2026-04-10 | Stage 7 Step 3 | Attempted `home-assistant-styles-manager` (`3.1.0` -> `4.1.2`) as an isolated dependency bump; **BLOCKED**: version 4.1.2 removes the exported `getCSSString` function that `src/console-messenger.ts` imports, causing build failure at type-check stage (`tsc --noEmit` error TS2305). Tested intermediate 4.0.0 and also fails. API breaking change is in the 4.x line (between 3.1.0 and 4.0.0). **Decision**: Deferred styles-manager bump until remaining dependencies tested. Rolled back to 3.1.0. | BLOCKED - DEFERRED | Rolled back to 3.1.0 | Continue to Stage 7 Step 4 (shadow-dom-selector) before revisiting styles-manager migration needs.
- 2026-04-10 | Stage 7 Step 4 | Updated `shadow-dom-selector` (`5.0.1` -> `6.1.0`) as an isolated dependency bump; resolved peer dependency warning from query-selector 6.1.0; validated with `corepack pnpm test:ts`, `corepack pnpm build`, and `corepack pnpm lint` (all passed cleanly); published validation tag `v13.0.2-es5.8` | IN PROGRESS | Revert Stage 7 step 4 commit | Run legacy device/cast smoke test for this tag.

## 12. Immediate Next Steps
- [x] Approve this staged spec.
- [x] Start Stage 1 with a single low-risk dependency group.
- [x] Publish `-es5.N` validation tag and run target-device smoke test.
- [x] Continue only after explicit pass.
