class ArkCaptcha {
    constructor(options = {}) {
        this.apiUrl = options.apiUrl || "/ark/api/captcha";

        this.imageElement = options.imageElement || null;
        this.inputElement = options.inputElement || null;
        this.refreshButton = options.refreshButton || null;
        this.container = options.container || null;
        this.enableVerify = options.enableVerify || false;
        this.theme = options.theme || "dark";
        this.size = options.size || "large";
        this.title = options.title || '';

        this.token = null;

        this.init();
    }

    async init() {
        this.renderCSS();
        // If elements not provided → auto render UI
        if (!this.imageElement || !this.inputElement) {
            this.renderDefaultUI();
        }
        await this.loadCaptcha();
        if (this.refreshButton) {
            this.refreshButton.addEventListener("click", () => {
                this.loadCaptcha();
            });
        }
    }

    renderCSS() {
        // Inject CSS once
        if (!document.getElementById("captcha-styles")) {
            const style = document.createElement("style");
            style.id = "captcha-styles";
            style.innerHTML = `
/* BASE */
.captcha-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
}

.captcha-card {
    width: 100%;
    border-radius: 16px;
    padding: 20px;
    font-family: Arial, sans-serif;
    text-align: center;
    transition: all 0.3s ease;
}

/* IMAGE */
.captcha-img {
    width: 100%;
    height: 80px;
    border-radius: 8px;
    border: 1px solid #ddd;
    object-fit: cover;
}

.captcha-refresh {
    position: absolute;
    right: 5px;
    top: 5px;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
}

/* INPUT */
.captcha-input {
    width: 100%;
    margin-top: 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
}

/* BUTTON */
.captcha-submit {
    width: 100%;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

/* MESSAGE */
.captcha-success { color: green; }
.captcha-error { color: red; }

/* ========================= */
/* 🎨 THEMES */
/* ========================= */

.captcha-theme-light {
    background: #fff;
    color: #333;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.captcha-theme-light .captcha-submit {
    background: #007bff;
    color: white;
}

.captcha-theme-light .captcha-submit:hover {
    background: #0056b3;
}

/* DARK */
.captcha-theme-dark {
    background: #1e293b;
    color: #e2e8f0;
    box-shadow: 0 10px 25px rgba(0,0,0,0.4);
}

.captcha-theme-dark .captcha-input {
    background: #334155;
    color: #fff;
    border: 1px solid #475569;
}

.captcha-theme-dark .captcha-submit {
    background: #6366f1;
    color: white;
}

/* GLASS */
.captcha-theme-glass {
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(12px);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.3);
}

/* MINIMAL */
.captcha-theme-minimal {
    background: transparent;
    box-shadow: none;
    border: 1px solid #ddd;
}

/* ========================= */
/* 📏 SIZES */
/* ========================= */

.captcha-size-compact {
    max-width: 240px;
    padding: 12px;
}

.captcha-size-compact .captcha-img {
    height: 60px;
}

.captcha-size-compact .captcha-input {
    padding: 6px;
    font-size: 12px;
}

.captcha-size-compact .captcha-submit {
    padding: 6px;
    font-size: 12px;
}

.captcha-size-compact .captcha-header {
    text-align: left;
    margin-top: -25px;
}

/* NORMAL */
.captcha-size-normal {
    max-width: 320px;
}

.captcha-size-normal .captcha-input {
    padding: 10px;
    font-size: 14px;
}

.captcha-size-normal .captcha-submit {
    padding: 10px;
}

.captcha-size-normal .captcha-header {
    text-align: left;
    margin-top: -35px;
}

/* LARGE */
.captcha-size-large {
    max-width: 420px;
}

.captcha-size-large .captcha-img {
    height: 100px;
}

.captcha-size-large .captcha-input {
    padding: 14px;
    font-size: 16px;
}

.captcha-size-large .captcha-submit {
    padding: 14px;
    font-size: 16px;
}

.captcha-size-large .captcha-header {
    text-align: left;
    margin-top: -35px;
}
`;
            document.head.appendChild(style);
        }
    }
    // 🔥 Auto UI Renderer
    renderDefaultUI() {
        // Create container if not provided
        if (!this.container) {
            this.container = document.createElement("div");
            document.body.appendChild(this.container);
        }
        this.container.classList.add("captcha-wrapper");

        const themeClass = `captcha-theme-${this.theme}`;
        const sizeClass = `captcha-size-${this.size}`;

        // Inject HTML
        this.container.innerHTML = `
            <div class="captcha-card ${themeClass} ${sizeClass}">
                ${(this.title ? `<div class="captcha-header">${this.title}</div>` : '')}
                <div class="captcha-image-container" style="margin-top: 5px;">
                    <img class="captcha-img" />
                    <button class="captcha-refresh" title="Refresh">↻</button>
                </div>
                <input type="text" class="captcha-input" placeholder="Enter code..." />
                ${(this.enableVerify ? '<button class="captcha-submit">Verify</button>' : '')}
                <div class="captcha-message"></div>
            </div>
        `;

        // Bind elements
        this.imageElement = this.container.querySelector(".captcha-img");
        this.inputElement = this.container.querySelector(".captcha-input");
        this.refreshButton = this.container.querySelector(".captcha-refresh");

        const submitBtn = this.container.querySelector(".captcha-submit");
        this.messageBox = this.container.querySelector(".captcha-message");

        if (submitBtn)
            submitBtn.addEventListener("click", async () => {
                const valid = await this.validate();
                if (valid) this.showSuccess();
                else this.showFailure();
            });
    }

    async showSuccess() {
        this.messageBox.textContent = "✔ Verified successfully";
        this.messageBox.className = "captcha-message captcha-success";
    }

    async showFailure() {
        this.messageBox.textContent = "✖ Invalid captcha";
        this.messageBox.className = "captcha-message captcha-error";
        this.loadCaptcha();
    }

    async loadCaptcha() {
        const response = await fetch(this.apiUrl);

        const blob = await response.blob();

        // ✅ Recommended: use custom header instead of content-disposition
        this.token = response.headers.get("X-Ark-Captcha-Token");

        const url = URL.createObjectURL(blob);
        this.imageElement.src = url;
    }

    async getValue() {
        return {
                token: this.token,
                value: this.inputElement.value
            };
    }

    async validate() {
        const value = this.inputElement.value;

        const response = await fetch(`${this.apiUrl}/validate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: this.token,
                value: value
            })
        });

        const result = await response.json();
        return result.success;
    }
}