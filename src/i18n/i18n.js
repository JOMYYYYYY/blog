import translations from "./translations.js";

function getLang() {
  try {
    return localStorage.getItem("lang") || "zh";
  } catch {
    return "zh";
  }
}

function setLang(lang) {
  try {
    localStorage.setItem("lang", lang);
  } catch {}
}

function applyTranslations() {
  const lang = getLang();
  const dict = translations[lang];
  if (!dict) return;

  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) {
      el.textContent = dict[key];
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyTranslations();

  const toggle = document.querySelector('[data-i18n="lang.switch"]');
  toggle?.addEventListener("click", () => {
    const current = getLang();
    setLang(current === "zh" ? "en" : "zh");
    location.reload();
  });
});
