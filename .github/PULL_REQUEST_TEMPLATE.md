## Extension submission

**Extension id:** <!-- must match the directory name under extensions/ -->
**Version:** <!-- semver, must match manifest.json and package.json -->
**Type:** <!-- extension | plugin | theme | addon | dev-tool | subtitle -->
**License model:** <!-- free | trial | subscription | enterprise | internal -->

---

## Description

<!-- Describe what this extension does in 2–4 sentences. Focus on what problem it solves for BlackVideo users. -->

---

## Changes in this submission

<!-- For new extensions: "Initial submission." For updates, describe what changed. -->

---

## Checklist

Complete every item before requesting review. Unchecked items will result in the pull request being returned.

### Manifest and package

- [ ] `manifest.json` is present and passes `bvx validate` without errors
- [ ] `package.json` is present with a matching `version` field
- [ ] Extension `id` in `manifest.json` matches the directory name under `extensions/`
- [ ] `version` has been bumped from the previously published version (updates only)
- [ ] All permission `reason` fields are complete sentences that specifically describe what user data is accessed and why

### Icon

- [ ] `icon.png` is present at the extension root
- [ ] Icon is 256x256 pixels
- [ ] Icon is not the CLI-generated placeholder (1x1 transparent PNG)

### Code

- [ ] No `node_modules/` directory committed
- [ ] No compiled output (`dist/`) committed
- [ ] No `.env` or credential files committed
- [ ] Source is TypeScript and not obfuscated or minified
- [ ] No runtime network requests to undeclared external domains

### Testing

- [ ] Extension loads correctly when placed in `AppRegistry/extensions/` locally
- [ ] Extension icon appears in the BlackVideo toolbar after restart
- [ ] Extension popup UI opens and functions correctly
- [ ] Extension can be uninstalled without errors

### Permissions (complete for each declared scope)

<!-- List each permission scope and its specific justification. -->

| Scope | Justification |
|---|---|
| <!-- scope --> | <!-- why it is needed --> |

---

## Screenshots or recordings

<!-- Optional but strongly recommended for new UI extensions. Paste images or a short video link showing the extension in operation inside BlackVideo. -->

---

## Notes for reviewers

<!-- Anything the reviewer should know: known limitations, testing instructions, relevant external documentation. Leave blank if not applicable. -->