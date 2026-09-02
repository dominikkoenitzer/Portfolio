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
    // `tmp` is the gitignored scratch tree (audit scripts, screenshots): not
    // product code, so it must not be able to fail the lint gate.
    ignores: ["dist", "dist-spa", "coverage", "public", "node_modules", "tmp"],
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
       * things: refs written during render, setState called straight out of an
       * effect, a child mutating what its parent owns. Fix the file, never add
       * a disable comment. Media-query state is seeded in the initial state
       * rather than assigned from an effect on mount, which is what keeps
       * `set-state-in-effect` quiet.
       */
      "react-hooks/refs": "error",
      "react-hooks/set-state-in-effect": "error",
      "react-hooks/immutability": "error",
    },
  },
  {
    // Build and prerender scripts and the Vercel function run on the server.
    files: ["scripts/**/*.ts", "api/**/*.ts", "*.config.ts"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    // shadcn's primitives re-export Radix parts as consts (`const Popover =
    // PopoverPrimitive.Root`), which eslint-plugin-react-refresh >= 0.5.5 cannot
    // tell apart from a non-component export. They are generated wrappers that
    // nobody hot-edits, so the Fast Refresh warning is noise for that folder.
    files: ["src/components/ui/**/*.tsx"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
);
