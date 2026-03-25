document.addEventListener("DOMContentLoaded", () => {
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (!headerPlaceholder) return;

  fetch("https://toniopaceict.github.io/level4_css/header.html?v=1")
    .then(response => {
      if (!response.ok) {
        throw new Error("Header file could not be loaded.");
      }
      return response.text();
    })
    .then(data => {
      headerPlaceholder.innerHTML = data;

      const currentPage = window.location.pathname.split("/").pop() || "index.html";
      const links = headerPlaceholder.querySelectorAll(".side-nav a");

      links.forEach(link => {
        const href = link.getAttribute("href");
        if (href === currentPage) {
          link.classList.add("active");

          const parentSection = link.closest(".side-nav-section");
          if (parentSection) {
            parentSection.classList.add("open");
          }
        }
      });

      const toggles = headerPlaceholder.querySelectorAll(".side-nav-toggle");

      toggles.forEach(toggle => {
        toggle.addEventListener("click", () => {
          const section = toggle.closest(".side-nav-section");
          if (section) {
            section.classList.toggle("open");
          }
        });
      });
    })
    .catch(error => {
      console.error("Error loading header:", error);
    });
});
