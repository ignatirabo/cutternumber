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
  inputLabel: {
    es: "Ingrese el nombre del autor:",
    en: "Enter the author's name:",
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
  descTitle: {
    es: "¿Qué es el número de Cutter-Sanborn?",
    en: "What is a Cutter-Sanborn number?",
  },
  descText: {
    es: "El número de Cutter-Sanborn es un código alfanumérico utilizado en bibliotecas para clasificar obras por autor. Se basa en la tabla de tres dígitos de Cutter-Sanborn (revisión Swanson-Swift, 1969), que asigna un código numérico a cada apellido.",
    en: "The Cutter-Sanborn number is an alphanumeric code used in libraries to classify works by author. It is based on the Cutter-Sanborn three-figure author table (Swanson-Swift revision, 1969), which assigns a numeric code to each surname.",
  },
  browseTables: {
    es: "Consultar las tablas",
    en: "Browse tables",
  },
  browseTablesDesc: {
    es: "Explore las tablas completas de Cutter-Sanborn organizadas alfabéticamente.",
    en: "Explore the complete Cutter-Sanborn tables organized alphabetically.",
  },
  tableTitle: {
    es: "Tablas de Cutter-Sanborn",
    en: "Cutter-Sanborn Tables",
  },
  tableBack: {
    es: "← Volver al generador",
    en: "← Back to generator",
  },
  matchedEntry: {
    es: "Entrada coincidente:",
    en: "Matched entry:",
  },
  footerText: {
    es: "Herramienta para calcular los números de tres dígitos de Cutter-Sanborn.",
    en: "Tool for calculating Cutter-Sanborn three-figure author numbers.",
  },
  footerContact: {
    es: "Contacto",
    en: "Contact",
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

  // Update lang switch button text
  const switchBtn = document.getElementById("lang-switch");
  if (switchBtn) switchBtn.textContent = t("langSwitch");
}
