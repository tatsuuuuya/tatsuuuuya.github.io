const screens = {
    auth: document.getElementById('screen-auth'),
    form: document.getElementById('screen-form'),
    result: document.getElementById('screen-result'),
};

const passwordInput = document.getElementById('password-input');
const enterBtn = document.getElementById('enter-btn');
const authError = document.getElementById('auth-error');

const predictorNameInput = document.getElementById('predictor-name');
const rankSelects = [1, 2, 3, 4].map((n) => document.getElementById(`rank-${n}`));
const formError = document.getElementById('form-error');
const submitBtn = document.getElementById('submit-btn');

const ticketCanvas = document.getElementById('ticket-canvas');
const downloadBtn = document.getElementById('download-btn');
const retryBtn = document.getElementById('retry-btn');

let tournamentData = null;
let encryptedPayload = null;

function showScreen(name) {
    for (const key of Object.keys(screens)) {
        screens[key].classList.toggle('active', key === name);
    }
}

function populateRankSelects() {
    for (const select of rankSelects) {
        select.innerHTML = '<option value="">選択してください</option>' +
            tournamentData.players
                .map((p) => `<option value="${p.id}">${p.name}</option>`)
                .join('');
    }
    refreshRankOptions();
}

function refreshRankOptions() {
    const selectedIds = rankSelects.map((s) => s.value).filter((v) => v !== '');
    for (const select of rankSelects) {
        const own = select.value;
        for (const option of select.options) {
            if (option.value === '') continue;
            option.disabled = selectedIds.includes(option.value) && option.value !== own;
        }
    }
}

function validateForm() {
    const name = predictorNameInput.value.trim();
    if (!name) return '予想者名を入力してください';
    const values = rankSelects.map((s) => s.value);
    if (values.some((v) => v === '')) return '1位〜4位をすべて選択してください';
    if (new Set(values).size !== values.length) return '同じ棋士を複数の順位に選ぶことはできません';
    return null;
}

async function fetchEncryptedPlayers() {
    const res = await fetch('players.enc.json');
    encryptedPayload = await res.json();
}

// Throws if the password is wrong.
async function unlockWithPassword(password) {
    tournamentData = await decryptPlayers(password, encryptedPayload);
    populateRankSelects();
}

async function init() {
    await fetchEncryptedPlayers();
    const stored = getStoredPassword();
    if (stored) {
        try {
            await unlockWithPassword(stored);
            showScreen('form');
            return;
        } catch {
            clearAuthed();
        }
    }
    showScreen('auth');
}

enterBtn.addEventListener('click', async () => {
    authError.textContent = '';
    try {
        await unlockWithPassword(passwordInput.value);
        setAuthed(passwordInput.value);
        showScreen('form');
    } catch {
        authError.textContent = '合言葉が違います';
    }
});

passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') enterBtn.click();
});

for (const select of rankSelects) {
    select.addEventListener('change', refreshRankOptions);
}

submitBtn.addEventListener('click', async () => {
    const error = validateForm();
    if (error) {
        formError.textContent = error;
        return;
    }
    formError.textContent = '';

    const userName = predictorNameInput.value.trim();
    const ranked = rankSelects.map((s) => {
        const player = tournamentData.players.find((p) => String(p.id) === s.value);
        return player ? player.name : '';
    });

    const fontSampleText = tournamentData.players.map((p) => p.name).join('') +
        '4連単の予想１点（）開催日：日穴オープン戦' +
        tournamentData.tournament +
        tournamentData.date +
        (tournamentData.venue || '') +
        userName;
    await loadTicketFonts(fontSampleText);
    drawTicket(ticketCanvas, {
        userName,
        date: tournamentData.date,
        tournament: tournamentData.tournament,
        ranked,
        venue: tournamentData.venue,
    });

    showScreen('result');
});

downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `${predictorNameInput.value.trim() || 'shimotsuki-cup'}_予想.png`;
    link.href = ticketCanvas.toDataURL('image/png');
    link.click();
});

retryBtn.addEventListener('click', () => {
    showScreen('form');
});

init();
