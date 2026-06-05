# Design System Inspired by Prep Education

## 1. Visual Theme & Atmosphere

Prep Education's design system embodies a modern, professional learning platform with clean minimalism and approachable clarity. The visual language prioritizes legibility and cognitive accessibility, with a predominantly neutral color foundation anchored by deep charcoal tones and bright, energetic blue accents that signal interactivity and progress. The aesthetic balances corporate sophistication with friendly, educational warmth—creating an environment where learners feel supported and motivated. Generous whitespace, rounded geometric forms, and consistent visual hierarchy guide users through complex learning journeys without cognitive overload.

**Key Characteristics**

- Clean, minimal interface with ample whitespace
- Rounded, friendly button and container forms
- Deep charcoal and navy text on light neutral backgrounds
- Vibrant blue as primary interactive accent
- Educational, approachable tone without excessive ornamentation
- High contrast for readability and accessibility
- Consistent typography hierarchy supporting content scanning

## 2. Color Palette & Roles

### Primary

- **Primary Brand Dark** (`#23242D`): Primary text color, headings, and core interface elements; establishes visual hierarchy and brand voice
- **Primary Action Blue** (`#0060FD`): Primary call-to-action buttons, links, and interactive highlights; signals actionable elements
- **Action Blue Variant** (`#0071F9`): Hover and active states for primary CTAs; subtly distinct for interactive feedback

### Accent Colors

- **Deep Navy** (`#233876`): Secondary headings, sidebar elements, and emphasis text; adds visual depth
- **Medium Blue** (`#1F242E`): Tertiary text and supporting UI elements; lower visual weight

### Interactive

- **Secondary Text** (`#566681`): Body text, descriptions, and supplementary information; reduces visual weight while maintaining readability
- **Link Text Default** (`#23242D`): Navigation links and contextual hyperlinks; consistent with body hierarchy

### Neutral Scale

- **Light Gray Border** (`#E5E7EB`): Borders, dividers, and subtle UI separations; used 501 times across layout
- **Pure White** (`#FFFFFF`): Primary background, cards, and content containers
- **Dark Gray Border** (`#D1D5DB`): Secondary borders and reduced-emphasis dividers
- **Off-White 1** (`#F9FAFB`): Subtle background fills and secondary content areas
- **Off-White 2** (`#F7FAFC`): Tertiary background color for card stacks and nested elements
- **Off-White 3** (`#FAFCFE`): Delicate background tint for hover states and disabled areas
- **Pure Black** (`#000000`): Text emphasis, shadows, and maximum contrast scenarios

### Surface & Borders

- **Transparent Clear** (`#0000`): Transparent overlays, button backgrounds without fill, and glassmorphic effects
- **Transparent Black** (`rgba(0, 0, 0, 0)`): Ghost buttons and overlay elements requiring transparency

### Semantic / Status

- **Warning Primary** (`#FFCC00`): Warning states, alerts, and cautionary messaging
- **Warning Secondary** (`#FF9F00`): Secondary warning indicators and attention-grab elements

## 3. Typography Rules

### Font Family

**Primary Font Stack:** "Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

**Secondary Font Stack:** "Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|---|---|
| Display/Hero | Noto Sans | 100px | 600 | 116px | 0 | Page hero headings; maximum visual impact |
| Heading 1 | Noto Sans | 30px | 700 | 42px | 0 | Section titles and primary headings |
| Heading 2 | Noto Sans | 14px | 400 | 20px | 0 | Secondary headings and subheadings |
| Body Text | Noto Sans | 14px | 400 | 20px | 0 | Primary reading content and descriptions |
| Button Label | Noto Sans | 16px | 600 | 24px | 0 | Large primary buttons |
| Button Label Small | Noto Sans | 14px | 600 | 20px | 0 | Secondary and compact buttons |
| Emphasized Text | Noto Sans | 14px | 600 | 20px | 0 | Inline emphasis, strong spans, highlights |
| Caption/Meta | Noto Sans | 12px | 400 | 18px | 0 | Timestamps, metadata, helper text |
| Navigation | Noto Sans | 14px | 400 | 20px | 0 | Navigation menu links |

