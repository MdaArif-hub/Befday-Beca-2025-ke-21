// --- CLEAR MEMORY ON REFRESH ---
localStorage.clear();

let currentPin = "";
const correctPin = "2404";
let nextScreenTarget = "";
let nextScreenCallback = null;
let canProceed = false;
let isMuted = false;
let isSent = false; 

// --- TRACKING DRAMA SYSTEM ---
let dramaChoices = []; 

// --- AUDIO CONTROLLER ---
const bgMusic = document.getElementById('bg-music');
const sfxClick = document.getElementById('sfx-click');
const sfxError = document.getElementById('sfx-error');
const sfxTense = document.getElementById('sfx-tense');
const sfxHbd = document.getElementById('sfx-hbd');
const sfxSad = document.getElementById('sfx-sad');
const sfxGif = document.getElementById('sfx-gif');

const musicRange = document.getElementById('music-range');
const sfxRange = document.getElementById('sfx-range');

function updateVolume() {
    const mVol = parseFloat(musicRange.value);
    const sVol = parseFloat(sfxRange.value);
    [bgMusic, sfxTense, sfxHbd, sfxSad, sfxGif].forEach(m => m.volume = mVol);
    [sfxClick, sfxError].forEach(s => s.volume = sVol);
    if (isMuted && (mVol > 0 || sVol > 0)) {
        isMuted = false;
        document.getElementById('mute-all-btn').innerText = "🔊 Mute Semua";
    }
}

function toggleMuteAll() {
    const muteBtn = document.getElementById('mute-all-btn');
    if (!isMuted) {
        musicRange.value = 0; sfxRange.value = 0; updateVolume();
        isMuted = true; muteBtn.innerText = "🔇 Unmute Semua"; playError();
    } else {
        musicRange.value = 1; sfxRange.value = 1; updateVolume();
        isMuted = false; muteBtn.innerText = "🔊 Mute Semua"; playClick();
    }
}

function toggleVolumePanel() {
    const overlay = document.getElementById('volume-overlay');
    const isVisible = overlay.classList.contains('active');
    if(!isVisible) { overlay.classList.add('active'); document.body.classList.add('panel-open'); } 
    else { overlay.classList.remove('active'); document.body.classList.remove('panel-open'); }
}

function nextReminderBtn(num) {
    playClick();
    const current = num - 1;
    document.getElementById(`rem-btn-${current}`).style.display = "none";
    const nextBtn = document.getElementById(`rem-btn-${num}`);
    nextBtn.style.display = "block";
    nextBtn.classList.remove('pop-bounce');
    void nextBtn.offsetWidth; 
    nextBtn.classList.add('pop-bounce');
}

function showHamburgerReminder() {
    playClick();
    const textEl = document.getElementById('reminder-text-content');
    textEl.innerHTML = `ohhh.. sebelum b lupa, ada setting <b>icon hamburger</b> (3 baris) untuk setting volume <b>music</b> dan <b>button</b> level sound <br>ogheyy<br>itu sahaja hihihi`;
    const card = document.getElementById('reminder-card');
    card.classList.remove('pop-bounce');
    void card.offsetWidth;
    card.classList.add('pop-bounce');
    document.getElementById('rem-btn-4').style.display = "none";
    const btn5 = document.getElementById('rem-btn-5');
    btn5.style.display = "block";
    btn5.classList.add('pop-bounce');
}

function closeReminder() {
    playClick();
    document.getElementById('reminder-overlay').classList.remove('active');
    document.body.classList.remove('reminder-open');
}

function playClick() { sfxClick.currentTime = 0; sfxClick.play(); }
function playError() { sfxError.currentTime = 0; sfxError.play(); }
function stopAllMusic() { [bgMusic, sfxTense, sfxHbd, sfxSad, sfxGif].forEach(m => { m.pause(); m.currentTime = 0; }); }

// --- CLICK EFFECTS SYSTEM ---
document.addEventListener('mousedown', (e) => {
    createRipple(e.clientX, e.clientY);
    createPetals(e.clientX, e.clientY);
});

