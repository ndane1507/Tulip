# Một vườn hoa dành cho em

Web quà tặng toàn màn hình, dựng bằng HTML, CSS, JavaScript thuần và Vite. Ba bông hoa SVG mọc và nở lần lượt trên nền đêm; ảnh kỷ niệm, lời nhắn và đom đóm xuất hiện quanh hoa. Không dùng framework hoặc thư viện 3D.

## Chạy ở máy

```sh
npm install
npm run dev
```

Mở địa chỉ Vite in ra (mặc định http://127.0.0.1:5175/). Build bản tĩnh bằng `npm run build`, kiểm tra bằng `npm run preview`. Thư mục xuất bản là `dist/`. Cần phục vụ bằng HTTP, không mở index.html bằng file://.

## Cá nhân hóa

Chỉnh `src/config.js`:

- `sender`, `recipient`: người gửi và người nhận.
- `letterTitle`, `letter`: tiêu đề và các đoạn thư.
- `messages`: lời nhắn mặc định, mỗi phần tử là một câu.
- `symbol`: `heart`, `flower`, hoặc `star`.
- `photos`: đường dẫn, chú thích, mô tả thay thế cho từng ảnh.
- `music`: đường dẫn nhạc nền.

Thay năm ảnh `public/media/memory-1.jpg` đến `memory-5.jpg` bằng ảnh của bạn, hoặc chỉnh đường dẫn trong cấu hình. Nên dùng JPEG/WebP nhỏ hơn 500 KB, ảnh dọc hoặc vuông. Ảnh hiện tại là phong cảnh mẫu từ Unsplash, không phải ảnh của người dùng. Danh sách nguồn nằm trong `public/media/SOURCES.md`.

Thay `public/media/garden-piano.wav` bằng nhạc bạn có quyền sử dụng, hoặc thay `music` để trỏ tới file MP3 của bạn trong public/media. File WAV hiện có là đoạn nhạc tổng hợp gốc được tạo bằng `node scripts/make-music.mjs`, không phải bản thu hay bài hát trong video TikTok. Nhạc chỉ phát sau khi mở quà hoặc nhấn nút nhạc; lỗi tải/phát nhạc không ngăn sử dụng web.

`src/garden.js` chứa hình học hoa/lá/cỏ; `src/style.css` chứa bố cục, màu và hoạt cảnh. Nội dung được render qua escape/textContent để lời nhắn không trở thành HTML thực thi.

## Sử dụng

- Nhấn **Mở quà** để bắt đầu. Hoa nở trong khoảng 5 giây, sau đó hiện ảnh và lời nhắn.
- Nút **+** góc trái mở thư, thư viện ảnh, nhạc và cài đặt.
- Bấm ảnh để xem lớn, dùng nút ảnh trước/sau để chuyển ảnh.
- Cài đặt cho phép chọn biểu tượng và viết tối đa 12 câu, mỗi câu không quá 100 ký tự.
- Cài đặt lưu trong localStorage của trình duyệt hiện tại. Để gửi nội dung mặc định cho người khác, sửa config và build lại; cài đặt trên máy bạn không đồng bộ sang máy người nhận.
- Escape hoặc nút đóng để đóng modal. Dialog giữ focus và trả focus về nút đã mở.
- Chạm vùng trống để tạo hạt sáng.

Mobile giảm số ảnh và hạt sáng; không cắt ba bông hoa chính. Chế độ giảm chuyển động hiển thị hoa tĩnh. Khi tab ẩn, Canvas, CSS animation và nhạc tạm dừng. Font và ảnh đều được phục vụ cục bộ, không gọi CDN lúc xem.

## Xuất bản

`npm run build` tạo web tĩnh trong `dist/`, có thể dùng với hosting tĩnh. `.openai/hosting.json` khai báo bản Sites riêng tư; không đổi `project_id` khi cập nhật.

## Tài nguyên

- Font Be Vietnam Pro và Cormorant Garamond: SIL Open Font License, giấy phép trong các gói @fontsource.
- Icons: Tabler Icons, MIT.
- Nhạc mẫu: được tổng hợp riêng cho dự án, không lấy bản ghi âm bên ngoài.
