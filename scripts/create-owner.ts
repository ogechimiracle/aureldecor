/**
 * Create (or update) the studio owner account — the only account that can
 * access /admin. There is no public registration and no hardcoded default
 * password anywhere in this project.
 *
 * Usage:
 *   npm run owner:create -- --name "Jane Doe" --email jane@studio.com
 *   npm run owner:create -- --name "Jane Doe" --email jane@studio.com --password "secret123456"
 *   npm run owner:create -- --email jane@studio.com --password "secret123456" --update
 */
import readline from "node:readline";
import { sql } from "drizzle-orm";
import { getDb, resolveDatabaseFile } from "../db";
import { users } from "../db/schema";
import {
  createOwner,
  findOwnerByEmail,
  updateOwnerPassword,
  updateOwnerProfile,
} from "../server/services/auth";

interface Args {
  name?: string;
  email?: string;
  password?: string;
  update?: boolean;
  help?: boolean;
}

const MIN_PASSWORD_LENGTH = 12;

function parseArgs(argv: string[]): Args {
  const args: Args = {};
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    const value = argv[i + 1];
    switch (flag) {
      case "--name":
        args.name = value;
        i++;
        break;
      case "--email":
        args.email = value;
        i++;
        break;
      case "--password":
        args.password = value;
        i++;
        break;
      case "--update":
        args.update = true;
        break;
      case "--help":
      case "-h":
        args.help = true;
        break;
      default:
        break;
    }
  }
  return args;
}

function prompt(question: string, options: { hidden?: boolean } = {}): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    if (!options.hidden || !process.stdin.isTTY) {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer.trim());
      });
      return;
    }

    process.stdout.write(question);
    const input = process.stdin;
    let value = "";
    const wasRaw = typeof input.isRaw === "boolean" ? input.isRaw : false;
    input.setRawMode?.(true);
    input.resume();

    const onData = (chunk: Buffer) => {
      const char = chunk.toString("utf8");
      if (char === "\n" || char === "\r") {
        input.setRawMode?.(wasRaw);
        input.pause();
        input.removeListener("data", onData);
        process.stdout.write("\n");
        rl.close();
        resolve(value);
        return;
      }
      if (char.charCodeAt(0) === 3) {
        process.exit(130);
      }
      if (char === "\u007f" || char === "\b") {
        value = value.slice(0, -1);
        process.stdout.write("\b \b");
        return;
      }
      if (char.charCodeAt(0) < 32) return;
      value += char;
      process.stdout.write("*");
    };

    input.on("data", onData);
  });
}

async function ensureMigrated(): Promise<void> {
  try {
    await getDb().select({ count: sql<number>`count(*)` }).from(users).limit(1);
  } catch (error) {
    console.error(
      "The database is not ready. Run `npm run db:init` first.",
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(`Create or update the studio owner account.

Options:
  --name "Full name"     Owner display name
  --email address        Owner email (login)
  --password "secret"    Password (min ${MIN_PASSWORD_LENGTH} chars; prompted if omitted)
  --update               Update the account if the email already exists
  -h, --help             Show this help

Examples:
  npm run owner:create -- --name "Jane Doe" --email jane@studio.com
  npm run owner:create -- --email jane@studio.com --password "correct horse battery" --update`);
    return;
  }

  console.log(`Database: ${resolveDatabaseFile()}`);
  await ensureMigrated();

  const emailInput = args.email ?? (await prompt("Owner email: "));
  const email = emailInput.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error("Please provide a valid email address.");
    process.exitCode = 1;
    return;
  }

  const existing = await findOwnerByEmail(email);

  if (existing && !args.update) {
    console.error(
      `An owner account already exists for ${email}. Re-run with --update to change its name or password.`,
    );
    process.exitCode = 1;
    return;
  }

  let name = args.name?.trim();
  if (!existing && !name) {
    name = (await prompt("Owner name: ")).trim();
    if (!name) {
      console.error("Name is required.");
      process.exitCode = 1;
      return;
    }
  }

  let password = args.password;
  if (!password) {
    password = await prompt(`Password (min ${MIN_PASSWORD_LENGTH} chars): `, {
      hidden: true,
    });
  }
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    console.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
    process.exitCode = 1;
    return;
  }

  if (existing) {
    if (name) await updateOwnerProfile(existing.id, { name, email: existing.email });
    await updateOwnerPassword(existing.id, password);
    console.log(`Owner account updated for ${existing.email}`);
    return;
  }

  const user = await createOwner({
    name: name ?? email.split("@")[0],
    email,
    password,
  });
  console.log(`Owner account created: ${user.name} <${user.email}>`);
  console.log("You can now sign in at /admin/login");
}

main().catch((error) => {
  console.error("Failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
