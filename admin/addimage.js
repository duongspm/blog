const imageFileInput = document.getElementById('imageFile');
const previewContainer = document.getElementById('imagePreviewContainer');
const previewImage = document.getElementById('imagePreview');

imageFileInput.addEventListener('change', function() {
    const file = this.files[0]; // Lấy file đầu tiên người dùng chọn

    if (file) {
        const reader = new FileReader();

        // 1. Khi trình duyệt đọc xong file
        reader.onload = function(e) {
            previewImage.src = e.target.result; // Gán dữ liệu ảnh vào thẻ img
            previewContainer.style.display = 'block'; // Hiện khung preview
        }

        // 2. Bắt đầu đọc file dưới dạng URL
        reader.readAsDataURL(file);
    } else {
        // Nếu người dùng hủy chọn file
        previewContainer.style.display = 'none';
        previewImage.src = "";
    }
});