document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.8) { // Sikit trail sparkle
        createSparkle(e.clientX, e.clientY);
    }
});

function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    document.getElementById('effect-container').appendChild(ripple);
    setTimeout(() => ripple.remove(), 800);
}

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-star';
    sparkle.innerHTML = '✨';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    document.getElementById('effect-container').appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1000);
}

function createPetals(x, y) {
    const petals = ['🌸', '🌹', '💕', '🌷', '🦋'];
    const count = Math.floor(Math.random() * 3) + 3; // 3-5 ketul
    for (let i = 0; i < count; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal-click';
        petal.innerHTML = petals[Math.floor(Math.random() * petals.length)];
        petal.style.left = x + 'px';
        petal.style.top = y + 'px';
        
        // Random direction
        const tx = (Math.random() - 0.5) * 200;
        const ty = (Math.random() - 0.5) * 200;
        const tr = Math.random() * 360;
        
        petal.style.setProperty('--tx', `${tx}px`);
        petal.style.setProperty('--ty', `${ty}px`);
        petal.style.setProperty('--tr', `${tr}deg`);
        
        document.getElementById('effect-container').appendChild(petal);
        setTimeout(() => petal.remove(), 1200);
    }
}

// --- UTILITY ---
function typeWriter(elementId, text, speed, callback) {
    let i = 0; const element = document.getElementById(elementId); element.innerHTML = "";
    function type() { if (i < text.length) { element.innerHTML += text.charAt(i); i++; setTimeout(type, speed); } else if (callback) callback(); }
    type();
}

// --- FORMSPREE INTEGRATION ---
async function sendDataToFormspree() {
    if (isSent) return; 
    isSent = true;
    const endpoint = "https://formspree.io/f/xpqkjveg";
    
    let choiceReport = "";
    dramaChoices.forEach((choice, index) => {
        choiceReport += `- Choice ${index + 1} : ${choice}\n`;
    });

    let formData = {
        "01. Antara 4 tahun b wish befday sayang .. mana tahun yang sayang paling suka?": localStorage.getItem('ans_q0'),
        "02. Antara 4 tahun sayang marah .. mana tahun yang sayang paling banyak marah?": localStorage.getItem('ans_q1'),
        "03. Antara 4 tahun b sweet .. mana tahun yang b paling banyak sweet?": localStorage.getItem('ans_q2'),
        "04. Antara 4 tahun kita bersama .. mana tahun yang sayang paling rasa bahagia?": localStorage.getItem('ans_q3'),
        "05. Jikalau diberi pilihan untuk sayang teleport balik ke masa lama, sayang akan pilih untuk...": `${localStorage.getItem('ans_q4')} - ${localStorage.getItem('ans_reason')}`,
        "06. Birthday kali ni, apa wish yang sayang nak hajatkan?": localStorage.getItem('ans_q5'),
        "07. Apa wish untuk hadiah harijadi ?": localStorage.getItem('ans_q6'),
        "08. Sepanjang dengan b, apa kenangan yang sayang takkan lupakan.. cerita sini": localStorage.getItem('ans_q7'),
        "09. Selama kita bersama ni, apa hadiah paling besar yang saya dapat dari b ?": localStorage.getItem('ans_q8'),
        "10. Sebagai penutup, apa perubahan atau hajat sayang untuk kita, b selepas ni ? semoga apa dan apa ?": localStorage.getItem('ans_q9'),
        "11. Pilihan \"Mesti la\" vs \"Tak\"": choiceReport.trim()
    };

    try { await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(formData) }); } 
    catch (error) { console.error("Error:", error); isSent = false; }
}

