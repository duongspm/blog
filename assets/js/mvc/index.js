import { db } from "./firebaseConfig.js";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

class IndexModel {
  constructor() {
    this.posts = [];
    this.projects = [];
    this.feedbacks =
      JSON.parse(localStorage.getItem("userFeedbacks") || "null") || [
        {
          name: "Nguy?n Vãn A",
          role: "CEO Tech",
          content: "Code r?t s?ch, t?i ýu t?t!",
          avatar: "https://i.pravatar.cc/100?img=12",
        },
      ];
    this.favorites = JSON.parse(localStorage.getItem("favoritePostIds") || "[]");
  }

  subscribePosts(onChange) {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    onSnapshot(
      q,
      (snapshot) => {
        this.posts = [];
        snapshot.forEach((doc) => {
          this.posts.push({ id: doc.id, ...doc.data() });
        });
        onChange(this.posts);
      },
      (err) => {
        console.error("L?i load posts:", err);
        onChange([]);
      },
    );
  }

  subscribeProjects(onChange) {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    onSnapshot(
      q,
      (snapshot) => {
        this.projects = [];
        snapshot.forEach((doc) => {
          this.projects.push({ id: doc.id, ...doc.data() });
        });
        onChange(this.projects);
      },
      (err) => {
        console.error("L?i load projects:", err);
        onChange([]);
      },
    );
  }

  addFeedback(feedback) {
    this.feedbacks.unshift(feedback);
    localStorage.setItem("userFeedbacks", JSON.stringify(this.feedbacks));
    return addDoc(collection(db, "feedbacks"), {
      ...feedback,
      createdAt: serverTimestamp(),
    });
  }

  toggleFavorite(postId) {
    if (this.favorites.includes(postId)) {
      this.favorites = this.favorites.filter((id) => id !== postId);
    } else {
      this.favorites.push(postId);
    }
    localStorage.setItem("favoritePostIds", JSON.stringify(this.favorites));
  }
}

class IndexView {
  constructor() {
    this.projectList = document.getElementById("project-list");
    this.projectCount = document.getElementById("project-count");
    this.blogMasonry = document.getElementById("blog-masonry");
    this.feedbackForm = document.getElementById("feedbackForm");
    this.feedbackName = document.getElementById("fbName");
    this.feedbackRole = document.getElementById("fbRole");
    this.feedbackContent = document.getElementById("fbContent");
    this.searchInput = document.getElementById("searchInput");
    this.categoryFilter = document.getElementById("categoryFilter");
    this.projectCount = document.getElementById("project-count");
  }

  renderProjects(projects) {
    if (!this.projectList) return;
    if (!projects.length) {
      this.projectList.innerHTML = "<div style='opacity:.6'>Chýa có d? án.</div>";
      this.projectCount.innerText = "0";
      return;
    }

    this.projectList.innerHTML = projects
      .map(
        (p) => `
            <a href="project-detail.html?id=${p.id}" class="project-card">
                <img src="${p.image || "https://picsum.photos/300/200"}" class="project-img" alt="${p.name}" loading="lazy">
                <div class="project-info">
                    <span class="tag">${p.tech || "Không tag"}</span>
                    <h3>${p.name}</h3>
                    <p>${(p.description || "").substring(0, 90)}...</p>
                </div>
            </a>
        `,
      )
      .join("\n");
    this.projectCount.innerText = String(projects.length);
  }

  renderPosts(posts, favoriteIds) {
    if (!this.blogMasonry) return;
    if (!posts.length) {
      this.blogMasonry.innerHTML = `<p style="grid-column:1/-1; text-align:center; opacity:.6">Chýa có bài vi?t nào.</p>`;
      return;
    }
    this.blogMasonry.innerHTML = posts
      .map((post) => {
        const isFav = favoriteIds.includes(post.id);
        return `
                <article class="blog-item reveal">
                    <div class="glass-card">
                        <div class="post-meta"><span class="category">${post.category || "Khác"}</span><time>${post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString("vi-VN") : ""}</time></div>
                        <h3>${post.title}</h3>
                        <div class="img-wrap auto-height"><img src="${post.image || "https://picsum.photos/200/300?random=100"}" alt="${post.title}" class="parallax-img" loading="lazy"></div>
                        <p>${(post.content || "").substring(0, 120)}...</p>
                        <div class="post-actions" style="display:flex; gap:.4rem; margin-top:.5rem; align-items:center;">
                            <button class="magnetic-btn btn-read" data-id="${post.id}"><span class="btn-text">Ð?c thêm ?</span></button>
                            <button class="magnetic-btn btn-fav" data-id="${post.id}">${isFav ? "? Ð? yêu thích" : "? Yêu thích"}</button>
                        </div>
                    </div>
                </article>
            `;
      })
      .join("");
    this.reinitReveal();
  }

  renderFeedbacks(feedbacks) {
    const slider = document.querySelector(".feedback-slider .swiper-wrapper");
    if (!slider) return;
    slider.innerHTML = feedbacks
      .map(
        (fb) => `
            <div class="swiper-slide">
                <div class="feedback-card">
                    <div class="quote-icon">"</div>
                    <p class="comment">${fb.content}</p>
                    <div class="user-info"><img src="${fb.avatar}" alt="${fb.name}"><div><h4>${fb.name}</h4><span>${fb.role}</span></div></div>
                </div>
            </div>
        `,
      )
      .join("");
  }

  reinitReveal() {
    const entries = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { threshold: 0.15 },
    );
    entries.forEach((e) => obs.observe(e));
  }
}

