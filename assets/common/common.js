/**
 * WEBSITE MAIN LOGIC - REFACTORED
 */

// --- 1. KHỞI TẠO BIẾN TOÀN CỤC ---
const html = document.documentElement;
const dot = document.querySelector(".cursor-dot");
const outline = document.querySelector(".cursor-outline");
const btnTop = document.getElementById("btnTop");
const progressBar = document.getElementById("bar");

// --- 2. GIAO DIỆN & HIỆU ỨNG CHUỘT (CUSTOM CURSOR) ---
function initCustomCursor() {
  // Không chạy con trỏ trên trang Admin hoặc Thiết bị di động
  if (
    document.body.classList.contains("admin-page") ||
    window.innerWidth < 1024
  ) {
    html.style.cursor = "auto";
    if (dot) dot.style.display = "none";
    if (outline) outline.style.display = "none";
    return;
  }
  if (!dot || !outline) return;

  window.addEventListener("mousemove", (e) => {
    const { clientX: x, clientY: y } = e;
    if (dot) {
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
    }

    if (outline) {
      outline.animate(
        {
          left: `${x}px`,
          top: `${y}px`,
        },
        { duration: 400, fill: "forwards" },
      );
    }
  });

  // Hiệu ứng tương tác khi di chuột vào các phần tử click được
  const interactiveElements =
    "a, button, .blog-item, .magnetic-btn, .project-card";
  document.querySelectorAll(interactiveElements).forEach((el) => {
    el.addEventListener("mouseenter", () => {
      outline.style.transform = "translate(-50%, -50%) scale(1.8)";
      outline.style.background = "rgba(99, 102, 241, 0.1)";
      outline.style.borderColor = "var(--primary-color)";
    });
    el.addEventListener("mouseleave", () => {
      outline.style.transform = "translate(-50%, -50%) scale(1)";
      outline.style.background = "transparent";
    });
  });
}

// --- 3. XỬ LÝ CUỘN TRANG (SCROLL EFFECTS) ---
function handleScroll() {
  const winScroll = html.scrollTop || document.body.scrollTop;
  const height = html.scrollHeight - html.clientHeight;
  const scrolled = (winScroll / height) * 100;

  // Cập nhật Thanh tiến trình (Progress Bar)
  if (progressBar) progressBar.style.width = scrolled + "%";

  // Hiện/Ẩn nút Back to Top
  if (btnTop) {
    winScroll > 400
      ? btnTop.classList.add("show")
      : btnTop.classList.remove("show");
  }

  // Hiệu ứng Parallax cho hình ảnh
  document.querySelectorAll(".parallax-img").forEach((img) => {
    const rect = img.parentElement.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const shift = (window.innerHeight / 2 - rect.top) * 0.1;
      img.style.transform = `scale(1.2) translateY(${shift}px)`;
    }
  });
}

// --- 4. CÁC TƯƠNG TÁC NGƯỜI DÙNG (INTERACTIONS) ---

// Chế độ sáng/tối
function toggleTheme() {
  const currentTheme = html.getAttribute("data-theme");
  currentTheme === "dark"
    ? html.removeAttribute("data-theme")
    : html.setAttribute("data-theme", "dark");
}

// Hiệu ứng Magnetic (Nam châm) cho nút
function initMagneticButtons() {
  document.querySelectorAll(".magnetic-btn").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const pos = btn.getBoundingClientRect();
      const x = e.clientX - (pos.left + pos.width / 2);
      const y = e.clientY - (pos.top + pos.height / 2);
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
    });

    // Hiệu ứng Ripple (Vòng tròn lan tỏa) khi click
    btn.addEventListener("click", function (e) {
      let ripple = document.createElement("span");
      ripple.classList.add("ripple");
      this.appendChild(ripple);

      const x = e.clientX - this.getBoundingClientRect().left;
      const y = e.clientY - this.getBoundingClientRect().top;

      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// Cuộn lên đầu trang (Back to Top)
if (btnTop) {
  btnTop.addEventListener("click", () => {
    btnTop.classList.add("launching");
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (typeof confetti === "function") {
      confetti({ particleCount: 30, spread: 30, origin: { y: 0.9 } });
    }

    setTimeout(() => btnTop.classList.remove("launching"), 600);
  });
}

// Cuộn mượt cho Navigation
document.querySelectorAll(".nav-item").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId.startsWith("#")) {
      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    }
  });
});

// Hiệu ứng hiện dần khi cuộn (Reveal on Scroll)
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target); // Chỉ chạy hiệu ứng 1 lần
      }
    });
  },
  { threshold: 0.15 },
);

// --- 5. KHỞI CHẠY HỆ THỐNG ---
document.addEventListener("DOMContentLoaded", () => {
  initCustomCursor();
  initMagneticButtons();
  handleScroll(); // Chạy ngay lập tức để kiểm tra vị trí trang

  document
    .querySelectorAll(".reveal")
    .forEach((el) => revealObserver.observe(el));
  window.addEventListener("scroll", handleScroll);
});
