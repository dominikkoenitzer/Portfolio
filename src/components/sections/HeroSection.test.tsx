import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { beforeAll, describe, expect, it } from "vitest";
import { LanguageContext } from "@/lib/language-context";
import { loadTranslation, translations } from "@/lib/translations";
import { HeroSection } from "./HeroSection";
import heroSource from "./HeroSection.tsx?raw";

const LANGUAGES = ["en", "de", "fr", "zh"] as const;

function render(language: (typeof LANGUAGES)[number]) {
  return renderToStaticMarkup(
    <MemoryRouter>
      <LanguageContext.Provider
        value={{
          detectedLanguage: language,
          detectedLanguageCode: language,
          language,
          setLanguage: () => {},
        }}
      >
        <HeroSection />
      </LanguageContext.Provider>
    </MemoryRouter>,
  );
}

describe("HeroSection name", () => {
  beforeAll(async () => {
    await Promise.all(LANGUAGES.map((language) => loadTranslation(language)));
  });

  it.each(LANGUAGES)("shows only Dominik in %s", (language) => {
    const name = render(language).match(/<div aria-hidden="true"[^>]*>(.*?)<\/div>/)?.[1] ?? "";
    expect(name.replace(/<[^>]+>/g, "")).toBe("Dominik");
  });

  it.each(LANGUAGES)("keeps no list of other names in %s", (language) => {
    expect(Object.keys(translations[language].hero)).not.toContain("roles");
    expect(JSON.stringify(translations[language].hero)).not.toMatch(/Punds/);
  });

  it("never swaps the name on a timer", () => {
    expect(heroSource).not.toMatch(/setInterval|AnimatePresence|Punds/);
  });
});
