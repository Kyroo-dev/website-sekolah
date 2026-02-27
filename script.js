// ============================================
// 0. PRELOADER LOGIC (HACKER STYLE)
// ============================================
const counter = document.getElementById('counter');
const progressBar = document.getElementById('progress-bar');
const preloader = document.querySelector('.preloader');

// Cek apakah element preloader ada (Hanya di index.html)
if (preloader) {
    document.body.classList.add('loading');
    let count = 0;
    const interval = setInterval(() => {
        count++;
        if (counter) counter.innerText = count;
        if (progressBar) progressBar.style.width = count + '%';

        if (count === 100) {
            clearInterval(interval);
            gsap.to(preloader, {
                yPercent: -100, duration: 1, ease: "power4.inOut", delay: 0.5,
                onComplete: () => {
                    document.body.classList.remove('loading');
                    // Trigger Hero Anim
                    gsap.to(".hero-title", { y: 0, opacity: 1, duration: 1.5, ease: "power4.out" });
                    gsap.to(".hero-subtitle", { y: 0, opacity: 1, duration: 1.5, ease: "power4.out", delay: 0.2 });
                    gsap.to(".hero-btn", { y: 0, opacity: 1, duration: 1.5, ease: "power4.out", delay: 0.4 });
                }
            });
        }
    }, 20);
} else {
    // Kalau di halaman lain (struktur.html), langsung remove loading class
    document.body.classList.remove('loading');
}

// ============================================
// STANDARD LOGIC
// ============================================
lucide.createIcons();
const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true, mouseMultiplier: 1 });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// MOBILE MENU
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (menuBtn && mobileMenu) {
    let isMenuOpen = false;
    menuBtn.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileMenu.style.opacity = '1'; mobileMenu.style.pointerEvents = 'auto';
            menuBtn.innerHTML = '<i data-lucide="x" class="w-8 h-8"></i>'; lucide.createIcons();
        } else {
            mobileMenu.style.opacity = '0'; mobileMenu.style.pointerEvents = 'none';
            menuBtn.innerHTML = '<i data-lucide="menu" class="w-8 h-8"></i>'; lucide.createIcons();
        }
    });
}

// PARTICLE CANVAS
const canvas = document.getElementById('particle-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, particles = [];
    function resize() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; }
    window.addEventListener('resize', resize); resize();
    class Particle {
        constructor() {
            this.x = Math.random() * width; this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5; this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2; this.color = Math.random() > 0.5 ? '#00f0ff' : '#bd00ff';
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1; if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fillStyle = this.color; ctx.fill(); }
    }
    for (let i = 0; i < 50; i++) particles.push(new Particle());
    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update(); particles[i].draw();
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x; const dy = particles[i].y - particles[j].y;
                if (Math.sqrt(dx * dx + dy * dy) < 150) {
                    ctx.beginPath(); ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - Math.sqrt(dx * dx + dy * dy)/1500})`;
                    ctx.lineWidth = 0.5; ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

// GSAP
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.matchMedia({
    "(min-width: 768px)": function() {
        const sections = gsap.utils.toArray(".facilities-wrapper > div");
        if(sections.length > 0) {
            gsap.to(sections, { xPercent: -100 * (sections.length - 1), ease: "none", scrollTrigger: { trigger: "#fasilitas", pin: true, scrub: 1, end: "+=2000" } });
        }
    }
});
if(document.querySelector(".profile-card")) {
    gsap.from(".profile-card", { y: 50, opacity: 0, duration: 1.5, ease: "power3.out", scrollTrigger: { trigger: "#creator", start: "top 85%" } });
}

// MODAL DAFTAR (WHATSAPP)
const modalDaftar = document.getElementById('modal-daftar');
const modalContent = document.querySelector('.modal-content');
const closeModal = document.getElementById('close-modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const ppdbForm = document.getElementById('ppdb-form');

if (modalDaftar) {
    function openModal() {
        modalDaftar.classList.remove('hidden');
        gsap.to(modalContent, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" });
    }
    function closeModalFunc() {
        gsap.to(modalContent, { scale: 0.9, opacity: 0, duration: 0.2, onComplete: () => { modalDaftar.classList.add('hidden'); } });
    }
    document.querySelectorAll('.btn-daftar').forEach(btn => {
        btn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    });
    closeModal.addEventListener('click', closeModalFunc);
    modalBackdrop.addEventListener('click', closeModalFunc);

    ppdbForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nama = document.getElementById('nama').value;
        const sekolah = document.getElementById('sekolah').value;
        const jurusan = document.getElementById('jurusan-pilih').value;
        const text = `Halo Admin SMK FutureTech,%0A%0ASaya ingin mendaftar PPDB.%0A---------------------------%0ANama: *${nama}*%0AAsal Sekolah: *${sekolah}*%0AMinat Jurusan: *${jurusan}*%0A---------------------------%0AMohon info selanjutnya.`;
        
        // GANTI NOMOR WA DISINI
        const nomorWA = "6281234567890"; 
        window.open(`https://wa.me/${nomorWA}?text=${text}`, '_blank');
        closeModalFunc();
    });
}