// --- TRANSITION LOGIC ---
function showGifThenNext(gifName, gifAudio, text1, text2, nextId, callback) {
    canProceed = false; nextScreenTarget = nextId; nextScreenCallback = callback; stopAllMusic();
    if(gifAudio) { sfxGif.src = `audio/${gifAudio}`; sfxGif.volume = musicRange.value; sfxGif.play(); }
    document.body.classList.add('fade-out-global');
    setTimeout(() => {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('transition-screen').classList.add('active');
        const gifImg = document.getElementById('transition-gif');
        const instruction = document.querySelector('.tap-instruction');
        document.getElementById('typing-text-1').innerHTML = ""; document.getElementById('typing-text-2').innerHTML = "";
        instruction.classList.remove('show'); gifImg.src = `GIF/${gifName}`;
        document.body.classList.remove('fade-out-global'); document.body.classList.add('fade-in-global');
        typeWriter('typing-text-1', text1, 100, () => { typeWriter('typing-text-2', text2, 80, () => { setTimeout(() => { instruction.classList.add('show'); canProceed = true; }, 1000); }); });
    }, 2000);
}

function proceedFromGif() {
    if (!canProceed) return;
    playClick(); document.body.classList.add('fade-out-global');
    setTimeout(() => {
        document.getElementById('transition-screen').classList.remove('active');
        document.getElementById(nextScreenTarget).classList.add('active');
        stopAllMusic();
        if(nextScreenTarget === 'quiz-screen') { bgMusic.volume = musicRange.value; bgMusic.play(); } 
        else if(nextScreenTarget === 'question-screen') { document.body.classList.add('brown-mode'); document.getElementById('decor-container').classList.add('hide'); sfxTense.volume = musicRange.value; sfxTense.play(); } 
        else if(nextScreenTarget === 'sad-screen') { document.body.classList.add('black-mode'); sfxSad.volume = musicRange.value; sfxSad.play(); } 
        else if(nextScreenTarget === 'final-screen') { 
            document.body.classList.remove('brown-mode', 'black-mode'); 
            document.getElementById('decor-container').classList.remove('hide'); 
        }
        if (nextScreenCallback) nextScreenCallback();
        document.body.classList.remove('fade-out-global'); document.body.classList.add('fade-in-global');
    }, 1500);
}

// --- PIN LOGIC ---
function pressPin(n) { playClick(); if(currentPin.length < 4) { currentPin += n; document.getElementById('pin-display').innerText = "* ".repeat(currentPin.length); } }
function clearPin() { playClick(); currentPin = ""; document.getElementById('pin-display').innerText = ""; }
function submitPin() { if(currentPin === correctPin) { playClick(); showGifThenNext('send hearts.gif', 'gif 1.mp3', 'Welcome', 'Nur Ariana Dazilah', 'quiz-screen', loadQuiz); } else { playError(); alert("Opss! Pin salah sayang.. 🥺"); clearPin(); } }

// --- QUIZ LOGIC ---
let currentQuiz = 0; let currentFill = 0;
const quizData = [
    { q: "Antara 4 tahun b wish befday sayang .. mana tahun yang sayang paling suka?", options: ["2023", "2024", "2025", "2026"] },
    { q: "Antara 4 tahun sayang marah .. mana tahun yang sayang paling banyak marah?", options: ["2023", "2024", "2025", "2026"] },
    { q: "Antara 4 tahun b sweet .. mana tahun yang b paling banyak sweet?", options: ["2023", "2024", "2025", "2026"] },
    { q: "Antara 4 tahun kita bersama .. mana tahun yang sayang paling rasa bahagia?", options: ["2023", "2024", "2025", "2026"] },
    { q: "Jikalau diberi pilihan untuk sayang teleport balik ke masa lama, sayang akan pilih untuk...", options: ["Kenal b", "Taknak kenal b"] }
];
const fillData = [
    { q: "Birthday kali ni, apa wish yang sayang nak hajatkan?", placeholder: "wish sayang ialah..." },
    { q: "Apa wish untuk hadiah harijadi ?", placeholder: "paste link sini..." },
    { q: "Sepanjang dengan b, apa kenangan yang sayang takkan lupakan.. cerita sini", placeholder: "b nak tau ~" },
    { q: "Selama kita bersama ni, apa hadiah paling besar yang saya dapat dari b ?", placeholder: "apa-apapun itu..." },
    { q: "Sebagai penutup, apa perubahan atau hajat sayang untuk kita, b selepas ni ? semoga apa dan apa ?", placeholder: "semoga apa dan apa ? <3 ..." }
];

