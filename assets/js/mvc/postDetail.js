import { db } from "./firebaseConfig.js";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

class PostDetailModel {
  constructor(postId) {
    this.postId = postId;
  }

  async loadPost() {
    if (!this.postId) throw new Error("Missing post ID");
    const docRef = doc(db, "posts", this.postId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) throw new Error("Bài viết không tồn tại");
    return { id: snap.id, ...snap.data() };
  }

  async likePost() {
    const postRef = doc(db, "posts", this.postId);
    await updateDoc(postRef, { likes: increment(1) });
  }

  async addComment(name, text) {
    const comments = collection(db, "posts", this.postId, "comments");
    await addDoc(comments, { name, text, createdAt: serverTimestamp() });
  }

  subscribeComments(onChange) {
    const commentsRef = collection(db, "posts", this.postId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "desc"));
    onSnapshot(q, (snap) => {
      const result = [];
      snap.forEach((doc) => result.push({ id: doc.id, ...doc.data() }));
      onChange(result);
    });
  }
}

class PostDetailView {
  constructor() {
    this.postContent = document.getElementById("postContent");
    this.nameInput = document.getElementById("commentName");
    this.textInput = document.getElementById("commentText");
    this.sendBtn = document.getElementById("btnSendComment");
    this.commentList = document.getElementById("commentList");
  }

  renderPost(post) {
    if (!this.postContent) return;
    document.title = `${post.title} | Duongg Blog`;
    const date = post.createdAt
      ? new Date(post.createdAt.seconds * 1000).toLocaleDateString("vi-VN")
      : "";
    this.postContent.innerHTML = `
            <header class="detail-header">
                <span class="category">${post.category}</span>
                <h1 class="post-title">${post.title}</h1>
                <time>Đăng ngày ${date}</time>
            </header>
            <img src="${post.image || "https://picsum.photos/900/500"}" class="detail-hero-img" alt="${post.title}">
            <div class="detail-content">${(post.content || "")
              .split("\n")
              .map((p) => `<p>${p}</p>`)
              .join("")}</div>
            <div class="like-section" style="margin-top:30px; text-align:center;">
                <button id="btnLike" class="glass-card magnetic-btn" style="padding: 10px 25px; border-radius: 50px;">❤️ <span id="likeCount">${post.likes || 0}</span></button>
                <p>Yêu thích bài viết này</p>
            </div>
        `;
  }

  renderComments(comments) {
    if (!this.commentList) return;
    this.commentList.innerHTML = comments
      .map(
        (c) => `
            <div class="comment-item" style="margin-bottom:15px; padding:15px; background:rgba(255,255,255,0.05); border-radius:10px;">
                <b style="color:var(--primary);">${c.name}</b>
                <p style="margin:5px 0;">${c.text}</p>
                <small style="opacity:0.5;">${c.createdAt ? new Date(c.createdAt.seconds * 1000).toLocaleString("vi-VN") : "Đang gửi..."}</small>
            </div>
        `,
      )
      .join("");
  }
}

class PostDetailController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async init() {
    try {
      const post = await this.model.loadPost();
      this.view.renderPost(post);
      this.view.renderComments([]);
      this.bindEvents();
      this.model.subscribeComments((comments) =>
        this.view.renderComments(comments),
      );
    } catch (error) {
      alert(error.message || "Lỗi khi tải bài viết");
      window.location.href = "index.html";
    }
  }

  bindEvents() {
    document.body.addEventListener("click", async (e) => {
      if (e.target.id === "btnLike" || e.target.closest("#btnLike")) {
        try {
          await this.model.likePost();
          const countSpan = document.getElementById("likeCount");
          if (countSpan)
            countSpan.innerText = String(
              parseInt(countSpan.innerText || "0") + 1,
            );
        } catch (error) {
          console.error(error);
        }
      }
    });

    this.view.sendBtn?.addEventListener("click", async () => {
      const name = this.view.nameInput?.value.trim();
      const text = this.view.textInput?.value.trim();
      if (!name || !text) return alert("Vui lòng nhập đủ tên và bình luận!");
      await this.model.addComment(name, text);
      if (this.view.textInput) this.view.textInput.value = "";
    });
  }
}

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");
new PostDetailController(
  new PostDetailModel(postId),
  new PostDetailView(),
).init();
