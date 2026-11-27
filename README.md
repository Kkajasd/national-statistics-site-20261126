# NusaStats — Indonesia in numbers

[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/Kkajasd/national-statistics-site-20261126/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/Kkajasd/national-statistics-site-20261126/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

A working national statistics site for Indonesia: population, economy, people and regions, built from published official figures (BPS — Statistics Indonesia, World Bank, APJII). Static files under `app/` — no build step, no network requests. Open `app/index.html` in a browser, or run `node serve.ts` and visit http://localhost:8080.

## Sections

- **Overview** — headline indicators plus a switchable GDP / population chart
- **Economy** — year selector (2019–2024), growth chart, sectors, trade
- **Population** — population trend, age structure, where people live
- **People** — life expectancy, literacy, schooling, HDI, poverty and unemployment trends
- **Regions** — searchable table of the ten most populous provinces
- **Sources & methods** — where every number comes from

## Handing it in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the vendored `vendor/makefun-frontend.ts` library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Screenshots in `screenshots/` are real renders of the site (see `shots.json` for the views), taken with `tools/shoot.mjs` against the headless shell.
