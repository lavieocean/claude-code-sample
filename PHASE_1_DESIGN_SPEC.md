# Phase 1 design specifications
## Features 1, 2, 3 - Detailed planning

---

## Feature 1: Highlight current week

### Goal
Make the present moment tangible. Show "You are here" in the ocean of weeks.

### Visual design options

#### Option A: Pulsing ring (推荐)
```
Visual:
- Thin ring around current week square (2px)
- Color: --color-accent (#4a4a4a)
- Animation: Subtle scale pulse (1.0 → 1.1 → 1.0)
- Duration: 2s ease-in-out, infinite
- Opacity: 0.8

Why:
- Catches eye without screaming
- Elegant, not distracting
- Works on both lived/remaining squares
```

#### Option B: Glowing effect
```
Visual:
- Box-shadow: 0 0 12px rgba(74, 74, 74, 0.4)
- No animation
- Slightly larger square (1.2x)

Why:
- More subtle
- Better for screenshots
- Less CPU intensive
```

#### Option C: Label overlay
```
Visual:
- Small arrow pointing to current week
- Text: "Now" or "You are here"
- Appears on hover over grid

Why:
- Clearest communication
- No visual clutter when not needed
- Respects minimalism
```

**我的推荐：Option A + C 组合**
- 默认显示微妙的脉搏环
- Hover 整个网格时显示 "Week 1,789 - You are here" 标签
- 移动端：轻触网格显示标签 3 秒后淡出

### Interaction details

**Desktop:**
1. Current week always has pulsing ring
2. Hover any week → Shows tooltip: "Week [number]"
3. Hover current week → Shows: "Week [number] - You are here"
4. Hover past weeks → Shows: "[X] weeks ago"
5. Hover future weeks → Shows: "[X] weeks remaining"

**Mobile:**
1. Current week has ring (no pulse to save battery)
2. Tap any week → Shows info for 2 seconds
3. Double-tap current week → Zoom to that area (optional)

### Edge cases

**Case 1: User is very young (< 1 year old)**
- Current week is in top-left corner
- Still show ring, but may be less visible
- Solution: Ensure ring is 3px on mobile for babies

**Case 2: User is very old (> 90 years)**
- Current week is beyond the grid
- Solution: Show message below grid:
  "You've lived beyond our 90-year grid. You're [X] weeks into bonus time."
- Extend grid dynamically to show actual age

**Case 3: User enters today as birthday**
- Current week = Week 0
- Show: "Week 0 - Your first week of life"

### Technical implementation

```javascript
// Calculate current week
const currentWeek = calculateWeeks(birthdate);

// Add class to current week square
const currentWeekEl = document.querySelector(`.week:nth-child(${currentWeek + 1})`);
if (currentWeekEl) {
    currentWeekEl.classList.add('current-week');
}

// CSS
.week.current-week {
    position: relative;
    animation: pulse 2s ease-in-out infinite;
}

.week.current-week::after {
    content: '';
    position: absolute;
    inset: -2px;
    border: 2px solid var(--color-accent);
    border-radius: 2px;
    pointer-events: none;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}
```

### Visual mockup (ASCII)
```
Grid view:
┌─┬─┬─┬─┬─┬─┬─┐
├─┼─┼─┼─┼─┼─┼─┤  ← Lived weeks (dark)
├─┼─┼─┼─┼─┼─┼─┤
├─┼─┼─┼╔═╗┼─┼─┤  ← Current week (pulsing ring)
├─┼─┼─┼║●║┼─┼─┤
├─┼─┼─┼╚═╝┼─┼─┤
├─┼─┼─┼─┼─┼─┼─┤  ← Remaining weeks (light)
└─┴─┴─┴─┴─┴─┴─┘
```

---

## Feature 2: Save as image

### Goal
Let people keep their life grid. Print it, share it, frame it. No friction.

### Visual design options

#### Option A: Clean export (推荐)
```
Image contents:
┌─────────────────────────────────┐
│                                 │
│  Life in weeks                  │  ← Title (subtle)
│                                 │
│  [THE GRID]                     │  ← Full grid with current week highlighted
│                                 │
│  1,789 weeks lived              │  ← Key stat
│  2,891 weeks remaining          │
│                                 │
│  32 years old                   │  ← Age (small, corner)
│                                 │
└─────────────────────────────────┘

Specs:
- Size: 1200x1600px (good for print & screen)
- Background: white (#ffffff)
- No URL, no branding
- Clean margins (60px all sides)
- Typography: Same as web
```

