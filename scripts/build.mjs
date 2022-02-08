import path from "path";
import fs from "fs";
import rimraf from "rimraf";
import { Extractor, ExtractorConfig } from "@microsoft/api-extractor";
import { $ } from "zx";

// all targets
const allTargets = fs.readdirSync("packages").filter((f) => {
  if (!fs.statSync(`packages/${f}`).isDirectory()) {
    return false;
  }
  return true;
});

// build
for (const target of allTargets) {
  await build(target);
}

async function build(target) {
  const pkgDir = path.resolve(`packages/${target}`);
  rimraf.sync(`${pkgDir}/dist`);

  await $`npx rollup -c --environment TARGET:${target}`;

  generateTypes(`${pkgDir}/api-extractor.json`);

  rimraf.sync(`${pkgDir}/dist/packages`);
}

function generateTypes(extractorPath) {
  const extractorConfig = ExtractorConfig.loadFileAndPrepare(extractorPath);
  // Invoke API Extractor
  const extractorResult = Extractor.invoke(extractorConfig, {
    localBuild: true,
    showVerboseMessages: true,
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
