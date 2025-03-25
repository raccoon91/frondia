import { spawn } from "child_process";
import { writeFileSync } from "fs";
import { program } from "commander";
import chalk from "chalk";

program.version("1.0.0");

program.command("start").action(() => {
  console.log(chalk.blue("Supabase Container Start"));

  const run = spawn("pnpm", ["dlx", "supabase", "start", "--workdir", "src/lib", "--ignore-health-check"]);

  run.stdout.on("data", (data) => {
    process.stdout.write(`${data}`);
  });

  run.stderr.on("data", (data) => {
    process.stdout.write(`${data}`);
  });

  run.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    console.log(chalk.green("Done"));
  });
});

program.command("stop").action(() => {
  console.log(chalk.blue("Supabase Container Stop"));

  const run = spawn("pnpm", ["dlx", "supabase", "stop", "--workdir", "src/lib"]);

  run.stdout.on("data", (data) => {
    process.stdout.write(`${data}`);
  });

  run.stderr.on("data", (data) => {
    process.stdout.write(`${data}`);
  });

  run.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    console.log(chalk.green("Done"));
  });
});

program.command("serve").action(() => {
  console.log(chalk.blue("Supabase Serve Edge Functions"));

  const run = spawn("pnpm", ["dlx", "supabase", "functions", "serve", "--workdir", "src/lib"]);

  run.stdout.on("data", (data) => {
    process.stdout.write(`${data}`);
  });

  run.stderr.on("data", (data) => {
    process.stdout.write(`${data}`);
  });

  run.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });

  process.on("SIGINT", () => {
    console.log(chalk.green("Exit"));

    process.exit();
  });
});

program.command("deploy").action(() => {
  console.log(chalk.blue("Supabase Deploy Edge Functions"));

  const run = spawn("pnpm", [
    "dlx",
    "supabase",
    "functions",
    "deploy",
    "goals",
    "--project-ref",
    process.env.VITE_SUPABASE_PROJECT_ID,
    "--workdir",
    "src/lib",
  ]);

  run.stdout.on("data", (data) => {
    process.stdout.write(`${data}`);
  });

  run.stderr.on("data", (data) => {
    process.stdout.write(`${data}`);
  });

  run.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });

  process.on("SIGINT", () => {
    console.log(chalk.green("Exit"));

    process.exit();
  });
});

program.command("link").action(() => {
  console.log(chalk.blue("Supabase Database Link"));

  const run = spawn("pnpm", [
    "dlx",
    "supabase",
    "link",
    "--project-ref",
    process.env.VITE_SUPABASE_PROJECT_ID,
    "--password",
    process.env.VITE_SUPABASE_DATABASE_PASSWORD,
    "--workdir",
    "src/lib",
  ]);

  run.stdout.on("data", (data) => {
    process.stdout.write(`${data}`);
  });

  run.stderr.on("data", (data) => {
    process.stdout.write(`${data}`);
  });

  run.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    console.log(chalk.green("Done"));
  });
});

program.command("pull").action(() => {
  console.log(chalk.blue("Supabase Database Pull"));

  const run = spawn("pnpm", ["dlx", "supabase", "db", "pull", "--workdir", "src/lib"]);

  run.stdout.on("data", (data) => {
    process.stdout.write(`${data}`);
  });

  run.stderr.on("data", (data) => {
    process.stdout.write(`${data}`);
  });

  run.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    console.log(chalk.green("Done"));
  });
});

program.command("types").action(() => {
  console.log(chalk.blue("Supabase Generate Types"));

  const run = spawn("pnpm", [
    "dlx",
    "supabase",
    "gen",
    "types",
    "typescript",
    "--project-id",
    process.env.VITE_SUPABASE_PROJECT_ID,
  ]);

  run.stdout.on("data", (data) => {
    writeFileSync("src/lib/supabase/database.types.ts", `${data}`, { encoding: "utf8" });

    console.log(chalk.green("Done"));
  });

  run.stderr.on("data", (data) => {
    process.stdout.write(`${data}`);
  });
});

program.parse(process.argv);
