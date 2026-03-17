import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { 
    getFirestore, doc, getDoc, updateDoc, increment, 
    collection, addDoc, serverTimestamp, query, orderBy, onSnapshot 
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

// 1. Cấu hình
const firebaseConfig = {
    apiKey: "AIzaSyCnPc_SS_dR0dXl7WPY1FNp_YgKoUyBl-E",
    authDomain: "my-creative-blog.firebaseapp.com",
    projectId: "my-creative-blog",
    storageBucket: "my-creative-blog.firebasestorage.app",
    messagingSenderId: "57335816842",
    appId: "1:57335816842:web:9212c8576d23e534c00373"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Lấy ID từ URL dùng chung cho toàn bộ file
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

async function initPage() {
    if (!postId) {
        window.location.href = "index.html";
        return;
    }

    try {
        // --- 2. TẢI NỘI DUNG BÀI VIẾT ---
        const docRef = doc(db, "posts", postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            document.title = `${data.title} | MyBlog`;
            
            const container = document.getElementById('postContent');
            container.innerHTML = `
                <header class="detail-header">
                    <span class="category">${data.category}</span>
                    <h1 class="post-title">${data.title}</h1>
                    <time>Đăng ngày ${data.createdAt?.toDate().toLocaleDateString('vi-VN')}</time>
                </header>

                <img src="${data.image}" class="detail-hero-img" alt="${data.title}">

                <div class="detail-content">
                    ${data.content.split('\n').map(p => `<p>${p}</p>`).join('')}
                </div>

                <div class="like-section" style="margin-top:30px; text-align:center;">
                    <button id="btnLike" class="glass-card magnetic-btn" style="padding: 10px 25px; border-radius: 50px;">
                        ❤️ <span id="likeCount">${data.likes || 0}</span>
                    </button>
                    <p>Yêu thích bài viết này</p>
                </div>
            `;

            // Kích hoạt các tính năng sau khi HTML đã được tạo
            setupLikeFeature();
            setupCommentFeature();
            loadComments();
        } else {
            alert("Bài viết không tồn tại!");
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Lỗi khởi tạo trang:", error);
    }
}

// --- 3. CHỨC NĂNG LIKE ---
function setupLikeFeature() {
    const btnLike = document.getElementById('btnLike');
    const countSpan = document.getElementById('likeCount');
    if (!btnLike || !countSpan) return;

    btnLike.onclick = async () => {
        try {
            // 1. Gửi lệnh tăng Like lên Firebase ngay lập tức
            const postRef = doc(db, "posts", postId);
            await updateDoc(postRef, { 
                likes: increment(1) 
            });

            // 2. Hiển thị số Like mới trên giao diện (Cộng dồn tại chỗ)
            countSpan.innerText = parseInt(countSpan.innerText) + 1;

            // 3. Hiệu ứng Visual: Nút nảy lên và đổi màu rực rỡ
            btnLike.style.transform = "scale(1.3)";
            btnLike.style.color = "#ef4444";
            btnLike.style.boxShadow = "0 0 20px rgba(239, 68, 68, 0.5)";

            // 4. Trả về kích thước cũ sau 100ms để tạo cảm giác đàn hồi
            setTimeout(() => {
                btnLike.style.transform = "scale(1)";
            }, 100);

            // Tùy chọn: Gọi lại hiệu ứng Stardust (bụi sao) nếu bạn đã cài ở các bước trước
            if (typeof createStardust === "function") {
                const rect = btnLike.getBoundingClientRect();
                createStardust(rect.left + rect.width / 2, rect.top + rect.height / 2);
            }

        } catch (error) {
            console.error("Lỗi khi thả tim:", error);
        }
    };
}


// --- 4. GỬI BÌNH LUẬN ---
function setupCommentFeature() {
    const btnSend = document.getElementById('btnSendComment');
    if (!btnSend) return;

    btnSend.onclick = async () => {
        const name = document.getElementById('commentName').value;
        const text = document.getElementById('commentText').value;
        
        if (!name || !text) return alert("Vui lòng nhập tên và nội dung!");

        await addDoc(collection(db, "posts", postId, "comments"), {
            name: name,
            text: text,
            createdAt: serverTimestamp()
        });
        
        document.getElementById('commentText').value = "";
    };
}

// --- 5. HIỂN THỊ BÌNH LUẬN REAL-TIME ---
function loadComments() {
    const commentList = document.getElementById('commentList');
    if (!commentList) return;

    const q = query(collection(db, "posts", postId, "comments"), orderBy("createdAt", "desc"));
    
    onSnapshot(q, (snapshot) => {
        commentList.innerHTML = "";
        snapshot.forEach(doc => {
            const data = doc.data();
            commentList.innerHTML += `
                <div class="comment-item" style="margin-bottom:15px; padding:15px; background:rgba(255,255,255,0.05); border-radius:10px;">
                    <b style="color:var(--primary);">${data.name}</b>
                    <p style="margin:5px 0;">${data.text}</p>
                    <small style="opacity:0.5;">${data.createdAt?.toDate().toLocaleString('vi-VN') || "Đang gửi..."}</small>
                </div>
            `;
        });
    });
}

// Khởi chạy toàn bộ trang
initPage();
