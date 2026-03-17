// 1. Theme Toggle
function toggleTheme() {
    const html = document.documentElement;
    html.getAttribute('data-theme') === 'dark' ? html.removeAttribute('data-theme') : html.setAttribute('data-theme', 'dark');
}
document.querySelectorAll('.magnetic-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Tạo thẻ span cho vòng tròn
        let ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);

        // Tính toán vị trí click bên trong nút
        let x = e.clientX - e.target.getBoundingClientRect().left;
        let y = e.clientY - e.target.getBoundingClientRect().top;

        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        // Xóa vòng tròn sau khi diễn xong animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});
