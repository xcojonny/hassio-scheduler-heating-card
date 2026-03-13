import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/scheduler-heating-card.ts",
  output: {
    file: "dist/scheduler-heating-card.js",
    format: "es",
    inlineDynamicImports: true,
  },
  plugins: [
    resolve({ browser: true }),
    typescript({ tsconfig: "./tsconfig.json" }),
    terser(),
  ],
};
