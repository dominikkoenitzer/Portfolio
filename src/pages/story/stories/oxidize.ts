import { BackupDemo, PathDemo, UninstallDemo } from "../demos/oxidize";
import type { Story } from "../types";

/** Oxidize, written as a case study around its live demos. */
export const story: Story = {
  lead: "A Windows uninstaller that also removes what programs leave behind, and backs up every piece of it first.",
  hero: {
    name: "oxidize-overview",
    dark: "oxidize-overview-dark",
    width: 2880,
    height: 1800,
    alt: "The Oxidize window: a list of made-up programs with their sizes, Quillmark selected, and its details and footprint on the right",
  },
  opening: [
    "Uninstalling a program on Windows removes the program. What it wrote around itself usually stays: registry keys, folders in AppData, scheduled tasks, PATH entries. Some of it keeps acting, like a task that still points at an exe that is gone.",
    "Finding that is easy. Being sure it is junk, and being able to take it back when you were wrong, is the job. So the rule came first: Oxidize deletes nothing it cannot put back.",
    { Demo: UninstallDemo },
  ],
  sections: [
    {
      id: "matching",
      heading: "Knowing what belongs to whom",
      blocks: [
        "Most of the work went into the scanner, and most of that was taking matches away. I listed every High match for every program on a machine, read the whole list, and turned each wrong one into a rule.",
        {
          points: [
            { term: "Exact name", text: "A key or folder named exactly like the program is High. Only High goes unless you ask." },
            { term: "Part of the name", text: "Medium. A folder no installed program claims is Low." },
            { term: "One word", text: "Counts as a program's name only if the name is that one word, four letters or more." },
            { term: "Shared folder", text: "A folder with another program installed inside it is left alone." },
            { term: "Vendor folder", text: "Searched for the program's own folders, never removed whole." },
          ],
        },
      ],
    },
    {
      id: "backups",
      heading: "Nothing goes without a backup",
      blocks: [
        "Each registry key is exported before it is deleted, and the export is checked, not trusted. Files are moved into a backup that keeps their paths, and a manifest records every step so a restore can replay it backwards.",
        { Demo: BackupDemo },
        "I proved the round trip on a fake program with everything a real one leaves. Removed and restored twice, every file came back with the same SHA-256 and every registry value with its original type.",
      ],
    },
    {
      id: "waiting",
      heading: "An exit code is only a hint",
      blocks: [
        "Plenty of uninstallers copy themselves to the temp folder, start the copy and exit at once with a zero. So Oxidize waits for evidence: while the program's uninstall entry exists and its own uninstaller still runs, it keeps waiting. The first version matched processes by name and could wait for a launcher that never ends.",
        {
          code: {
            file: "src/uninstall.rs",
            text: `while start.elapsed() < max {
    // A running process is only ours if it runs from the program's own
    // folder or is the uninstaller's copy of itself in %TEMP%.
    let alive = system::running_exes().into_iter().any(|exe| {
        install_dir
            .as_deref()
            .map(|d| system::path_under(&exe, d))
            .unwrap_or(false)
            || is_temp_uninstaller(&exe)
    });
    if !alive {
        break;
    }
    std::thread::sleep(Duration::from_millis(500));
}
!still_installed(program)`,
            caption: "Done means the uninstall entry is gone, not that the first process exited.",
          },
        },
      ],
    },
    {
      id: "protected",
      heading: "Protected folders, however they are spelled",
      blocks: [
        "The worst bug I found was a string comparison. Oxidize refused C:\\Windows, yet C:/Windows, C:\\Windows. and the short name C:\\PROGRA~1 walked past the check, and a few fake registry entries got it to offer 15.8 GB of Program Files at High.",
        "Now every path is resolved the way Windows resolves it before it is compared, and Windows' own folders, Program Files, drive roots and profile roots are refused outright.",
        { Demo: PathDemo },
      ],
    },
    {
      id: "now",
      heading: "Where it stands",
      blocks: [
        "Oxidize is a command line and a window over one engine, and every command has a dry run that leaves the machine unchanged. Clean up clears temp files, crash dumps and caches around folders it never touches; it is the one place Oxidize deletes for good, and it says so first.",
        {
          still: {
            name: "oxidize-cleanup",
            dark: "oxidize-cleanup-dark",
            width: 2880,
            height: 1800,
            alt: "The Clean up view of Oxidize, listing categories of files it can clear with what each would free",
            caption: "Clean up shows what each category frees and whether it can be undone, before it touches anything.",
          },
        },
        "Every program I uninstall now goes through it.",
      ],
    },
  ],
};
