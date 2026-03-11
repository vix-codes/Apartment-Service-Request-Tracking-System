const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:8080' 
    : 'https://url-shortener-h3sh.onrender.com'; // User needs to update this after Render deployment

const shortenBtn = document.getElementById('shortenBtn');
const longUrlInput = document.getElementById('longUrl');
const resultContainer = document.getElementById('result');
const shortUrlText = document.getElementById('shortUrl');
const copyBtn = document.getElementById('copyBtn');

const checkAnalyticsBtn = document.getElementById('checkAnalyticsBtn');
const analyticsCodeInput = document.getElementById('analyticsCode');
const analyticsResult = document.getElementById('analyticsResult');
const clickCountSpan = document.getElementById('clickCount');
const createdAtSpan = document.getElementById('createdAt');
const expiresAtSpan = document.getElementById('expiresAt');

// Shorten URL
shortenBtn.addEventListener('click', async () => {
    const url = longUrlInput.value;
    if (!url) {
        showToast('Please enter a valid URL');
        return;
    }

    shortenBtn.disabled = true;
    shortenBtn.innerText = 'Creating...';

    try {
        const response = await fetch(`${API_BASE_URL}/shorten`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) throw new Error('Failed to shorten URL');

        const data = await response.json();
        shortUrlText.innerText = data.shortUrl;
        resultContainer.classList.remove('hidden');
        showToast('Success! URL shortened.');
    } catch (error) {
        console.error(error);
        showToast('Error shortening URL. Is the backend running?');
    } finally {
        shortenBtn.disabled = false;
        shortenBtn.innerText = 'Shorten Now';
    }
});

// Analytics
checkAnalyticsBtn.addEventListener('click', async () => {
    const code = analyticsCodeInput.value.trim();
    if (!code) {
        showToast('Please enter a short code');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/analytics/${code}`);
        if (!response.ok) {
            if (response.status === 404) throw new Error('Code not found');
            throw new Error('Failed to fetch analytics');
        }

        const data = await response.json();
        clickCountSpan.innerText = data.clickCount;
        createdAtSpan.innerText = new Date(data.createdAt).toLocaleDateString();
        expiresAtSpan.innerText = data.expiresAt ? new Date(data.expiresAt).toLocaleDateString() : 'Never';
        
        analyticsResult.classList.remove('hidden');
    } catch (error) {
        showToast(error.message);
    }
});

// Copy to Clipboard
copyBtn.addEventListener('click', () => {
    const text = shortUrlText.innerText;
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!');
    });
});

// Helper: Show Toast
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}
