/*
 * config/extension.deactivate.handler.ts
 * Called every time the extension is deactivated.
 */
export default async function deactivate({ manifest }: { manifest: any }): Promise<void> {
  console.log(`[${manifest.id}] Deactivating…`);
  // Unregister listeners, stop workers, save state.
}
