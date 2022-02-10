import { execSync } from "child_process";
import { $, chalk, fs } from "zx";

// update version
execSync("npx bumpp package.json packages/*/package.json", {
  stdio: "inherit",
});

const { version } = await fs.readJSON("package.json");

// push to GitHub
await $`git add .`;
await $`git commit -m "chore: release v${version}"`;
await $`git tag v${version}`;
await $`git push`;
await $`git push origin --tags`;

// build
await $`npm run build`;

// publish
await $`npx pnpm -r publish --access public --no-git-checks`;
console.log(chalk.green(`Successfully published ${version}`));
