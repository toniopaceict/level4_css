document.addEventListener("DOMContentLoaded", () => {
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (!headerPlaceholder) return;

  fetch("/header.html")
    .then(response => {
      if (!response.ok) throw new Error("Header not found");
      return response.text();
    })
    .then(data => {
      headerPlaceholder.innerHTML = data;

      const currentPage = window.location.pathname.split("/").pop() || "index.html";
      const links = headerPlaceholder.querySelectorAll(".side-nav a");

      links.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
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
    .catch(err => console.error(err));
});
