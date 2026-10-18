import { BackupDemo, PathDemo, UninstallDemo, WaitDemo } from "../demos/oxidize";
import type { Story } from "../types";

/** Oxidize, written as a case study around its live demos. */
export const story: Story = {
  opening: [
    "Uninstalling a program on Windows removes the program. What it wrote around itself usually stays: registry keys, folders under AppData and ProgramData, scheduled tasks, firewall rules, PATH entries, and a long tail of small records Windows keeps about every program it has met. None of it is large. All of it piles up, and some of it keeps acting, like a scheduled task that still points at an exe that is gone.",
    "Tools that clean this up exist, and most of them make me nervous. Finding junk is easy. Being sure it is junk, and being able to take it back when you were wrong, is the actual job. So the safety net came before anything else: Oxidize may not delete what it cannot put back.",
    { Demo: UninstallDemo },
    "The program's own uninstaller runs first. Then Oxidize goes looking, and every find comes with a confidence. A folder or key named exactly like the program is High, one that only shares part of the name is Medium, and a folder no installed program claims is Low. Only High goes unless you ask for more.",
    {
      still: {
        name: "oxidize-overview",
        dark: "oxidize-overview-dark",
        width: 2880,
        height: 1800,
        alt: "The Oxidize window listing twenty made-up programs by name, with Quillmark selected and what makes it up listed beside the list",
        caption: "Twenty made-up programs, and everything that makes up the selected one. The window follows the Windows theme, light or dark.",
      },
    },
  ],
  sections: [
    {
      id: "matching",
      heading: "Knowing what belongs to whom",
      blocks: [
        "Most of the work went into the scanner, and most of that work was taking matches away. To check it, I listed every High match for every program on a machine, not only the ones I expected, and read the whole list.",
        "It was humbling. A runtime with a long name boiled down to a single word and claimed another product's services. A program installed through a package manager picked up a vendor's name from the folder above it, and suddenly every folder of that vendor was a Medium hit.",
        "Each of those became a rule. One word counts as a program's name only when the name really is that one word and at least four letters long. A folder with another program installed inside it is shared and left alone. A vendor's folder is searched, never removed whole.",
      ],
    },
    {
      id: "waiting",
      heading: "An exit code is only a hint",
      blocks: [
        "Running the uninstaller sounds trivial: start it, wait for it to exit, move on. Packages from the Windows installer behave. Plenty of others copy themselves to the temp folder, start the copy and exit at once with a cheerful zero, so the process Oxidize was watching is finished long before the uninstall is.",
        { Demo: WaitDemo },
        "So Oxidize waits for evidence instead. While the program's uninstall entry still exists and something that looks like its uninstaller is still running, it keeps waiting. The first version matched those processes by name and could wait for no reason at all: a launcher whose games uninstall through the launcher itself never looks finished. Now a process only counts if it runs from the program's own folder, or is an uninstaller's copy in the temp folder.",
      ],
    },
    {
      id: "backups",
      heading: "Nothing goes without a backup",
      blocks: [
        "Before a registry key is deleted it is exported, and the export is checked: the right byte order mark, the right header, a section for exactly that key. A clean exit from the export tool is not taken as proof. Files and folders are moved, not deleted, into a backup that keeps their original paths, and a manifest records every step so a restore can replay it backwards.",
        { Demo: BackupDemo },
        "To prove the round trip I built a fake program with everything a real one leaves: an uninstall entry, its folders, a vendor folder, a Start menu entry, an autostart value and a PATH entry. I removed it and restored it twice. Both times every file came back with the same SHA-256, every registry value with its original type, and the PATH byte for byte.",
        {
          still: {
            name: "oxidize-confirm",
            dark: "oxidize-confirm-dark",
            width: 2880,
            height: 1800,
            alt: "Oxidize asking whether to remove Quillmark completely, saying that running copies are closed and a backup is kept",
            caption: "Before anything happens, Oxidize says what it will do, and that a backup is kept.",
          },
        },
      ],
    },
    {
      id: "protected",
      heading: "Protected folders, however they are spelled",
      blocks: [
        "The worst bug I found was a string comparison. Oxidize refused to touch C:\\Windows, and yet C:/Windows, C:\\Windows. and the short name C:\\PROGRA~1 walked straight past the check. Given a few fake registry entries pointing at them, it offered 15.8 GB of Program Files at High.",
        "Now every path is resolved the way Windows resolves it before it is compared: real names instead of short ones, slashes turned around, the extended-length prefix and trailing dots and spaces stripped. Windows' own folders, the Program Files folders, drive roots and profile roots are refused outright.",
        { Demo: PathDemo },
      ],
    },
    {
      id: "now",
      heading: "Where it stands",
      blocks: [
        "Oxidize is two programs over one engine: a command line for scripts and a window for everyone else. A small server lets an AI assistant plan a removal and carry it out only after you have seen the plan, always with the backup. Every command has a dry run, and a dry run leaves the machine unchanged, bit for bit.",
        "Since 0.2.6 it also cleans up after Windows itself: temp files, crash dumps, browser caches and, if you ask, the Recycle Bin, around a list of folders it never touches. Version 0.2.7 fixed exactly the kind of mistake this project exists to prevent, because Clean up could have taken Oxidize's own backups for an unclaimed folder.",
        {
          still: {
            name: "oxidize-cleanup",
            dark: "oxidize-cleanup-dark",
            width: 2880,
            height: 1800,
            alt: "The Clean up view of Oxidize, listing categories of files it can clear with what each would free",
            caption: "Clean up shows what each category would free, what clears it and whether it can be undone, before it touches anything.",
          },
        },
        "It has 328 tests, and every program I uninstall now goes through it.",
      ],
    },
  ],
};
