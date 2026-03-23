/* inc.js: shared initialization, includes, cursor, theme, page utilities */

function initializeInview() {
  const targets = document.querySelectorAll(".inview");
  if (!targets.length) return;
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );
  targets.forEach((t) => observer.observe(t));
}

function initializePageTop() {
  const pageTop = document.querySelector("#pagetop");
  if (!pageTop) return;
  window.addEventListener("scroll", () => {
    pageTop.classList.toggle("is-show", window.scrollY > 400);
  });
  pageTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initializeAnchorLinks() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const target = this.getAttribute("href");
      if (!target || target === "#") return;
      const el = document.querySelector(target);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initializeMenuActive() {
  const pathname = location.pathname.replace(/\/$/, "");
  document.querySelectorAll(".nav-item").forEach((item) => {
    const href = item.getAttribute("href");
    if (!href) return;
    const link = href.replace(/\/$/, "");
    if (link === pathname || link === "./" || link === "index.html") {
      item.classList.add("is-active");
    }
  });
}

function initCustomCursor() {
  const dot = document.querySelector(".cursor-dot");
  const outline = document.querySelector(".cursor-outline");
  if (!dot || !outline) return;

  window.addEventListener("mousemove", (e) => {
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
    outline.style.left = `${e.clientX}px`;
    outline.style.top = `${e.clientY}px`;
  });

  document.querySelectorAll("a, button, .blog-item").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      outline.style.transform = "translate(-50%, -50%) scale(1.7)";
      outline.style.background = "rgba(59, 130, 246, 0.12)";
    });
    el.addEventListener("mouseleave", () => {
      outline.style.transform = "translate(-50%, -50%) scale(1)";
      outline.style.background = "transparent";
    });
  });
}

function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute("data-theme") === "dark";
  if (isDark) {
    html.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
  } else {
    html.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }
}

function initializeComponents() {
  loadTheme();
  initializeInview();
  initializePageTop();
  initializeAnchorLinks();
  initializeMenuActive();
}

document.addEventListener("DOMContentLoaded", () => {
  const includeElements = document.querySelectorAll("[data-include]");
  const promises = [];

  includeElements.forEach((el) => {
    const file = el.getAttribute("data-include");
    const rootPath = el.getAttribute("data-path") || "";
    if (!file) return;
    const p = fetch(file)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load: ${file}`);
        return res.text();
      })
      .then((html) => {
        el.innerHTML = html.replace(/\{\$root\}/g, rootPath);
      })
      .catch((err) => {
        console.error(err);
        el.innerHTML = `<p style="color:red;">Could not load ${file}</p>`;
      });
    promises.push(p);
  });

  const runInit = () => {
    initCustomCursor();
    initializeComponents();
    // Emit custom event to signal includes are loaded
    document.dispatchEvent(new CustomEvent("includesLoaded"));
  };

  if (promises.length) {
    Promise.all(promises).then(runInit).catch(runInit);
  } else {
    runInit();
  }
});
