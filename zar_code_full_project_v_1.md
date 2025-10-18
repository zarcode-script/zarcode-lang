# ⚙️ ZarCode — Bahasa Pemrograman Web dalam Bahasa Indonesia (v1.0)

ZarCode adalah bahasa skrip ringan yang dirancang agar pengembang Indonesia dapat menulis logika web dalam Bahasa Indonesia, tanpa kehilangan kecepatan dan keamanan JavaScript.

File ZarCode memiliki ekstensi `.zar`, dan dijalankan melalui **zarcode.js** sebagai interpreter di browser.

---

## 📁 Struktur Proyek
```
zarcode-full/
│
├── index.html
├── zarcode.js
├── feed.zar
├── komentar.zar
├── README.md
└── server/
    ├── db.php
    ├── api_posts.php
    └── api_comment.php
```

---

## 🧠 Fitur Dasar Bahasa ZarCode
| Bahasa ZarCode | Arti JavaScript |
|----------------|----------------|
| `fungsi` | `function` |
| `jk` | `if` |
| `jt` | `else` |
| `ambil` | `fetch GET` |
| `kirim` | `fetch POST` |
| `unt` | `for` |
| `klik` | `addEventListener('click',...)` |
| `skp` | `localStorage.setItem()` |
| `tampil` | `console.log()` atau tampil ke elemen |

Contoh:
```zar
fungsi tampilkanPesan() {
  jk (true) {
    tampil "Halo dunia ZarCode!";
  } jt {
    tampil "Kondisi salah";
  }
}
```

---

## 🔧 zarcode.js — Interpreter
```javascript
// ===============================================
// ZARCODE.JS v1.0
// ===============================================
(function(global){
  'use strict';

  // Utilitas dasar
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
  }

  function zarLog(msg) {
    console.log('%c[ZarCode]', 'color:#09f', msg);
  }

  // Parser sederhana ZarCode
  function parseZarCode(code) {
    let js = code
      .replace(/\bfungsi\b/g, 'function')
      .replace(/\bjk\b/g, 'if')
      .replace(/\bjt\b/g, 'else')
      .replace(/\bunt\b/g, 'for')
      .replace(/\bklik\b/g, 'addEventListener("click",')
      .replace(/\btampil\b/g, 'zarShow')
      .replace(/\bambil\b/g, 'zarGet')
      .replace(/\bkirim\b/g, 'zarPost')
      .replace(/\bskp\b/g, 'localStorage.setItem');
    return js;
  }

  // Eksekusi aman
  function runZarCode(code) {
    const js = parseZarCode(code);
    try {
      const fn = new Function('zarShow','zarGet','zarPost', js);
      fn(zarShow, zarGet, zarPost);
    } catch(err){
      console.error('ZarCode Error:', err);
    }
  }

  // Implementasi fungsi bawaan
  function zarShow(msg, el){
    if(!el) zarLog(msg);
    else {
      const e = document.querySelector(el);
      if(e) e.innerHTML = escapeHTML(msg);
    }
  }

  function zarGet(url){
    return fetch(url).then(r=>r.json());
  }

  function zarPost(url, data){
    return fetch(url, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(data)
    }).then(r=>r.json());
  }

  // Loader otomatis file .zar
  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('script[type="text/zar"]').forEach(async tag=>{
      const src = tag.getAttribute('src');
      if(src){
        const res = await fetch(src);
        const code = await res.text();
        runZarCode(code);
      } else {
        runZarCode(tag.textContent);
      }
    });
  });

  global.ZarCode = { run: runZarCode };

})(window);
```

---

## 🌐 index.html
```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>ZarCode Feed</title>
  <script src="zarcode.js"></script>
</head>
<body>
  <h2>📰 Feed Postingan</h2>
  <div id="feed"></div>
  <h3>Komentar</h3>
  <div id="comments"></div>

  <script type="text/zar" src="feed.zar"></script>
  <script type="text/zar" src="komentar.zar"></script>
</body>
</html>
```

---

## 🗂️ feed.zar
```zar
fungsi tampilFeed() {
  ambil('server/api_posts.php').then(data => {
    unt (post of data) {
      tampil `<div><b>${post.user}</b>: ${post.content}</div>`, '#feed';
    }
  });
}

tampilFeed();
```

---

## 💬 komentar.zar
```zar
fungsi kirimKomentar(teks) {
  kirim('server/api_comment.php', { isi: teks }).then(res => {
    jk (res.status == 'ok') {
      tampil 'Komentar dikirim!', '#comments';
    } jt {
      tampil 'Gagal mengirim komentar', '#comments';
    }
  });
}

// contoh input manual (nantinya bisa dari form)
kirimKomentar('Halo dunia!');
```

---

## 🖥️ server/db.php
```php
<?php
$mysqli = new mysqli('localhost', 'root', '', 'zarcode');
if ($mysqli->connect_errno) {
  die('Gagal konek DB: ' . $mysqli->connect_error);
}
?>
```

---

## 📄 server/api_posts.php
```php
<?php
header('Content-Type: application/json');
require 'db.php';

$result = $mysqli->query('SELECT user, content FROM posts ORDER BY id DESC');
$posts = [];
while ($row = $result->fetch_assoc()) {
  $posts[] = $row;
}
echo json_encode($posts);
?>
```

---

## 📄 server/api_comment.php
```php
<?php
header('Content-Type: application/json');
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$isi = $mysqli->real_escape_string($data['isi']);
$mysqli->query("INSERT INTO comments (isi, created_at) VALUES ('$isi', NOW())");

echo json_encode(['status'=>'ok']);
?>
```

---

## 📘 README.md (ZarCode)
```markdown
# ZarCode v1.0 — Bahasa Pemrograman Web Bahasa Indonesia

### Cara Pakai
1. Tambahkan `zarcode.js` ke halaman HTML kamu.
2. Tulis kode `.zar` dan load dengan `<script type="text/zar" src="namafile.zar"></script>`.

### Contoh Cepat
```html
<script src="zarcode.js"></script>
<script type="text/zar">
  fungsi halo() {
    tampil 'Halo Dunia!';
  }
  halo();
</script>
```

### Tujuan
- Mempermudah developer lokal memahami logika kode dalam bahasa Indonesia.
- Menghadirkan bahasa web baru yang aman, ringan, dan mudah diajarkan.

### Lisensi
ZarCode diluncurkan di bawah lisensi MIT — gratis digunakan dan dikembangkan.
```

---

✅ Selesai! Kamu bisa langsung upload semua isi folder ini ke GitHub dengan nama repo misalnya **zarcode-lang**.

Kalau kamu mau, aku bisa bantu tambahkan **ekstensi VS Code syntax highlighting** dan **compiler CLI `zarc`** untuk konversi `.zar` → `.js` otomatis.