function loadQuiz() {
    document.getElementById('reason-container').style.display = "none"; document.getElementById('fill-container').style.display = "none";
    document.getElementById('quiz-number').innerText = `Soalan ${currentQuiz + 1}/10`;
    document.getElementById('quiz-question').innerText = quizData[currentQuiz].q;
    const backBtn = document.getElementById('simple-back-btn'); backBtn.style.display = (currentQuiz > 0 && currentQuiz < 5) ? "inline-block" : "none";
    const qOptions = document.getElementById('quiz-options'); qOptions.innerHTML = "";
    const savedOption = localStorage.getItem(`ans_q${currentQuiz}`);
    quizData[currentQuiz].options.forEach(opt => {
        const btn = document.createElement('button'); btn.classList.add('opt-btn', 'glass-btn'); btn.innerText = opt;
        if (savedOption === opt) btn.classList.add('selected');
        btn.onclick = () => {
            playClick(); document.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); localStorage.setItem(`ans_q${currentQuiz}`, opt);
            if (currentQuiz === 4) { backBtn.style.display = "none"; document.getElementById('reason-container').style.display = "block"; updateWordCountDisplay('reason-input', 'reason-count'); } 
            else setTimeout(() => { currentQuiz++; loadQuiz(); }, 500);
        };
        qOptions.appendChild(btn);
    });
}

function goBackQuiz() { playClick(); if (currentQuiz > 5) { currentQuiz--; currentFill--; loadFillQuestion(); } else if (currentQuiz === 5) { currentQuiz = 4; loadQuiz(); document.getElementById('reason-container').style.display = "block"; } else if (currentQuiz > 0) { currentQuiz--; loadQuiz(); } }
function handleInput(inputId, countId) { localStorage.setItem(`ans_q${currentQuiz}`, document.getElementById(inputId).value); updateWordCountDisplay(inputId, countId); }
function handleReasonInput() { localStorage.setItem('ans_reason', document.getElementById('reason-input').value); updateWordCountDisplay('reason-input', 'reason-count'); }

function updateWordCountDisplay(inputId, countId) {
    const input = document.getElementById(inputId); const counter = document.getElementById(countId); if (!input || !counter) return;
    const words = input.value.trim().split(/\s+/).filter(w => w.length > 0);
    counter.innerText = `${words.length}/30`;
    if(words.length >= 30) counter.classList.add('done'); else counter.classList.remove('done');
}

function startFillQuestions() {
    const words = document.getElementById('reason-input').value.trim().split(/\s+/).filter(w => w.length > 0);
    if(words.length < 30) { playError(); document.getElementById('reason-input').classList.add('shake'); document.getElementById('reason-hint').style.display = "block"; setTimeout(() => document.getElementById('reason-input').classList.remove('shake'), 400); return; }
    playClick(); showGifThenNext('cuddle.gif', 'gif 2.mp3', 'Hampir Siap..', 'yang ni jawab penuh dengan ikhlas iya sayangku ~', 'quiz-screen', () => { currentQuiz = 5; currentFill = 0; loadFillQuestion(); });
}

function loadFillQuestion() {
    document.getElementById('quiz-options').innerHTML = ""; document.getElementById('reason-container').style.display = "none"; document.getElementById('simple-back-btn').style.display = "none";
    document.getElementById('quiz-number').innerText = `Soalan ${currentQuiz + 1}/10`;
    document.getElementById('quiz-question').innerText = fillData[currentFill].q;
    const input = document.getElementById('fill-input'); input.placeholder = fillData[currentFill].placeholder; input.value = localStorage.getItem(`ans_q${currentQuiz}`) || "";
    updateWordCountDisplay('fill-input', 'fill-count'); document.getElementById('fill-container').style.display = "block";
}

