# 📸 Put Mummy's photos here

The gallery on the page has 6 frames. Drop your photos into **this folder**
using exactly these filenames, and they'll appear automatically:

```
photos/photo-1.jpg
photos/photo-2.jpg
photos/photo-3.jpg
photos/photo-4.jpg
photos/photo-5.jpg
photos/photo-6.jpg
```

## Notes

- **Square photos look best** — the frames are cropped to a 1:1 square.
- **Any size works**, but keep each file under ~500 KB so the page loads fast.
- Using `.png` or `.webp` instead? Update the `src` in `index.html`
  (search for `photo-1.jpg`).
- **Any frame you leave empty** just shows a dashed "photo 1" placeholder —
  nothing breaks, so you can start with 2 photos and add the rest later.
- Want more than 6? Copy a `<figure class="polaroid">` block in `index.html`
  and bump the number.

## Captions

The handwritten caption under each photo is edited in `index.html` —
look for the `<figcaption>` lines (`us, always`, `that summer`, etc.).