class IndexController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.filteredPosts = [];
  }

  async init() {
    this.view.renderFeedbacks(this.model.feedbacks);
    this.initSwiper();
    this.bindEvents();
    this.setupTypewriter();
    this.setupWheel();
    this.model.subscribePosts((posts) => {
      this.filteredPosts = posts;
      this.applyFilters();
    });
    this.model.subscribeProjects((projects) => {
      this.view.renderProjects(projects);
    });
  }

  bindEvents() {
    this.view.searchInput?.addEventListener("input", () => this.applyFilters());
    this.view.categoryFilter?.addEventListener("change", () => this.applyFilters());

    document.body.addEventListener("click", (e) => {
      const readBtn = e.target.closest(".btn-read");
      if (readBtn) {
        const id = readBtn.dataset.id;
        window.location.href = `post-detail.html?id=${id}`;
      }
      const favBtn = e.target.closest(".btn-fav");
      if (favBtn) {
        const id = favBtn.dataset.id;
        this.model.toggleFavorite(id);
        this.applyFilters();
      }
    });

    this.view.feedbackForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const newFb = {
        name: this.view.feedbackName.value.trim() || "Ngý?i dùng",
        role: this.view.feedbackRole.value.trim() || "Khách hàng",
        content: this.view.feedbackContent.value.trim(),
        avatar: `https://i.pravatar.cc/80?u=${Date.now()}`,
      };
      if (!newFb.content) return;
      await this.model.addFeedback(newFb);
      this.view.feedbackName.value = "";
      this.view.feedbackRole.value = "";
      this.view.feedbackContent.value = "";
      this.view.renderFeedbacks(this.model.feedbacks);
      if (typeof confetti === "function")
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
    });
  }

  applyFilters() {
    const q = this.view.searchInput.value.toLowerCase().trim();
    const category = this.view.categoryFilter.value;
    let posts = this.filteredPosts;
    if (category !== "all") {
      posts = posts.filter(
        (p) => (p.category || "").toLowerCase() === category.toLowerCase(),
      );
    }
    if (q) {
      posts = posts.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.content || "").toLowerCase().includes(q),
      );
    }
    this.view.renderPosts(posts, this.model.favorites);
  }

  initSwiper() {
    new Swiper(".feedback-slider", {
      loop: true,
      autoplay: { delay: 4000, disableOnInteraction: false },
      pagination: { el: ".swiper-pagination", clickable: true },
      breakpoints: { 640: { slidesPerView: 1, spaceBetween: 20 }, 1024: { slidesPerView: 2, spaceBetween: 30 } },
    });
  }

  setupTypewriter() {
    const words = ["Web Performance", "UI/UX", "Full-stack", "Sáng t?o"];
    const target = document.getElementById("typewriter");
    let i = 0,
      j = 0,
      forward = true;
    const tick = () => {
      if (!target) return;
      if (forward) {
        target.innerText = words[i].slice(0, j + 1);
        j++;
        if (j === words[i].length) {
          forward = false;
          setTimeout(tick, 1200);
          return;
        }
      } else {
        target.innerText = words[i].slice(0, j - 1);
        j--;
        if (j === 0) {
          forward = true;
          i = (i + 1) % words.length;
        }
      }
      setTimeout(tick, forward ? 120 : 70);
    };
    tick();
  }

  setupWheel() {
    const canvas = document.getElementById("wheelCanvas");
    const wheelInput = document.getElementById("wheelInput");
    const wheelBtn = document.getElementById("wheelBtn");
    if (!canvas || !wheelInput || !wheelBtn) return;

    const ctx = canvas.getContext("2d");
    let currentRotation = 0;
    let spinning = false;

    const draw = () => {
      const items = wheelInput.value
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean);
      const size = canvas.width;
      const center = size / 2;
      const radius = center - 8;
      ctx.clearRect(0, 0, size, size);
      if (!items.length) {
        ctx.fillStyle = "#888";
        ctx.fillText("Nh?p ít nh?t 2 m?c", 20, center);
        return;
      }
      const slice = (2 * Math.PI) / items.length;
      for (let i = 0; i < items.length; i++) {
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.fillStyle = `hsl(${(i * 360) / items.length}, 70%, 60%)`;
        ctx.arc(center, center, radius, i * slice, (i + 1) * slice);
        ctx.fill();
        ctx.stroke();
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(i * slice + slice / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "bold 12px Arial";
        ctx.fillText(items[i].slice(0, 18), radius - 14, 5);
        ctx.restore();
      }
    };

    draw();
    wheelInput.addEventListener("input", draw);

    wheelBtn.addEventListener("click", () => {
      if (spinning) return;
      const items = wheelInput.value
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean);
      if (items.length < 2) return alert("Nh?p ít nh?t 2 m?c.");
      spinning = true;
      wheelBtn.disabled = true;
      const degree = 1800 + Math.random() * 360;
      currentRotation += degree;
      canvas.style.transform = `rotate(${currentRotation}deg)`;
      setTimeout(() => {
        spinning = false;
        wheelBtn.disabled = false;
        const final = currentRotation % 360;
        const slice = 360 / items.length;
        const idx = Math.floor(((360 - final + 90) % 360) / slice);
        document.getElementById("winnerName").innerText =
          items[idx] || "Không xác ð?nh";
        document.getElementById("resultModal").style.display = "flex";
        if (typeof confetti === "function")
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }, 3800);
    });
  }
}

new IndexController(new IndexModel(), new IndexView()).init();
