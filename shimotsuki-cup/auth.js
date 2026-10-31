const SESSION_KEY = 'shimotsuki-cup-pw';

function base64ToBytes(b64) {
    return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

function isAuthed() {
    return sessionStorage.getItem(SESSION_KEY) !== null;
}

function setAuthed(password) {
    sessionStorage.setItem(SESSION_KEY, password);
}

function clearAuthed() {
    sessionStorage.removeItem(SESSION_KEY);
}

function getStoredPassword() {
    return sessionStorage.getItem(SESSION_KEY);
}

async function deriveAesKey(password, saltB64, iterations) {
    const baseKey = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        'PBKDF2',
        false,
        ['deriveKey']
    );
    return crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: base64ToBytes(saltB64), iterations, hash: 'SHA-256' },
        baseKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
    );
}

// Throws if the password is wrong (AES-GCM auth tag check fails).
async function decryptPlayers(password, encryptedPayload) {
    const key = await deriveAesKey(password, encryptedPayload.salt, encryptedPayload.iterations);
    const iv = base64ToBytes(encryptedPayload.iv);
    const ciphertext = base64ToBytes(encryptedPayload.ciphertext);
    const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
    return JSON.parse(new TextDecoder().decode(plainBuf));
}
