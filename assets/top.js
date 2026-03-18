// 1. Định nghĩa nội dung hàm (Khai báo trước khi gọi)
function initCustomCursor() {
    const dot = document.querySelector(".cursor-dot");
    const outline = document.querySelector(".cursor-outline");

    if (!dot || !outline) return; // Bảo vệ nếu thiếu thẻ HTML

    window.addEventListener("mousemove", (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Chấm nhỏ đi theo ngay lập tức
        dot.style.left = `${posX}px`;
        dot.style.top = `${posY}px`;

        // Vòng tròn lớn đuổi theo mượt mà (Hiệu ứng Lag nhẹ)
        outline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Thêm hiệu ứng phóng to khi hover vào link/nút
    document.querySelectorAll('a, button, .blog-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            outline.style.background = 'rgba(59, 130, 246, 0.1)';
        });
        el.addEventListener('mouseleave', () => {
            outline.style.transform = 'translate(-50%, -50%) scale(1)';
            outline.style.background = 'transparent';
        });
    });
}

// 2. Logic kiểm tra trang để khởi chạy
if (!document.body.classList.contains('admin-page')) {
    initCustomCursor();
} else {
    // Nếu là trang admin, hiện lại con trỏ hệ thống
    document.documentElement.style.cursor = 'auto';
}

function initCustomCursor() {
    const dot = document.querySelector(".cursor-dot");
    const outline = document.querySelector(".cursor-outline");

    if (!dot || !outline) return; // Tránh lỗi nếu thiếu thẻ HTML

    window.addEventListener("mousemove", (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Chấm nhỏ đi theo ngay lập tức
        dot.style.left = `${posX}px`;
        dot.style.top = `${posY}px`;

        // Vòng tròn lớn đuổi theo mượt mà
        outline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });
}

// 2. Gọi hàm dựa trên điều kiện trang
if (!document.body.classList.contains('admin-page')) {
    initCustomCursor();
} else {
    document.documentElement.style.cursor = 'auto';
}

// 1. Theme Toggle
function toggleTheme() {
    const html = document.documentElement;
    html.getAttribute('data-theme') === 'dark' ? html.removeAttribute('data-theme') : html.setAttribute('data-theme', 'dark');
}

// 2. Custom Cursor
const dot = document.querySelector(".cursor-dot");
const outline = document.querySelector(".cursor-outline");

window.addEventListener("mousemove", (e) => {
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
    outline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 500, fill: "forwards" });
});

// 3. Scroll Effects
window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Progress Bar
    document.getElementById('bar').style.width = (winScroll / height * 100) + "%";

    // Back to Top & Parallax
    winScroll > 400 ? document.getElementById('btnTop').classList.add('show') : document.getElementById('btnTop').classList.remove('show');

    document.querySelectorAll('.parallax-img').forEach(img => {
        const rect = img.parentElement.getBoundingClientRect();
        if(rect.top < window.innerHeight && rect.bottom > 0) {
            const shift = (window.innerHeight / 2 - rect.top) * 0.1;
            img.style.transform = `scale(1.2) translateY(${shift}px)`;
        }
    });
});

// 4. Reveal & Magnetic
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('active'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const pos = btn.getBoundingClientRect();
        const x = e.pageX - (pos.left + pos.width / 2 + window.scrollX);
        const y = e.pageY - (pos.top + pos.height / 2 + window.scrollY);
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = 'translate(0,0)');
});

function toTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
document.querySelectorAll('.nav-item').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100, // Trừ hao khoảng cách header
                behavior: 'smooth'
            });
        }
    });
});
window.addEventListener('scroll', () => {
    document.querySelectorAll('.parallax-img').forEach(img => {
        const rect = img.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            // Giảm cường độ dịch chuyển để phù hợp với ảnh nhỏ
            const shift = (window.innerHeight / 2 - rect.top) * 0.05; 
            img.style.transform = `scale(1.1) translateY(${shift}px)`;
        }
    });
});
document.querySelectorAll('.blog-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        outline.style.width = '80px';
        outline.style.height = '80px';
        outline.style.borderColor = 'var(--primary)';
        outline.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
    });

    item.addEventListener('mouseleave', () => {
        outline.style.width = '40px';
        outline.style.height = '40px';
        outline.style.backgroundColor = 'transparent';
    });
});
document.querySelectorAll('.blog-item').forEach(item => {
    const img = item.querySelector('img');
    
    // Đợi ảnh tải xong để lấy màu (giả lập hoặc dùng thư viện lấy màu)
    img.onload = function() {
        // Trong demo này, mình sẽ gán màu ngẫu nhiên hoặc theo Category 
        // để đảm bảo hiệu suất tốt nhất. 
        // Bạn có thể dùng thư viện ColorThief nếu muốn lấy màu chính xác từ ảnh.
        const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        item.style.setProperty('--glow-color', randomColor);
        const glowElement = item.querySelector('.glass-card');
        glowElement.style.setProperty('--primary', randomColor); // Đổi luôn màu nhấn của card
    };

    // Nếu ảnh đã cache, chạy luôn
    if (img.complete) img.onload();
});
let lastScroll = 0;
const header = document.querySelector(".main-header");

