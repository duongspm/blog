import { db } from "./firebaseConfig.js";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

class ProjectDetailModel {
  constructor(projectId) {
    this.projectId = projectId;
  }

  async loadProject() {
    if (!this.projectId) throw new Error("Missing project ID");
    const projectRef = doc(db, "projects", this.projectId);
    const snap = await getDoc(projectRef);
    if (!snap.exists()) throw new Error("Dự án không tồn tại");
    return { id: snap.id, ...snap.data() };
  }

  async addComment(name, text) {
    const commentsRef = collection(db, "projects", this.projectId, "comments");
    await addDoc(commentsRef, { name, text, createdAt: serverTimestamp() });
  }

  subscribeComments(onChange) {
    const commentsRef = collection(db, "projects", this.projectId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "desc"));
    onSnapshot(q, (snap) => {
      const result = [];
      snap.forEach((doc) => result.push({ id: doc.id, ...doc.data() }));
      onChange(result);
    });
  }
}

class ProjectDetailView {
  constructor() {
    this.card = document.getElementById("projectCard");
    this.commentList = document.getElementById("commentList");
    this.nameInput = document.getElementById("commentName");
    this.textInput = document.getElementById("commentText");
    this.btnSend = document.getElementById("btnSendComment");
  }

  renderProject(project) {
    if (!this.card) return;
    const avatar = project.name
      ? project.name.trim().charAt(0).toUpperCase()
      : "P";
    const createdAtText = project.createdAt
      ? new Date(project.createdAt.seconds * 1000).toLocaleDateString("vi-VN")
      : "Chưa cập nhật";

    this.card.innerHTML = `
      <div class="project-detail-card">
          <div class="project-banner">
              <img src="${project.image || "https://picsum.photos/1000/600"}" alt="${project.name}" class="main-img">
              <div class="category-badge">${project.tech || "Dự án"}</div>
          </div>

          <div class="project-body">
              <div class="project-meta">
                  <div class="author-info">
                      <div class="avatar-circle">${avatar}</div>
                      <div class="title-group">
                          <h1 class="project-title">${project.name}</h1>
                          <p class="publish-date">Ngày tạo: ${createdAtText}</p>
                      </div>
                  </div>
                  <a href="${project.link}" target="_blank" class="btn-visit-glow">
                      <span>Mở Website</span>
                      <i class="icon">🚀</i>
                  </a>
              </div>

              <div class="project-description">
                  <div class="tech-stack-wrapper">
                      <h4 class="detail-label">🚀 Công nghệ sử dụng</h4>

                      <div class="tech-tags-container">
                          <span class="tag-badge" data-tooltip="Click để xem các dự án cùng ngôn ngữ này">${project.tech || "Chưa cập nhật"}</span>
                      </div>

                  </div>
                  <div class="desc-content-wrapper">
                      <h4 class="detail-label">📝 Mô tả dự án</h4>
                      <p class="desc-text">${project.description || "Không có mô tả dự án."}</p>
                  </div>
              </div>
          </div>
      </div>
    `;
  }

  renderComments(comments) {
    if (!this.commentList) return;
    if (!comments.length) {
      this.commentList.innerHTML =
        '<div style="opacity:.6">Chưa có bình luận nào. Hãy là người đầu tiên!</div>';
      return;
    }
    this.commentList.innerHTML = comments
      .map(
        (c) => `
        <div class="comment-item">
          <div class="cmt-avatar">${c.name.charAt(0).toUpperCase()}</div>
          <div class="cmt-body">
              <strong>${c.name}</strong>
              <p>${c.text}</p>
          </div>
          <small>${c.createdAt ? new Date(c.createdAt.seconds * 1000).toLocaleString("vi-VN") : "..."}</small>
        </div>
      `,
      )
      .join("");
  }

  showError(message) {
    if (this.card) {
      this.card.innerHTML = `<div class="loading">${message}</div>`;
    }
  }

  getCommentData() {
    return {
      name: this.nameInput?.value.trim() || "",
      text: this.textInput?.value.trim() || "",
    };
  }

  clearCommentForm() {
    if (this.textInput) this.textInput.value = "";
  }

  bindSendComment(handler) {
    if (this.btnSend) {
      this.btnSend.addEventListener("click", handler);
    }
  }
}

class ProjectDetailController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.init();
  }

  async init() {
    try {
      const project = await this.model.loadProject();
      this.view.renderProject(project);
      this.setupComments();
    } catch (error) {
      this.view.showError(error.message);
    }
  }

  setupComments() {
    this.model.subscribeComments((comments) => {
      this.view.renderComments(comments);
    });

    this.view.bindSendComment(async () => {
      const { name, text } = this.view.getCommentData();
      if (!name || !text) {
        alert("Nhập tên và bình luận.");
        return;
      }
      try {
        await this.model.addComment(name, text);
        this.view.clearCommentForm();
      } catch (error) {
        alert("Lỗi khi gửi bình luận: " + error.message);
      }
    });
  }
}

// Initialize
const params = new URLSearchParams(window.location.search);
const projectId = params.get("id");

if (projectId) {
  const model = new ProjectDetailModel(projectId);
  const view = new ProjectDetailView();
  new ProjectDetailController(model, view);
} else {
  document.getElementById("projectCard").innerHTML =
    '<div class="loading">ID dự án không hợp lệ.</div>';
}
