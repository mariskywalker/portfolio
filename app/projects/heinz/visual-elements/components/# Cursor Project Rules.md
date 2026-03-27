# Cursor Project Rules

## Visual Asset Rules

All floating or composited visual assets must use real transparency.

### Allowed formats
- PNG with alpha channel
- WebP with transparency
- SVG

### Forbidden
- JPG assets used as floating elements
- PNG files with black background
- Any image requiring mix-blend-mode to fake transparency

If an asset does not contain real alpha transparency, it must be replaced with a properly cut PNG/WebP before being added to the layout.

### Never attempt to fix background issues with
- mix-blend-mode
- brightness/contrast
- CSS hacks

The asset itself must be correct.


## Animation Rules

All animations must be scroll-synced using GSAP ScrollTrigger.

Avoid arbitrary time-based delays.

Motion should follow scroll progress for cinematic storytelling.
