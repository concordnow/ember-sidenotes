# Security policy

## Reporting a vulnerability

If you discover a vulnerability that affects consumers of this addon at runtime, please open a private report via GitHub Security Advisories on this repository rather than a public issue.

## Runtime surface

`ember-sidenotes` ships a small Ember addon. The consumer's application bundle includes the addon's own source (`addon/`) plus its declared runtime `dependencies`:

- `@ember/render-modifiers`
- `ember-cli-babel`
- `ember-cli-htmlbars`
- `ember-on-resize-modifier`

Some of those packages pull their own runtime dependencies into the consumer's bundle. The notable one is `ember-on-resize-modifier`, which depends on `ember-resize-observer-service` (the shared `ResizeObserver` instance) — it therefore also ships at runtime and is part of this surface.

Outside the addon's direct runtime dependencies and their runtime-shipped transitive deps, packages reported by `npm audit` belong to a developer's build/test/release tooling, not the application at runtime.

## Accepted dev-only advisories

The advisories listed below are documented as accepted because they live in dev/build/test tooling chains, not in the consumer's runtime bundle. State as of 2026-06-23: `npm audit` reports 14 advisories (3 high, 7 moderate, 4 low) and **none of them reach the runtime surface described above**.

Patching most of them requires either upgrading `ember-source` past `~3.28` (out of scope for this addon today) or overriding a deeply nested transitive with a version whose API breaks its immediate parent.

### High — test runner websocket stack

| Package | Path | Why not fixed |
|---|---|---|
| `ws` | `testem → socket.io → engine.io → ws` | Memory-exhaustion DoS. `ws` only runs inside the `testem` socket server during `ember test`. No attacker-controlled traffic on a developer machine; never shipped to consumers. |
| `engine.io`, `socket.io-adapter` | `testem → socket.io → …` | Same `testem` websocket stack. Bumping requires a newer `socket.io`/`testem` major than the Ember 3.28 test stack pins. |

### Moderate

| Package | Path | Why not fixed |
|---|---|---|
| `got`, `package-json`, `ember-try-config`, `ember-try` | `ember-try → ember-try-config → package-json@6 → got@9` | `got@11+` removed the callback API that `package-json@6` relies on. Overriding `got` breaks the ember-try matrix runner. |
| `ember-cli` | build toolchain | Pinned to the `~3.28` line; bumping out is the `ember-source` upgrade tracked below. |
| `js-yaml` | `ember-cli → js-yaml` | Quadratic-complexity DoS on merge keys; parses only repo-local config at build time. |
| `uuid` | `ember-cli → uuid` | Missing buffer bounds check in the `buf`-argument path, which the build tooling does not use. |

### Low — clean-css build chain

The 4 low-severity advisories all cascade from `clean-css <= 4.1.11` (ReDoS), pulled in by `broccoli-clean-css` / `clean-css-promise` / `ember-cli-preprocess-registry` at build time only. Patching requires a `broccoli-clean-css` major that the Ember 3.28 preprocess registry does not accept.

## Mitigations already in place

- `release-it@15` was bumped to `^19` to drop the entire `vm2` chain (15 critical advisories), then to `^20` to drop the `undici@6` chain (3 advisories — 1 high, 2 moderate).
- `npm overrides` pin safer versions across the tree: `@babel/core`, `@babel/runtime`, `ember-modifier`, `ansi-html`, `braces`, `markdown-it`, `micromatch`, `tmp`, and `undici`. The `tmp` override (`^0.2.6`) clears the former symlink-write advisory, and the `undici` override (`^7`) keeps the `release-it` chain off the vulnerable `undici@6` line.
- Node has been bumped to 20 LTS so the dev toolchain runs on a supported runtime.

The remaining advisories all sit in the `ember-cli@3.28` build/test toolchain. The 3 high advisories are confined to the `testem` websocket server used during `ember test`; they have appeared since the previous review and are accepted as dev/test-only, not silently ignored.

## Reviewing this list

The list above should be re-evaluated when any of the following happens:

- `ember-source` is bumped past `~3.28` (unblocks a large fraction of the cascades, including the `testem`/`socket.io` stack).
- A consumer reports a concrete exploit path against runtime code.
- A new `npm audit` advisory lands outside the dev/build/test chains documented above.