### Principles

- **Hierarchy through weight:** Use 400, 600, and 700 weights to create visual distinction
- **Readable line height:** Minimum 20px line height for body content; 24px for larger text
- **Generous sizing:** Base body size at 14px ensures accessibility and legibility on all screens
- **Consistent spacing:** Maintain 1.4–1.5x multiplier between line height and font size
- **Noto Sans for everything:** Uniform, highly readable font family supporting multiple languages

## 4. Component Stylings

### Buttons

#### Primary Button (Large)
- **Background:** `#0060FD`
- **Text Color:** `#FFFFFF`
- **Font Size:** `16px`
- **Font Weight:** `600`
- **Padding:** `12px 16px 12px 16px`
- **Height:** `48px`
- **Width:** `fit-content`
- **Border Radius:** `999px`
- **Border:** `0px solid #E5E7EB`
- **Box Shadow:** `none`
- **Hover State:** Background `#004FD8`, text remains white
- **Active State:** Background `#003FA8`, text remains white

#### Primary Button (Small)
- **Background:** `#0060FD`
- **Text Color:** `#FFFFFF`
- **Font Size:** `14px`
- **Font Weight:** `600`
- **Padding:** `8px 12px 8px 12px`
- **Height:** `36px`
- **Width:** `fit-content`
- **Border Radius:** `999px`
- **Border:** `0px solid #E5E7EB`
- **Box Shadow:** `none`
- **Hover State:** Background `#004FD8`
- **Active State:** Background `#003FA8`

#### Secondary Button
- **Background:** `#F9FAFB`
- **Text Color:** `#1F242E`
- **Font Size:** `14px`
- **Font Weight:** `600`
- **Padding:** `8px 12px 8px 12px`
- **Height:** `36px`
- **Width:** `fit-content`
- **Border Radius:** `999px`
- **Border:** `0px solid #E5E7EB`
- **Box Shadow:** `none`
- **Hover State:** Background `#F0F1F3`, text `#1F242E`
- **Active State:** Background `#E5E7EB`, text `#1F242E`

#### Ghost Button (Tertiary)
- **Background:** `rgba(0, 0, 0, 0)`
- **Text Color:** `#0060FD`
- **Font Size:** `14px`
- **Font Weight:** `600`
- **Padding:** `8px 12px 8px 12px`
- **Height:** `36px`
- **Width:** `fit-content`
- **Border Radius:** `999px`
- **Border:** `0px solid #E5E7EB`
- **Box Shadow:** `none`
- **Hover State:** Background `#FAFCFE`, text `#0060FD`
- **Active State:** Background `#F7FAFC`, text `#0071F9`

#### Icon Button (48px)
- **Background:** `#F9FAFB`
- **Text Color:** `#1F242E`
- **Font Size:** `20px`
- **Padding:** `0px 0px 0px 0px`
- **Height:** `48px`
- **Width:** `48px`
- **Border Radius:** `999px`
- **Border:** `0px solid #E5E7EB`
- **Display:** flex; align-items center; justify-content center
- **Hover State:** Background `#F0F1F3`

#### Icon Button (36px)
- **Background:** `#F9FAFB`
- **Text Color:** `#1F242E`
- **Font Size:** `18px`
- **Padding:** `0px 0px 0px 0px`
- **Height:** `36px`
- **Width:** `36px`
- **Border Radius:** `999px`
- **Border:** `0px solid #E5E7EB`
- **Display:** flex; align-items center; justify-content center
- **Hover State:** Background `#F0F1F3`

### Cards & Containers

#### Standard Card
- **Background:** `#FFFFFF`
- **Border:** `1px solid #E5E7EB`
- **Border Radius:** `16px`
- **Padding:** `24px`
- **Box Shadow:** `rgba(31, 36, 46, 0.1) 0px 4px 24px 0px`
- **Hover State:** Box Shadow `rgba(31, 36, 46, 0.15) 0px 8px 32px 0px`

