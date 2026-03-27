/**
 * SKRIP DUNIA BELAJAR CERIA
 * Mengelola navigasi halaman, suara, dan sistem mewarnai
 */

// --- 1. Variabel Global ---
let canvas, ctx;
let painting = false;
let currentColor = '#FF6B6B'; // Warna awal (Merah Muda)

// --- 2. Fungsi Navigasi & Login ---

function showPage(pageId) {
    // Sembunyikan semua halaman
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Tampilkan halaman yang dipilih
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Khusus Halaman Mewarnai: Inisialisasi Canvas
    if (pageId === 'page5') {
        // Beri sedikit jeda agar browser selesai merender elemen sebelum dihitung ukurannya
        setTimeout(initCanvas, 100);
    }
}

function login() {
    const nameInput = document.getElementById('userNameInput');
    const name = nameInput.value.trim();
    
    if (name !== "") {
        document.getElementById('greeting').innerText = `Halo, ${name}! 👋`;
        showPage('page2');
    } else {
        alert("Masukkan namamu dulu ya!");
    }
}

// --- 3. Fungsi Suara (Text to Speech) ---

function speak(text) {
    if ('speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'id-ID';
        window.speechSynthesis.speak(msg);
    }
}

// --- 4. Sistem Mewarnai (Canvas) ---

function initCanvas() {
    canvas = document.getElementById('coloringArea');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    
    // Mengatur ukuran internal canvas sesuai tampilan CSS (agar tidak buram)
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // --- Event Listeners untuk Mouse ---
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', finishedPosition);
    canvas.addEventListener('mousemove', draw);

    // --- Event Listeners untuk Touch (HP/Tablet) ---
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Mencegah scroll layar saat menggambar
        startPosition(e.touches[0]);
    });
    canvas.addEventListener('touchend', finishedPosition);
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Mencegah scroll layar saat menggambar
        draw(e.touches[0]);
    });
}

function changeColor(color) {
    currentColor = color;
}

function startPosition(e) {
    painting = true;
    draw(e); // Agar bisa membuat titik hanya dengan sekali klik
}

function finishedPosition() {
    painting = false;
    ctx.beginPath(); // Memutus jalur garis agar tidak tersambung ke titik baru
}

function draw(e) {
    if (!painting) return;

    // Mendapatkan posisi koordinat yang akurat di dalam canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Pengaturan kuas
    ctx.lineWidth = 10;
    ctx.lineCap = 'round'; // Ujung garis bulat (halus)
    ctx.lineJoin = 'round';
    ctx.strokeStyle = currentColor;

    // Menggambar garis
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function clearCanvas() {
    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// Pastikan sistem siap saat halaman pertama kali dimuat
window.onload = () => {
    // Jika user me-refresh saat di halaman mewarnai
    const activePage = document.querySelector('.page.active');
    if (activePage && activePage.id === 'page5') {
        initCanvas();
    }
};