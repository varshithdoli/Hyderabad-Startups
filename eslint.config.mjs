<<<<<<< HEAD
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
=======
version https://git-lfs.github.com/spec/v1
oid sha256:870f1adccecf3051cbcd9fd307cef51d7633cf510979c181a81f4b1797273493
size 465
>>>>>>> 850a4ceb7bc877c65ebdeedc624b9d3e996394c5
