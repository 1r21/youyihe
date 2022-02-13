import { Extractor, ExtractorConfig } from "@microsoft/api-extractor";
import { chalk } from "zx";
import { $, fs, path, os } from "zx";

// all targets
const allTargets = fs.readdirSync("packages").filter((f) => {
  return fs.statSync(`packages/${f}`).isDirectory();
});

// build one target
// Eg: TARGET=api pnpm build
const target = process.env.TARGET;
if (target) {
  if (allTargets.includes(target)) {
    await build(target);
    process.exit(0);
  } else {
    console.log(chalk.red.bold(`!${target} no exists`));
    process.exit(1);
  }
}

await runParallel(os.cpus().length, allTargets, build);

async function runParallel(maxConcurrency, source, iteratorFn) {
  const ret = [];
  const executing = [];
  for (const item of source) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    ret.push(p);

    if (maxConcurrency <= source.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= maxConcurrency) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(ret);
}

async function build(target) {
  const pkgDir = path.resolve(`packages/${target}`);
  await $`rm -rf ${pkgDir}/dist && npx rollup -c --environment TARGET:${target}`;

  generateTypes(`${pkgDir}/api-extractor.json`);
  await $`rm -rf ${pkgDir}/dist/packages`;
}

function generateTypes(extractorPath) {
  const extractorConfig = ExtractorConfig.loadFileAndPrepare(extractorPath);
  // Invoke API Extractor
  const extractorResult = Extractor.invoke(extractorConfig, {
    localBuild: true,
    showVerboseMessages: false,
  });

  if (extractorResult.succeeded) {
    console.log(`API Extractor completed successfully`);
    process.exitCode = 0;
  } else {
    console.error(
      `API Extractor completed with ${extractorResult.errorCount} errors` +
        ` and ${extractorResult.warningCount} warnings`
    );
    process.exitCode = 1;
  }
}
