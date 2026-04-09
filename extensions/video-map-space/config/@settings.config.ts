/*
 * Video Map Space
 * config/@settings.config.ts
 *
 * User-facing settings for this extension.
 * Persisted via the BlackVideo Tauri store.
 */

import { invoke } from '@tauri-apps/api/core';

export interface ExtensionSettings {
  enabled: boolean;
  // Add your settings here:
}

const DEFAULTS: ExtensionSettings = {
  enabled: true,
};

const STORE_KEY = 'bv_ext_video-map-space_settings';

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
  await invoke('store_set', {
    key:   STORE_KEY,
    value: JSON.stringify({ ...current, ...settings }),
  });
}

export async function resetSettings(): Promise<void> {
  await invoke('store_set', { key: STORE_KEY, value: JSON.stringify(DEFAULTS) });
}
