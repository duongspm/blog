
const myProjects = [
    {
        name: "Trang giới thiệu cá nhân",
        description: "Blog cá nhân lưu trữ kỷ niệm chuyến đi.",
        link: "https://duongspm.github.io",
        image: "../assets/imgs/top/blog.png", // Bạn có thể thay bằng ảnh chụp màn hình web
        tech: "HTML, CSS, JS"
    },
    {
        name: "Coffee Website",
        description: "Trang web cà phê mới toang",
        link: "https://duongspm.github.io/caphemuoi/",
        image: "../assets/imgs/top/cf.png",
        tech: "Javascript"
    },
    {
        name: "Chat GPT",
        description: "Chat GPT API đời đầu",
        link: "https://duongspm.github.io/chatgpt/index.html",
        image: "../assets/imgs/top/chatgpt.png",
        tech: "Html css"
    },
    {
        name: "Yodoran",
        description: "Trang giới thiệu sản phẩm tối giản. Bán trứng của Nhật Bản. Thuần JS, include header footer",
        link: "https://duongspm.github.io/yodoran/",
        image: "../assets/imgs/top/yodoran.png",
        tech: "CSS Grid"
    }
];

function loadProjects() {
    const grid = document.getElementById('project-list');
    grid.innerHTML = myProjects.map(p => `
        <a href="${p.link}" class="project-card" target="_blank">
            <img src="${p.image}" class="project-img" alt="${p.name}">
            <div class="project-info">
                <span class="tag">${p.tech}</span>
                <h3>${p.name}</h3>
                <p>${p.description}</p>
            </div>
        </a>
    `).join('');
}

// Chạy hàm khi trang web sẵn sàng
document.addEventListener('DOMContentLoaded', loadProjects);
function animateCounter() {
    const counterElement = document.getElementById('project-count');
    const target = myProjects.length; // Lấy tổng số dự án thực tế
    let count = 0;
    const speed = 100; // Tốc độ nhảy số (ms)

    const updateCount = () => {
        if (count < target) {
            count++;
            counterElement.innerText = count;
            setTimeout(updateCount, speed);
        } else {
            // Khi đếm xong thì thêm hiệu ứng rung
            counterElement.classList.add('bounce');
        }
    };

    updateCount();
}

// Gọi hàm này sau khi trang đã load xong dữ liệu
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();    // Hàm vẽ danh sách web đã làm ở bước trước
    animateCounter();  // Chạy hiệu ứng đếm
});

let isConfettiBusy = false; // Biến kiểm tra trạng thái

document.getElementById('download-cv-btn').addEventListener('click', function(e) {
    if (isConfettiBusy) return; // Nếu đang bắn thì thoát, không cho bấm tiếp
    
    isConfettiBusy = true; // Khóa lại

    // Chỉ bắn 1 đợt tập trung để tiết kiệm tài nguyên
    confetti({
        particleCount: 80, // Giảm số lượng mảnh từ 150 xuống 80
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#a855f7'],
        disableForReducedMotion: true // Tự tắt nếu máy yếu/cấu hình thấp
    });

    // Sau 2 giây mới cho phép bấm bắn lại
    setTimeout(() => {
        isConfettiBusy = false;
    }, 2000); 
});
const swiper = new Swiper('.feedback-slider', {
    loop: true,
    autoplay: { delay: 4000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: {
        640: { slidesPerView: 1, spaceBetween: 20 },
        1024: { slidesPerView: 2, spaceBetween: 30 },
    }
});
// 1. Khởi tạo mảng feedback từ LocalStorage hoặc mảng mẫu mặc định
let storedFeedbacks = JSON.parse(localStorage.getItem('userFeedbacks')) || [
    { name: "Nguyễn Văn A", role: "CEO Tech", content: "Code rất sạch, tối ưu tốt!", avatar: "https://i.pravatar.cc" }
];

// 2. Hàm đổ dữ liệu vào Swiper khi load trang
function initFeedbacks() {
    storedFeedbacks.forEach(fb => {
        const slideHTML = createSlideHTML(fb.name, fb.role, fb.content, fb.avatar);
        swiper.appendSlide(slideHTML);
    });
}

// 3. Hàm tạo HTML cho Slide (tái sử dụng)
function createSlideHTML(name, role, content, avatar) {
    return `
        <div class="swiper-slide">
            <div class="feedback-card">
                <div class="quote-icon">"</div>
                <p class="comment">${content}</p>
                <div class="user-info">
                    <img src="${avatar}" alt="User">
                    <div>
                        <h4>${name}</h4>
                        <span>${role}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 4. Xử lý khi nhấn Gửi Form
document.getElementById('feedbackForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const newFb = {
        name: document.getElementById('fbName').value,
        role: document.getElementById('fbRole').value,
        content: document.getElementById('fbContent').value,
        // avatar: `https://i.pravatar.cc{Math.random()}`
        avatar: `https://i.pravatar.cc`
    };

    // Lưu vào mảng và LocalStorage
    storedFeedbacks.push(newFb);
    localStorage.setItem('userFeedbacks', JSON.stringify(storedFeedbacks));

    // Thêm vào Swiper và cuộn tới đó
    swiper.appendSlide(createSlideHTML(newFb.name, newFb.role, newFb.content, newFb.avatar));
    swiper.slideTo(swiper.slides.length);

    // Hiệu ứng ăn mừng
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.8 } });
    this.reset();
});

// Chạy khởi tạo khi trang sẵn sàng
initFeedbacks();
// 1. Tham chiếu tới bảng 'feedbacks' trong Firebase
const dbRef = firebase.database().ref('feedbacks');

// 2. Lắng nghe dữ liệu MỚI nhất từ Firebase (Realtime)
// Mỗi khi có ai đó gửi feedback, hàm này sẽ tự chạy và đẩy vào Slide
dbRef.on('child_added', (snapshot) => {
    const fb = snapshot.val();
    const slideHTML = `
        <div class="swiper-slide">
            <div class="feedback-card">
                <div class="quote-icon">"</div>
                <p class="comment">${fb.content}</p>
                <div class="user-info">
                    <img src="${fb.avatar}" alt="User">
                    <div>
                        <h4>${fb.name}</h4>
                        <span>${fb.role}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Thêm vào Swiper
    swiper.appendSlide(slideHTML);
    swiper.update(); // Cập nhật lại trạng thái slide
});

// 3. Xử lý gửi Feedback lên Firebase
document.getElementById('feedbackForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('fbName').value;
    const role = document.getElementById('fbRole').value;
    const content = document.getElementById('fbContent').value;
    const avatar = `https://i.pravatar.cc{Date.now()}`; // Dùng timestamp để avatar không trùng

    // Đẩy dữ liệu lên Firebase
    dbRef.push({
        name: name,
        role: role,
        content: content,
        avatar: avatar,
        timestamp: Date.now()
    }).then(() => {
        // Thành công: Bắn pháo hoa & Reset form
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.8 } });
        this.reset();
        
        // Cuộn tới slide mới nhất (cuối cùng)
        setTimeout(() => swiper.slideTo(swiper.slides.length), 500);
    }).catch((error) => {
        alert("Lỗi khi gửi: " + error.message);
    });
});