#### Option B: Minimal export
```
Just the grid:
- Pure grid, no text
- Square format (1200x1200px)
- User decides context

Why:
- Ultimate minimalism
- Versatile (can add own text)
- Smallest file size
```

#### Option C: Annotated export
```
Grid + annotations:
- Shows age ranges (0, 10, 20...90 years on Y-axis)
- Months on X-axis (subtle)
- More "scientific" look

Why:
- Easier to understand for others
- Good for sharing
- Educational
```

**我的推荐：Option A 作为默认，提供 Option B 作为选项**

User choice:
- [ ] Include statistics (default: checked)
- [ ] Minimal mode (grid only)

### Interaction details

**Button placement:**
- Below the grid, next to "Start over" button
- Icon: ⬇ Download
- Text: "Save as image"

**Click behavior:**
1. Button click → Instant feedback (button text: "Saving...")
2. Generate image using canvas
3. Auto-download as: `life-in-weeks-[age]years.png`
4. Button text returns: "Save as image"
5. No confirmation dialog (clean UX)

**Mobile:**
- Same button
- Downloads to phone's gallery
- Works in all mobile browsers

### Edge cases

**Case 1: Browser doesn't support canvas**
- Fallback: Show message: "Please use a modern browser to save images"
- Offer alternative: "Take a screenshot instead"

**Case 2: Download blocked by browser**
- Try alternative method (open in new tab)
- Show instruction: "Right-click → Save image as..."

**Case 3: User has very custom screen (ultra-wide, etc.)**
- Always generate standardized 1200x1600px
- Don't match screen size

### Technical implementation

**Library choice:**
- Option A: `html2canvas` (easy, but heavy ~140KB)
- Option B: Native canvas API (light, more control)
- **Recommendation: Option B** (keep it light)

**Steps:**
```javascript
async function saveAsImage(includeStats = true) {
    // 1. Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');

    // 2. White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1200, 1600);

    // 3. Draw title
    ctx.fillStyle = '#2a2a2a';
    ctx.font = '32px -apple-system, sans-serif';
    ctx.fillText('Life in weeks', 60, 100);

    // 4. Draw grid
    const gridSize = 1080; // Square grid
    const cols = 52;
    const cellSize = gridSize / cols;
    const startX = 60;
    const startY = 200;

    for (let i = 0; i < TOTAL_WEEKS; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = startX + (col * cellSize);
        const y = startY + (row * cellSize);

        // Draw week square
        ctx.fillStyle = i < weeksLived ? '#2a2a2a' : '#f0f0f0';
        ctx.fillRect(x, y, cellSize - 1, cellSize - 1);

        // Highlight current week
        if (i === weeksLived) {
            ctx.strokeStyle = '#4a4a4a';
            ctx.lineWidth = 2;
            ctx.strokeRect(x - 2, y - 2, cellSize + 2, cellSize + 2);
        }
    }

    // 5. Draw statistics (if enabled)
    if (includeStats) {
        ctx.font = '24px -apple-system, sans-serif';
        ctx.fillText(`${weeksLived.toLocaleString()} weeks lived`, 60, 1450);
        ctx.fillText(`${weeksRemaining.toLocaleString()} weeks remaining`, 60, 1490);
    }

    // 6. Download
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `life-in-weeks-${age}years.png`;
        a.click();
        URL.revokeObjectURL(url);
    }, 'image/png');
}
```

### File naming

**Pattern:** `life-in-weeks-[age]years.png`

**Examples:**
- `life-in-weeks-32years.png`
- `life-in-weeks-5years.png`
- `life-in-weeks-67years.png`

**Why:**
- Sortable by age
- Descriptive
- No special characters
- Works on all OS

### Performance

**Image generation time:**
- Expected: < 500ms on modern devices
- Acceptable: < 2s on older phones
- If slower: Show loading indicator

**File size:**
- Expected: 50-150KB (PNG)
- Optimized: Use PNG compression
- No need for JPEG (grid is geometric)

---

## Feature 3: Age shortcut input

### Goal
Remove friction. Some people just want to see quickly. Don't ask for more than you need.

### Visual design options

