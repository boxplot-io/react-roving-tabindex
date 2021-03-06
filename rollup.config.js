import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import url from "@rollup/plugin-url";
import svgr from "@svgr/rollup";
import del from "rollup-plugin-delete";

import pkg from "./package.json";

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true
    },
    {
      file: pkg.module,
      format: "es",
      exports: "named",
      sourcemap: true
    }
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
  plugins: [
    external(),
    postcss({
      modules: true
    }),
    url(),
    svgr(),
    nodeResolve(),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true
    }),
    commonjs(),
    del({ targets: "dist/*" })
  ]
};
