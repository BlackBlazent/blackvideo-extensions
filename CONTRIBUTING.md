# Contributing to blackvideo-extensions

This document describes how to submit a third-party extension to the BlackVideo marketplace, how to update an existing extension, and what standards submissions must meet to be accepted.

---

## Before you begin

### Required tools

- Node.js 18 or later
- `blackvideo-extension-engine` CLI (`npm install -g blackvideo-extension-engine`)
- A GitHub account
- A BlackBlazent Developer Portal account at [blackvideo-centric-site.onrender.com/marketplace](https://blackvideo-centric-site.onrender.com/marketplace)

### Developer account

You must have a registered developer account to publish extensions to the marketplace. Registration is free. Your account is linked to your published extensions and cannot be transferred.

---

## Submitting a new extension

### Step 1 — Scaffold

Run the CLI in a directory of your choice. The `id` must be unique across the registry, kebab-case, and npm-package-name compatible.

```bash
bvx init <extension-id>
cd <extension-id>
```

The CLI will prompt for metadata and generate the full extension structure including manifest, package.json, lifecycle handlers, and UI components.

### Step 2 — Develop

Implement your extension logic inside the generated structure. Entry point: `index.ts`. UI component: `src/components/extension.container.card.tsx`.

Run in watch mode during development:

```bash
bvx dev
```

Validate your manifest at any time:

```bash
bvx validate
```

### Step 3 — Replace the placeholder icon

The scaffolded `icon.png` is a 1x1 transparent placeholder. Replace it with a 256x256 PNG before publishing. The icon appears in the BlackVideo toolbar and marketplace listing.

### Step 4 — Build

```bash
bvx build
```

This produces a `.bvx` file (a zip archive containing your compiled extension and manifest). Verify the output in the `dist/` directory.

### Step 5 — Publish

```bash
bvx publish
```

This command:

1. Runs `bvx validate` and aborts if validation fails
2. Runs `bvx build`
3. Creates a GitHub release in your fork of this repository tagged `<id>@<version>`
4. Uploads the `.bvx` as a release asset
5. Registers the extension metadata in Convex via your developer token

You will be prompted for your developer token on first publish. The token is stored in your local `.bvx-config` file and not committed to version control.

### Step 6 — Open a pull request

Fork this repository, add your extension directory under `extensions/<id>/`, and open a pull request against the `main` branch using the pull request template.

The pull request must include:

- The full extension directory at `extensions/<id>/`
- A valid `manifest.json` and `package.json`
- A 256x256 `icon.png` (not the placeholder)
- No compiled output or `node_modules`

The `.gitignore` in the template scaffold already excludes build artifacts.

---

## Updating an existing extension

### Patch or minor update

1. Make your changes
2. Bump the version in `manifest.json` and `package.json`: `npm version patch` or `npm version minor`
3. Run `bvx publish`
4. Open a pull request with the updated extension directory

### Major update

Major updates (breaking changes to API surface or permissions) require a note in the pull request description explaining what changed and why. If new permissions are added, each new scope must include a clear `reason` explaining what user data is accessed and why.

---

## Review process

Pull requests are reviewed by BlackBlazent maintainers. Review criteria:

- Manifest validates against the schema without errors or warnings
- Icon is present and meets the 256x256 PNG requirement
- Permissions are minimal and each `reason` field is clear and specific
- No forbidden permission combinations (`filesystem.read` + `network.fetch`, `ipc.emit` + `store.write`)
- Extension id does not conflict with an existing entry
- No external dependencies fetched at runtime without `network.fetch` permission declared
- Code does not contain obfuscated logic
- No telemetry or analytics that are not declared in permissions

There is no guaranteed turnaround time. Extensions that fail validation are closed with a comment explaining the required changes. Resubmit after addressing the feedback.

---

## Code standards

### TypeScript

All extension code must be TypeScript. Strict mode is recommended. The `bvx build` command compiles via the configuration in your generated `tsconfig.json`.

### Manifest

The `reason` field on each permission must be a complete sentence explaining specifically what user data is accessed and why. Vague reasons such as "needed for functionality" will be rejected.

Good:

```json
{
  "scope": "playback.read",
  "reason": "Reads the current video timestamp to synchronise the map marker position."
}
```

Rejected:

```json
{
  "scope": "playback.read",
  "reason": "For the extension to work."
}
```

### Versioning

Follow semver strictly. The version in `manifest.json` must match the version in `package.json`. A published version cannot be republished — always bump before submitting an update.

### Icon

- Format: PNG
- Size: exactly 256x256 pixels
- Background: transparent is preferred
- No text in the icon
- No placeholder or generated placeholder icon

---

## What is not accepted

The following will result in an immediate close without review:

- Extensions that access or transmit user data not covered by declared permissions
- Extensions that include compiled binaries or native modules
- Extensions that make network requests to domains not listed in `network.fetch` reason
- Extensions that attempt to modify the BlackVideo application outside their own store namespace
- Extensions with obfuscated, minified, or machine-generated source
- Extensions that duplicate the id of an existing published extension
- Extensions with a placeholder `icon.png`
- Extensions that have not been validated with `bvx validate` (validation errors present)

---

## Local testing before submission

Before opening a pull request, test your extension locally by copying the extension directory into your BlackVideo installation's `AppRegistry/extensions/` folder and restarting the app. The extension should appear in the toolbar automatically.

You can also test the upload flow by going to the Extensions portal in BlackVideo, clicking the Add button, and uploading your `package.json`.

---

## Questions

Open an issue in this repository for questions about the submission process. For bugs in the `blackvideo-extension-engine` CLI, open an issue in the [blackvideo-extensions-engine](https://github.com/BlackBlazent/blackvideo-extensions-engine) repository.