#### Option A: Dual input (推荐)
```
Layout:

┌─────────────────────────────────┐
│ When were you born?             │
│                                 │
│ [Date picker: 1990-05-15    ▼] │
│                                 │
│ Or just enter your age          │
│                                 │
│ [Text input: ___ years old    ] │
│                                 │
│ [Visualize your life]           │
└─────────────────────────────────┘

Why:
- Clear options
- User chooses precision
- Both visible (no hidden tabs)
```

#### Option B: Smart single input
```
Layout:

┌─────────────────────────────────┐
│ Birth date or age?              │
│                                 │
│ [Input: Type date or age...   ] │
│                                 │
│ Examples: "1990-05-15" or "32"  │
│                                 │
│ [Visualize your life]           │
└─────────────────────────────────┘

Why:
- One input field
- Auto-detect format
- Most minimal
```

#### Option C: Toggle button
```
Layout:

┌─────────────────────────────────┐
│ When were you born?             │
│ [Date ⚬ Age]  ← Toggle          │
│                                 │
│ [Date picker: 1990-05-15    ▼]  │  (or)
│ [Age input: 32              ]  │
│                                 │
│ [Visualize your life]           │
└─────────────────────────────────┘

Why:
- Clean single view
- Explicit mode switch
- Familiar pattern
```

**我的推荐：Option A**
- 最清晰，无需解释
- 两个输入都可见，用户自主选择
- 填写任一个即可提交

### Interaction details

**Input behavior:**
1. User sees both inputs (date + age)
2. User fills ONE of them
3. Other input auto-disables (grayed out)
4. User can switch by clearing current input
5. Click Visualize → validates filled input

**Date input:**
- Type: `<input type="date">`
- Max: Today
- Min: 1900-01-01 (120 years ago)
- Placeholder: "YYYY-MM-DD"

**Age input:**
- Type: `<input type="number">`
- Min: 0
- Max: 120
- Placeholder: "e.g., 32"
- Unit text: "years old" (static label)

**Validation:**

```
If date filled:
  ✓ Must be valid date
  ✓ Must be in past
  ✓ Must be < 120 years ago
  → Calculate exact weeks

If age filled:
  ✓ Must be number
  ✓ Must be 0-120
  ✓ Approximation warning?
  → Calculate as: age * 52 weeks
```

### Edge cases

**Case 1: User fills both inputs**
- Last edited input wins
- OR: Show gentle error: "Please use date or age, not both"
- **Recommendation:** Last edited wins (more forgiving)

**Case 2: User enters decimal age (32.5)**
- Accept it: `32.5 * 52 = 1,690 weeks`
- Good for precision seekers

**Case 3: User enters 0 years old**
- Valid (newborn)
- Show: "Week 0 - Your first week"

**Case 4: Age > 90 years**
- Still allow it
- Grid extends beyond 90 years
- Show: "You've lived [X] weeks"

### Precision tradeoff

**Date input:**
- Precision: Exact week
- Example: Born May 15, 1990 → Week 1,789

**Age input:**
- Precision: Approximate to mid-year
- Example: 32 years old → 32 * 52 = 1,664 weeks
- Could be ±26 weeks off

**User communication:**

Option A: Show warning
```
⚠ Age-based calculation is approximate (±6 months)
```

