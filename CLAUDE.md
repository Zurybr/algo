# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Spanish-language XV Años (Quinceañera) invitation web application featuring an animated gift box opening sequence followed by a formal invitation card display.

## Architecture

**Core Files:**
- `index.html` - Main HTML structure with two animated scenes
- `main.js` - Animation logic using GSAP and ScrollTrigger
- `data.js` - Event data configuration (ES6 module)
- `styles.css` - CSS with custom properties and animations

**Key Design Patterns:**
- Two-scene structure: Scene 1 (gift box animation) → Scene 2 (invitation content)
- CSS custom properties for theming (`--color-gold`, `--blush`, etc.)
- GSAP ScrollTrigger for scene transitions
- ES6 modules for data separation
- Responsive design with mobile breakpoints

## Development

**No Build Process:** This is a vanilla HTML/CSS/JS project with no package.json or build tools. Files are served directly.

**External Dependencies (CDN):**
- GSAP 3.9.1 with ScrollTrigger plugin
- Particles.js 2.0.0
- Google Fonts (Great Vibes, Playfair Display)
- FontAwesome 6.0.0-beta3

**Testing:** Open `index.html` in a browser to test the animation sequence and content display.

## Key Configuration

**Event Data:** All event details are centralized in `data.js` - modify the `invitacion` object to update:
- Names, dates, locations
- Program schedule
- Contact information (WhatsApp RSVP link)

**Styling:** The design uses a gold/red/ivory color scheme with Spanish quinceañera aesthetics. Animations include gift box opening, floral reveals, and content fade-ins.