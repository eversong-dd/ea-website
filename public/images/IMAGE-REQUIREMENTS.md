# Image Assets Required for Homepage

To complete the Eversong AI homepage, please add the following images to your project:

## Directory Structure

Create these directories in your `public` folder:

```
public/
├── images/
│   ├── insights/
│   └── case-studies/
└── videos/
```

## Required Images

### Hero Video
- **Path**: `/public/videos/hero-bg.mp4`
- **Style**: Calm, visionary, slow motion
- **Mood**: Abstract light, skyline, or data flow
- **Technical**: Loop-friendly, muted playback, 1920x1080 minimum

### Insight Tiles (4 images)

1. **The AI Deadlock**
   - Path: `/public/images/insights/ai-deadlock.jpg`
   - Dimensions: 800x600px minimum
   - Style: Professional, abstract AI/technology theme
   - Treatment: Will be desaturated on page, full color on hover

2. **Executive Sprint**
   - Path: `/public/images/insights/executive-sprint.jpg`
   - Dimensions: 800x600px minimum
   - Style: Business/executive theme
   - Treatment: Will be desaturated on page, full color on hover

3. **Powercrumbs Case Study**
   - Path: `/public/images/case-studies/powercrumbs.jpg`
   - Dimensions: 800x600px minimum
   - Style: Industrial or construction visual
   - Treatment: Will be desaturated on page, full color on hover

4. **Scaling AI Safely**
   - Path: `/public/images/insights/scaling-ai.jpg`
   - Dimensions: 800x600px minimum
   - Style: Technology/security theme
   - Treatment: Will be desaturated on page, full color on hover

## Image Guidelines (per design brief)

- **Color palette**: Should work with Ink Blue (#001238) and Pearl (#F1F1F1)
- **Composition**: High-contrast images work best with text overlays
- **Quality**: Professional, premium feel
- **Format**: JPG for photos, consider WebP for optimization
- **Aspect ratio**: 4:3 or similar for tiles
- **File size**: Optimize for web (under 500KB per image)

## Temporary Placeholder

Until you add real images, the tiles will show a gradient fallback in Ink Blue. The layout and functionality are fully working.

## Next Steps

1. Add video file to `/public/videos/hero-bg.mp4`
2. Add the 4 tile images to their respective paths
3. Run `npm run dev` to see the complete homepage
4. Adjust image positioning/scaling if needed via CSS
