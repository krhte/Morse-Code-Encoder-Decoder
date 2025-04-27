const morseCodeMap = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
    'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
    'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
    'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
    'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.'
};

const arabicToMorse = {
    'ا': '.-', 'ب': '-...', 'ت': '-', 'ث': '-..', 'ج': '.---', 'ح': '....', 'خ': '--.',
    'د': '-..', 'ذ': '--..', 'ر': '.-.', 'ز': '--.', 'س': '...', 'ش': '----',
    'ص': '---.', 'ض': '.--.', 'ط': '-.-.', 'ظ': '.-.-', 'ع': '.-..-', 'غ': '--..-',
    'ف': '..-.', 'ق': '--.-', 'ك': '-.-', 'ل': '.-..', 'م': '--', 'ن': '-.',
    'ه': '....', 'و': '.--', 'ي': '-.--', 'ئ': '.--..', 'ء': '...-', 'أ': '.-.-',
    'ؤ': '-.-.', 'إ': '.-..', 'لا': '-..-.-', 'ل': '.-..'
};

const reverseMorseCodeMap = Object.fromEntries(
    Object.entries(morseCodeMap).map(([letter, morse]) => [morse, letter])
);

const reverseArabicMorseCodeMap = Object.fromEntries(
    Object.entries(arabicToMorse).map(([letter, morse]) => [morse, letter])
);

function encode() {
    const text = document.getElementById('textInput').value.toUpperCase();
    const morse = text.split('').map(char => {
        if (char === ' ') return '/';
        return morseCodeMap[char] || arabicToMorse[char] || '';
    }).join(' ');
    document.getElementById('morseOutput').value = morse;
}

function decode() {
    const morse = document.getElementById('morseOutput').value.trim();
    const text = morse.split(' ').map(code => {
        if (code === '/') return ' ';
        return reverseMorseCodeMap[code] || reverseArabicMorseCodeMap[code] || '';
    }).join('');
    document.getElementById('textInput').value = text;
}

function encodeDecode() {
    const textInput = document.getElementById('textInput').value.trim();
    const morseOutput = document.getElementById('morseOutput').value.trim();

    if ((textInput === "" && morseOutput === "")) {
        return;
    }

    const normalTextVisible = document.getElementById('textInput').style.display === 'block';
    if (normalTextVisible) {
        encode();
        toggleInput('morse');
    } else {
        decode();
        toggleInput('normal');
    }
}

function toggleInput(type) {
    if (type === 'normal') {
        document.getElementById('textInput').style.display = 'block';
        document.getElementById('morseOutput').style.display = 'none';
        document.getElementById('normalTextToggle').classList.add('active');
        document.getElementById('morseCodeToggle').classList.remove('active');
    } else {
        document.getElementById('textInput').style.display = 'none';
        document.getElementById('morseOutput').style.display = 'block';
        document.getElementById('morseCodeToggle').classList.add('active');
        document.getElementById('normalTextToggle').classList.remove('active');
    }
}

const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const points = [];

for (let i = 0; i < 100; i++) {
    points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
    });
}

function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    }

    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const dx = points[i].x - points[j].x;
            const dy = points[i].y - points[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(points[j].x, points[j].y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / 100})`;
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(draw);
}

draw();

window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
});

document.addEventListener('mousemove', (e) => {
    points.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
    });
    if (points.length > 120) points.shift();
});

toggleInput('normal');
