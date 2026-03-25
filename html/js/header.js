document.addEventListener("DOMContentLoaded", () => {
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (!headerPlaceholder) return;

  fetch("header.html")
    .then(response => {
      if (!response.ok) {
        throw new Error("Header file could not be loaded.");
      }
      return response.text();
    })
    .then(data => {
      headerPlaceholder.innerHTML = data;

      // Optional: highlight the current page automatically
      const currentPage = window.location.pathname.split("/").pop() || "index.html";
      const navLinks = headerPlaceholder.querySelectorAll(".nav-links a");

      navLinks.forEach(link => {
        const linkPage = link.getAttribute("href");
        if (linkPage === currentPage) {
          link.classList.add("active");
        }
      });
    })
    .catch(error => {
      console.error("Error loading header:", error);
    });
});
