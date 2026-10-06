<p align="center">
  <img src="./assets/logo.svg" width="96" alt="Slides logo" />
</p>

<h1 align="center">Slides</h1>

<p align="center"><strong>Lessons that move.</strong><br />Animated lesson decks you build in code and present in the browser.</p>

## Decks

| Deck | Path | Pages |
| --- | --- | --- |
| Flowcharts, Lesson 01 | [`slides/01-flow-charts`](./slides/01-flow-charts/index.tsx) | 17 |

## Getting started

```bash
bun install
bun run dev
```

Open `http://localhost:5173`, pick a deck, and press `F` to present.

| Command | Description |
| --- | --- |
| `bun run dev` | Dev server with hot reload |
| `bun run build` | Static build into `dist/` |
| `bun run preview` | Serve the built `dist/` locally |

## Presenting

- `→` / `Space` next step or page, `←` back, `F` fullscreen, `Esc` exit.
- Speaker notes live in each deck's `notes` export and show in presenter view.
- Export to PowerPoint from the **Download** menu (animations are not carried over).

## Adding a deck

Create `slides/<id>/index.tsx` that default-exports an array of page components. Every page renders on a fixed 1920 × 1080 canvas.

```tsx
import type { Page, SlideMeta } from '@open-slide/core';

const Cover: Page = () => <div style={{ width: '100%', height: '100%' }}>Hello</div>;

export const meta: SlideMeta = { title: 'My deck' };
export default [Cover] satisfies Page[];
```

See [`AGENTS.md`](./AGENTS.md) for the full authoring guide.

## Deploy

`vercel.json` and `netlify.toml` are preconfigured. Run `bunx vercel --prod`, or import the repo on Vercel or Netlify.

## Branding

The social preview image is `assets/og.png` (1200 × 630), copied into `dist/` by `bun run build`.


Built on [open-slide](https://open-slide.dev). The app name, tab title, favicon, sidebar logo and social preview tags are set by [`patches/@open-slide%2Fcore@2.0.1.patch`](./patches), which `bun install` applies automatically. Upgrading `@open-slide/core` means regenerating it with `bun patch @open-slide/core`.
