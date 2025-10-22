# Video Assets

This folder contains optimized video loops for the website.

## Video Optimization Guidelines

For optimal performance, follow these guidelines:

### Compression
- **Target size**: < 10 MB per video
- **Format**: MP4 (H.264 codec)
- **Resolution**: 1920x1080 for fullscreen backgrounds
- **Frame rate**: 24-30 fps

### DaVinci Resolve Export Settings
1. **Format**: QuickTime or MP4
2. **Codec**: H.264
3. **Quality**: 
   - Bitrate: 5-8 Mbps for 1080p
   - Profile: High
   - Keyframe interval: Every 24 frames
4. **Audio**: None (for background videos)

### FFmpeg Command Line (Alternative)
```bash
ffmpeg -i input.mp4 -c:v libx264 -preset slow -crf 23 -vf scale=1920:1080 -an output.mp4
```

### Additional Optimization
```bash
# Further compress with two-pass encoding
ffmpeg -i input.mp4 -c:v libx264 -b:v 5M -pass 1 -f mp4 /dev/null && \
ffmpeg -i input.mp4 -c:v libx264 -b:v 5M -pass 2 output.mp4
```

## Placeholder Video

To test the hero section, you can:
1. Create a short video loop in DaVinci Resolve
2. Export using the settings above
3. Name it `hero-bg.mp4` and place it here
4. Or use a free stock video from [Pexels](https://www.pexels.com/videos/) or [Pixabay](https://pixabay.com/videos/)

## Azure Storage

In production, videos are served from Azure Storage Blob containers with CDN caching for optimal performance.
