/*
 * config/services.config.ts
 *
 * License and service configuration for this extension.
 * Controls feature gating, trial limits, and monetization hooks.
 */

import type { LicenseModel } from '../../../../core/extension/extension.registry.server';

export interface ServiceConfig {
  license:          LicenseModel;
  trialDays?:       number;
  featureGates:     Record<string, boolean>;
  subscriptionUrl?: string;
}

export const servicesConfig: ServiceConfig = {
  license: 'free',

  // Uncomment for trial/subscription models:
  // trialDays: 14,
  // subscriptionUrl: 'https://blackvideo.app/extensions/{{extension-id}}/subscribe',

  featureGates: {
    // Example:
    // 'advanced-mode': false,    // locked behind subscription
    // 'export-data':   true,     // free feature
  },
};

export function isFeatureEnabled(feature: string): boolean {
  return servicesConfig.featureGates[feature] ?? false;
}
