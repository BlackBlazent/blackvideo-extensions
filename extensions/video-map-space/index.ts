/*
 * Video Map Space — BlackVideo Extension
 * Author: Jednaz Lonestamp
 * Version: 1.0.0
 * Type: extension
 *
 * index.ts — Extension entry point.
 * Called by the BlackVideo extension loader when the extension is activated.
 */

import { VideoTheaterStage } from '../../../../AppData/forbidden/dev/main/playground/Video.Theater.Stage';

// ─────────────────────────────────────────────────────────────
//  State
// ─────────────────────────────────────────────────────────────

let _stage: VideoTheaterStage | null = null;

// ─────────────────────────────────────────────────────────────
//  Lifecycle
// ─────────────────────────────────────────────────────────────

export default function activate(): void {
  console.log('[video-map-space] Activated');

  // ── Playback hooks ───────────────────────────────────────
  _stage = VideoTheaterStage.getInstance();

  _stage.subscribe('loadedmetadata', (video: HTMLVideoElement | null) => {
    if (!video) return;
    console.log('[video-map-space] Video loaded:', video.src);
    // Your logic here
  });

  _stage.subscribe('canplay', (_video: HTMLVideoElement | null) => {
    // Your logic here
  });
}

export function deactivate(): void {
  console.log('[video-map-space] Deactivated');
  // Release resources, unsubscribe hooks, stop workers.
  _stage = null;
}
