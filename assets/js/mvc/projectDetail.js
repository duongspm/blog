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

const params = new URLSearchParams(window.location.search);
const projectId = params.get("id");
const card = document.getElementById("projectCard");
const commentList = document.getElementById("commentList");
const btnSend = document.getElementById("btnSendComment");
const nameInput = document.getElementById("commentName");
const textInput = document.getElementById("commentText");

async function loadProject() {
  if (!projectId) {
    card.innerHTML = '<div class="loading">ID dự án không hợp lệ.</div>';
    return;
  }
  const projectRef = doc(db, "projects", projectId);
  const snap = await getDoc(projectRef);
  if (!snap.exists()) {
    card.innerHTML = '<div class="loading">Không tìm thấy dự án.</div>';
    return;
  }
  const p = { id: snap.id, ...snap.data() };
  const avatar = p.name ? p.name.trim().charAt(0).toUpperCase() : "P";
  const createdAtText = p.createdAt
    ? new Date(p.createdAt.seconds * 1000).toLocaleDateString("vi-VN")
    : "Chưa cập nhật";
  card.innerHTML = `
    <div class="project-detail-card">
        <div class="project-banner">
            <img src="${p.image || "https://picsum.photos/1000/600"}" alt="${p.name}" class="main-img">
            <div class="category-badge">${p.tech || "Dự án"}</div>
        </div>

        <div class="project-body">
            <div class="project-meta">
                <div class="author-info">
                    <div class="avatar-circle">${avatar}</div>
                    <div class="title-group">
                        <h1 class="project-title">${p.name}</h1>
                        <p class="publish-date">Ngày tạo: ${createdAtText}</p>
                    </div>
                </div>
                <a href="${p.link}" target="_blank" class="btn-visit-glow">
                    <span>Mở Website</span>
                    <i class="icon">🚀</i>
                </a>
            </div>

            <div class="project-description">
                <div class="tech-stack-wrapper">
                    <h4 class="detail-label">🚀 Công nghệ sử dụng</h4>
                
                    <div class="tech-tags-container">
                        <span class="tag-badge" data-tooltip="Click để xem các dự án cùng ngôn ngữ này">${p.tech || "Chưa cập nhật"}</span>
                    </div>

                </div>
                <div class="desc-content-wrapper">
                    <h4 class="detail-label">📝 Mô tả dự án</h4>
                    <p class="desc-text">${p.description || "Không có mô tả dự án."}</p>
                </div>
            </div>
        </div>
    </div>
  `;
}

async function sendComment() {
  const name = nameInput.value.trim();
  const text = textInput.value.trim();
  if (!name || !text) {
    alert("Nhập tên và bình luận.");
    return;
  }
  await addDoc(collection(db, "projects", projectId, "comments"), {
    name,
    text,
    createdAt: serverTimestamp(),
  });
  textInput.value = "";
}

function renderComments(items) {
  if (!commentList) return;
  if (!items.length) {
    commentList.innerHTML =
      '<div style="opacity:.6">Chưa có bình luận nào. Hãy là người đầu tiên!</div>';
    return;
  }
  commentList.innerHTML = items
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

function subscribeComments() {
  const q = query(
    collection(db, "projects", projectId, "comments"),
    orderBy("createdAt", "desc"),
  );
  onSnapshot(q, (snap) => {
    const items = [];
    snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
    renderComments(items);
  });
}

btnSend?.addEventListener("click", sendComment);
loadProject();
if (projectId) subscribeComments();
