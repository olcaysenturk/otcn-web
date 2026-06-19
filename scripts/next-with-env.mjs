#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import process from "node:process";

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    console.error(`[next-with-env] Env file not found: ${filePath}`);
    process.exit(1);
  }

  const raw = readFileSync(filePath, "utf8");
  const lines = raw.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;

    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

const args = process.argv.slice(2);
if (args.length < 2 || args[0] !== "--env-file") {
  console.error("Usage: node scripts/next-with-env.mjs --env-file <path> <next args...>");
  process.exit(1);
}

const envFile = resolve(process.cwd(), args[1]);
const nextArgs = args.slice(2);

if (nextArgs.length === 0) {
  console.error("Usage: node scripts/next-with-env.mjs --env-file <path> <next args...>");
  process.exit(1);
}

loadEnvFile(envFile);

const nextBin = resolve(process.cwd(), "node_modules", "next", "dist", "bin", "next");
const child = spawn(process.execPath, [nextBin, ...nextArgs], {
  cwd: process.cwd(),
  env: process.env,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
