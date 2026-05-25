# Security policy

## Reporting a vulnerability

If you discover a vulnerability that affects consumers of this addon at runtime, please open a private report via GitHub Security Advisories on this repository rather than a public issue.

## Runtime surface

`ember-sidenotes` ships a small Ember addon. The consumer's application bundle only includes the addon's own source (`addon/`) plus its declared runtime `dependencies`:

- `@ember/render-modifiers`
- `ember-cli-babel`
- `ember-cli-htmlbars`
- `ember-resize-observer-modifier`

Vulnerabilities reported by `npm audit` against transitive packages outside this list affect a developer's build/test/release environment, not the application at runtime.

## Accepted dev-only advisories

The advisories listed below are documented as accepted because they live in dev-time tooling chains that cannot be patched without either upgrading `ember-source` past `~3.28` (out of scope for this addon today) or breaking an internal API contract in the dependency tree. State as of 2026-05-25.

### Moderate

| Package | Path | Why not fixed |
|---|---|---|
| `got` | `ember-try-config@4 → package-json@6 → got@9` | `got@11+` removed the callback API that `package-json@6` relies on. Overriding `got` breaks the ember-try matrix runner. |
| `package-json`, `ember-try-config`, `ember-try` | Same chain | All trace back to the `got@9` exposure above. |

### Low (37)

The 37 low-severity advisories are mostly cascades from three root causes inside the Ember 3.28 build toolchain:

- `tmp <= 0.2.3` (symlink arbitrary write) — pulled in by `can-symlink`, `watch-detector`, `external-editor`, and `fixturify-project`. None of these run with attacker-controlled input on a developer machine.
- `clean-css <= 4.1.11` (ReDoS) — used by `broccoli-clean-css`/`ember-cli-preprocess-registry` at build time only.
- `ember-cli-babel@7` deprecation cascade — flagged because `ember-cli-babel@8` exists, but `@8` requires `ember-source@>=4`. We stay on `~3.28`.

Patching any of these requires either upgrading `ember-source` (out of scope) or overriding deeply nested transitives with a version whose API breaks the immediate parent. The practical exploit surface for these advisories on a developer's machine is negligible.

## Mitigations already in place

- `release-it@15` was bumped to `^19` to drop the entire `vm2` chain (15 critical advisories), then to `^20` to drop the `undici@6` chain (3 advisories — 1 high, 2 moderate).
- `npm overrides` pin safer versions of `braces`, `micromatch`, `ansi-html`, `markdown-it`, and `@babel/runtime` in the tree.
- Node has been bumped to 20 LTS so the dev toolchain runs on a supported runtime.

After the `release-it@20` bump, `npm audit` reports 0 high advisories. Remaining advisories sit in the `ember-cli@3.28` toolchain (moderate: `uuid`, `got`, `qs`, `ws`; low: `tmp`, `clean-css`, plus `ember-cli-babel@7` deprecation cascades).

## Reviewing this list

The list above should be re-evaluated when any of the following happens:

- `ember-source` is bumped past `~3.28` (unblocks a large fraction of the cascades).
- A consumer reports a concrete exploit path against runtime code.