#### Feature Card (with Text Link)
- **Background:** `#FFFFFF`
- **Border Radius:** `16px`
- **Padding:** `16px 12px 16px 12px`
- **Text Link Color:** `#566681`
- **Text Link Font Weight:** `600`
- **Text Link Font Size:** `14px`
- **Box Shadow:** `none`
- **Width:** `100%`

#### Hero Container
- **Background:** `#FFFFFF` or `#F9FAFB` gradient
- **Padding:** `56px 32px 56px 32px`
- **Border Radius:** `0px` (full-width hero)

### Inputs & Forms

#### Text Input / Form Field
- **Background:** `#FFFFFF`
- **Border:** `1px solid #E5E7EB`
- **Border Radius:** `8px`
- **Padding:** `12px 16px 12px 16px`
- **Font Size:** `14px`
- **Font Weight:** `400`
- **Text Color:** `#23242D`
- **Placeholder Color:** `#A0AEC0`
- **Focus State:** Border `2px solid #0060FD`, outline none
- **Error State:** Border `1px solid #FF6B6B`, background tint `#FFE5E5`
- **Disabled State:** Background `#F7FAFC`, text `#A0AEC0`, cursor not-allowed

#### Select / Dropdown
- **Background:** `#FFFFFF`
- **Border:** `1px solid #E5E7EB`
- **Border Radius:** `8px`
- **Padding:** `12px 16px 12px 16px`
- **Font Size:** `14px`
- **Color:** `#23242D`
- **Focus State:** Border `2px solid #0060FD`

### Navigation

#### Main Navigation Bar
- **Background:** `rgba(0, 0, 0, 0)` or `#FFFFFF` (on scroll)
- **Height:** `72px`
- **Width:** `1440px` (max-width container)
- **Text Color:** `#23242D`
- **Font Size:** `14px`
- **Font Weight:** `400`
- **Padding:** `0px 32px 0px 32px`
- **Alignment:** flex; align-items center; justify-content space-between
- **Link Hover State:** Text Color `#0060FD`, underline or bottom-border `2px solid #0060FD`
- **Link Active State:** Text Color `#0060FD`, bottom-border `2px solid #0060FD`

#### Navigation Link
- **Background:** `rgba(0, 0, 0, 0)`
- **Text Color:** `#23242D`
- **Font Size:** `14px`
- **Font Weight:** `400`
- **Padding:** `0px` (inherited from parent container)
- **Border Radius:** `0px`
- **Text Decoration:** none (default), underline on hover
- **Hover State:** Color `#0060FD`, text-decoration underline

### Badges & Status Tags

#### Info Badge
- **Background:** `#FAFCFE`
- **Text Color:** `#0060FD`
- **Border:** `1px solid #D1D5DB`
- **Border Radius:** `999px`
- **Padding:** `4px 12px 4px 12px`
- **Font Size:** `12px`
- **Font Weight:** `600`

#### Success Badge
- **Background:** `#E8F5E9`
- **Text Color:** `#2E7D32`
- **Border:** `1px solid #C8E6C9`
- **Border Radius:** `999px`
- **Padding:** `4px 12px 4px 12px`
- **Font Size:** `12px`

#### Warning Badge
- **Background:** `#FFF3E0`
- **Text Color:** `#E65100`
- **Border:** `1px solid #FFE0B2`
- **Border Radius:** `999px`
- **Padding:** `4px 12px 4px 12px`
- **Font Size:** `12px`

## 5. Layout Principles

### Spacing System

**Base Unit:** `8px` (scales to 4px, 8px, 12px, 16px, 20px, 24px, 28px, 32px, 36px, 48px, 52px, 56px)

- **4px:** Micro-spacing within icons and tight component internals
- **8px:** Gap between inline elements; compact padding for small buttons
- **12px:** Small component padding; tight form field spacing
- **16px:** Button padding; standard form field padding; section gaps
- **20px:** Medium spacing between related content blocks
- **24px:** Standard gap in grid layouts; card padding
- **28px:** Large section margins
- **32px:** Major section padding; container horizontal padding
- **36px:** Extra-large spacing between major sections
- **48px:** Section dividers; hero section padding top/bottom
- **52px:** Large container padding
- **56px:** Maximum section padding; full-height hero sections

