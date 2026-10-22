import { FreshDemo, PickerDemo } from "../demos/psyche";
import type { Story } from "../types";

const TYPER = `for (var i = 0; i < code.Length; i++)
{
    ct.ThrowIfCancellationRequested();
    if (PInvoke.GetForegroundWindow() != hwnd)
    {
        return TypeResult.FocusLost;
    }
    if (!SendCharacter(code[i]))
    {
        return TypeResult.InputBlocked;
    }
    // …
}`;

/** Psyche: a full case study, two live demos and the decisions behind them. */
export const story: Story = {
  lead: "A Windows app that keeps two-factor codes on the PC and types the right one when I press Alt+P.",
  hero: {
    name: "psyche-hero",
    width: 1600,
    height: 1000,
    alt: "Psyche's picker with demo accounts: two marked This site at the top, each six-digit code beside its countdown ring",
    crop: [0.2, 0.14, 0.8, 0.86],
    caption: "The picker with demo accounts: the two that belong to the site in front come first.",
  },
  opening: [
    "Every two-factor sign-in meant picking up my phone, unlocking it, finding the account and typing six digits before they ran out. Psyche keeps the codes on the PC I am already at.",
    "Alt+P reads the address of the page in front and types the code of the account that belongs to it. Anything less certain opens a picker.",
    { Demo: PickerDemo },
  ],
  sections: [
    {
      id: "match",
      heading: "Typed without asking only when it is sure",
      blocks: [
        "Only an exact or known match is typed without asking, and only when there is exactly one. A probable match is listed first and waits for me. Picking an account there asks whether to remember the site, because a lookalike remembered once would get the code from then on.",
        {
          points: [
            { term: "Exact", text: "The site is a domain this account was used on, or under one." },
            { term: "Known", text: "The account is one of 151 services whose sign-in domains ship with the app." },
            { term: "Probable", text: "The site's name is the issuer's name, every hyphen where the issuer breaks words." },
          ],
        },
      ],
    },
    {
      id: "fresh",
      heading: "A code that is still valid when it lands",
      blocks: [
        "A code typed in its last second often expires before the server checks it. With two seconds or less left, Psyche waits for the next code and types that one.",
        { Demo: FreshDemo },
      ],
    },
    {
      id: "typing",
      heading: "Every digit checks the window first",
      blocks: [
        "The digits go out as Unicode key events, 12 ms apart, so the keyboard layout does not matter. Before each one Psyche checks that the same window is still in front, and stops if it is not.",
        "Windows lets no ordinary program type into a window that runs as administrator. There the code goes to the clipboard, kept out of its history and cloud sync, and is cleared after 30 seconds by default.",
        {
          code: {
            file: "src/Psyche.Windows/Input/CodeTyper.cs",
            text: TYPER,
            caption: "The typing loop: a window change between two digits ends it before the next one goes out.",
          },
        },
      ],
    },
    {
      id: "vault",
      heading: "A vault that opens for one Windows account",
      blocks: [
        "The accounts live in one file, encrypted with XChaCha20-Poly1305. Its key is protected by Windows for the signed-in user, so the vault opens without a password on my account and is useless anywhere else. A backup carries a password of its own, stretched with Argon2id.",
        {
          still: {
            name: "psyche-accounts",
            width: 1600,
            height: 1000,
            crop: [0.14, 0.095, 0.86, 0.905],
            alt: "Psyche's main window with demo accounts: each issuer and account name, its six-digit code, a countdown ring and a Copy button",
            caption: "The main window after signing in to Windows: no vault password, every code beside its ring.",
          },
        },
      ],
    },
    {
      id: "tests",
      heading: "Tested where it runs",
      blocks: [
        "On every push to main and every pull request, CI on Windows checks the formatting, runs both test suites and builds the Native AOT release. The domain parser is tested against the Public Suffix List's own test file.",
      ],
    },
  ],
};
