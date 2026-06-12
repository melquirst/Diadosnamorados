// ── Atmosfera: Poeira Iluminada e Corações ──
(function() {
    const canvas = document.getElementById('coracao-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Fórmula do coração
    function heartX(t, size) { return size * 16 * Math.pow(Math.sin(t), 3); }
    function heartY(t, size) { return -size * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)); }

    // Cria partículas mistas: Algumas são corações, a maioria é poeira brilhante
    function criarParticula() {
        const isHeart = Math.random() > 0.85; // Apenas 15% serão corações
        return {
            x: Math.random() * canvas.width,
            y: canvas.height + 20,
            isHeart: isHeart,
            size: isHeart ? (Math.random() * 0.5 + 0.3) : (Math.random() * 1.5 + 0.5), // Corações maiores, poeira minúscula
            speed: isHeart ? (Math.random() * 0.6 + 0.2) : (Math.random() * 0.4 + 0.1), // Poeira sobe mais devagar
            alpha: isHeart ? (Math.random() * 0.3 + 0.1) : (Math.random() * 0.4 + 0.1),
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: (Math.random() - 0.5) * 0.01,
            color: isHeart ? '#C0392B' : (Math.random() > 0.5 ? '#FFF8F7' : '#F5B7B1') // Corações vermelhos, poeira creme/rosada
        };
    }

    // Criar partículas iniciais espalhadas pela tela
    for (let i = 0; i < 60; i++) {
        let p = criarParticula();
        p.y = Math.random() * canvas.height;
        particles.push(p);
    }

    function desenharCoracao(x, y, size, alpha, color) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        for (let t = 0; t < Math.PI * 2; t += 0.1) {
            const px = x + heartX(t, size);
            const py = y + heartY(t, size);
            t === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function desenharPoeira(x, y, size, alpha, color) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function animar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, i) => {
            p.y -= p.speed;
            p.wobble += p.wobbleSpeed;
            p.x += Math.sin(p.wobble) * 0.5; // Balanço lateral suave
            
            if (p.isHeart) {
                desenharCoracao(p.x, p.y, p.size, p.alpha, p.color);
            } else {
                desenharPoeira(p.x, p.y, p.size, p.alpha, p.color);
            }

            // Recicla a partícula quando sai da tela
            if (p.y < -30) {
                particles[i] = criarParticula();
            }
        });
        requestAnimationFrame(animar);
    }
    animar();
})();

// ── Entrar no museu ──
function entrarMuseu() {
    const hero = document.getElementById('hero');
    const museu = document.getElementById('museu');

    hero.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(-30px)';

    setTimeout(() => {
        hero.style.display = 'none';
        museu.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        iniciarObserver();
    }, 600);
}

// ── Abrir segredo ──
function abrirPorta() {
    const segredo = document.getElementById('segredo');
    segredo.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Pequeno efeito de "shake" na porta antes de abrir
    const porta = document.querySelector('.porta');
    porta.style.animation = 'shake 0.4s ease';
    setTimeout(() => { porta.style.animation = ''; }, 400);
}

function fecharSegredo() {
    const segredo = document.getElementById('segredo');
    segredo.style.opacity = '0';
    segredo.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
        segredo.style.display = 'none';
        segredo.style.opacity = '';
        segredo.style.transition = '';
        document.body.style.overflow = '';
    }, 300);
}

// ── Scroll reveal ──
function iniciarObserver() {
    const elementos = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12 });

    elementos.forEach(el => observer.observe(el));
}

// ── Animação da porta (shake) ──
const style = document.createElement('style');
style.textContent = `
@keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-5px) rotate(-1deg); }
    40%      { transform: translateX(5px) rotate(1deg); }
    60%      { transform: translateX(-4px); }
    80%      { transform: translateX(4px); }

    // ── Efeito 3D e Reflexo nos Quadros ──
VanillaTilt.init(document.querySelectorAll(".quadro, .quadro-futuro"), {
    max: 8,              // Rotação máxima em graus
    speed: 400,          // Velocidade da transição
    glare: true,         // Ativa o efeito de reflexo de luz
    "max-glare": 0.3,    // Opacidade máxima do reflexo (0 a 1)
    scale: 1.02          // Dá um leve zoom quando o mouse passa
});
}
`;
document.head.appendChild(style);
