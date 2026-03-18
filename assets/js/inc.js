/* ------------------------------
    Inview Animation
------------------------------ */
function initializeInview() {
    const targets = document.querySelectorAll('.inview');
    if (targets.length === 0) return;

    const options = {
        root: null,
        rootMargin: '0% 0px', // -50% 0px ==> center of viewport
        threshold: 0.5 // Execute when the element is 50% displayed
    };

    const addClass = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-view');
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(addClass, options);

    targets.forEach(target => {
        observer.observe(target);
    });
}

/* ------------------------------
    Pagetop
------------------------------ */
function initializePageTop() {
    const pageTop = document.querySelector('#pagetop');

    if (!pageTop) {
        return;
    }

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        if (scrolled >= 400) {
            pageTop.classList.add('is-show');
        } else {
            pageTop.classList.remove('is-show');
        }
    });

    pageTop.addEventListener('click', (e) => {
        e.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ------------------------------
    Anchorlink
------------------------------ */
function initializeAnchorLinks() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');

            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ------------------------------
    Menu Active
------------------------------ */
function initializeMenuActive() {
    const currentPath = window.location.pathname;
    const menuLinks = document.querySelectorAll('.menu a');

    if (menuLinks.length === 0) return;

    menuLinks.forEach(link => {
        const linkUrl = new URL(link.href);
        const linkPath = linkUrl.pathname;
        
        const normalizePath = (path) => (path.length > 1 && path.endsWith('/')) ? path.slice(0, -1) : path;

        if (normalizePath(linkPath) === normalizePath(currentPath)) {
            link.classList.add('is-active');
        }
    });
}

/* ------------------------------
    Component Initializer
------------------------------ */
function initializeComponents() {
    initializeInview();
    initializePageTop();
    initializeAnchorLinks();
    initializeMenuActive();
}

/* ------------------------------
    Include
------------------------------ */
document.addEventListener("DOMContentLoaded", function() {
    const includeElements = document.querySelectorAll("[data-include]");
    const promises = [];

    includeElements.forEach(function(el) {
        const file = el.getAttribute("data-include");
        const rootPath = el.getAttribute("data-path") || "";

        if (file) {
            const promise = fetch(file)
                .then(response => {
                    if (!response.ok) throw new Error(`Failed to load ${file}`);
                    return response.text();
                })
                .then(data => {
                    const processedData = data.replace(/\{\$root\}/g, rootPath);
                    el.innerHTML = processedData;
                })
                .catch(err => {
                    console.error(err);
                    el.innerHTML = `<p style="color: red;">Could not load ${file}</p>`;
                });
            promises.push(promise);
        }
    });

    if (promises.length > 0) {
        Promise.all(promises).then(() => {
            initializeComponents();
        });
    } else {
        initializeComponents();
    }
});
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
    // initCustomCursor();
    document.documentElement.style.cursor = 'auto';
    
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