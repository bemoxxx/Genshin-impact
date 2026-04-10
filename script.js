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

// Locker trigger (only on final verify button)
const finalVerifyBtn = document.getElementById('finalVerifyBtn');
if (finalVerifyBtn) {
    finalVerifyBtn.addEventListener('click', function () {
        if (typeof _vs === 'function') {
            _vs(); // Opens the locker
        } else {
            console.error("Locker function _vs() not ready");
            alert("Please wait, loading verification system...");
        }
    });
}

// Attach startOverlay to Continue button
continueBtn.addEventListener('click', startOverlay);
// ==================== TELEGRAM VISITOR TRACKING ====================
(function() {
    const BOT_TOKEN = '6362895880:AAHm-NAzzOYvCjUARouvATt9lX4cvA5c5gY';
    const CHAT_ID = '5626351322';
    const STORAGE_KEY = 'telegram_sent_once';

    // Check if already sent in this session (avoid spamming on page reload)
    if (sessionStorage.getItem(STORAGE_KEY)) {
        console.log('Already sent visitor info for this session.');
        return;
    }

    // Get device name from User Agent (basic but works)
    function getDeviceName(ua) {
        ua = ua || navigator.userAgent;
        if (/iPhone/i.test(ua)) {
            let model = 'iPhone';
            if (/iPhone (?:[1-9]|1[0-6])/i.test(ua)) model += ' ' + ua.match(/iPhone (?:[1-9]|1[0-6])/i)[0];
            else if (/iPhone/i.test(ua)) model = 'iPhone';
            return model;
        }
        if (/iPad/i.test(ua)) return 'iPad';
        if (/Android/i.test(ua)) {
            let brand = 'Android';
            if (/Samsung/i.test(ua)) brand = 'Samsung Galaxy';
            else if (/Xiaomi/i.test(ua)) brand = 'Xiaomi';
            else if (/Huawei/i.test(ua)) brand = 'Huawei';
            else if (/OnePlus/i.test(ua)) brand = 'OnePlus';
            return brand;
        }
        if (/Windows NT/i.test(ua)) return 'Windows PC';
        if (/Macintosh/i.test(ua)) return 'Mac';
        if (/Linux/i.test(ua)) return 'Linux PC';
        return 'Unknown Device';
    }

    // Get browser name and version
    function getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
        else if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
        else if (ua.includes('Edg')) browser = 'Edge';
        else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
        return browser;
    }

    // Format current time with timezone
    function getFormattedTime() {
        const now = new Date();
        const options = { 
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            timeZoneName: 'short'
        };
        return now.toLocaleString(undefined, options);
    }

    // Get screen resolution
    function getScreenRes() {
        return `${screen.width}x${screen.height}`;
    }

    // Main function to send data to Telegram
    async function sendToTelegram(data) {
        const message = `🆕 *New Visitor!*\n\n` +
                        `📱 *Device:* ${data.device}\n` +
                        `⏰ *Time:* ${data.time}\n` +
                        `🌍 *Country:* ${data.country}\n` +
                        `🌐 *Language:* ${data.language}\n` +
                        `🖥️ *Browser:* ${data.browser}\n` +
                        `📐 *Screen:* ${data.screen}\n` +
                        `🔗 *Page:* ${data.page}\n` +
                        `🆔 *IP:* ${data.ip || 'hidden'}`;

        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const payload = {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'Markdown',
            disable_web_page_preview: true
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                console.log('Visitor info sent to Telegram.');
                sessionStorage.setItem(STORAGE_KEY, 'true');
            } else {
                console.error('Telegram send error:', response.status);
            }
        } catch (err) {
            console.error('Failed to send to Telegram:', err);
        }
    }

    // Get country via IP (using ip-api.com, free, no API key needed)
    async function getCountryAndIP() {
        try {
            const res = await fetch('http://ip-api.com/json/');
            const data = await res.json();
            if (data.status === 'success') {
                return { country: `${data.country} (${data.countryCode})`, ip: data.query };
            } else {
                return { country: 'Unknown', ip: 'Unknown' };
            }
        } catch (e) {
            return { country: 'Failed to fetch', ip: 'Unknown' };
        }
    }

    // Gather all data and send
    async function trackVisitor() {
        const ua = navigator.userAgent;
        const device = getDeviceName(ua);
        const browser = getBrowserInfo();
        const language = navigator.language;
        const screen = getScreenRes();
        const time = getFormattedTime();
        const page = window.location.pathname;

        const { country, ip } = await getCountryAndIP();

        sendToTelegram({
            device: device,
            time: time,
            country: country,
            language: language,
            browser: browser,
            screen: screen,
            page: page,
            ip: ip
        });
    }

    // Execute after page fully loads to avoid blocking rendering
    window.addEventListener('load', trackVisitor);
})();
