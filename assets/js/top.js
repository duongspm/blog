let lastScroll = 0;
const header = document.querySelector(".main-header");

function toggleMobileMenu() {
  const navLinks = document.querySelector(".nav-links");
  const burger = document.querySelector(".hamburger");
  if (!navLinks || !burger) return;
  navLinks.classList.toggle("active");
  burger.classList.toggle("active");
  document.body.style.overflow = navLinks.classList.contains("active")
    ? "hidden"
    : "auto";
}

window.addEventListener("includesLoaded", () => {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelector(".nav-links")?.classList.remove("active");
      document.querySelector(".hamburger")?.classList.remove("active");
    });
  });
});

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;
  if (header) {
    if (currentScroll <= 50) {
      header.classList.remove("nav-hidden");
    } else if (currentScroll > lastScroll) {
      header.classList.add("nav-hidden");
    } else {
      header.classList.remove("nav-hidden");
    }
  }
  lastScroll = currentScroll;

  document.querySelectorAll(".parallax-img").forEach((img) => {
    const rect = img.parentElement?.getBoundingClientRect();
    if (!rect) return;
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const shift = (window.innerHeight / 2 - rect.top) * 0.08;
      img.style.transform = `scale(1.1) translateY(${shift}px)`;
    }
  });
});

function toTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
