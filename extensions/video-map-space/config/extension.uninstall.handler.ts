/*
 * Video Map Space
 * config/extension.uninstall.handler.ts — called on permanent removal.
 */

export default async function uninstall({ manifest }: { manifest: { id: string } }): Promise<void> {
  console.log(`[video-map-space] Uninstalling…`);
  // Remove stored data, revoke permissions, clean up files.
}