window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    // 1. Nếu đang ở sát đầu trang (dưới 50px) -> Luôn hiện Menu
    if (currentScroll <= 50) {
        header.classList.remove("nav-hidden");
        return;
    }

    // 2. So sánh hướng cuộn
    if (currentScroll > lastScroll && !header.classList.contains("nav-hidden")) {
        // Cuộn xuống -> Ẩn Menu
        header.classList.add("nav-hidden");
    } else if (currentScroll < lastScroll && header.classList.contains("nav-hidden")) {
        // Cuộn lên -> Hiện Menu
        header.classList.remove("nav-hidden");
    }

    lastScroll = currentScroll;
});
function toggleMobileMenu() {
    const nav = document.querySelector(".nav-links");
    const burger = document.querySelector(".hamburger");
    
    nav.classList.toggle("active");
    burger.classList.toggle("active");
}

// Tự động đóng menu khi bấm vào một mục (tránh che khuất nội dung sau khi cuộn)
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelector(".nav-links").classList.remove("active");
        document.querySelector(".hamburger").classList.remove("active");
    });
});
function toggleMobileMenu() {
    const navLinks = document.querySelector(".nav-links");
    const burger = document.querySelector(".hamburger");
    
    // Bật/tắt class active
    navLinks.classList.toggle("active");
    burger.classList.toggle("active");

    // Ngăn cuộn trang khi đang mở Menu di động (Tăng trải nghiệm UX)
    if (navLinks.classList.contains("active")) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }
}
const text = "Nhật Ký Lập Trình";
const speed = 150; // Tốc độ gõ (ms mỗi chữ)
let i = 0;

function typeWriter() {
    if (i < text.length) {
        document.getElementById("typewriter").innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    } else {
        // Sau khi gõ xong, bạn có thể cho con trỏ biến mất hoặc dừng nhấp nháy
        // document.querySelector(".cursor-blinker").style.display = "none";
    }
}

// Chạy hiệu ứng khi trang đã sẵn sàng
window.addEventListener('DOMContentLoaded', () => {
    // Đợi 0.5s sau khi load để bắt đầu gõ cho mượt
    setTimeout(typeWriter, 500);
});
const words = ["Công nghệ mới", "Thiết kế UI/UX", "Tối ưu hiệu suất", "Nhật ký Lập trình"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.getElementById("typewriter");

function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        // Xóa bớt 1 ký tự
        typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        // Gõ thêm 1 ký tự
        typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    // Tốc độ: Gõ thì chậm (150ms), xóa thì nhanh (75ms)
    let typeSpeed = isDeleting ? 75 : 150;

    // Nếu gõ xong 1 câu
    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // Nghỉ 2 giây ở cuối câu trước khi xóa
        isDeleting = true;
    } 
    // Nếu xóa xong 1 câu
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length; // Chuyển sang câu tiếp theo
        typeSpeed = 500; // Nghỉ nửa giây trước khi gõ câu mới
    }

    setTimeout(type, typeSpeed);
}

// Bắt đầu chạy khi trang load
document.addEventListener("DOMContentLoaded", type);
// Kiểm tra xem có phải thiết bị cảm ứng không
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice) {
    // Chỉ chạy hiệu ứng Magnetic và Custom Cursor trên PC (Máy tính)
    initCustomCursor();
    // initMagneticButtons();
} else {
    // Trên Mobile: Vô hiệu hóa Parallax nặng để cuộn mượt hơn
    window.removeEventListener('scroll', parallaxEffect);
}
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    
    // Tạo hiệu ứng lóe sáng nhanh khi đổi màu
    document.body.style.transition = "background-color 0.8s ease-in-out";
    
    if (isDark) {
        html.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}
function toggleTheme() {
    const html = document.documentElement;
    const btn = document.querySelector(".theme-toggle-mini");
    const rect = btn.getBoundingClientRect();
    
    // 1. Tạo hiệu ứng bụi sao (Stardust)
    createStardust(rect.left + rect.width / 2, rect.top + rect.height / 2);

    // 2. Logic chuyển đổi Theme cũ của bạn
    const isDark = html.getAttribute('data-theme') === 'dark';
    if (isDark) {
        html.removeAttribute('data-theme');
    } else {
        html.setAttribute('data-theme', 'dark');
    }
}

function createStardust(x, y) {
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement("div");
        particle.className = "stardust-particle";
        
        // Vị trí xuất phát từ tâm nút bấm
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        // Tạo hướng bay ngẫu nhiên (X: -100px đến 100px, Y: -100px đến 100px)
        const moveX = (Math.random() - 0.5) * 200;
        const moveY = (Math.random() - 0.5) * 200;
        
        particle.style.setProperty('--moveX', `${moveX}px`);
        particle.style.setProperty('--moveY', `${moveY}px`);

        // Màu sắc ngẫu nhiên giữa Primary và Purple
        const color = Math.random() > 0.5 ? 'var(--primary)' : '#8b5cf6';
        particle.style.background = color;

        document.body.appendChild(particle);

        // Xóa hạt khỏi DOM sau khi diễn xong animation để nhẹ máy
        setTimeout(() => {
            particle.remove();
        }, 800);
    }
}

document.getElementById('download-cv-btn').addEventListener('click', function() {
    if (window.isConfettiRunning) return; // Chống spam click
    window.isConfettiRunning = true;

    // Bắn pháo hoa
    const myConfetti = confetti({
        particleCount: 60, // Số lượng ít để mượt mà
        spread: 60,
        origin: { y: 0.7 },
        ticks: 200, // Hạt sẽ biến mất nhanh hơn (mặc định là 200-600)
    });

    // Ép buộc xóa sạch mọi hạt sau 3 giây (khi chúng đã rơi hết)
    setTimeout(() => {
        confetti.reset(); // Hàm này sẽ xóa toàn bộ canvas confetti
        window.isConfettiRunning = false;
    }, 3000); 
});
