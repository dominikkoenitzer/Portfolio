import type { Story } from "../types";

// The body of SafeWrite in MainWindow.Files.cs; the temporary path above it
// and the cleanup in `finally` are trimmed.
const SAFE_WRITE = `try
{
    File.WriteAllText(temp, text, encoding);
    if (File.Exists(full))
        File.Replace(temp, full, destinationBackupFileName: null);
    else
        File.Move(temp, full);
}
finally
{
    // …
}`;

/** Jester, a small project: the few things a notepad must never get wrong. */
export const story: Story = {
  lead: "A notepad for Windows in purple and gold, with tabs, find in files and PDF export, in one portable exe.",
  hero: {
    name: "jester-hero",
    width: 1600,
    height: 1000,
    alt: "Jester in its dark theme with two tabs open, its own README and CONTRIBUTING, with line numbers and a status bar",
    caption: "Jester in its dark theme with its own README open: line numbers on the left, encoding and line ending below.",
  },
  opening: [
    "I wanted a notepad that opens before I let go of the mouse, but still does the few things the built-in one refuses to. So I built one in C# and WPF on .NET 10.",
    "It has tabs, a line-number gutter, find across a whole folder and A4 PDF export. The dark and light themes follow the Windows app mode, and unsaved tabs come back on the next start.",
  ],
  sections: [
    {
      id: "save",
      heading: "Saving never truncates the file you already have",
      blocks: [
        "Opening a file for writing empties it first, so a crash or a full disk halfway through leaves less than you had before Ctrl+S. Jester writes to a hidden temporary file in the same folder and swaps it in, so a failed write leaves the old file whole.",
        {
          code: {
            file: "MainWindow.Files.cs",
            text: SAFE_WRITE,
            caption: "The whole text lands in the temporary file first; only File.Replace touches the original.",
          },
        },
        "Unsaved and untitled tabs go to the session two seconds after the last change, so their text survives closing the window, signing out of Windows or a crash.",
      ],
    },
    {
      id: "encoding",
      heading: "A file goes back the way it came",
      blocks: [
        "On open, Jester reads the byte-order mark. Without one, it takes the bytes as UTF-8 if they are valid UTF-8 and in the Windows ANSI code page if not. That encoding stays with the tab and is used again on save, so a UTF-16 file never comes back as UTF-8.",
        "Changing it is always a choice: convert in the Format menu, or read the file again in another encoding.",
        {
          still: {
            name: "jester-encoding",
            width: 2560,
            height: 1600,
            crop: [0, 0.035, 0.36, 0.5],
            alt: "Jester in its light theme with the File menu open on Reopen with Encoding: UTF-8, UTF-8 with BOM, UTF-16 LE, UTF-16 BE, Windows-1252 and ANSI",
            caption: "Reopen with Encoding, in the light theme: the file is read again in the encoding you pick.",
          },
        },
      ],
    },
    {
      id: "search",
      heading: "Find in Files survives whatever folder it is given",
      blocks: [
        "A folder can hold protected subfolders, system files and huge logs. Find in Files decides up front what it will not touch, so the search ends with results instead of an error.",
        {
          points: [
            { term: "Hidden files", text: "Skipped, along with system files." },
            { term: "Locked folders", text: "Ignored instead of thrown on." },
            { term: "File list", text: "Built before the search starts, so nothing fails halfway." },
            { term: "Over 4 MB", text: "Passed over, like a file that fails to read." },
            { term: "5,000 results", text: "Where the list stops." },
          ],
        },
        "The search arithmetic lives in TextSearch.cs, which knows nothing about the editor, so it is tested without a window, like the encodings, the session and the gutter.",
      ],
    },
    {
      id: "exe",
      heading: "One exe, even with a PDF library inside",
      blocks: [
        "Jester ships as one self-contained file with the .NET 10 runtime compressed inside, so it runs on Windows 10 and 11 without an installer. The PDF library copies its bundled fonts next to the exe as loose files. Jester never uses them, since a PDF is set in the editor's own font, so a step in the project file strips them from the published build.",
      ],
    },
  ],
};
