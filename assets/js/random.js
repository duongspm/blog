// ramdom
/* script.js */
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const inputField = document.getElementById('wheelInput');
const spinBtn = document.getElementById('wheelBtn');

let currentRotation = 0;
let isSpinning = false;

// Hàm lấy danh sách item từ textarea
const getWheelItems = () => {
    return inputField.value.split('\n').filter(item => item.trim() !== "");
};

// Hàm vẽ vòng quay
const drawWheel = () => {
    const items = getWheelItems();
    const itemCount = items.length;
    
    // Đảm bảo lấy đúng kích thước thực tế của canvas
    const size = canvas.width; 
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2;

    ctx.clearRect(0, 0, size, size);

    items.forEach((text, i) => {
        const arcSize = (2 * Math.PI) / itemCount;
        const angle = i * arcSize;
        
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = `hsl(${(i * 360) / itemCount}, 70%, 60%)`;
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, angle + arcSize);
        ctx.fill();
        ctx.stroke();

        // Vẽ chữ - Điều chỉnh cỡ chữ nhỏ lại trên mobile nếu cần
        ctx.translate(centerX, centerY);
        ctx.rotate(angle + arcSize / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        
        // Font size tự động nhỏ đi một chút nếu danh sách quá dài
        const fontSize = itemCount > 10 ? "12px" : "16px";
        ctx.font = `bold ${fontSize} Arial`;
        
        ctx.fillText(text, radius - 15, 5);
        ctx.restore();
    });
};


// Hiệu ứng pháo hoa khi thắng
const fireConfetti = () => {
    const config = { particleCount: 150, spread: 70, origin: { y: 0.6 } };
    confetti(config);
};

// Logic khi bấm quay
const startSpin = () => {
    if (isSpinning) return;
    
    const items = getWheelItems();
    if (items.length < 2) {
        alert("Vui lòng nhập ít nhất 2 mục!");
        return;
    }

    isSpinning = true;
    spinBtn.disabled = true;

    // Tính toán độ quay ngẫu nhiên (ít nhất 5 vòng)
    const extraDegree = Math.floor(Math.random() * 360);
    const totalSpin = 1800 + extraDegree; 
    currentRotation += totalSpin;

    canvas.style.transform = `rotate(${currentRotation}deg)`;

    // Xử lý kết quả sau khi quay xong (4s)
    setTimeout(() => {
        isSpinning = false;
        spinBtn.disabled = false;
        
        const items = getWheelItems();
        const finalRotation = currentRotation % 360;
        const arcSize = 360 / items.length;
        
        // Tính toán người thắng
        const winnerIndex = Math.floor(((360 - finalRotation + 270) % 360) / arcSize);
        const winner = items[winnerIndex];

        // Hiển thị kết quả
        showResult(winner);
        fireConfetti(); // Gọi hàm pháo hoa đã viết trước đó
    }, 4000);
};
// Hàm hiển thị Modal
function showResult(name) {
    const modal = document.getElementById('resultModal');
    const winnerDisplay = document.getElementById('winnerName');
    
    winnerDisplay.innerText = name;
    modal.style.display = 'flex';

    // --- HIỆU ỨNG RUNG ĐIỆN THOẠI ---
    if ("vibrate" in navigator) {
        // Rung theo kiểu: Rung 200ms, nghỉ 100ms, rung lại 500ms
        navigator.vibrate([200, 100, 500]);
    }
}

// Hàm đóng Modal
function closeModal() {
    document.getElementById('resultModal').style.display = 'none';
}
// Lắng nghe sự kiện
inputField.addEventListener('input', drawWheel);
spinBtn.addEventListener('click', startSpin);

// Vẽ lần đầu tiên khi tải trang
drawWheel();
// Thêm biến để theo dõi vị trí ô hiện tại
let lastItemIndex = -1;

// Hàm này cần được gọi liên tục trong lúc quay (sử dụng requestAnimationFrame)
const checkVibrationTick = (currentRotationDeg, itemCount) => {
    const arcSize = 360 / itemCount;
    const currentIndex = Math.floor((currentRotationDeg % 360) / arcSize);

    if (currentIndex !== lastItemIndex) {
        lastItemIndex = currentIndex;
        // Rung cực ngắn (10ms) tạo cảm giác như tiếng khấc bánh xe
        if ("vibrate" in navigator) navigator.vibrate(10);
    }
};