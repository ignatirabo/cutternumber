export type Lang = "es" | "en";

const strings: Record<string, Record<Lang, string>> = {
  siteTitle: {
    es: "Número de Cutter-Sanborn",
    en: "Cutter-Sanborn Number",
  },
  siteSubtitle: {
    es: "Swanson-Swift Revision, 1969",
    en: "Swanson-Swift Revision, 1969",
  },
  heroSubtitle: {
    es: "Encuentre el código de clasificación bibliotecaria para cualquier autor de forma rápida y sencilla.",
    en: "Find the library classification code for any author quickly and easily.",
  },
  navHome: {
    es: "Inicio",
    en: "Home",
  },
  navTables: {
    es: "Tablas",
    en: "Tables",
  },
  inputLabel: {
    es: "Nombre del autor",
    en: "Author name",
  },
  inputPlaceholder: {
    es: "Ej: García Márquez",
    en: "E.g.: García Márquez",
  },
  submitButton: {
    es: "Obtener número",
    en: "Get number",
  },
  resultLabel: {
    es: "Número de Cutter:",
    en: "Cutter number:",
  },
  errorEmpty: {
    es: "Por favor, ingrese un nombre.",
    en: "Please enter a name.",
  },
  errorNoMatch: {
    es: "No se encontró un número para esta entrada.",
    en: "No match found for this input.",
  },
  howItWorks: {
    es: "Cómo funciona",
    en: "How it works",
  },
  step1Title: {
    es: "Ingrese el autor",
    en: "Enter the author",
  },
  step1Desc: {
    es: "Escriba el apellido y nombre del autor que desea clasificar.",
    en: "Type the surname and name of the author you want to classify.",
  },
  step2Title: {
    es: "Obtenga el código",
    en: "Get the code",
  },
  step2Desc: {
    es: "El sistema busca automáticamente el número de Cutter-Sanborn correspondiente.",
    en: "The system automatically looks up the corresponding Cutter-Sanborn number.",
  },
  bannerText: {
    es: "Explore las tablas completas organizadas alfabéticamente",
    en: "Explore the complete tables organized alphabetically",
  },
  browseTables: {
    es: "Consultar las tablas",
    en: "Browse tables",
  },
  tableTitle: {
    es: "Tablas de Cutter-Sanborn",
    en: "Cutter-Sanborn Tables",
  },
  tableSubtitle: {
    es: "Explore las tablas completas organizadas alfabéticamente.",
    en: "Explore the complete tables organized alphabetically.",
  },
  tableCode: {
    es: "Código",
    en: "Code",
  },
  tableKey: {
    es: "Clave",
    en: "Key",
  },
  tableBack: {
    es: "Volver al buscador",
    en: "Back to search",
  },
  matchedEntry: {
    es: "Entrada coincidente:",
    en: "Matched entry:",
  },
  langSwitch: {
    es: "English",
    en: "Español",
  },
};

let currentLang: Lang = "es";

const STORAGE_KEY = "cutter-lang";

export function initLang(): Lang {
  // URL hash takes priority
  const hash = window.location.hash.replace("#", "").toLowerCase();
  if (hash === "en" || hash === "es") {
    currentLang = hash;
    localStorage.setItem(STORAGE_KEY, currentLang);
    return currentLang;
  }

  // Then localStorage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "es") {
    currentLang = stored;
    return currentLang;
  }

  // Default to Spanish
  currentLang = "es";
  return currentLang;
}

export function getLang(): Lang {
  return currentLang;
}

export function setLang(lang: Lang): void {
  currentLang = lang;
  localStorage.setItem(STORAGE_KEY, lang);
  window.location.hash = lang;
  applyTranslations();
}

export function toggleLang(): void {
  setLang(currentLang === "es" ? "en" : "es");
}

export function t(key: string): string {
  const entry = strings[key];
  if (!entry) return key;
  return entry[currentLang] ?? key;
}

export function applyTranslations(): void {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n")!;
    const text = t(key);
    if (el instanceof HTMLInputElement) {
      if (el.type === "submit" || el.type === "button") {
        el.value = text;
      }
    } else {
      el.textContent = text;
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder")!;
    if (el instanceof HTMLInputElement) {
      el.placeholder = t(key);
    }
  });

  document.documentElement.lang = currentLang;
}
