const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

let audioCtx;
let analyser;
let dataArray;
let bufferLength;

// Canvasni ekran o'lchamiga moslash
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Audio tizimini ishga tushirish (faqat birinchi marta bosilganda)
function initAudio() {
    if (audioCtx) return;

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128; // To'lqinlar soni

    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    const audios = document.querySelectorAll('audio');
    audios.forEach(audio => {
        // Cross-origin audio bilan ishlash uchun
        audio.crossOrigin = "anonymous";
        const source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
    });

    draw();
}

// Ekvalayzerni chizish
function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] * 2;
        
        // Neon ko'k gradiyent
        ctx.fillStyle = `rgba(0, 210, 255, ${barHeight / 400})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
        
        // Yuqori qismdagi chiziqlar
        ctx.fillRect(x, 0, barWidth - 2, barHeight / 4);

        x += barWidth;
    }
}

function playSound(e) {
    if (!audioCtx) initAudio();

    const code = e.keyCode || this.getAttribute('data-key');
    const audio = document.querySelector(`audio[data-key="${code}"]`);
    const key = document.querySelector(`.key[data-key="${code}"]`);

    if (!audio) return;

    key.classList.add('playing');
    audio.currentTime = 0;
    audio.play();
}

function removeTransition(e) {
    if (e.propertyName !== 'transform') return;
    this.classList.remove('playing');
}

const keys = document.querySelectorAll('.key');
keys.forEach(key => {
    key.addEventListener('transitionend', removeTransition);
    key.addEventListener('click', playSound);
});

window.addEventListener('keydown', playSound);