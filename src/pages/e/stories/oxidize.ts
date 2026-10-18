import { BackupDemo, PathDemo, TimelineDemo, UninstallDemo } from "../demos/oxidize";
import type { Story } from "../types";

/** Oxidize told as a short essay with live demos. */
export const story: Story = {
  intro: [
    "A Windows uninstaller that also removes what programs leave behind. Every leftover is backed up first, and one command puts a removal back.",
  ],
  Hero: UninstallDemo,
  sections: [
    {
      id: "backup",
      heading: "Nothing goes without a backup",
      index: "Backups",
      body: [
        "Every registry key is exported, and the export is checked, before the key is deleted. Files move into the backup with their original paths, and a manifest records each step. Undo replays that manifest backwards.",
      ],
      Demo: BackupDemo,
    },
    {
      id: "exit-code",
      heading: "An exit code is only a hint",
      index: "Exit codes",
      body: [
        "Many uninstallers copy themselves to the temp folder, start the copy and exit at once. The process Oxidize started reports success while the real work has barely begun, so it waits until the program's uninstall entry is gone.",
      ],
      Demo: TimelineDemo,
    },
    {
      id: "protected",
      heading: "Windows' own folders are refused",
      index: "Protected folders",
      body: [
        "The same folder has many spellings. Oxidize resolves each path to its real name before comparing, and refuses Windows' own folders, drive roots and profile roots outright.",
      ],
      Demo: PathDemo,
    },
  ],
};
