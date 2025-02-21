import del from "rollup-plugin-delete";
import typescript from "@rollup/plugin-typescript";

export default {
  input: {
    index: "src/index.ts",
    "func/index": "src/func/index.ts",
  },
  output: [
    {
      dir: "dist",
      format: "esm",
      sourcemap: false,
      entryFileNames: "[name].js",
    },
    {
      dir: "dist",
      format: "cjs",
      sourcemap: false,
      entryFileNames: "[name].cjs",
      exports: "named",
    },
  ],
  plugins: [
    del({ targets: "dist/**/*", hook: "buildStart" }),
    typescript({
      tsconfig: "./tsconfig.json",
      declarationDir: "dist", // .d.ts to dist folder
      declaration: true, // Enable .d.ts
    }),
  ],
  external: [],
};
