import { db, storage } from "./firebaseConfig.js";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
import {
  ref as sRef,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-storage.js";

class AdminModel {
  constructor() {
    this.posts = [];
    this.todos = [];
    this.projects = [];
  }

  async createPost(data) {
    const docRef = await addDoc(collection(db, "posts"), {
      ...data,
      createdAt: serverTimestamp(),
      likes: 0,
    });
    return docRef.id;
  }

  async createProject(data) {
    const payload = { ...data, createdAt: serverTimestamp() };
    const docRef = await addDoc(collection(db, "projects"), payload);
    return docRef.id;
  }

  async updateProject(id, data) {
    await updateDoc(doc(db, "projects", id), data);
  }

  async deleteProject(id) {
    await deleteDoc(doc(db, "projects", id));
  }

  async uploadImage(file) {
    if (!file) return null;
    const storagePath = `project_images/${Date.now()}_${file.name}`;
    const snapshot = await uploadBytes(sRef(storage, storagePath), file);
    return await getDownloadURL(snapshot.ref);
  }

  subscribeProjects(onChange) {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    onSnapshot(
      q,
      (snap) => {
        const result = [];
        snap.forEach((d) => result.push({ id: d.id, ...d.data() }));
        this.projects = result;
        onChange(result);
      },
      (error) => console.error("Project listener error", error),
    );
  }

  addTodo(text) {
    return addDoc(collection(db, "todos"), {
      text,
      done: false,
      createdAt: serverTimestamp(),
    });
  }

  subscribeTodos(onChange) {
    const q = query(collection(db, "todos"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snap) => {
      const todos = [];
      snap.forEach((d) => todos.push({ id: d.id, ...d.data() }));
      this.todos = todos;
      onChange(todos);
    });
  }

  toggleTodo(id, done) {
    return updateDoc(doc(db, "todos", id), { done: !done });
  }

  deleteTodo(id) {
    return deleteDoc(doc(db, "todos", id));
  }
}

class AdminView {
  constructor() {
    this.projectForm = document.getElementById("adminProjectForm");
    this.pName = document.getElementById("pName");
    this.pLink = document.getElementById("pLink");
    this.pImage = document.getElementById("pImage");
    this.pTech = document.getElementById("pTech");
    this.pDesc = document.getElementById("pDesc");
    this.projectTableBody = document.getElementById("projectTableBody");
    this.btnCancelEdit = document.getElementById("btnCancelEdit");

    this.postForm = document.getElementById("btnPublish");
    this.title = document.getElementById("postTitle");
    this.category = document.getElementById("postCategory");
    this.content = document.getElementById("postContent");
    this.imageFile = document.getElementById("imageFile");
    this.tableBody = document.getElementById("tableBody");

    this.todoInput = document.getElementById("todoInput");
    this.btnAddTodo = document.getElementById("btnAddTodo");
    this.todoList = document.getElementById("todoList");
    this.todoCount = document.getElementById("todoCount");
  }

  renderProjects(projects) {
    if (!this.projectTableBody) return;
    if (!projects.length) {
      this.projectTableBody.innerHTML = "<tr><td colspan='4' style='text-align:center; opacity:.6;'>Chýa có d? án</td></tr>";
      return;
    }

    this.projectTableBody.innerHTML = projects
      .map(
        (p) => `
            <tr>
              <td>${p.name}</td>
              <td><a href='${p.link}' target='_blank'>${p.link}</a></td>
              <td>${p.tech || "-"}</td>
              <td>
                <button class='btn-edit' data-id='${p.id}'>S?a</button>
                <button class='btn-delete' data-id='${p.id}'>Xóa</button>
              </td>
            </tr>
          `,
      )
      .join("");
  }

  renderPosts(posts) {
    if (!this.tableBody) return;
    if (!posts.length) {
      this.tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; opacity:.5;">Chýa có bài vi?t</td></tr>';
      return;
    }
    this.tableBody.innerHTML = posts
      .map(
        (post) => `
            <tr>
                <td><img src="${post.image || "https://picsum.photos/80/80"}" class="thumb-img" alt="thumb"></td>
                <td><div style="font-weight:600;">${post.title}</div><div style="font-size:.76rem; opacity:.6">${post.category || "Chýa phân lo?i"}</div></td>
                <td>${post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString("vi-VN") : ""}</td>
                <td><button class="btn-delete" data-id="${post.id}">Xóa</button></td>
            </tr>
        `,
      )
      .join("");
  }

  renderTodos(todos) {
    if (!this.todoList) return;
    this.todoList.innerHTML = todos
      .map(
        (todo) => `
            <li class="todo-item ${todo.done ? "done" : ""}">
                <span>${todo.text}</span>
                <div class="todo-btns">
                    <button class="btn-todo" data-action="toggle" data-id="${todo.id}" data-done="${todo.done}">?</button>
                    <button class="btn-todo" data-action="delete" data-id="${todo.id}">?</button>
                </div>
            </li>
        `,
      )
      .join("");
    this.todoCount.innerText = String(todos.length);
  }

  setLoading(enabled) {
    const button = document.querySelector("#adminProjectForm button[type='submit']");
    if (!button) return;
    button.disabled = enabled;
    button.innerText = enabled ? "Ðang lýu..." : "Lýu d? án";
  }

  fillProjectForm(project) {
    this.pName.value = project.name || "";
    this.pLink.value = project.link || "";
    this.pImage.value = project.image || "";
    this.pTech.value = project.tech || "";
    this.pDesc.value = project.description || "";
  }

  clearProjectForm() {
    this.pName.value = "";
    this.pLink.value = "";
    this.pImage.value = "";
    this.pTech.value = "";
    this.pDesc.value = "";
  }
}

class AdminController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.editProjectId = null;
  }

  init() {
    this.bindEvents();
    this.model.subscribeProjects((projects) => this.view.renderProjects(projects));
    this.model.subscribePosts((posts) => this.view.renderPosts(posts));
    this.model.subscribeTodos((todos) => this.view.renderTodos(todos));
  }

  bindEvents() {
    this.view.projectForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = this.view.pName.value.trim();
      const link = this.view.pLink.value.trim();
      const image = this.view.pImage.value.trim();
      const tech = this.view.pTech.value.trim();
      const description = this.view.pDesc.value.trim();
      if (!name || !link || !image) return alert("Tên, link, h?nh ?nh là b?t bu?c.");

      this.view.setLoading(true);
      try {
        const payload = { name, link, image, tech, description };
        if (this.editProjectId) {
          await this.model.updateProject(this.editProjectId, payload);
          alert("C?p nh?t d? án thành công.");
        } else {
          await this.model.createProject(payload);
          alert("T?o d? án thành công.");
        }
        this.editProjectId = null;
        this.view.clearProjectForm();
      } catch (err) {
        console.error(err);
        alert("L?i khi lýu d? án: " + err.message);
      } finally {
        this.view.setLoading(false);
      }
    });

    this.view.btnCancelEdit?.addEventListener("click", () => {
      this.editProjectId = null;
      this.view.clearProjectForm();
    });

    this.view.projectTableBody?.addEventListener("click", async (e) => {
      const editBtn = e.target.closest(".btn-edit");
      const deleteBtn = e.target.closest(".btn-delete");
      if (editBtn) {
        const id = editBtn.dataset.id;
        const docRef = doc(db, "projects", id);
        const snap = await getDoc(docRef);
        if (!snap.exists()) return alert("D? án không t?n t?i.");
        const p = { id: snap.id, ...snap.data() };
        this.editProjectId = p.id;
        this.view.fillProjectForm(p);
        return;
      }
      if (deleteBtn) {
        const id = deleteBtn.dataset.id;
        if (!confirm("Xác nh?n xóa d? án?")) return;
        await this.model.deleteProject(id);
      }
    });

    this.view.postForm?.addEventListener("click", async (e) => {
      e.preventDefault();
      const title = this.view.title.value.trim();
      const category = this.view.category.value;
      const content = this.view.content.value.trim();
      const file = this.view.imageFile.files[0];
      if (!title || !content) return alert("H?y nh?p tiêu ð? và n?i dung.");
      try {
        const imageUrl = file
          ? await this.model.uploadImage(file)
          : "https://picsum.photos/600/400";
        await this.model.createPost({ title, category, content, image: imageUrl });
        alert("Ð? ðãng bài thành công.");
        this.view.title.value = "";
        this.view.content.value = "";
        this.view.imageFile.value = "";
      } catch (error) {
        console.error(error);
        alert("L?i khi ðãng bài: " + error.message);
      }
    });

    this.view.btnAddTodo?.addEventListener("click", async () => {
      const text = this.view.todoInput.value.trim();
      if (!text) return;
      await this.model.addTodo(text);
      this.view.todoInput.value = "";
    });

    this.view.todoList?.addEventListener("click", async (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      if (action === "toggle") await this.model.toggleTodo(id, btn.dataset.done === "true");
      if (action === "delete") await this.model.deleteTodo(id);
    });
  }
}

new AdminController(new AdminModel(), new AdminView()).init();
