#!/usr/bin/env node

/**
 * create-pinarkive-app — scaffold official PinArkive starters via degit (no git history).
 */

import degit from "degit";
import fs from "fs";
import path from "path";
import prompts from "prompts";

const REPOS = {
  next: "pinarkive/starter-next-supabase#main",
  vite: "pinarkive/starter-vite-react#main",
  workers: "pinarkive/starter-hono-workers#main",
};

const STARTER_CHOICES = [
  { title: "Next.js + Supabase", value: "next", description: "App Router, Tailwind, optional Supabase" },
  { title: "Vite + React", value: "vite", description: "SPA + Express upload proxy" },
  { title: "Hono + Workers", value: "workers", description: "Cloudflare Worker + HTML UI" },
];

function parseArgs(argv) {
  let yes = false;
  let template = null;
  let projectName = null;
  const rest = [];

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--yes" || a === "-y") {
      yes = true;
      continue;
    }
    if (a === "--template" || a === "-t") {
      const v = argv[i + 1];
      if (!v || v.startsWith("-")) {
        console.error("Error: --template requires a value: next | vite | workers");
        process.exit(1);
      }
      template = v.toLowerCase();
      i++;
      continue;
    }
    if (a.startsWith("-")) {
      console.error(`Error: unknown flag ${a}`);
      process.exit(1);
    }
    if (projectName === null) projectName = a;
    else rest.push(a);
  }

  if (rest.length > 0) {
    console.error("Error: unexpected arguments:", rest.join(" "));
    process.exit(1);
  }

  return { yes, template, projectName };
}

function validateTemplate(t) {
  if (!t) return null;
  if (REPOS[t]) return t;
  console.error(`Error: invalid template "${t}". Use: next | vite | workers`);
  process.exit(1);
}

function isDirectoryEmptyOrMissing(dir) {
  if (!fs.existsSync(dir)) return true;
  const entries = fs.readdirSync(dir);
  return entries.length === 0;
}

function removeGitIfPresent(projectDir) {
  const gitDir = path.join(projectDir, ".git");
  if (fs.existsSync(gitDir)) {
    fs.rmSync(gitDir, { recursive: true, force: true });
  }
}

function printNextSteps(templateKey, projectName) {
  const cd = `cd ${projectName}`;

  const env =
    templateKey === "workers"
      ? "cp .dev.vars.example .dev.vars\n# Edit .dev.vars — set PINARKIVE_API_KEY"
      : templateKey === "next"
        ? "cp .env.example .env.local\n# Edit .env.local — set PINARKIVE_API_KEY"
        : "cp .env.example .env\n# Edit .env — set PINARKIVE_API_KEY";

  console.log("\nDone. Next steps:\n");
  console.log(`  ${cd}`);
  console.log(`  ${env.split("\n").join("\n  ")}`);
  console.log("  npm install");
  console.log("  npm run dev");
  console.log("\nDocs: see README.md in the new project.\n");
}

async function main() {
  const { yes, template: flagTemplate, projectName: argName } = parseArgs(process.argv.slice(2));
  const templateFlag = validateTemplate(flagTemplate);

  if (yes && (!argName || !templateFlag)) {
    console.error(
      "Error: --yes requires a project folder name and --template next|vite|workers.\n" +
        "Example: npx create-pinarkive-app my-app --template next --yes"
    );
    process.exit(1);
  }

  let projectName = argName;
  let templateKey = templateFlag;

  const onCancel = () => {
    console.log("\nCancelled.");
    process.exit(0);
  };

  if (!yes) {
    if (!projectName) {
      const r = await prompts(
        {
          type: "text",
          name: "name",
          message: "Project folder name",
          initial: "pinarkive-app",
          validate: (v) => {
            const s = String(v).trim();
            if (!s) return "Name is required";
            return /^[a-zA-Z0-9._-]+$/.test(s) || "Use letters, numbers, dot, underscore, or hyphen";
          },
        },
        { onCancel }
      );
      if (!r?.name) process.exit(0);
      projectName = String(r.name).trim();
    }

    if (!templateKey) {
      const r = await prompts(
        {
          type: "select",
          name: "template",
          message: "Which PinArkive starter?",
          choices: STARTER_CHOICES,
        },
        { onCancel }
      );
      if (!r?.template) process.exit(0);
      templateKey = r.template;
    }
  }

  const target = path.resolve(process.cwd(), projectName);

  if (!isDirectoryEmptyOrMissing(target)) {
    console.error(`Error: "${projectName}" already exists and is not empty. Choose another name or empty the folder.`);
    process.exit(1);
  }

  const src = REPOS[templateKey];
  console.log(`\nScaffolding ${src.replace("#main", "")} → ${projectName} …`);

  const emitter = degit(src, { cache: false, force: true });

  emitter.on("info", (info) => {
    if (info.message) console.log("  " + info.message);
  });

  try {
    await emitter.clone(target);
  } catch (err) {
    console.error("\nError: could not download template.");
    console.error(err?.message || err);
    console.error("\nCheck your network and that the repo exists: https://github.com/" + src.split("#")[0]);
    process.exit(1);
  }

  removeGitIfPresent(target);

  console.log(`\nCreated ${projectName} (${templateKey}).`);
  printNextSteps(templateKey, projectName);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
