import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { LanguageContext } from "@/lib/language-context";
import { LanguageToggle } from "./LanguageToggle";

// The real popover renders its content into a portal only once open; inline parts let the sheet render on the server.
vi.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: { children: ReactNode }) => <>{children}</>,
  PopoverContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PopoverTrigger: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

function render() {
  return renderToStaticMarkup(
    <LanguageContext.Provider
      value={{
        detectedLanguage: "de",
        detectedLanguageCode: "de-CH",
        language: "en",
        setLanguage: () => {},
      }}
    >
      <LanguageToggle />
    </LanguageContext.Provider>,
  );
}

describe("LanguageToggle", () => {
  it("marks each language's name with its own lang, the system row included", () => {
    const tagged = [...render().matchAll(/<[a-z]+ [^>]*\blang="([^"]+)"[^>]*>([^<]*)</g)]
      .map(([, lang, text]) => `${lang}:${text}`)
      .sort();
    expect(tagged).toEqual(["de:Deutsch", "de:Deutsch", "en:English", "fr:Français", "zh:中文"]);
  });
});
