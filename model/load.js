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
// Giả sử 'db' đã được khởi tạo
const postContainer = document.getElementById('blog-masonry');

function loadPosts() {
    // Truy vấn lấy bài mới nhất xếp lên đầu
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    // Lắng nghe dữ liệu Real-time
    onSnapshot(q, (snapshot) => {
        postContainer.innerHTML = ""; // Xóa dữ liệu mẫu

        if (snapshot.empty) {
            postContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; opacity: 0.5;">Chưa có bài viết nào được xuất bản.</p>`;
            return;
        }

        snapshot.forEach((doc) => {
            const data = doc.data();
            const id = doc.id;
            const date = data.createdAt ? data.createdAt.toDate().toLocaleDateString('vi-VN') : "";

            // Tạo cấu trúc HTML cho từng thẻ bài viết
            const postHTML = `
                <article class="blog-item reveal" id="${id}">
                    <div class="glass-card">
                        <div class="post-meta">
                            <span class="category">${data.category || 'Chưa phân loại'}</span>
                            <time>${date}</time>
                        </div>
                        
                        <h2 class="post-title">${data.title}</h2>
                        
                        <div class="img-wrap auto-height">
                            <picture>
                                <img src="${data.image}" alt="${data.title}" class="parallax-img" loading="lazy">
                            </picture>
                        </div>

                        <p class="post-excerpt">${data.content.substring(0, 120)}...</p>
                        
                        <button class="magnetic-btn" onclick="location.href='post-detail.html?id=${id}'">
                            <span class="btn-text">Đọc thêm →</span>
                        </button>
                    </div>
                </article>
            `;
            postContainer.innerHTML += postHTML;
        });

        // QUAN TRỌNG: Kích hoạt lại hiệu ứng sau khi dữ liệu đã render xong
        reinitEffects();
    });
}
// 1. Định nghĩa hàm lấy màu và tạo hiệu ứng Glow
function initGlowEffects() {
    document.querySelectorAll('.blog-item').forEach(item => {
        const img = item.querySelector('.parallax-img');
        
        // Đợi ảnh tải xong để lấy màu (giả lập lấy màu ngẫu nhiên để tối ưu hiệu suất)
        if (img) {
            const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Gán biến màu vào CSS của thẻ bài viết
            item.style.setProperty('--glow-color', randomColor);
            
            // Cập nhật màu Primary cho từng Card để đồng bộ
            const card = item.querySelector('.glass-card');
            if (card) {
                card.style.borderColor = `rgba(${hexToRgb(randomColor)}, 0.3)`;
            }
        }
    });
}
// Hàm hỗ trợ đổi mã màu Hex sang RGB để làm trong suốt viền
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
        : '59, 130, 246';
}
function reinitEffects() {
    // 1. Chạy lại Intersection Observer cho hiệu ứng Reveal
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

    // 2. Chạy lại hiệu ứng lấy màu Glow từ ảnh (như đã hướng dẫn trước đó)
    initGlowEffects();
}

document.addEventListener("DOMContentLoaded", loadPosts);

