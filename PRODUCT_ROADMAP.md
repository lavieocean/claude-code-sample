# Life in weeks - Product roadmap
## Jason Fried-inspired iteration strategy

### Core principle
**"Does this help people value their time more?"**
Every feature must pass this test. We're not building a toy, we're building a tool for reflection.

---

## Current state analysis

**What works:**
- Immediate visual impact (the grid is powerful)
- Simple two-step flow (no learning curve)
- Clean aesthetic (doesn't distract from the message)

**What's missing:**
- No reason to return (one-time use)
- No personal context (weeks are abstract)
- No actionable insight (beautiful, but so what?)

---

## Iteration 1: Make weeks meaningful
**Problem:** Numbers without context don't change behavior.

**Why this matters:**
People know time passes. They need to feel it. Abstract weeks don't create emotional connection.

**Specific changes:**

### 1.1 Add life milestones overlay
```
Implementation:
- Add optional "Mark important moments" step
- User clicks/taps weeks to mark: "Started college", "First job", "Met partner"
- Visual differentiation: subtle dot or star on marked weeks
- Shows patterns: "Your career started at week 1,040"

Why:
- Makes abstract weeks concrete
- Creates personal narrative
- Encourages reflection on what mattered
```

### 1.2 Show relatable comparisons
```
Implementation:
- Below statistics, add context:
  "You've lived the equivalent of 312 months"
  "That's 2,184 days"
  "About the same as [famous person] at age [X]"

Why:
- Different time units resonate with different people
- Historical context adds perspective
- Makes large numbers feel real
```

### 1.3 Highlight current week
```
Implementation:
- Make the current week pulse subtly
- Label it: "You are here"
- Optional: Show day within week (Saturday of week 1,789)

Why:
- Grounds user in present moment
- Creates sense of "now matters"
- Subtle urgency without anxiety
```

**Development effort:** 2-3 days
**Impact:** High - transforms one-time view into personal artifact

---

## Iteration 2: Enable quiet sharing
**Problem:** Meaningful experiences should be shareable, but not social-media-noisy.

**Why this matters:**
People want to share moments of reflection. But we don't want to turn contemplation into performance.

**Specific changes:**

### 2.1 Thoughtful export
```
Implementation:
- "Save as image" button
- Generates clean PNG:
  - Grid with lived/remaining weeks
  - Key statistics in corner
  - Small text: "Life in weeks - [your age] years"
- No branding, no URLs, just the data

Why:
- Lets people keep it private
- Enables sharing on their terms
- Image works everywhere (save, print, share)
```

### 2.2 URL sharing with privacy
```
Implementation:
- "Get shareable link" generates URL like:
  ?born=1990-05-15 (or hashed for privacy)
- Link recreates exact view someone saw
- No tracking, no accounts, just state in URL

Why:
- Share with specific people (partner, kids)
- Start conversations about time
- No database, no complexity
```

**Development effort:** 1-2 days
**Impact:** Medium - extends reach without compromising minimalism

---

## Iteration 3: Add future thinking
**Problem:** Visualization shows past, but behavior changes require future focus.

**Why this matters:**
Regret is useless. The question is: "What will I do with the weeks I have left?"

**Specific changes:**

### 3.1 Future milestone planning
```
Implementation:
- After viewing grid, optional prompt:
  "What do you want to do in the next 52 weeks?"
- User can place a single marker in future weeks
- Text label: "Launch business", "Learn piano", "Travel Japan"
- Shows countdown: "42 weeks until your goal"

Why:
- Shifts from passive reflection to active planning
- Creates accountability (specific week, specific goal)
- Maintains simplicity (one future goal only)
```

### 3.2 Decade view
```
Implementation:
- Toggle button: "View by decades"
- Compresses 52 weeks into single rows
- Each decade = one row of 10 blocks
- Hover shows years within decade

Why:
- Some people think in decades, not weeks
- Easier to see life arc
- Less overwhelming for young users
```

### 3.3 Projected age scenarios
```
Implementation:
- Small calculator below grid:
  "If you want to [blank], you have [X] weeks to start"
- Examples:
  - "Raise a child (18 years) → Need to start by week 2,340"
  - "Master a skill (10,000 hours) → [X] weeks if you practice [Y] hours/week"

Why:
- Makes time concrete with goals
- Shows opportunity windows
- Inspires action vs. anxiety
```

**Development effort:** 3-4 days
**Impact:** High - transforms reflection into action

---

## Iteration 4: Reduce friction
**Problem:** Birth date input is a small barrier. Smaller is better.

**Why this matters:**
Jason Fried: "Every question you ask is a door people might not walk through."

**Specific changes:**

### 4.1 Age-based shortcut
```
Implementation:
- Change prompt to:
  "When were you born? (or just enter your age)"
- Accept both formats
- Age input shows approximate grid (less precise, but faster)

Why:
- Some people don't want to share exact birthday
- Faster for mobile users
- Still delivers core value
```

### 4.2 Remember preference (optional)
```
Implementation:
- After first view, small checkbox:
  "Remember me (saves to this browser only)"
- Uses localStorage, no server
- Returns to visualization immediately on revisit

Why:
- Encourages return visits
- No account complexity
- Respects privacy (local only)
```

### 4.3 Direct link with age
```
Implementation:
- URL parameter: ?age=32
- Skips step 1, shows visualization immediately
- Enables "bookmark your life" workflow

Why:
- Zero friction for return visits
- Can be homepage/bookmark
- Daily reminder
```

**Development effort:** 1 day
**Impact:** Medium - increases return rate

---

## Iteration 5: Weekly ritual (experimental)
**Problem:** Impact fades after first view. How to make it a practice?

**Why this matters:**
One moment of reflection is nice. A practice of reflection changes lives.

**Specific changes:**

### 5.1 Weekly question prompt
```
Implementation:
- On return visits, show ONE question:
  Week 1,789: "What made this week worth living?"
  Week 1,790: "What did you learn this week?"
  Week 1,791: "Who did you help this week?"
- Rotates through 52 questions (one per week number % 52)
- No input required, just read and think
- Appears before grid for 3 seconds, then fades

Why:
- Creates weekly ritual
- Question prompts reflection
- Low commitment (just reading, no writing)
```

### 5.2 Week-at-a-glance mode
```
Implementation:
- Toggle to "Current week focus"
- Shows just current week, enlarged
- 7 boxes for 7 days
- Simple prompt: "How did you spend these days?"

Why:
- Long-term view can be overwhelming
- Weekly scale is actionable
- Zooms in without losing context
```

**Development effort:** 2 days
**Impact:** Experimental - could be powerful or annoying

---

## What we're NOT doing (and why)

### ❌ Social features
- No user accounts
- No public profiles
- No "share on Twitter" buttons
**Why:** Reflection is private. We're not building engagement, we're building meaning.

### ❌ Gamification
- No streaks
- No achievements
- No points
**Why:** Time isn't a game. Respect the seriousness of the subject.

### ❌ Notifications/reminders
- No email reminders
- No push notifications
- No "come back" prompts
**Why:** If it's valuable, people will return. Nagging destroys the calm we're creating.

### ❌ Monetization features
- No premium tiers
- No ads
- No data collection
**Why:** Some things should just be good. This is one of them.

### ❌ Detailed analytics
- No "time spent in each category"
- No life dashboards
- No productivity tracking
**Why:** Complexity kills reflection. Keep it simple.

---

## Prioritized implementation order

**Phase 1 (Do now):**
1. Highlight current week (Iteration 1.3) - 2 hours
2. Save as image (Iteration 2.1) - 4 hours
3. Age shortcut (Iteration 4.1) - 3 hours

**Why these first:**
- Highest impact, lowest effort
- Enhance core experience without complexity
- Build on what already works

**Phase 2 (Do next month):**
1. Life milestones overlay (Iteration 1.1) - 1 day
2. Future milestone planning (Iteration 3.1) - 2 days
3. Remember preference (Iteration 4.2) - 3 hours

**Why these second:**
- Add meaningful personalization
- Enable return visits
- Still maintain simplicity

**Phase 3 (Experiment):**
1. Weekly question prompt (Iteration 5.1) - 1 day
2. Relatable comparisons (Iteration 1.2) - 4 hours
3. Decade view (Iteration 3.2) - 1 day

**Why these last:**
- Need to validate if users return
- More experimental
- Can learn from usage patterns first

---

## Success metrics (Jason Fried style)

**Don't measure:**
- Time on page
- Daily active users
- Viral coefficient

**Do notice:**
- Qualitative feedback ("This changed how I think about time")
- Return visits (are people coming back?)
- Shares (are people sending to friends?)

**The real metric:**
Did someone's behavior change? Did they do something different with their time because of this tool?

That's the only number that matters.

---

## Guiding questions for every decision

1. **Does this add complexity or clarity?**
2. **Would I use this weekly, or just once?**
3. **Does this help someone act differently, or just feel different?**
4. **Can we explain the value in one sentence?**
5. **What would we remove to make room for this?**

If you can't answer these confidently, don't build it.

---

## Philosophy

This isn't a growth hack. It's not a viral tool. It's not going to have millions of users.

It's going to have the right users - people who want to think deeply about their time.

That's enough.

**Less, but better.**
