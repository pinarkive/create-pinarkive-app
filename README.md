# create-pinarkive-app

Small **CLI** to scaffold an official **PinArkive** starter into a new folder—no git history in the output (uses [degit](https://github.com/Rich-Harris/degit)).

These starters are intended to be published as public repositories under the PinArkive GitHub organization and are free to use.

## What it does

- Prompts for a **project folder name** and **starter** (or use flags).
- Downloads the selected repo’s **`main`** branch from GitHub.
- Ensures the target directory is **missing or empty**.
- Removes **`.git`** from the generated project if present.
- Prints **next steps** (`cd`, env file, `npm install`, `npm run dev`).

Generated projects come from the official PinArkive starter repositories:

| Template flag | Source repo |
|---------------|-------------|
| `next` | [pinarkive/starter-next-supabase](https://github.com/pinarkive/starter-next-supabase) (`main`) |
| `vite` | [pinarkive/starter-vite-react](https://github.com/pinarkive/starter-vite-react) (`main`) |
| `workers` | [pinarkive/starter-hono-workers](https://github.com/pinarkive/starter-hono-workers) (`main`) |

## Usage

```bash
npx create-pinarkive-app
```

Non-interactive (requires folder name + template):

```bash
npx create-pinarkive-app my-app --template next --yes
npx create-pinarkive-app my-app --template vite --yes
npx create-pinarkive-app my-app --template workers --yes
```

Flags:

- `--template next` | `vite` | `workers` (alias: `-t`)
- `--yes` / `-y` — skip prompts (must pass project name and `--template`)

## Local development

```bash
cd create-pinarkive-app
npm install
npm run dev
```

`npm run dev` runs `node --watch index.js` (Node 18+). Use `npm start` for a single run.

### Test locally without publishing

From this package directory:

```bash
npm link
```

Then elsewhere:

```bash
create-pinarkive-app
# or
node /path/to/create-pinarkive-app/index.js
```

To unlink: `npm unlink -g create-pinarkive-app` (or `npm unlink create-pinarkive-app` from the package folder).

## Publish to npm

1. Bump `version` in `package.json`.
2. Ensure you are logged in: `npm login`
3. Publish scoped or unscoped as your org allows:

   ```bash
   npm publish --access public
   ```

4. The **`create-pinarkive-app`** binary is declared in `package.json` → `bin`.

Requires Node **18+**.

## Requirements

- Network access to clone from GitHub.
- Write permission in the current working directory.

## Future ideas

- **Auto install** — optional `npm install` in the new folder after scaffold.
- **More flags** — additional non-interactive options (e.g. package manager).
- **Docs media** — link preview GIFs in starter READMEs after they are recorded post-publish.

## License

[MIT](./LICENSE)
