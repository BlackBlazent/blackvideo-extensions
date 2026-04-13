![VISITORS](https://api.visitorbadge.io/api/VisitorHit?user=BlackBlazent&repo=blackvideo-extensions&countColor=%237B1E7A)

# blackvideo-extensions

Official extension registry for [BlackVideo (Zephyra)](https://blackvideo-centric-site.onrender.com) — a Tauri v2 desktop video player built by BlackBlazent.

This repository serves two purposes: it is the distribution point for first-party extensions authored by BlackBlazent, and it is the submission target for third-party extensions published to the BlackVideo marketplace.

---

## Repository structure

```
blackvideo-extensions/
├── extensions/
│   ├── <extension-id>/
│   │   ├── manifest.json
│   │   ├── package.json
│   │   ├── icon.png
│   │   ├── index.ts
│   │   ├── config/
│   │   │   ├── extension.install.handler.ts
│   │   │   ├── extension.active.handler.ts
│   │   │   ├── extension.deactivate.handler.ts
│   │   │   └── extension.uninstall.handler.ts
│   │   └── src/
│   │       └── components/
│   │           ├── extension.container.card.tsx
│   │           └── ui/
│   │               ├── navigation.tsx
│   │               └── bottomSpace.tsx
│   └── index.json
├── marketplace.json
├── CONTRIBUTING.md
└── README.md
```

### `extensions/`

Each subdirectory is a single extension, named by its canonical `id` (kebab-case, npm-compatible). The directory name must exactly match the `id` field in `manifest.json`.

### `extensions/index.json`

Auto-generated registry index. Lists every extension id present in this repository. Updated automatically on each merged pull request. Do not edit by hand.

### `marketplace.json`

Curated marketplace listing consumed by the BlackVideo Centric Website marketplace page and the in-app marketplace. Contains display metadata, download URLs, and version information for all published extensions. Updated by the release pipeline when a new GitHub release is tagged.

---

## Extension format

Extensions are distributed as `.bvx` files — standard zip archives containing at minimum a `manifest.json`. The `blackvideo-extension-engine` CLI handles scaffolding, validation, building, and publishing.

```
npm install -g blackvideo-extension-engine
bvx init <extension-id>
```

### `manifest.json` schema

```json
{
  "id": "video-map-space",
  "name": "video-map-space",
  "displayName": "Video Map Space",
  "description": "Geographic video analysis using interactive map overlays.",
  "version": "1.0.0",
  "author": "Jednaz Lonestamp",
  "authorClass": "jednaz-lonestamp",
  "type": "extension",
  "license": "free",
  "icon": "icon.png",
  "entry": "index.ts",
  "uiEntry": "src/components/extension.container.card",
  "permissions": [
    {
      "scope": "playback.read",
      "reason": "Reads current video timestamp to synchronise map position."
    }
  ],
  "playbackHooks": true,
  "uiSupport": true,
  "cliSupport": false
}
```

#### Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Unique identifier. Kebab-case, npm-compatible. Must match directory name. |
| `name` | string | yes | Same as `id`. Used by the package registry. |
| `displayName` | string | yes | Human-readable name shown in the marketplace. |
| `description` | string | yes | Short description, minimum 10 characters. |
| `version` | string | yes | Semver string. Must be bumped on every published update. |
| `author` | string | yes | Author display name. |
| `authorClass` | string | yes | Author identifier used as a CSS class. Kebab-case. |
| `type` | string | yes | One of: `extension`, `plugin`, `theme`, `addon`, `dev-tool`, `subtitle`. |
| `license` | string | yes | One of: `free`, `trial`, `subscription`, `enterprise`, `internal`. |
| `icon` | string | yes | Path to icon file, relative to extension root. Recommended: 256x256 PNG. |
| `entry` | string | yes | Entry point file, relative to extension root. |
| `uiEntry` | string | no | UI component entry, relative to extension root. Required when `uiSupport` is true. |
| `permissions` | array | yes | At least one permission object with `scope` and `reason`. |
| `playbackHooks` | boolean | yes | Whether the extension integrates with VideoTheaterStage. |
| `uiSupport` | boolean | yes | Whether the extension provides a UI container card. |
| `cliSupport` | boolean | yes | Whether the extension exposes a CLI runner. |

#### Allowed permission scopes

```
playback.read
playback.write
filesystem.read
network.fetch
store.write
ipc.emit
```

Blocked combinations: `filesystem.read` + `network.fetch`, `ipc.emit` + `store.write`.

---

## Distribution model

### First-party extensions (BlackBlazent)

Extensions authored by BlackBlazent are committed directly to the `extensions/` directory and bundled into the BlackVideo app via `AppRegistry/extensions/` at build time. They are available immediately on first install without any marketplace interaction.

### Third-party extensions

Third-party extensions are not bundled with the app. They are published to this repository as GitHub releases. The release asset is a `.bvx` file. Metadata is registered in Convex and surfaced in the marketplace.

Distribution flow:

```
bvx init                         scaffold extension
bvx build                        compile to .bvx
bvx publish                      upload .bvx to GitHub release, register in Convex
                                      |
             +------------------------+------------------------+
             |                                                 |
   Centric Website                                     BlackVideo App
   Marketplace page                                    Extensions page
   (fetch from Convex)                                 (fetch from Convex)
             |                                                 |
         Install click                                    Install click
             |                                                 |
   mirror slug to localStorage                   download .bvx from GitHub
                                                 extract manifest.json
                                                 register in extensionRegistry
                                                 icon appears in toolbar
```

---

## Installation in BlackVideo

Extensions installed from the marketplace are stored in the Tauri application store (`bv_ext_registry_v1`) and survive restarts. Extensions placed manually in `AppRegistry/extensions/` are scanned at startup via the `scan_extension_dirs` Rust command and registered automatically.

Extension install paths:

| Source | Storage | Persistence |
|---|---|---|
| AppRegistry (built-in) | Bundled in app package | Permanent (part of app) |
| Marketplace install | Tauri store | Permanent until uninstalled |
| Package.json upload | Tauri store | Permanent until uninstalled |

---

## Versioning

This repository follows the extension's own semver. Each extension is versioned independently. A new GitHub release must be tagged with the format `<extension-id>@<version>`, for example `video-map-space@1.2.0`. The `bvx publish` command handles this automatically.

---

## Security

The BlackVideo extension verifier validates every manifest before install against the schema above. Extensions that declare blocked permission combinations are rejected at install time. The `bvx validate` command runs the same checks locally before publish.

Extensions have no filesystem write access outside their own store namespace and cannot make arbitrary network requests unless `network.fetch` is declared and approved during review.

---

## CLI reference

The `blackvideo-extension-engine` package provides the following commands.

```bash
bvx init <id>          Scaffold a new extension with interactive prompts
bvx validate           Validate manifest.json against the schema
bvx build              Bundle extension into .bvx archive
bvx dev                Watch mode with live re-validation
bvx publish            Build, create GitHub release, register in marketplace
bvx upgrade            Check for CLI updates
bvx info               Print environment diagnostics
```

Aliases: `blackvideo-ext`, `bv-ext`, `bvx`.

Install:

```bash
npm install -g blackvideo-extension-engine
```

---

## License

First-party extensions in this repository are licensed under the terms specified in each extension's `manifest.json`. The repository structure, tooling, and documentation are Copyright (c) 2026 BlackBlazent. All rights reserved.

Third-party extensions retain their own licenses as declared in their respective `manifest.json` and `package.json` files. BlackBlazent does not claim ownership of third-party submissions.