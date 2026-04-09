/*
 * config/extension.install.handler.ts
 * Called once when the extension is first installed.
 */
export default async function install({ manifest }: { manifest: any }): Promise<void> {
  console.log(`[${manifest.id}] Installing…`);
  // Initialize data directories, write default config, etc.
}
