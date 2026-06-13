# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GitHub Pages site hosting a shogi (Japanese chess) coordinate training game. The entire application is a single file: `index.html`.

## Development

No build step or package manager. Open `index.html` directly in a browser to run locally:

```bash
# Quick local server if needed
python3 -m http.server 8080
```

Deploy by pushing to the `main` branch — GitHub Pages serves it automatically.

## Architecture

Everything lives in `index.html`:

- **CSS** — dark theme (`#121212`), 9×9 grid via CSS Grid, cell flash animations for correct/wrong feedback, flying chick emoji animation (`@keyframes fly-away`) triggered every 10 correct answers
- **JS** — no frameworks, no dependencies
  - `createGrid()` — builds 81 clickable cells; columns run right-to-left (将棋の筋: 9→1 left-to-right on screen)
  - `generateNewQuestion()` — picks random `(x, y)` and displays as `{数字}{漢数字}` (e.g. `５三`)
  - `handleCellClick(x, y, element)` — checks answer, updates score, triggers chick effect at multiples of 10
  - `triggerChickEffect()` — spawns 30 `🐣` elements with randomized CSS custom property trajectories

## Coordinate System

Shogi columns (筋) are numbered 9→1 right-to-left; rows (段) use kanji 一〜九 top-to-bottom. The grid is rendered with `x` iterating `9` down to `1` per row so column 9 appears on the left as in standard shogi notation.
