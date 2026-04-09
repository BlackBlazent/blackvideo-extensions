/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

/*
 * {{displayName}} — BlackVideo Extension
 * Author: {{author}}
 * Version: {{version}}
 *
 * index.ts — Extension entry point.
 * Called by extention.loader.ts when the extension is activated.
 *
 * Use this file to:
 *   - Bootstrap your extension runtime
 *   - Register playback hooks via VideoTheaterStage
 *   - Initialize background services
 *   - Register IPC listeners
 */

import { VideoTheaterStage } from '../../../AppData/forbidden/dev/main/playground/Video.Theater.Stage';

// ─────────────────────────────────────────────────────────────
//  Extension bootstrap
// ─────────────────────────────────────────────────────────────

let _stage: VideoTheaterStage | null = null;

export default function activate(): void {
  console.log('[{{extension-id}}] Activated');

  _stage = VideoTheaterStage.getInstance();

  // ── Playback hooks ───────────────────────────────────────
  // Subscribe to video events via the theater stage observer pattern.

  _stage.subscribe('loadedmetadata', (video: HTMLVideoElement | null) => {
    if (!video) return;
    console.log('[{{extension-id}}] Video loaded:', video.src);
    // Your logic here
  });

  _stage.subscribe('canplay', (video: HTMLVideoElement | null) => {
    if (!video) return;
    // Your logic here
  });

  // ── UI initialization ────────────────────────────────────
  // The UI is handled by extension.container.card.tsx.
  // This file is only for background/runtime initialization.
}

export function deactivate(): void {
  console.log('[{{extension-id}}] Deactivated');
  // Unsubscribe from stage, stop workers, release resources.
  _stage = null;
}
