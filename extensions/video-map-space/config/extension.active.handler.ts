/*
 * Video Map Space
 * config/extension.active.handler.ts — called on every activation.
 */

export default async function activate({ manifest }: { manifest: { id: string } }): Promise<void> {
  console.log(`[video-map-space] Activating…`);
  // Start workers, register playback hooks, open IPC channels.
}
