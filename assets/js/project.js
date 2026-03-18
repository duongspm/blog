
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
        description: "Trang giới thiệu sản phẩm tối giản. Bán trứng của Nhật Bản",
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
