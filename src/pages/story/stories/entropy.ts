import { AnalyzeDemo, RandomDemo } from "../demos/entropy";
import type { Story } from "../types";

/** Entropy, told around the analyzer, the random picks and the Windows app on the same engine. */
export const story: Story = {
  lead: "A password generator and analyzer that runs entirely in the browser, and a Windows password manager built on the same engine.",
  hero: {
    name: "entropy-hero",
    width: 3200,
    height: 2000,
    alt: "Entropy's Generate tab: a 16-character password from all four character sets, rated maximum at 103 bits, under acid-green generative art",
  },
  opening: [
    "I did not want to paste a password into a website to find out whether it was any good. So I wrote one that never sends it anywhere, and found that the hard part was being honest about the answer.",
    "The first version scored length and character classes, and called a dictionary word with a symbol and a digit on it strong. The analyzer that replaced it thinks like someone cracking it.",
    { Demo: AnalyzeDemo },
  ],
  sections: [
    {
      id: "attacker",
      heading: "One attacker behind every label",
      blocks: [
        "It finds every word, keyboard walk, repeat, sequence and date, prices each in guesses, and takes the cheapest way to cover the whole password. A label is only honest if it agrees with the crack time beside it, so every tier is set against one attacker: a GPU on a fast hash at a hundred billion guesses a second.",
        {
          points: [
            { term: "Weak", text: "Under 43 bits: gone in 90 seconds or less." },
            { term: "Fair", text: "43 to 58 bits: up to about two months." },
            { term: "Good", text: "59 to 74 bits: up to about 12,000 years." },
            { term: "Strong", text: "75 to 98 bits: up to 15 times the age of the universe." },
            { term: "Maximum", text: "99 bits and up: out of any attacker's reach." },
          ],
        },
      ],
    },
    {
      id: "random",
      heading: "Random bytes, without the modulo bias",
      blocks: [
        "Taking a random number modulo the size of the character pool looks right and is slightly wrong: unless the pool divides the range evenly, the leftover values at the top land on the first few characters.",
        { Demo: RandomDemo },
        "With a real 32-bit source the bias is about two in a hundred million, which is exactly why it is easy to leave in. Every character and every passphrase word in Entropy goes through one function that throws the tail away and draws again.",
      ],
    },
    {
      id: "windows",
      heading: "Alt+E types the login for the page in front",
      blocks: [
        "The analyzer also runs in a password manager for Windows that I use myself. Alt+E on a sign-in page reads the address in front. With one saved login for that site, it types the username, a Tab and the password; otherwise this picker opens with the site's logins on top. A login is never offered on an address that only looks like its own.",
        {
          still: {
            name: "entropy-picker",
            width: 1600,
            height: 1000,
            crop: [0.25, 0.19, 0.75, 0.81],
            alt: "Entropy's Alt+E picker: a search field, the page's address in the corner, the login for that site on top marked This site, and keys to type, copy or close",
            caption: "The picker on a sign-in page: the login that belongs to this address sits on top, marked This site.",
          },
        },
      ],
    },
    {
      id: "agree",
      heading: "Two engines that agree to the last guess",
      blocks: [
        "The app's Health page puts every saved password through the same estimator, so I ported it to C#. A script runs the website's own TypeScript over 704 passwords and saves what it says, and the C# tests must reproduce every guess count, bit value, label and crack time. The leak check is offline as well: about a million common leaked passwords, kept as 16-bit fingerprints.",
      ],
    },
  ],
};
