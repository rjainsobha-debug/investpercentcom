function normalizePath(path) {
  if (!path) return "index";
  path = path.toLowerCase().trim();
  if (path.startsWith("/")) path = path.slice(1);
  path = path.split("?")[0].split("#")[0];
  if (path === "" || path === "/") return "index";
  if (path.endsWith(".html")) path = path.replace(".html", "");
  return path;
}

function highlightActiveNav() {
  const currentPage = normalizePath(window.location.pathname);
  const links = document.querySelectorAll(".nav-link");
  links.forEach(function(link) {
    link.classList.remove("active");
    const linkPage = (link.dataset.page || "").toLowerCase().trim();
    const linkHref = normalizePath(link.getAttribute("href") || "");
    if (currentPage === linkPage || currentPage === linkHref) {
      link.classList.add("active");
    }
  });
}

function toggleMenu() {
  const drawer = document.getElementById("mobileDrawer");
  if (drawer) drawer.classList.toggle("open");
}

function closeMobileMenuOnLinkClick() {
  const drawer = document.getElementById("mobileDrawer");
  if (!drawer) return;
  const mobileLinks = drawer.querySelectorAll(".nav-link");
  mobileLinks.forEach(function(link) {
    link.addEventListener("click", function() {
      drawer.classList.remove("open");
    });
  });
}

function loadNavbar() {
  var navEl = document.getElementById("navbar");
  if (!navEl) return;
  fetch("/components/navbar.html")
    .then(function(res) { return res.text(); })
    .then(function(html) {
      navEl.innerHTML = html;
      highlightActiveNav();
      closeMobileMenuOnLinkClick();
    })
    .catch(function() {
      fetch("components/navbar.html")
        .then(function(res) { return res.text(); })
        .then(function(html) {
          navEl.innerHTML = html;
          highlightActiveNav();
          closeMobileMenuOnLinkClick();
        });
    });
}

document.addEventListener("DOMContentLoaded", loadNavbar);