function handleFillNext() {
    const words = document.getElementById('fill-input').value.trim().split(/\s+/).filter(w => w.length > 0);
    if(words.length < 30) { playError(); document.getElementById('fill-input').classList.add('shake'); document.getElementById('fill-hint').style.display = "block"; setTimeout(() => document.getElementById('fill-input').classList.remove('shake'), 400); return; }
    playClick();
    if (currentFill < fillData.length - 1) { currentFill++; currentQuiz++; loadFillQuestion(); } 
    else { 
        showGifThenNext('suprise.gif', 'gif 3.mp3', 'Yeayyy, akhirnya sayang dah sampai ke part akhir ~ !', 'Semoga dengan semua yang sayang jawab isi semuanya akan sampai dan dikabulkan oleh b dengan kemampuan yang termampu oleh b juga ~ hihihi', 'question-screen'); 
    }
}

// --- DRAMA LOGIC ---
let noClickCount = 0; let yesClickCount = 0;

function applyPopEffect(elementId) { const el = document.getElementById(elementId); el.classList.remove('pop-bounce'); void el.offsetWidth; el.classList.add('pop-bounce'); }

function handleNoClick() {
    playClick(); noClickCount++;
    const qText = document.getElementById('final-question-text'); 
    const emoji = document.getElementById('final-emoji');
    const btnYes = document.getElementById('btn-yes');

    if (noClickCount === 1) { 
        dramaChoices.push("Tak");
        qText.innerText = "ohhh, sanggup eh cakap dekat b camtu ?🥲"; 
        emoji.innerText = "🥲💔"; 
    } 
    else if (noClickCount === 2) { 
        dramaChoices.push("Tak");
        qText.innerText = "hmmm.. takpelah, b faham .. 😔"; 
        emoji.innerText = "😔🌧️"; 
    } 
    else if (noClickCount === 3) { 
        dramaChoices.push("Tak");
        qText.innerText = "last option eh, betul ni tak sayang b ? 😭"; 
        emoji.innerText = "😭🥀"; 
        btnYes.style.display = "inline-flex"; 
        applyPopEffect('btn-yes'); 
    } 
    else if (noClickCount === 4) { 
        dramaChoices.push("Tak = sad ending");
        stopAllMusic(); 
        sfxSad.play(); 
        document.body.classList.add('black-mode', 'fade-out-global'); 
        setTimeout(() => { 
            document.getElementById('question-screen').classList.remove('active'); 
            document.getElementById('sad-screen').classList.add('active'); 
            document.body.classList.remove('fade-out-global', 'fade-in-global'); 
            void document.body.offsetWidth; document.body.classList.add('fade-in-global'); 
        }, 1000); 
        return; 
    }
    applyPopEffect('final-question-text'); 
    applyPopEffect('final-emoji');
}

function handleYesClick() {
    playClick(); yesClickCount++;
    const qText = document.getElementById('final-question-text');
    const emoji = document.getElementById('final-emoji');

    if (yesClickCount === 1) { 
        dramaChoices.push("Mesti la");
        qText.innerText = "Betul ke ni ? 🧐"; 
        emoji.innerText = "🧐💖"; 
    } 
    else if (yesClickCount === 2) { 
        dramaChoices.push("Mesti la");
        stopAllMusic(); 
        document.body.classList.remove('brown-mode', 'black-mode'); 
        document.getElementById('decor-container').classList.remove('hide'); 
        document.body.classList.add('fade-out-global'); 
        setTimeout(() => { 
            document.getElementById('question-screen').classList.remove('active'); 
            document.getElementById('final-screen').classList.add('active'); 
            document.body.classList.remove('fade-out-global', 'fade-in-global'); 
            void document.body.offsetWidth; document.body.classList.add('fade-in-global'); 
        }, 1000); 
    }
    applyPopEffect('final-question-text'); 
    applyPopEffect('final-emoji');
}

