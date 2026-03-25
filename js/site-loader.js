(function () {
  const MENU_VERSION = "1";

  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "https://toniopaceict.github.io/level4_css/css/menu.css?v=" + MENU_VERSION;
  document.head.appendChild(css);

  const headerScript = document.createElement("script");
  headerScript.src = "https://toniopaceict.github.io/level4_css/js/header.js?v=" + MENU_VERSION;
  document.body.appendChild(headerScript);
})();
