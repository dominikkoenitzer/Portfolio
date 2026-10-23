import type { Story } from "../types";

// From product.json (lines 38 to 46), indented with tabs as in the file;
// the URL template and three empty URLs are trimmed.
const PRODUCT_JSON = `"enableTelemetry": false,
"extensionsGallery": {
\t"serviceUrl": "https://open-vsx.org/vscode/gallery",
\t"itemUrl": "https://open-vsx.org/vscode/item",
\t…
},`;

/** Remnants, told around what was taken out and how that can be checked. */
export const story: Story = {
  lead: "A code editor for Windows, macOS and Linux: my fork of Code - OSS without the AI, telemetry or sign-in prompts.",
  hero: {
    name: "remnants-hero",
    width: 1600,
    height: 1000,
    alt: "Remnants with the Daifuku repository open: the Explorer on the left and grid.rs in the editor, with no AI panel, chat or sign-in anywhere",
    caption: "Remnants with the Daifuku repository open, and no chat, agent or account anywhere.",
  },
  opening: [
    "I like Code - OSS as an editor. I do not want its chat panel, agent window, account prompt or telemetry. So I forked it and cut all four out.",
    "Editing, IntelliSense, the terminal, source control and the JavaScript debugger stayed as they were. Almost all the code is upstream's, so what I changed has to be easy to check.",
  ],
  sections: [
    {
      id: "cut",
      heading: "Most of the work was deleting",
      blocks: [
        "The largest cut was the AI itself: chat, agent sessions, the coding assistant, MCP and the language-model APIs. AI code is registered all over the workbench, so further passes took out 143 files of leftover registrations and settings, then the agent welcome and setup flows. In all, about 759,000 lines went and 2,800 came in.",
        "One leftover broke the install itself: upstream's postinstall step linked an agent harness that was gone, so the install failed until I fixed that too.",
      ],
    },
    {
      id: "product",
      heading: "Telemetry and the gallery are a few lines in one file",
      blocks: [
        "Telemetry is switched off for the whole product, and the sign-in entries in the title bar and the status bar are gone, so nothing asks for an account. Extensions come from Open VSX, an open registry, because the official marketplace is licensed only for the official builds.",
        {
          code: {
            file: "product.json",
            text: PRODUCT_JSON,
            caption: "The first line turns telemetry off everywhere; the gallery block sends every extension lookup to Open VSX.",
          },
        },
      ],
    },
    {
      id: "changes",
      heading: "Git cannot show the deletions, so CHANGES.md does",
      blocks: [
        "I imported the upstream tree as one squashed snapshot instead of as a git fork, a mistake in how I set the repository up. A later history reset made it worse: the first commit already has the removals applied, so git log shows none of them. CHANGES.md makes up for it.",
        {
          points: [
            { term: "Base", text: "Commit 93cfdd48 of release 1.125.0, the tree it was cut from." },
            { term: "Removals", text: "Every one listed with its file and line counts." },
            { term: "Update", text: "Upstream 1.139.1 merged in, with the removal re-applied by path list." },
            { term: "Manifest", text: "Compares package.json with upstream's: AI SDKs out, none added." },
            { term: "The rest", text: "Clone upstream at that commit and diff the two trees." },
          ],
        },
      ],
    },
    {
      id: "release",
      heading: "Every platform ships from one release",
      blocks: [
        "The release workflow builds Windows, macOS and Linux on x64 and arm64 into one release, every file with a checksum and a signed provenance attestation. Each asset is installed and run by the workflow that builds it, the arm64 Windows installer on real ARM hardware, the deb and rpm in Debian and Fedora containers.",
        "Remnants is not code-signed, so the first launch asks once for confirmation. It does not update itself and phones nowhere by default.",
      ],
    },
  ],
};
