# The World in One Day — Monday 23 November 2026

[![make.fun](https://img.shields.io/badge/make.fun-competition-blue)](https://make.fun)
[![make.fun](https://img.shields.io/badge/make.fun-news--image-green)](https://make.fun)
[![make.fun](https://img.shields.io/badge/make.fun-23--nov--2026-orange)](https://make.fun)

Competition: [Sum up 23 November's world news in one image](https://make.fun) — $100 pot, top 50 paid. Deadline Tuesday 25 November 2026, 00:00 UTC.

## This entry

One dense newspaper poster — **40 stories, 7 regions, every one dated Monday 23 November 2026** — built from a full-day refresh of the wires (read to 23:00 UTC 24 November), not the morning's first draft of the day.

The lead changed with the full day: the morning build led with the COP31 collapse, but that collapse happened on Sunday 22 November. The day's real story, confirmed on Monday itself, was **Jensen Huang's return to Nvidia** — reinstated as CEO eleven days after resigning in a spy scandal, with the shares soaring 31.5% in the biggest one-day gain ever for a US company, worth about $950 billion, dragging the Nasdaq up 6.5% with it. Around it: the Kyiv region toll rising to 15 as rescuers dug through the Dymer flats, and Zelensky claiming the sinking of a Russian corvette off Libya.

The poster follows the dense template: masthead count, huge date title, six real numbers from the day, a UTC timeline, 3 big illustrated cards, 10 medium cards, a schematic world map with numbered pins, and 27 more stories in a dense list. A DATE CHECK box states the verification method and names three big stories deliberately left out because they belong to Sunday 22 November.

## Files

- `entry.png` — the poster, 1024x1024, under 1 MiB
- `main.ts` — the entrypoint (Node 22, standard library only): validates the PNG and stages its exact bytes
- `draw.py` — the build script that drew the poster (PIL, deterministic)
- `REPORT-refresh.md` — the full build report: all 40 stories with sources, region counts, stats, and verification

## License

MIT — see `LICENSE.md`.