### Grid & Container

- **Max Container Width:** `1440px` (desktop)
- **Column Strategy:** 12-column responsive grid with flexible breakpoints
- **Horizontal Padding:** `32px` on desktop; `20px` on tablet; `16px` on mobile
- **Gutter Width:** `24px` between columns
- **Section Pattern:** Full-width sections with contained content; alternating background colors (white/off-white) for visual rhythm

### Whitespace Philosophy

Prep Education employs generous, intentional whitespace to reduce cognitive load and support scanning. Spaces between major content blocks allow users to parse information hierarchically. Interior padding is consistent with the spacing scale, never arbitrary. Whitespace increases at higher breakpoints to leverage screen real estate; decreases on mobile to prioritize content density without cramping.

### Border Radius Scale

- **0px:** Full-width sections, navigation bars, and structural dividers
- **8px:** Form inputs, small cards, and utility UI elements
- **16px:** Standard card borders, feature cards, and medium containers
- **32px:** Large rounded containers and emphasized modal cards
- **48px:** Extra-large rounded buttons and prominent UI blocks
- **999px:** Pill-shaped buttons, compact badges, and circular icon containers

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (L0) | No shadow; `box-shadow: none` | Text, icons, borders; primary content |
| Raised (L1) | `rgba(31, 36, 46, 0.1) 0px 4px 24px 0px` | Standard cards, lifted containers |
| Lifted (L2) | `rgba(31, 36, 46, 0.15) 0px 8px 32px 0px` | Hoverable cards, interactive containers |
| Floating (L3) | `rgba(31, 36, 46, 0.2) 0px 12px 48px 0px` | Modals, dropdowns, tooltips (inferred) |
| Focus Ring (Interactive) | `rgba(0, 113, 249, 0.5) 0px 0px 0px 0px` | Button focus states (accessible highlight) |

**Shadow Philosophy:** Shadows are subtle and realistic, using a consistent light source from above-left. Elevation increases only when interaction or hierarchy demands it—avoiding excessive depth that muddies the interface. Shadows never exceed opacity 0.2 to maintain legibility of underlying content. Focus states use a soft blue glow for keyboard accessibility rather than harsh outlines.

## 7. Do's and Don'ts

### Do

- Use `#0060FD` or `#0071F9` for all primary interactive elements (buttons, links, highlights)
- Maintain 14px as the base body text size; increase to 16px only for hero copy
- Apply `999px` border radius to all buttons for a consistent, friendly appearance
- Use `#E5E7EB` for borders and subtle dividers; reserve darker grays for secondary content
- Provide at least `12px` of internal padding on interactive elements for comfortable touch targets
- Employ the 8px spacing scale religiously; never deviate with arbitrary pixel values
- Maintain 1.4–1.5x line-height-to-font-size ratio across typography for readability
- Use `#F9FAFB` or `#F7FAFC` as secondary backgrounds to create visual separation without harsh contrast
- Apply subtle shadows (`rgba(31, 36, 46, 0.1)`) to elevated containers for gentle depth
- Test all text on both light and dark backgrounds for sufficient contrast (WCAG AA minimum 4.5:1)

### Don't

- Never use text smaller than 12px on interactive elements
- Use Noto Sans consistently across all hierarchy levels for maximum readability
- Don't apply shadows stronger than `rgba(31, 36, 46, 0.2)`; keep depth subtle and realistic
- Never set border radius to 0px on interactive buttons; minimum `8px` for consistency
- Avoid full-opacity black (`#000000`) in standard UI; use `#1F242E` or `#23242D` instead
- Don't place text directly on colors without sufficient contrast; use white or off-white for readability
- Never skip the hover state for interactive elements; always provide visual feedback
- Avoid centering body text blocks longer than 60 characters; left-align for readability
- Don't use more than 3 colors in a single component; maintain visual simplicity
- Avoid padding below 8px on any interactive element; comfort and accessibility require minimum sizes

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|---|
| Mobile | `< 640px` | Horizontal padding `16px`; font sizes 12–14px; single-column layout; button width `100%` |
| Tablet | `640px – 1024px` | Horizontal padding `20px`; 6–8 column grid; font sizes 14–16px; button width auto on inline layouts |
| Desktop | `1024px – 1440px` | Horizontal padding `32px`; 12-column grid; full typography hierarchy; spacing scale max |
| Large Desktop | `> 1440px` | Max container width `1440px`; centered on screen; gutter spacing `24px` |

