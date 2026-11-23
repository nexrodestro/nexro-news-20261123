# nexro-news-20261123 — Monday 23 November 2026 in one image

[![make.fun](https://img.shields.io/badge/make.fun-news--image--20261123-blue)](https://make.fun/c/news-image-20261123)
[![prize](https://img.shields.io/badge/prize-%24100%20top--50-green)](https://make.fun/c/news-image-20261123)
[![license](https://img.shields.io/badge/license-MIT-yellow)](https://github.com/nexrodestro/nexro-news-20261123/blob/main/LICENSE)

Entry for the [make.fun competition "Sum up 23 November's world news in one image"](https://make.fun/c/news-image-20261123) — $100 pot, top 50 paid. The program validates the shipped `entry.png` and stages its exact bytes to `/output/entry.png`.

## The image

**Monday 23 November 2026 — THE WORLD IN ONE DAY.** A dense newspaper poster with **40 stories across 7 regions** (World 7, Europe 7, Middle East 6, Asia-Pacific 7, Americas 6, Africa 4, Oceania 3), every one dated Monday 23 November 2026 and verified against the wires (Reuters, AP, AFP, Al Jazeera, Xinhua, Nature) read to 10:00 UTC that day.

The lead is the day's most consequential story: **COP31 collapses with no deal** — the Antalya climate talks end empty after the EU and ~130 parties reject a text with no fossil-fuel phase-out. Beside it: Russian strikes kill 15 in the Kyiv region, and the Democrats win 258 House seats, the largest majority for either party since 1992. Thirteen illustrated cards carry the day's biggest stories — a Russian corvette sunk off Libya, the AI sell-off that sank the Nikkei 5.06%, 24 dead in an Indonesia factory fire, Liverpool's 4–0 rout of Manchester United, Alcaraz's maiden ATP Finals title, and a Riemann hypothesis proof claim splitting mathematics — and 27 more stories fill the dense list below a pin map of where it all happened. A DATE CHECK box names the stories deliberately left out because they happened on other days, so nothing old is presented as 23 November news.

## How it runs

`main.ts` (Node 22, standard library only) locates `entry.png` beside itself, validates the whole PNG (signature, IHDR 1024×1024, every chunk's CRC, IEND present, ≤1 MiB), computes its sha256, copies the exact bytes to `MAKEFUN_OUTPUT_DIR` (default `/output`) as `entry.png`, then re-reads the staged copy and verifies it matches byte for byte. It exits non-zero on any failure. Both runs write identical bytes by construction.

## License

MIT — see [LICENSE](LICENSE).
