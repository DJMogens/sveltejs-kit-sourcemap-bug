# SvelteKit Remote Functions Sourcemap Bug

Minimal reproduction for a bug where `vite-plugin-sveltekit-remote` produces broken sourcemaps.

The plugin's `transform` hook modifies `.remote.*` files but doesn't return a `map` property, causing Vite to lose the sourcemap chain entirely. The resulting `.map` files have `sources: []`, empty `sourcesContent`, and semicolon-only `mappings`.

## Reproduce

```sh
npm install
```

### 1. See the bug

```sh
npm run build:bug
```

You'll see warnings like:

```
[plugin vite-plugin-sveltekit-remote] Sourcemap is likely to be incorrect: a]plugin (vite-plugin-sveltekit-remote)
failed to generate a sourcemap for src/lib/example.remote.ts with id src/lib/example.remote.ts.
```

Inspect the broken sourcemap:

```sh
cat .svelte-kit/output/server/chunks/example.remote.js.map
```

You'll see `"sources":[]`, `"sourcesContent":[]`, and only semicolons in `"mappings"`.

### 2. See the fix

```sh
npm run build:fix
```

No warnings. Inspect the fixed sourcemap:

```sh
cat .svelte-kit/output/server/chunks/example.remote.js.map
```

Now has proper `sources`, `sourcesContent`, and real VLQ mappings.

## What the patch does

See `patches/@sveltejs+kit+2.53.4.patch`:

- **SSR path**: Uses `MagicString` (already a dependency) instead of bare string concatenation, returns `{ code, map }` with a proper sourcemap
- **Client path**: Adds `map: { mappings: '' }` to signal an intentional full replacement (no original code preserved)

## Key files

- `src/lib/example.remote.ts` — Remote function file (the file that triggers the bug)
- `src/routes/+page.svelte` — Page that imports the remote function
- `svelte.config.js` — Enables `experimental.remoteFunctions`
- `vite.config.js` — Enables `build.sourcemap` (required to generate `.map` files)
- `patches/@sveltejs+kit+2.53.4.patch` — The fix
