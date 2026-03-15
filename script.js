const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

let audioCtx, analyser, dataArray, bufferLength;

// Canvas o'lchamini sozlash
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    const audios = document.querySelectorAll('audio');
    audios.forEach(audio => {
        const source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
    });
    draw();
}

function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] * 1.8;
        ctx.fillStyle = `rgba(0, 210, 255, ${barHeight / 450})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        ctx.fillRect(x, 0, barWidth - 1, barHeight / 3);
        x += barWidth;
    }
}

function playSound(e) {
    if (!audioCtx) initAudio();

    const code = e.keyCode || this.getAttribute('data-key');
    const audio = document.querySelector(`audio[data-key="${code}"]`);
    const key = document.querySelector(`.key[data-key="${code}"]`);

    if (!audio || !key) return;

    // Klassni tozalash va qayta qo'shish (qotib qolmaslik uchun)
    key.classList.remove('playing');
    void key.offsetWidth; // Reflow
    key.classList.add('playing');

    audio.currentTime = 0;
    audio.play();

    // 100ms dan keyin majburiy olib tashlash
    setTimeout(() => {
        key.classList.remove('playing');
    }, 100);
}

// Eventlarni ulash
const keys = document.querySelectorAll('.key');
keys.forEach(key => {
    key.addEventListener('click', playSound);
});

window.addEventListener('keydown', playSound);