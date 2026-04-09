/*
 * Video Map Space
 * config/extension.deactivate.handler.ts — called on every deactivation.
 */

export default async function deactivate({ manifest }: { manifest: { id: string } }): Promise<void> {
  console.log(`[video-map-space] Deactivating…`);
  // Unregister listeners, stop workers, save state.
}