Option B: No warning (most people won't care)

Option C: Show precision in results
```
Statistics:
~1,664 weeks lived (approximate)
```

**我的推荐：Option C**
- Show `~` (tilde) prefix for age-based
- No scary warnings
- Communicates uncertainty subtly

### Mobile optimization

**Current design issues:**
- Date picker is clunky on mobile
- Small calendar popups

**Age input advantages on mobile:**
- Just number keyboard
- Faster typing
- No calendar navigation

**Expected behavior:**
- 70% of mobile users will use age input
- 30% will use date (those who want precision)

### Technical implementation

```javascript
// Input elements
const dateInput = document.getElementById('birthdate');
const ageInput = document.getElementById('age');

// Cross-disable logic
dateInput.addEventListener('input', () => {
    if (dateInput.value) {
        ageInput.disabled = true;
        ageInput.value = '';
    } else {
        ageInput.disabled = false;
    }
});

ageInput.addEventListener('input', () => {
    if (ageInput.value) {
        dateInput.disabled = true;
        dateInput.value = '';
    } else {
        dateInput.disabled = false;
    }
});

// Calculate weeks from age
function calculateWeeksFromAge(age) {
    return Math.floor(age * 52);
}

// Validation
function validate() {
    if (dateInput.value) {
        const error = validateBirthdate(dateInput.value);
        if (error) return error;
        return null;
    } else if (ageInput.value) {
        const age = parseFloat(ageInput.value);
        if (age < 0 || age > 120) {
            return 'Please enter an age between 0 and 120';
        }
        return null;
    } else {
        return 'Please enter your birth date or age';
    }
}

// Show visualization
function showVisualization() {
    const error = validate();
    if (error) {
        // Show error
        return;
    }

    let weeksLived;
    let isApproximate = false;

    if (dateInput.value) {
        weeksLived = calculateWeeks(dateInput.value);
    } else {
        const age = parseFloat(ageInput.value);
        weeksLived = calculateWeeksFromAge(age);
        isApproximate = true;
    }

    updateStats(weeksLived, isApproximate);
    createGrid(weeksLived);
    // ... switch to step 2
}
```

### Copy/messaging

**Input labels:**
```
Date option:
  Label: "When were you born?"
  Placeholder: none (native date picker)

Age option:
  Label: "Or just enter your age"
  Placeholder: "e.g., 32"
  Suffix: "years old"
```

**Button text:**
- Unchanged: "Visualize your life"
- Works for both inputs

**Error messages:**
```
No input:
  "Please enter your birth date or age"

Invalid date:
  "Please enter a valid birth date"

Future date:
  "Birth date cannot be in the future"

Invalid age:
  "Please enter an age between 0 and 120"

Age too high:
  "Please enter a valid age"
```

---

## Combined visual flow

### Step 1 - Input (updated)
```
┌──────────────────────────────────────┐
│                                      │
│  Life in weeks                       │
│                                      │
│  Each life contains approximately    │
│  4,680 weeks. A simple grid to help  │
│  you reflect on time.                │
│                                      │
│  ────────────────────────────────    │
│                                      │
│  When were you born?                 │
│  [Date: 1990-05-15            ▼]    │
│                                      │
│  Or just enter your age              │
│  [Age: ___] years old                │
│                                      │
│  [Visualize your life]               │
│                                      │
└──────────────────────────────────────┘
```

### Step 2 - Visualization (updated)
```
┌──────────────────────────────────────┐
│                                      │
│  Your life in weeks                  │
│  Each square represents one week.    │
│                                      │
│  1,789                               │
│  Weeks lived                         │
│                                      │
│  2,891                               │
│  Weeks remaining (estimated)         │
│                                      │
│  38.2%                               │
│  Of life experienced                 │
│                                      │
│  ────────────────────────────────    │
│  90 years × 52 weeks    ◼ Lived     │
│                          □ Remaining │
│  ┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐         │
│  ├─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┤         │
│  ├─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┤         │
│  ├─┼─┼─┼╔═╗┼─┼─┼─┼─┼─┼─┼─┤ ← Current│
│  ├─┼─┼─┼║●║┼─┼─┼─┼─┼─┼─┼─┤   (pulse)│
│  ├─┼─┼─┼╚═╝┼─┼─┼─┼─┼─┼─┼─┤         │
│  └─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘         │
│                                      │
│  [⬇ Save as image] [↺ Start over]  │
│                                      │
│  "Time is the most valuable thing    │
│   a person can spend."               │
│                                      │
└──────────────────────────────────────┘
```

---

## Design system consistency

### Colors (unchanged)
```
--color-bg: #fafafa
--color-text: #2a2a2a
--color-text-light: #6a6a6a
--color-border: #e0e0e0
--color-lived: #2a2a2a
--color-remaining: #f0f0f0
--color-accent: #4a4a4a (used for current week)
```

### Typography (unchanged)
```
H1: 1.5rem, 400 weight
Body: 0.95rem
Labels: 0.9rem
Small: 0.85rem
Stats: 2rem, 300 weight
```

### Spacing (unchanged)
```
xs: 8px
sm: 16px
md: 24px
lg: 48px
xl: 64px
```

### Animations (new)
```
Pulse (current week):
  Duration: 2s
  Easing: ease-in-out
  Scale: 1.0 → 1.1 → 1.0

Fade in:
  Duration: 0.6s
  Easing: ease-in
  Opacity: 0 → 1
  Transform: translateY(20px) → 0

Button press:
  Transform: translateY(1px)
  Duration: instant
```

---

## Development checklist

### Feature 1: Current week highlight
- [ ] Calculate current week index
- [ ] Add `.current-week` class to element
- [ ] CSS: Pulsing ring animation
- [ ] Desktop: Hover tooltip "Week X - You are here"
- [ ] Mobile: Tap tooltip (3s auto-hide)
- [ ] Edge case: Age > 90 (extend grid)
- [ ] Edge case: Age = 0 (newborn)
- [ ] Test on different screen sizes

### Feature 2: Save as image
- [ ] Create canvas rendering function
- [ ] Draw white background
- [ ] Draw title "Life in weeks"
- [ ] Draw grid (52 cols, proper spacing)
- [ ] Draw current week highlight
- [ ] Draw statistics text
- [ ] Add "Save as image" button
- [ ] Implement download trigger
- [ ] Filename: `life-in-weeks-[age]years.png`
- [ ] Loading state ("Saving...")
- [ ] Error handling (unsupported browser)
- [ ] Test on mobile (iOS/Android)
- [ ] Test file size (should be < 200KB)

### Feature 3: Age shortcut
- [ ] Add age input field
- [ ] Add "years old" label
- [ ] Cross-disable logic (date ↔ age)
- [ ] Age validation (0-120)
- [ ] Calculate weeks from age (age * 52)
- [ ] Update stats to show `~` for approximate
- [ ] Clear both inputs on reset
- [ ] Update error messages
- [ ] Test decimal ages (32.5)
- [ ] Test switching between inputs
- [ ] Mobile: Number keyboard for age input

### Testing matrix
```
Browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS 14+)
- [ ] Mobile Chrome (Android 10+)

Ages:
- [ ] Newborn (0 years)
- [ ] Child (5 years)
- [ ] Young adult (25 years)
- [ ] Middle age (50 years)
- [ ] Elderly (75 years)
- [ ] Super-elderly (95 years, beyond grid)

Input methods:
- [ ] Date picker only
- [ ] Age input only
- [ ] Switch from date to age
- [ ] Switch from age to date
- [ ] Decimal age (32.5)
```

---

## Risks and mitigation

### Risk 1: Pulsing animation = battery drain on mobile
**Mitigation:**
- Disable animation after 10 seconds
- OR: Only pulse on page load (3 pulses, then stop)
- OR: No animation on mobile (static ring only)

**Recommendation:** Static ring on mobile

### Risk 2: Canvas image quality on retina displays
**Mitigation:**
- Use 2x resolution canvas (2400x3200px)
- Scale down for display
- Crisp on all screens

**Recommendation:** Implement 2x, check file size

### Risk 3: Age input = less emotional impact
**Mitigation:**
- Track usage: How many use age vs. date?
- If 90%+ use age, maybe date picker is the problem?
- Could add micro-copy: "Date gives exact week" to encourage precision

**Recommendation:** Ship and measure

### Risk 4: Image download fails on iOS
**Mitigation:**
- iOS sometimes blocks auto-download
- Fallback: Open image in new tab
- Show instruction: "Long-press image to save"

**Recommendation:** Test thoroughly on iOS

---

## Success criteria

### Feature 1 success = Current week is obvious
- [ ] First-time users can find current week within 3 seconds
- [ ] Users say "Oh, that's where I am now"

### Feature 2 success = People save and share
- [ ] At least 20% of users click "Save as image"
- [ ] Users share screenshots on social media
- [ ] Image quality is good enough to print

### Feature 3 success = Faster input
- [ ] Average time to visualization < 10 seconds
- [ ] Mobile users prefer age input (hypothesis)
- [ ] Fewer form errors

---

## Questions to align on

1. **Current week animation:**
   - Continuous pulse (may drain battery)?
   - 3 pulses then stop?
   - Static ring only?

2. **Image export:**
   - Include stats by default, or make it optional?
   - Square (1200x1200) or portrait (1200x1600)?
   - Add watermark "Made with life-in-weeks" or stay pure?

3. **Age input:**
   - Show "approximate" warning or just `~` prefix?
   - Accept decimal (32.5) or integers only?
   - Both inputs visible, or toggle between them?

4. **Save button placement:**
   - Next to "Start over"?
   - Above grid (more prominent)?
   - Floating button (bottom-right corner)?

5. **Mobile priority:**
   - Should mobile get simplified version?
   - Or keep feature parity with desktop?

**我的建议倾向，但想听您的想法：**
- Static ring on mobile (save battery)
- Stats included by default, portrait format
- No watermark (pure minimalism)
- Show `~` only, no warning
- Accept decimals
- Both inputs visible
- Button next to "Start over"
- Full feature parity

**您的想法？有哪些需要调整的？**
