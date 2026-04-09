/*
 * Video Map Space
 * config/extension.install.handler.ts — called once on first install.
 */

export default async function install({ manifest }: { manifest: { id: string } }): Promise<void> {
  console.log(`[video-map-space] Installing…`);
  // Initialize data directories, write default config, etc.
}
