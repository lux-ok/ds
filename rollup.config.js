import path from "path";
import del from "rollup-plugin-delete";
import typescript from "@rollup/plugin-typescript";

export default {
  input: {
    index: "src/index.ts", // 主入口文件
    "func/index": "src/func/index.ts", // func 目录单独作为一个入口
  },
  output: [
    {
      // 对应的 ESM 输出
      dir: "dist",
      format: "esm",
      sourcemap: false,
      entryFileNames: "[name].js", // 生成 func 和 main 对应的 JS 文件
      // chunkFileNames: "[name]-[hash].js",
    },
    {
      // 对应的 CJS 输出
      dir: "dist",
      format: "cjs",
      sourcemap: false,
      entryFileNames: "[name].cjs",
      exports: "named",
      // chunkFileNames: "[name]-[hash].cjs",
    },
  ],
  plugins: [
    del({ targets: "dist/**/*", hook: "buildStart" }),
    typescript({
      tsconfig: "./tsconfig.json",
    }),
  ],
  external: [],
};
