import { existsSync, readFileSync } from "node:fs";
import { spawn } from "node:child_process";

function parseEnv(content) {
  const out = {};
  const lines = content.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const eqIndex = line.indexOf("=");
    if (eqIndex <= 0) continue;

    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    out[key] = value;
  }

  return out;
}

const [, , envFile, ...cmdParts] = process.argv;

if (!envFile || cmdParts.length === 0) {
  console.error("Usage: node scripts/run-with-env.mjs <env-file> <command> [...args]");
  process.exit(1);
}

if (!existsSync(envFile)) {
  console.error(`Env file not found: ${envFile}`);
  process.exit(1);
}

const envContent = readFileSync(envFile, "utf8");
const loadedEnv = parseEnv(envContent);

const child = spawn(cmdParts[0], cmdParts.slice(1), {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, ...loadedEnv },
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});

