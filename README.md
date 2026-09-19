# 🎂 Happy Birthday Mummy!

A torn-paper collage zine, made for Mummy's birthday on **September 21st**.

No frameworks, no build step — just open `index.html` and it works.

## ✨ What's inside

- 📜 **Torn-paper collage style** — ragged clip-path edges, layered paper,
  washi tape, a recycled-paper grain overlay and marker/handwritten type
- 🎨 **Peach, terracotta & sage** palette on a warm "desk" background
- 📸 **Polaroid gallery** — 6 taped frames you drop photos into
- 🎵 **Birthday melody** — "Happy Birthday" as a soft music-box tone
  (Web Audio API), played from the paper sticker in the top-right
- 🎊 **Paper-scrap confetti & floating paper balloons** — canvas animation
- 💛 **Short wishes on loose paper scraps** — no long letter, just love
- 📱 **Responsive** + respects `prefers-reduced-motion`

## 🚀 Opening it

Just double-click `index.html`, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## 📁 Files

```
├── index.html     # Page structure — all the text lives here
├── styles.css     # Paper textures, torn edges, tape, animations
├── script.js      # Confetti, balloons, melody, photo loading
├── photos/        # Drop photo-1.jpg … photo-6.jpg in here
└── README.md      # This file
```

## 💝 Customisation

| What | Where |
|---|---|
| Wishes & captions | the text inside `index.html` |
| Photos | `photos/` — see `photos/README.md` |
| Colours | the `:root` variables at the top of `styles.css` |
| Torn edge shapes | `.torn-a`, `.torn-b`, `.torn-scrap` in `styles.css` (note: `clip-path` shapes are cut, so if an edge eats your text, add padding) |
| Melody | the `MELODY` array in `script.js` |

> ⚠️ A `clip-path` also clips `box-shadow`, which is why shadows live on the
> outer `.torn-wrap` as a `drop-shadow` filter instead.

## 🌐 Hosting on GitHub Pages

1. Push these files to a repo (branch `main`)
2. **Settings → Pages**
3. Source: **Deploy from a branch** → `main` → `/ (root)` → **Save**
4. Live at `https://YOUR_USERNAME.github.io/YOUR_REPO/`

---

*Made with ♥ + paper scraps.*