### Touch Targets

- **Minimum Interactive Height:** `44px` (buttons, form fields, navigation items)
- **Minimum Interactive Width:** `44px` (icon buttons, small toggles)
- **Recommended Padding:** `12px 16px` for comfortable finger targeting
- **Spacing Between Targets:** Minimum `8px` to prevent mis-taps
- **Form Field Height:** `36px` (compact) or `48px` (standard); never less than `36px`

### Collapsing Strategy

- **Hero Section:** Reduce padding from `56px` to `36px` (tablet); `24px` (mobile); maintain 100px font on desktop, reduce to `48px` on mobile
- **Cards:** Stack vertically on mobile; 2-column on tablet; 3-column on desktop (within max container)
- **Navigation:** Sticky top on mobile with hamburger menu; full horizontal bar on tablet+
- **Button Groups:** Stack vertically on mobile; inline on tablet+
- **Grid Columns:** 1 column (mobile) → 6 columns (tablet) → 12 columns (desktop)
- **Spacing:** Reduce all spacing values by 50% on mobile; scale linearly between breakpoints
- **Typography:** Reduce display heading from 100px → 56px (tablet) → 36px (mobile)
- **Images:** Full-width on mobile; constrained percentage on tablet; fixed width on desktop

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA:** Primary Action Blue (`#0060FD`)
- **Secondary CTA:** Secondary Button (`#F9FAFB` background, `#1F242E` text)
- **Ghost CTA:** Ghost Button (`transparent` background, `#0060FD` text)
- **Background:** Pure White (`#FFFFFF`) or Off-White (`#F9FAFB`)
- **Primary Text/Heading:** Primary Brand Dark (`#23242D`)
- **Secondary Text:** Secondary Text (`#566681`)
- **Borders/Dividers:** Light Gray Border (`#E5E7EB`)
- **Accent/Depth:** Deep Navy (`#233876`)
- **Warning:** Warning Primary (`#FFCC00`) or Warning Secondary (`#FF9F00`)
- **Success:** Success Green (`#2E7D32`, inferred)
- **Card Shadow:** `rgba(31, 36, 46, 0.1) 0px 4px 24px 0px`

### Iteration Guide

1. **Always use `#0060FD` for primary buttons, links, and interactive highlights**—it is the system's core accent and signals actionability.

2. **Set base body text to 14px with 400 weight in Noto Sans; use 16px only for hero or display copy.**

3. **Apply `999px` border radius to all buttons uniformly**—the pill shape is a defining visual characteristic.

4. **Use the 8px spacing scale (8, 16, 24, 32, 48, 56px) exclusively**—never introduce arbitrary pixel values.

5. **Maintain minimum 44px height for interactive elements on all devices**; add padding generously (`12px 16px` standard).

6. **Color hierarchy: primary text `#23242D`, secondary `#566681`, borders `#E5E7EB`**—never invert or reorder.

7. **Apply subtle shadows (`rgba(31, 36, 46, 0.1)`) only to elevated cards and containers**; keep flat elements shadowless.

8. **Ensure all text contrast meets WCAG AA (4.5:1 minimum for body, 3:1 for large text)**; test dark text on light backgrounds.

9. **Use 16px for heading font size (30px with 700 weight in Noto Sans); reserve 100px for hero display only.**

10. **On mobile, reduce padding by ~50% and stack layouts vertically; maintain 44px minimum touch targets and full-width button widths.**