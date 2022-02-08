import path from "path";
import { defineConfig } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

if (!process.env.TARGET) {
  throw new Error("TARGET package must be specified via --environment flag.");
}

const packagesDir = path.resolve(__dirname, "packages");

const pkgDir = path.resolve(packagesDir, process.env.TARGET);
const resolve = (p) => path.resolve(pkgDir, p);
const pkg = require(resolve(`package.json`));

const packageOptions = pkg.buildOptions || {};
const name = packageOptions.filename || path.basename(pkgDir);

export default defineConfig({
  input: resolve(`src/index.ts`),
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      tsconfig: path.resolve(__dirname, `tsconfig.json`),
      declarationDir: ".",
    }),
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  treeshake: {
    moduleSideEffects: false,
  },
  output: [
    {
      file: resolve(`dist/${name}.esm.js`),
      format: "es",
    },
    {
      file: resolve(`dist/${name}.cjs.js`),
      exports: "auto",
      format: "cjs",
    },
  ],
});
