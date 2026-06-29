# Demo Text-to-Speech

Trang demo tĩnh: hiển thị từng đoạn văn bản kèm nút phát âm thanh tương ứng. Chạy hoàn toàn bằng HTML/CSS/JS, không cần server, phù hợp để host trên GitHub Pages.

## Cấu trúc thư mục

```
.
├── index.html        # cấu trúc trang
├── style.css         # giao diện
├── script.js         # dữ liệu mẫu + logic player
└── audio/
    ├── sample-1.mp3   # ⚠️ hiện là file câm (placeholder), cần thay bằng audio thật
    ├── sample-2.mp3
    └── sample-3.mp3
```

`audio/sample-*.mp3` hiện tại là **file âm thanh câm** (không có tiếng) chỉ để bạn thấy layout hoạt động đúng ngay khi mở trang. Hãy thay chúng bằng audio do hệ thống TTS của bạn sinh ra, cùng tên file (hoặc đổi tên trong `script.js`).

## Thêm / sửa mẫu demo

Mở `script.js`, sửa mảng `samples` ở đầu file:

```js
const samples = [
  {
    text: "Văn bản đầu vào của bạn ở đây.",
    audio: "audio/sample-1.mp3",
  },
  // thêm bao nhiêu mẫu cũng được, chỉ cần copy đúng cấu trúc trên
];
```

Mỗi mẫu chỉ cần `text` và `audio` — số thứ tự, thời gian phát (mm:ss) và hiệu ứng waveform sẽ tự render.

Định dạng audio nên dùng `.mp3` hoặc `.wav` (đa số browser hỗ trợ tốt cả hai trên GitHub Pages).

## Chạy thử trên máy trước khi deploy

Mở trực tiếp `index.html` bằng trình duyệt là đủ để xem layout. Nếu muốn audio chắc chắn load đúng (một số browser chặn `file://` với audio), chạy local server đơn giản:

```bash
cd tts-demo
python3 -m http.server 8000
```

rồi mở `http://localhost:8000`.

## Deploy lên GitHub Pages

1. Tạo repo mới trên GitHub (hoặc dùng repo có sẵn), ví dụ `tts-demo`.
2. Đẩy toàn bộ nội dung thư mục này (kể cả thư mục `audio/`) lên nhánh `main`:
   ```bash
   git init
   git add .
   git commit -m "Demo text-to-speech"
   git branch -M main
   git remote add origin https://github.com/<tài-khoản>/<tên-repo>.git
   git push -u origin main
   ```
3. Vào repo trên GitHub → **Settings → Pages**.
4. Ở **Source**, chọn nhánh `main`, thư mục `/ (root)` → **Save**.
5. Sau khoảng 1 phút, GitHub sẽ cấp một URL dạng:
   ```
   https://<tài-khoản>.github.io/<tên-repo>/
   ```
   Mở URL đó để xem trang demo.

> Lưu ý: GitHub Pages có giới hạn dung lượng repo (khuyến nghị < 1GB) và băng thông mềm ~100GB/tháng. Nếu file audio TTS khá nặng hoặc nhiều mẫu, nên nén (mp3 bitrate thấp như 64–96kbps vẫn đủ rõ cho giọng nói) trước khi đẩy lên.

## Tuỳ biến nhanh

- Đổi tiêu đề/giới thiệu: sửa trực tiếp trong `index.html` (phần `<header class="page-head">`).
- Đổi màu/font: sửa các biến ở đầu `style.css` (mục `:root`).
- Trang đã hỗ trợ responsive (mobile) và tôn trọng cài đặt "giảm hiệu ứng chuyển động" (`prefers-reduced-motion`) của hệ điều hành.
