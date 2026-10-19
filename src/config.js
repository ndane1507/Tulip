// Thay nội dung và các file trong public/media/ để cá nhân hóa món quà.
export const gift = {
  sender: 'Người thương em',
  recipient: 'Em',
  title: 'Một vườn hoa dành cho em',
  letterTitle: 'Gửi em, người anh thương.',
  letter: [
    'Có những điều thật khó để nói thành lời. Vậy nên, anh gửi vào đây một chút dịu dàng, một chút nhớ nhung, và cả một vườn hoa chỉ dành cho em.',
    'Mong những ngày của em luôn có nắng, những lúc mệt mỏi luôn có một nơi để trở về. Và mong rằng, khi nhìn những bông hoa nhỏ này, em sẽ nhớ: có một người luôn nghĩ về em.',
    'Cảm ơn em vì đã xuất hiện. Cứ cười thật nhiều nhé, phần còn lại mình cùng đi qua.'
  ],
  messages: ['Thương em', 'Em là duy nhất', 'Mãi bên nhau', 'Always with you', 'You are my everything'],
  symbol: 'heart',
  photos: [
    { src: '/media/memory-1.jpg', caption: 'Một chiều thật yên', alt: 'Ảnh mẫu: bờ biển và ánh nắng' },
    { src: '/media/memory-2.jpg', caption: 'Những ngày có nắng', alt: 'Ảnh mẫu: khung cảnh núi và hồ' },
    { src: '/media/memory-3.jpg', caption: 'Mình cùng đi nhé', alt: 'Ảnh mẫu: một chuyến đi giữa thiên nhiên' },
    { src: '/media/memory-4.jpg', caption: 'Giữ lại dịu dàng', alt: 'Ảnh mẫu: những bông hoa xinh' },
    { src: '/media/memory-5.jpg', caption: 'Và nhiều ngày sau', alt: 'Ảnh mẫu: bầu trời hoàng hôn' }
  ],
  // Bản nhạc piano tổng hợp được tạo riêng để làm âm thanh mẫu, không dùng bài hát trong video.
  music: '/media/garden-piano.wav',
  musicLabel: 'Khúc nhạc của khu vườn'
};
