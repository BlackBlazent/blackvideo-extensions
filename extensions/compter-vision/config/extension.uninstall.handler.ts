/*
 * config/extension.uninstall.handler.ts
 * Called when the extension is permanently removed.
 */
export default async function uninstall({ manifest }: { manifest: any }): Promise<void> {
  console.log(`[${manifest.id}] Uninstalling…`);
  // Remove stored data, revoke permissions, clean up files.
}
