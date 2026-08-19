import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

/**
 * Type-aware linting is deliberately off: `bun run typecheck` already runs the
 * compiler over the same files, so turning it on here would pay for a second
 * full type-check to re-report what tsc has already said.
 */
export default tseslint.config(
  {
    ignores: ["dist", "dist-spa", "coverage", "public", "node_modules"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      /*
       * The route table imports pages lazily and a few modules export a
       * component beside its constants, which is the pattern this rule warns
       * about. Constant exports are allowed for that reason.
       */
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      /*
       * The React Compiler rules in eslint-plugin-react-hooks v7 flag real
       * things — refs written during render, setState called straight out of an
       * effect, locals mutated after render. The one remaining site is the
       * WebGL sphere, where the fix changes what the animation does and has to
       * be watched in a browser to confirm. It reports as a warning so the gate
       * stays honest about it instead of either failing on work that is not
       * done or hiding it behind a disable comment. Fix a file, then promote
       * its rule — as `refs` was once ServiceExplorer and LightVeil moving
       * their live-prop writes into post-commit effects, and
       * `set-state-in-effect` was the hero, skills and services sections
       * seeding their media queries in the initial state instead of assigning
       * it from an effect on mount.
       */
      "react-hooks/refs": "error",
      "react-hooks/set-state-in-effect": "error",
      "react-hooks/immutability": "warn",
    },
  },
  {
    // Build and prerender scripts and the Vercel function run on the server.
    files: ["scripts/**/*.ts", "api/**/*.ts", "*.config.ts"],
    languageOptions: {
      globals: globals.node,
    },
  },
);
