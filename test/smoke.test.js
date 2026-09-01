import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(root, "index.js");

function run(args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, ...args], {
      cwd,
      env: { ...process.env, NO_COLOR: "1" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => (stdout += d));
    child.stderr.on("data", (d) => (stderr += d));
    child.on("error", reject);
    child.on("close", (code) => resolve({ code, stdout, stderr }));
  });
}

describe("create-pinarkive-app smoke", () => {
  it("scaffolds vite starter into a temp directory", async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cpa-"));
    const name = "smoke-app";
    const result = await run([name, "--template", "vite", "--yes"], tmp);
    assert.equal(result.code, 0, result.stderr || result.stdout);
    const dest = path.join(tmp, name);
    assert.ok(fs.existsSync(path.join(dest, "package.json")));
    assert.ok(fs.existsSync(path.join(dest, "vite.config.ts")));
    assert.ok(!fs.existsSync(path.join(dest, ".git")));
    fs.rmSync(tmp, { recursive: true, force: true });
  });
});
