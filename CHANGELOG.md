# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **BREAKING:** Drop support for Node < 20. Minimum is now `^20.9.0 || >=22.0.0`
- Migrate linting toolchain to ESLint 9 flat config and Prettier 3
- Upgrade `ember-try` to v4 for Node 20 compatibility
- Upgrade dev dependencies: `@embroider/test-setup` v2, `ember-resolver` v10, `ember-qunit` v6
- Bump `release-it` to v20 (drops the `undici@6` and `vm2` chains)

### Added

- `SECURITY.md` documenting accepted dev-only advisories
- CI concurrency control to cancel in-progress runs on the same branch
- Test coverage for `notes-placement` edge cases (`offsetY=0` short-circuit, `activeNoteId` fallback) and `@gutter` propagation in `sidenotes-wrapper`

### Security

- Pin vulnerable transitive dependencies via `package.json` `overrides` (`ansi-html`, `braces`, `markdown-it`, `micromatch`, `@babel/runtime`)
- Bump `qs` to 6.15.2

## [1.3.1] - 2022-08-11

### Fixed

- Fix performance bottleneck when many notes are displayed

## [1.3.0] - 2022-03-28

### Fixed

- Fix reacting to offsetY changes while using @key argument on the wrapper

## [1.2.0] - 2021-12-07

### Fixed

- Fix version mistake (uncompleted v1.1.0 published)
- Fix preventing resize for absent item

## [1.1.0] - 2021-12-06

- Triggers placement on @items change
- Add key argument passed to #each helper
- Keep @items ordering in sidenotes display

## [1.0.0] - 2021-11-22

### Added

- First implementation

[unreleased]: https://github.com/concordnow/ember-sidenotes/compare/v1.3.1...HEAD
[1.3.1]: https://github.com/concordnow/ember-sidenotes/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/concordnow/ember-sidenotes/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/concordnow/ember-sidenotes/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/concordnow/ember-sidenotes/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/concordnow/ember-sidenotes/compare/null...v1.0.0
