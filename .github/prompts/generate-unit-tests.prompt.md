# Generate Unit Tests for Groot-Based WordPress Projects

You are generating PHPUnit unit tests for a WordPress project built on the Groot theme.

Groot is the base theme used across many projects, and most projects include shared post and framework code from the `lib` directory. Many project post types are thin wrappers over existing Conifer post types, so test scope must focus on new behavior only.

## Goals

-   Produce practical, maintainable unit tests with strong coverage of project-specific behavior.
-   Follow existing conventions in the project test suite.
-   Prefer WP_Mock-based tests over heavier integration-style approaches whenever possible.
-   Keep test runtime lean.

## Required Context Gathering

Before writing tests, inspect these locations in this order:

1. `test/unit`
2. `lib`
3. `vendor/sitecrafting/conifer/test/unit` (primary Conifer reference tests)
4. `vendor/sitecrafting/test/unit` (fallback for projects with older/different vendor structure)

Notes:

-   The local `test/unit` directory may not provide enough examples on its own.
-   When searching under `vendor`, include ignored files so `.gitignore` entries (such as `/vendor`) do not hide reference tests.
-   Conifer tests should be used as a pattern source for style, naming, and mocking approaches.
-   Prefer `vendor/sitecrafting/conifer/test/unit`. If it is missing, check `vendor/sitecrafting/test/unit` next.
-   If neither Conifer path exists, call that out explicitly and continue by using the best available local patterns.

## Scope Rules

Focus tests on functionality added by the project code, not behavior already covered by parent classes.

Good candidates include:

-   Custom post type registration args
-   Custom taxonomy/term registration
-   Hook registration (`add_action`, `add_filter`)
-   Ajax handlers and callback behavior
-   Small project-specific helper logic
-   Any custom behavior added in constructors or overridden methods

Avoid re-testing inherited Conifer or WordPress core behavior unless project code changes it.

## Testing Style and Patterns

-   Match namespace and structure conventions used in `test/unit`.
-   Reuse shared base test classes when available (for example, extending the project `Base` class).
-   Use clear method names describing behavior (`test_x_should_y`).
-   Keep tests small and focused on one behavior each.
-   Add concise docblocks/comments where they improve readability.

When testing protected/internal behavior, prefer lightweight test spies/subclasses consistent with existing suite patterns.

## Mocking Strategy (WP_Mock First)

Always try WP_Mock first.

-   Mock WordPress functions and hooks with WP_Mock.
-   Assert hook registration where relevant.
-   Use function expectations for WP helpers (URLs, escaping, translations, etc.) when behavior depends on them.

If WP_Mock is not viable for a specific case, explain why and use the lightest alternative that keeps tests deterministic.

## Complexity Gate

If the requested tests require heavy setup or are likely to be slow/fragile (for example: deep integration concerns, complex environment bootstrapping, filesystem/network side effects, or highly coupled legacy code), pause and ask the user whether to proceed.

When asking, explain:

-   Why the scenario is complex
-   What tradeoff is expected (time, brittleness, lower signal)
-   A lighter alternative (for example: limiting to hook/registration assertions only)

## Output Requirements

When you respond with generated tests:

1. Briefly summarize what behaviors are covered and what is intentionally out of scope.
2. Provide complete test file contents.
3. Mention any assumptions or unresolved uncertainties.
4. Include run instructions for this project using Lando tooling.

### Test Run Instructions

After generating tests, report how to run them. Prefer:

-   `lando unit` for standard unit tests
-   `lando unit-multisite` if multisite-specific behavior is tested

If needed, verify available commands from `.lando.yml` and report the closest correct command.

## Quality Bar

-   Tests should be consistent with existing project conventions.
-   Assertions should validate behavior, not just implementation details.
-   Keep fixture/setup minimal.
-   Favor readability and long-term maintainability over cleverness.
