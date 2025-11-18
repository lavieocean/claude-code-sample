# Theme system design
## 5 visual styles for life weeks visualizer

---

## Design philosophy

Each theme should be immediately recognizable and emotionally distinct. Not just color swaps - each is a complete visual language that changes how you feel about your time.

---

## Theme 1: Apple (默认)
**Essence:** "Designed by Apple in California"

**Color palette:**
```
Background: #f5f5f7 (Apple's signature light gray)
Text: #1d1d1f (near black)
Text light: #86868b (gray)
Lived weeks: #0071e3 (Apple blue)
Remaining weeks: #f5f5f7 with subtle border
Current week: #06c (darker blue)
Accent: Gradient shimmer
```

**Typography:**
- San Francisco (via -apple-system)
- Weight: 400-600
- Letter spacing: -0.02em (tight, modern)

**Grid style:**
- Border radius: 3px (Apple's signature roundness)
- Subtle shadow on lived weeks: `0 1px 3px rgba(0,0,0,0.1)`
- Smooth animations (ease-out curves)
- Breathing space between squares

**Special effects:**
- Glassmorphism header (blurred background)
- Gradient on hover
- Smooth scale transitions

**Mood:** Premium, calm, trustworthy

---

## Theme 2: Alessi
**Essence:** "Where art meets function" - Italian playful design

**Color palette:**
```
Background: #fffef8 (warm cream)
Text: #2d2d2d
Lived weeks: Rotating bright colors!
  - #ff6b6b (red)
  - #4ecdc4 (turquoise)
  - #ffe66d (yellow)
  - #a8e6cf (mint)
Remaining weeks: #fff8e7
Current week: #ff006e (magenta)
```

**Typography:**
- Rounded sans-serif
- Playful weights
- Slightly loose spacing

**Grid style:**
- Variable border radius (8px-12px, slightly organic)
- Lived weeks get random colors from palette
- Thicker borders (2px)
- Slight rotation on hover (-2deg to 2deg)

**Special effects:**
- Each lived week is a different bright color (random from palette)
- Whimsical hover effects (bounce)
- Hand-drawn feel to borders

**Mood:** Joyful, optimistic, human

---

## Theme 3: Bauhaus
**Essence:** "Form follows function" - German rationalism

**Color palette:**
```
Background: #ffffff (pure white)
Text: #000000 (pure black)
Primary colors only:
  - Red: #e63946
  - Blue: #457b9d
  - Yellow: #f1faee
Lived weeks: #000000 (black)
Remaining weeks: #ffffff with thick black border
Current week: #e63946 (red accent)
```

**Typography:**
- Geometric sans-serif
- Weight: 700 (bold, confident)
- All caps for headers
- Grid-based alignment

**Grid style:**
- Perfect squares (no border radius)
- Thick borders (3px solid black)
- High contrast
- Precise alignment
- No shadows

**Special effects:**
- Primary color accents appear on decade markers
- Geometric shapes overlay
- Grid lines visible

**Mood:** Rational, bold, modernist

---

## Theme 4: Wabi-sabi (Japanese Zen)
**Essence:** "Beauty in imperfection" - Japanese philosophy

**Color palette:**
```
Background: #f9f7f4 (rice paper)
Text: #3d3d3d (ink)
Text light: #9d9d9d
Lived weeks: #2d2d2d (墨 - sumi ink)
Remaining weeks: #f5f3f0 (washi paper)
Current week: #8b7355 (bamboo)
Accent: #d4c5b9 (sand)
```

**Typography:**
- Serif font (Georgia, elegant)
- Light weight (300)
- Generous line height (1.8)
- Calm, spacious

**Grid style:**
- Soft edges (2px radius)
- Watercolor-like lived weeks (opacity variation)
- Textured background (subtle grain)
- Organic spacing (slightly irregular)

**Special effects:**
- Brush stroke texture on lived weeks
- Faded edges (like ink bleeding)
- Subtle paper texture background
- Haiku-like quote

**Mood:** Contemplative, peaceful, transient

---

## Theme 5: Brutalist
**Essence:** "Honest materials" - Raw and unpolished

**Color palette:**
```
Background: #e8e8e8 (concrete)
Text: #000000 (pure black)
Text light: #666666
Lived weeks: #000000 (solid black)
Remaining weeks: #cccccc (raw concrete)
Current week: #ff0000 (danger red)
Accent: #333333
```

**Typography:**
- Monospace (Courier New, Menlo)
- All weights 400 (no variation)
- Uppercase labels
- Terminal-like

**Grid style:**
- No border radius (sharp corners)
- Irregular gaps (1px-4px random)
- No smooth transitions (instant)
- Pixelated/aliased edges
- Heavy borders (3px)

**Special effects:**
- Glitch effect on current week
- Raw, unfiltered aesthetic
- Visible grid structure
- Harsh shadows (hard edges)
- System error aesthetic

**Mood:** Raw, honest, confrontational

---

## Implementation plan

### 1. CSS architecture
```css
/* Base variables (Default/Apple) */
:root {
  --theme-bg: #f5f5f7;
  --theme-text: #1d1d1f;
  /* ... */
}

/* Theme overrides */
.theme-alessi {
  --theme-bg: #fffef8;
  --theme-text: #2d2d2d;
  /* ... */
}
```

### 2. Theme switcher UI
```
┌─────────────────────────────┐
│ Choose a style:             │
│ ○ Apple   ○ Alessi          │
│ ○ Bauhaus ○ Wabi-sabi       │
│ ○ Brutalist                 │
└─────────────────────────────┘
```

Options:
- Radio buttons with preview icons
- Dropdown with visual previews
- Icon grid (most visual)

**Recommendation:** Icon grid with mini previews

### 3. Theme persistence
- localStorage: Save user's theme preference
- Apply on page load
- Include in exported image

### 4. Export integration
Each theme exports with:
- Same color scheme
- Same typography
- Theme name in small text (bottom)

---

## User flow

1. User visualizes life (any input method)
2. Sees default theme (Apple)
3. Clicks theme selector
4. Previews live change
5. Exports with chosen theme

---

## Technical considerations

### Performance
- All themes use CSS variables (fast switching)
- No image assets (pure CSS)
- Smooth transitions (except Brutalist)

### Accessibility
- Sufficient contrast in all themes
- Color is not sole indicator
- Keyboard navigation for theme switcher

### Mobile
- Theme picker collapses to dropdown on mobile
- Touch-friendly targets (48px min)

---

## Success metrics

**Visual diversity:** Can you identify theme in 1 second?
**Emotional resonance:** Does each theme evoke distinct feeling?
**Shareability:** Do people want to share different themes?

If yes to all three = success.
