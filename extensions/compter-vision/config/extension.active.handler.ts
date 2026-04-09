/*
 * config/extension.active.handler.ts
 * Called every time the extension is activated (enabled by user or on startup).
 */
export default async function activate({ manifest }: { manifest: any }): Promise<void> {
  console.log(`[${manifest.id}] Activating…`);
  // Start workers, register playback hooks, open IPC channels.
}