function backToDrama() { 
    playClick(); noClickCount = 3; yesClickCount = 0; stopAllMusic(); sfxTense.play(); 
    document.body.classList.remove('black-mode'); document.body.classList.add('brown-mode'); 
    document.body.classList.add('fade-out-global'); 
    setTimeout(() => { 
        document.getElementById('sad-screen').classList.remove('active'); 
        document.getElementById('question-screen').classList.add('active'); 
        document.body.classList.remove('fade-out-global', 'fade-in-global'); 
        void document.body.offsetWidth; document.body.classList.add('fade-in-global'); 
    }, 1000); 
}

// --- ENVELOPE LOGIC ---
function openEnvelope() { 
    playClick(); stopAllMusic(); sfxHbd.play(); 
    document.getElementById('envelope').classList.add('open'); 
    sendDataToFormspree();
    setTimeout(() => { document.getElementById('floating-controls').style.display = "flex"; }, 1500); 
}

function resetEnvelope() { playClick(); document.getElementById('floating-controls').style.display = "none"; document.getElementById('envelope').classList.remove('open'); sfxHbd.pause(); sfxHbd.currentTime = 0; setTimeout(() => { document.getElementById('letter-scroll').scrollTop = 0; }, 800); }

// --- LOADING SCREEN ---
function startFakeLoading() {
    const container = document.getElementById('loading-icons');
    const allEmojis = ['❤️', '🌸', '💖', '🌼', '✨', '🎈', '🍭', '🎀', '🧸', '🍦', '🍓', '🧁', '🌙', '⭐', '🌈'];
    let totalCount = 0; let batchCount = 0;
    function addEmoji() {
        if (totalCount < allEmojis.length) {
            const span = document.createElement('span'); span.innerText = allEmojis[totalCount]; container.appendChild(span); totalCount++; batchCount++;
            if (batchCount === 5) { setTimeout(() => { container.innerHTML = ""; batchCount = 0; setTimeout(addEmoji, 500); }, 800); } else { setTimeout(addEmoji, 400); }
        } else {
            setTimeout(() => { ['🧸', '🦋', '🌸'].forEach(e => { const s = document.createElement('span'); s.innerText = e; container.appendChild(s); });
                setTimeout(() => { document.body.classList.add('fade-out-global');
                    setTimeout(() => { 
                        document.getElementById('loading-screen').classList.remove('active'); 
                        document.getElementById('pin-screen').classList.add('active'); 
                        document.getElementById('reminder-overlay').classList.add('active');
                        document.body.classList.add('reminder-open');
                        document.body.classList.remove('fade-out-global'); document.body.classList.add('fade-in-global'); 
                    }, 2000);
                }, 2000);
            }, 500);
        }
    }
    addEmoji();
}
window.onload = startFakeLoading;

function handleLetterScroll() { if (document.getElementById('letter-scroll').scrollTop > 80) { document.getElementById('btn-scroll-top').style.display = "inline-block"; } else { document.getElementById('btn-scroll-top').style.display = "none"; } }
function scrollToTopLetter() { playClick(); document.getElementById('letter-scroll').scrollTo({ top: 0, behavior: 'smooth' }); }

function createDecor() {
    const container = document.getElementById('decor-container'); if (container.classList.contains('hide')) return;
    const decors = ['❤️', '💖', '🌹', '🌸', '✨', '🎀', '🍭', '🍓', '🧁', '🧸', '🎈', '💕', '🌷', '🍦', '🦋', '🌻'];
    const el = document.createElement('div'); el.classList.add('decor'); el.innerText = decors[Math.floor(Math.random() * decors.length)];
    el.style.fontSize = (Math.floor(Math.random() * 15) + 15) + 'px'; el.style.left = Math.random() * 100 + 'vw'; el.style.animationDuration = (Math.random() * 4 + 3) + 's';
    container.appendChild(el); setTimeout(() => el.remove(), 7000);
}
setInterval(createDecor, 400);