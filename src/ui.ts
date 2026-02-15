import type { CutterEntry } from "./data";
import { cutterNumber } from "./cutter";
import { t, toggleLang } from "./i18n";

export function initUI(table: CutterEntry[]): void {
  const form = document.getElementById("cutter-form") as HTMLFormElement;
  const input = document.getElementById("author-input") as HTMLInputElement;
  const resultBox = document.getElementById("result-box")!;
  const resultNumber = document.getElementById("result-number")!;
  const resultEntry = document.getElementById("result-entry")!;
  const errorBox = document.getElementById("error-box")!;
  const langSwitch = document.getElementById("lang-switch")!;

  langSwitch.addEventListener("click", toggleLang);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim();

    // Hide previous results
    resultBox.classList.add("hidden");
    errorBox.classList.add("hidden");

    if (!value) {
      errorBox.textContent = t("errorEmpty");
      errorBox.classList.remove("hidden");
      return;
    }

    const result = cutterNumber(table, value);
    if (!result) {
      errorBox.textContent = t("errorNoMatch");
      errorBox.classList.remove("hidden");
      return;
    }

    resultNumber.textContent = result.number;
    resultEntry.textContent = `${t("matchedEntry")} ${result.matchedKey} (${result.code})`;
    resultBox.classList.remove("hidden");
  });

  // Browse tables links (nav link + banner)
  for (const id of ["browse-link", "browse-banner"]) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        (window as unknown as Record<string, () => void>).__showTableBrowser();
      });
    }
  }
}
