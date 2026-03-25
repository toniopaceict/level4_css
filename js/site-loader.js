(function () {
  /* =======================================================
     CHANGE THIS NUMBER WHEN YOU UPDATE THE MENU
     Example:
     If you edit menu.css or header.js, change 7 to 8
     Then students only need a normal refresh
     ======================================================= */
  const MENU_VERSION = "8";

  /* Load shared menu CSS */
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "https://toniopaceict.github.io/level4_css/css/menu.css?v=" + MENU_VERSION;
  document.head.appendChild(css);

  /* Load shared header/menu JS */
  const headerScript = document.createElement("script");
  headerScript.src = "https://toniopaceict.github.io/level4_css/js/header.js?v=" + MENU_VERSION;
  document.body.appendChild(headerScript);
})();
