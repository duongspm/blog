 import { 
    getStorage, 
    ref as sRef, 
    uploadBytes, 
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-storage.js";

// Các import khác giữ nguyên (đảm bảo có đuôi .js)
// import { initializeApp } from "https://www.gstatic.com";
import { getFirestore, collection, addDoc, serverTimestamp,query, orderBy,updateDoc , 
    onSnapshot, 
    doc, 
    deleteDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
 import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";

  const firebaseConfig = {
    apiKey: "AIzaSyCnPc_SS_dR0dXl7WPY1FNp_YgKoUyBl-E",
    authDomain: "my-creative-blog.firebaseapp.com",
    projectId: "my-creative-blog",
    storageBucket: "my-creative-blog.firebasestorage.app",
    messagingSenderId: "57335816842",
    appId: "1:57335816842:web:9212c8576d23e534c00373",
    measurementId: "G-ETT210DYQX"
  };
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  const db = getFirestore(app);
  try {
    // Khởi tạo Firebase
    const analytics = getAnalytics(app);
    
    
    // Kiểm tra tên Project để xác nhận đã nhận đúng Config
    console.log("🚀 Firebase kết nối thành công!");
    console.log("Project ID:", app.options.projectId);
    console.log("Chi tiết:", analytics);
    
  } catch (error) {
    console.error("❌ Lỗi kết nối Firebase:");
    console.error("Mã lỗi:", error.code);
    console.error("Chi tiết:", error.message);
    
  }
  // admin-logic.js

// ... (Các phần import và khởi tạo Firebase giữ nguyên) ...
// 1. Kiểm tra nút Publish (Chỉ có ở Admin)
document.getElementById('btnPublish').addEventListener('click', async (e) => {
    e.preventDefault();

    const title = document.getElementById('postTitle').value;
    const category = document.getElementById('postCategory').value;
    const content = document.getElementById('postContent').value;
    const file = document.getElementById('imageFile').files[0];
    const btn = document.getElementById('btnPublish');

    if (!title || !content) {
        return alert("Vui lòng nhập đủ Tiêu đề, Nội dung và chọn Ảnh!");
    }

    // HIỆN TRẠNG THÁI XỬ LÝ NGAY LẬP TỨC (Tăng UX)
    btn.disabled = true;
    btn.innerHTML = `<span class="btn-text">🚀 Đang xử lý dữ liệu...</span>`;

    try {
        // BƯỚC 1: Tải ảnh lên Storage (Phần nặng nhất)
        // Chúng ta phải có URL ảnh trước khi tạo bài viết để bài viết hiển thị hoàn hảo
        const storagePath = `blog_images/${Date.now()}_${file.name}`;
        const storageReference = sRef(storage, storagePath);
        
        btn.innerHTML = `<span class="btn-text">📸 Đang tải ảnh lên...</span>`;
        const snapshot = await uploadBytes(storageReference, file);
        const imageURL = await getDownloadURL(snapshot.ref);
        // const imageURL = 'https://picsum.photos/200/300?random=2';


        // BƯỚC 2: Lưu vào Firestore (Rất nhanh)
        btn.innerHTML = `<span class="btn-text">✍️ Đang xuất bản bài viết...</span>`;
        await addDoc(collection(db, "posts"), {
            title: title,
            category: category,
            content: content,
            image: imageURL,
            createdAt: serverTimestamp()
        });

        alert("🎉 Bài viết đã được đăng thành công!");
        // window.location.href = "../index.html"; // Chuyển hướng về trang chủ để xem kết quả

    } catch (error) {
        console.error("Lỗi:", error);
        alert("Lỗi: " + error.message);
        btn.disabled = false;
        btn.innerHTML = `<span class="btn-text">Thử lại</span>`;
    }
});

// Giả sử 'db' đã được khởi tạo ở trên
const tableBody = document.getElementById('tableBody');

function loadPostsAdmin() {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    // Dùng onSnapshot để lắng nghe dữ liệu thời gian thực
    onSnapshot(q, (snapshot) => {
        tableBody.innerHTML = ""; // Xóa trắng danh sách cũ

        if (snapshot.empty) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; opacity:0.5;">Chưa có bài viết nào.</td></tr>`;
            return;
        }

        snapshot.forEach((post) => {
            const data = post.data();
            const id = post.id;
            const date = data.createdAt ? data.createdAt.toDate().toLocaleDateString('vi-VN') : "Đang xử lý...";

            const row = `
                <tr>
                    <td><img src="${data.image}" class="thumb-img" alt="thumb"></td>
                    <td>
                        <div style="font-weight:600; font-size:0.9rem;">${data.title}</div>
                        <div style="font-size:0.7rem; opacity:0.5;">${data.category}</div>
                    </td>
                    <td><span style="font-size:0.8rem; opacity:0.7;">${date}</span></td>
                    <td>
                        <button class="btn-delete" onclick="deletePost('${id}')">Xóa</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    });
}

// Hàm xóa bài viết
window.deletePost = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
        try {
            await deleteDoc(doc(db, "posts", id));
            alert("Đã xóa bài viết thành công!");
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
        }
    }
};

// Khởi tạo Todo (Đặt trong DomContentLoaded)
// import { 
//         deleteDoc, updateDoc, serverTimestamp 
// } from "https://www.gstatic.com";

function initTodo() {
    const todoInput = document.getElementById('todoInput');
    const btnAdd = document.getElementById('btnAddTodo');
    const todoList = document.getElementById('todoList');
    const todoCount = document.getElementById('todoCount');

    // 1. Thêm Task
    btnAdd.addEventListener('click', async () => {
        if (!todoInput.value.trim()) return;
        await addDoc(collection(db, "todos"), {
            text: todoInput.value,
            done: false,
            createdAt: serverTimestamp()
        });
        todoInput.value = "";
    });

    // 2. Lắng nghe dữ liệu
    const qTodos = query(collection(db, "todos"), orderBy("createdAt", "desc"));
    onSnapshot(qTodos, (snap) => {
        todoList.innerHTML = "";
        todoCount.innerText = snap.size;
        
        snap.forEach(t => {
            const data = t.data();
            const id = t.id;
            const li = document.createElement('li');
            li.className = `todo-item ${data.done ? 'done' : ''}`;
            li.innerHTML = `
                <span>${data.text}</span>
                <div class="todo-btns">
                    <button class="btn-todo" onclick="toggleTodo('${id}', ${data.done})" style="color:#10b981">✔</button>
                    <button class="btn-todo" onclick="deleteTodo('${id}')" style="color:#ef4444">✘</button>
                </div>
            `;
            todoList.appendChild(li);
        });
    });
}

// Gán hàm vào window để HTML gọi được (Xóa & Toggle)
window.deleteTodo = async (id) => { await deleteDoc(doc(db, "todos", id)); };
window.toggleTodo = async (id, status) => { await updateDoc(doc(db, "todos", id), { done: !status }); };

// Đừng quên gọi initTodo() trong DOMContentLoaded
initTodo();

// Gọi hàm load ngay khi trang sẵn sàng
document.addEventListener("DOMContentLoaded", loadPostsAdmin);

// import { collection, query, orderBy, onSnapshot } from "https://www.gstatic.com";

const projectDb = firebase.database().ref('projects');

document.getElementById('adminProjectForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const newProject = {
        name: document.getElementById('pName').value,
        tech: document.getElementById('pTech').value,
        link: document.getElementById('pLink').value,
        image: document.getElementById('pImage').value || `https://www.s-shot.com{document.getElementById('pLink').value}`,
        description: document.getElementById('pDesc').value,
        createdAt: Date.now()
    };

    // Đẩy lên Firebase
    projectDb.push(newProject)
        .then(() => {
            alert("Thêm dự án thành công! 🎉");
            this.reset();
            confetti({ particleCount: 150, spread: 70 });
        })
        .catch(err => alert("Lỗi: " + err.message));
});
// Thay đổi hàm load dự án cũ thành hàm lắng nghe Realtime
firebase.database().ref('projects').on('value', (snapshot) => {
    const grid = document.getElementById('project-list');
    grid.innerHTML = ''; // Xóa cũ
    
    snapshot.forEach((childSnapshot) => {
        const p = childSnapshot.val();
        const pId = childSnapshot.key; // ID duy nhất từ Firebase
        
        grid.innerHTML += `
            <div class="project-card" onclick="openProjectDetail('${pId}')">
                <img src="${p.image}" class="project-img">
                <div class="project-info">
                    <span class="tag">${p.tech}</span>
                    <h3>${p.name}</h3>
                    <p>${p.description.substring(0, 60)}...</p>
                </div>
            </div>
        `;
    });
});
