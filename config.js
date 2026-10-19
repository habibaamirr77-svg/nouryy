// ===== الإعدادات: أبعاد القاعة ومواقع اللوحات =====
const W = 26;   // العرض
const D = 18;   // العمق
const H = 5;    // الارتفاع

const Y = 2.3, O = 0.05; // ارتفاع اللوحات + بعدها عن الجدار

// كل لوحة: [x, y, z, دوران, عرض, ارتفاع]  — أضف أو احذف سطر لتغيير عدد اللوحات
const SLOTS = [
  [-7, Y, -D/2 + O, 0, 3.6, 2.4],
  [ 0, Y, -D/2 + O, 0, 4.2, 2.8],
  [ 7, Y, -D/2 + O, 0, 3.6, 2.4],
  [-W/2 + O, Y, -4,  Math.PI/2, 3, 2.2],
  [-W/2 + O, Y,  4,  Math.PI/2, 3, 2.2],
  [ W/2 - O, Y, -4, -Math.PI/2, 3, 2.2],
  [ W/2 - O, Y,  4, -Math.PI/2, 3, 2.2],
  [-5, Y, D/2 - O, Math.PI, 3, 2.2],
  [ 5, Y, D/2 - O, Math.PI, 3, 2.2],
];

// ===== صور اللوحات (بنفس ترتيب SLOTS) =====
// غيّري أي رابط هنا، أو ضعي صورك في مجلد images/ واكتبي مثلاً 'images/1.jpg'
const IMAGES = [
  'https://i.postimg.cc/8C9mT3hW/Whats-App-Image-2026-10-20-at-1-21-35-AM.jpg',
  'https://i.postimg.cc/MpsYFXHh/Whats-App-Image-2026-10-20-at-1-21-35-AM-(3).jpg',
  'https://i.postimg.cc/8sQRLryW/Whats-App-Image-2026-10-20-at-1-21-35-AM-(2).jpg',
  'https://i.postimg.cc/xdt3B8Cn/Whats-App-Image-2026-10-20-at-1-21-35-AM-(1).jpg',
  'https://i.postimg.cc/ZRvj3ZbS/Whats-App-Image-2026-10-20-at-1-20-23-AM.jpg',
  'https://i.postimg.cc/k54TJKLV/Whats-App-Image-2026-10-20-at-1-20-23-AM-(3).jpg',
  'https://i.postimg.cc/Z5JfQ1cn/Whats-App-Image-2026-10-20-at-1-20-23-AM-(2).jpg',
  'https://i.postimg.cc/tRVmndJ7/Whats-App-Image-2026-10-20-at-1-20-23-AM-(1).jpg',
  'https://i.postimg.cc/8sQRLryW/Whats-App-Image-2026-10-20-at-1-21-35-AM-(2).jpg',
];
