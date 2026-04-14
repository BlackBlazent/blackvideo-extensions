#!/usr/bin/env node
/*
 * scripts/update-marketplace.ts
 *
 * Regenerates marketplace.json from all extension manifests found under
 * extensions/<id>/manifest.json and extensions/<id>/package.json.
 *
 * Run automatically by bvx publish and the GitHub Actions release workflow.
 * Can also be run manually:
 *
 *   npx ts-node scripts/update-marketplace.ts
 *
 * Environment variables:
 *   GITHUB_REPO   - e.g. BlackBlazent/blackvideo-extensions  (default: read from package.json)
 *   RELEASE_TAG   - e.g. video-map-space@1.2.0               (optional, only updates that entry)
 *
 * The script:
 *   1. Reads every extensions/<id>/manifest.json
 *   2. Reads the matching extensions/<id>/package.json for extra metadata
 *   3. Constructs a download URL using the release tag format <id>@<version>
 *   4. Merges with existing marketplace.json to preserve downloadCount/starCount
 *   5. Writes the updated marketplace.json
 */

import fs   from 'fs';
import path from 'path';

// ─────────────────────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────────────────────

interface ManifestJson {
  id:            string;
  name:          string;
  displayName:   string;
  description:   string;
  version:       string;
  author:        string;
  authorClass:   string;
  type:          string;
  license:       string;
  icon:          string;
  entry:         string;
  uiEntry?:      string;
  permissions:   Array<{ scope: string; reason: string }>;
  playbackHooks: boolean;
  uiSupport:     boolean;
  cliSupport:    boolean;
}

interface PackageJson {
  name:        string;
  version:     string;
  description: string;
  author?:     string;
  blackvideo?: {
    category?:    string;
    tags?:        string[];
    iconUrl?:     string;
    bannerUrl?:   string;
    screenshots?: string[];
    featured?:    boolean;
    tagline?:     string;
  };
}

interface MarketplaceEntry {
  id:              string;
  slug:            string;
  name:            string;
  tagline:         string;
  description:     string;
  version:         string;
  author:          string;
  authorClass:     string;
  category:        string;
  type:            string;
  license:         string;
  tags:            string[];
  iconUrl:         string | null;
  bannerUrl:       string | null;
  screenshots:     string[];
  githubRepo:      string;
  githubReleaseTag: string;
  downloadUrl:     string;
  downloadCount:   number;
  starCount:       number;
  featured:        boolean;
  status:          string;
  publishedAt:     number;
  permissions:     Array<{ scope: string; reason: string }>;
  playbackHooks:   boolean;
  uiSupport:       boolean;
  cliSupport:      boolean;
}

interface MarketplaceJson {
  _meta:      object;
  extensions: MarketplaceEntry[];
}

// ─────────────────────────────────────────────────────────────
//  Config
// ─────────────────────────────────────────────────────────────

const ROOT          = path.resolve(process.cwd());
const EXT_DIR       = path.join(ROOT, 'extensions');
const OUTPUT_FILE   = path.join(ROOT, 'marketplace.json');
const GITHUB_REPO   = process.env.GITHUB_REPO ?? 'BlackBlazent/blackvideo-extensions';
const TARGET_TAG    = process.env.RELEASE_TAG;  // if set, only update this extension

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────

function readJson<T>(filePath: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
  } catch {
    return null;
  }
}

function buildDownloadUrl(repo: string, id: string, version: string): string {
  const tag   = `${id}@${version}`;
  const asset = `${id}-${version}.bvx`;
  return `https://github.com/${repo}/releases/download/${encodeURIComponent(tag)}/${asset}`;
}

function rawIconUrl(repo: string, id: string, iconFile: string): string {
  return `https://raw.githubusercontent.com/${repo}/main/extensions/${id}/${iconFile}`;
}

// ─────────────────────────────────────────────────────────────
//  Main
// ─────────────────────────────────────────────────────────────

function run(): void {
  console.log('[marketplace] Reading existing marketplace.json...');
  const existing = readJson<MarketplaceJson>(OUTPUT_FILE) ?? { _meta: {}, extensions: [] };
  const existingMap = new Map<string, MarketplaceEntry>(
    existing.extensions.map(e => [e.id, e])
  );

  // List all extension directories
  const extDirs = fs
    .readdirSync(EXT_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.'))
    .map(d => d.name);

  const updated: MarketplaceEntry[] = [];

  for (const id of extDirs) {
    // If a specific tag was targeted, skip other extensions
    if (TARGET_TAG) {
      const [tagId] = TARGET_TAG.split('@');
      if (id !== tagId) {
        const prev = existingMap.get(id);
        if (prev) updated.push(prev);
        continue;
      }
    }

    const manifestPath = path.join(EXT_DIR, id, 'manifest.json');
    const packagePath  = path.join(EXT_DIR, id, 'package.json');

    const manifest = readJson<ManifestJson>(manifestPath);
    if (!manifest) {
      console.warn(`[marketplace] Skipping ${id}: no manifest.json`);
      continue;
    }

    const pkg = readJson<PackageJson>(packagePath);
    const bvMeta = pkg?.blackvideo ?? {};
    const prev   = existingMap.get(id);

    const entry: MarketplaceEntry = {
      id:               manifest.id,
      slug:             manifest.id,
      name:             manifest.displayName,
      tagline:          bvMeta.tagline ?? manifest.description.slice(0, 80),
      description:      manifest.description,
      version:          manifest.version,
      author:           manifest.author,
      authorClass:      manifest.authorClass,
      category:         bvMeta.category ?? 'extensions',
      type:             manifest.type,
      license:          manifest.license,
      tags:             bvMeta.tags ?? [],
      iconUrl:          bvMeta.iconUrl ?? rawIconUrl(GITHUB_REPO, id, manifest.icon),
      bannerUrl:        bvMeta.bannerUrl ?? null,
      screenshots:      bvMeta.screenshots ?? [],
      githubRepo:       GITHUB_REPO,
      githubReleaseTag: `${manifest.id}@${manifest.version}`,
      downloadUrl:      buildDownloadUrl(GITHUB_REPO, manifest.id, manifest.version),
      // Preserve existing stats — never reset them
      downloadCount:    prev?.downloadCount ?? 0,
      starCount:        prev?.starCount     ?? 0,
      featured:         bvMeta.featured     ?? prev?.featured ?? false,
      status:           'published',
      publishedAt:      prev?.publishedAt   ?? Date.now(),
      permissions:      manifest.permissions,
      playbackHooks:    manifest.playbackHooks,
      uiSupport:        manifest.uiSupport,
      cliSupport:       manifest.cliSupport,
    };

    updated.push(entry);
    console.log(`[marketplace] ${prev ? 'Updated' : 'Added'}: ${id}@${manifest.version}`);
  }

  const output: MarketplaceJson = {
    _meta: {
      generated:   new Date().toISOString(),
      repo:        GITHUB_REPO,
      version:     '1',
      description: 'Curated marketplace index for BlackVideo extensions. Updated automatically on each GitHub release by the bvx publish pipeline.',
    },
    extensions: updated.sort((a, b) => {
      // Featured first, then by publishedAt descending
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.publishedAt - a.publishedAt;
    }),
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2) + '\n', 'utf-8');
  console.log(`[marketplace] Written: marketplace.json (${updated.length} extension(s))`);
}

run();