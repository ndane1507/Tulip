# Một vườn tulip gửi bạn

Web lời chúc dành cho bạn bè: năm bông tulip hồng, đào, tím và kem trên nền đêm. Không có ảnh kỷ niệm hoặc nội dung dành cho người yêu. HTML, CSS, JavaScript thuần, SVG và Canvas; chạy bằng Vite.

## Chạy tại máy

```sh
npm install
npm run dev
```

Mở http://127.0.0.1:5175/. Trên Windows có thể bấm đúp **start-local.cmd** thay vì nhập lệnh. Giữ cửa sổ terminal mở khi xem web, Ctrl+C để dừng. Nếu cổng 5175 đã có bản xem trước đang chạy, chỉ cần mở link đó.

Build bằng `npm run build`, xem bản build bằng `npm run preview`. Thư mục đầu ra: `dist/`.

## Thư mục dự án

Toàn bộ bản hoàn chỉnh nằm trong **tulip-garden/**:

- `src/`: mã nguồn giao diện, hoa và hiệu ứng.
- `public/`: nhạc và tài nguyên tĩnh.
- `scripts/`: công cụ tạo nhạc mẫu.
- `docs/preview.png`: ảnh chụp bản hoàn chỉnh.
- `start-local.cmd`: mở server local trên Windows.
- `vercel.json`: cấu hình build và hosting Vercel.

`node_modules/` là thư viện đã cài, `dist/` là kết quả build. Hai thư mục này có thể tạo lại bằng `npm ci` và `npm run build`. Các thư mục ẩn `.git/` và `.vercel/` giữ lịch sử mã nguồn và liên kết dự án Vercel.

## Đưa lên Vercel

Đã có `vercel.json` khai báo Vite, lệnh build và thư mục `dist`.

1. Import thư mục/repository này vào Vercel.
2. Chọn Framework Preset: Vite; Build Command: `npm run build`; Output Directory: `dist`.
3. Không cần biến môi trường, tài khoản cho khách xem hoặc cơ sở dữ liệu.

Hoặc dùng CLI trong thư mục dự án:

```sh
npx vercel
```

Dự án đã được liên kết với Vercel. Bản nâng cấp hiện được chạy local để xem trước; cấu hình Vercel vẫn có sẵn để xuất bản sau.

## Chỉnh lời chúc

Sửa `src/config.js`: `heading`, `emphasis`, `subtitle`, `wishes` và `greeting`. Nội dung mặc định là lời chúc vui vẻ, bình an và may mắn. Không dùng dữ liệu localStorage từ phiên bản cũ.

Đổi `music` sang đường dẫn file MP3/WAV bạn có quyền sử dụng, đặt trong `public/media/`. File `garden-piano.wav` hiện có là nhạc tổng hợp gốc, tạo bằng `node scripts/make-music.mjs`. Không lấy bản ghi âm từ video tham chiếu. Nhạc chỉ phát sau khi nhấn Ghé khu vườn hoặc nút nhạc; lỗi nhạc không ngăn ngắm hoa.

## Hiệu ứng và tương tác

- Thân và lá phát triển theo từng lớp, cánh tulip mở lần lượt.
- Hoa và lá đung đưa lệch nhịp; cánh có gân mảnh, bắt sáng mềm và vùng tối tạo chiều sâu.
- Sao lấp lánh, đom đóm, cánh hoa trôi, sương và sao băng thưa.
- Trăng khuyết, sương chân hoa và nền sáng nhẹ tạo chiều sâu.
- Rê chuột tạo chiều sâu và thu hút đom đóm gần con trỏ; chạm vùng trống tạo cụm hạt sáng cùng gợn sáng.
- Xem hoa nở: phát lại hoạt cảnh. Đọc lời chúc: mở lời chúc ngắn, Escape để đóng.
- Bật/tắt nhạc ở góc phải. Khi chuyển tab, nhạc và chuyển động tạm dừng.
- Mobile giảm hạt, giữ trọn cụm tulip và hiển thị từng lời chúc lần lượt; hỗ trợ prefers-reduced-motion và màn hình ngang.

Hình hoa nằm trong `src/garden.js`, bố cục và hoạt cảnh trong `src/style.css`, tương tác và Canvas trong `src/main.js`. Tài nguyên được phục vụ cục bộ, không cần CDN lúc xem.

Font Be Vietnam Pro và Cormorant Garamond: SIL Open Font License. Icons Tabler: MIT. SVG hoa và âm thanh mẫu được tạo riêng cho dự án.
