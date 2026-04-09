/*
 * config/@settings.config.ts
 *
 * User-facing settings and runtime preferences for this extension.
 * Persisted via the BlackVideo store (Tauri plugin-store).
 */

import { invoke } from '@tauri-apps/api/core';

// ── Define your settings shape ───────────────────────────────

export interface ExtensionSettings {
  enabled:    boolean;
  // Add your own settings below:
  // quality:    'low' | 'medium' | 'high';
  // showOverlay: boolean;
}

const DEFAULTS: ExtensionSettings = {
  enabled: true,
};

const STORE_KEY = 'bv_ext_{{extension-id}}_settings';

// ── Load / Save ──────────────────────────────────────────────

export async function loadSettings(): Promise<ExtensionSettings> {
  try {
    const raw = await invoke<string | null>('store_get', { key: STORE_KEY });
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

export async function saveSettings(settings: Partial<ExtensionSettings>): Promise<void> {
  const current = await loadSettings();
  const merged  = { ...current, ...settings };
  await invoke('store_set', { key: STORE_KEY, value: JSON.stringify(merged) });
}

export async function resetSettings(): Promise<void> {
  await invoke('store_set', { key: STORE_KEY, value: JSON.stringify(DEFAULTS) });
}
