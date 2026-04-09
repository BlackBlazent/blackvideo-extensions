/*
 * Video Map Space
 * config/services.config.ts
 *
 * License and service configuration.
 */

export type LicenseModel = 'free';

export interface ServiceConfig {
  license:          LicenseModel;
  trialDays?:       number;
  featureGates:     Record<string, boolean>;
  subscriptionUrl?: string;
}

export const servicesConfig: ServiceConfig = {
  license: 'free',
  featureGates: {
    // 'advanced-mode': false,
  },
};

export function isFeatureEnabled(feature: string): boolean {
  return servicesConfig.featureGates[feature] ?? false;
}
