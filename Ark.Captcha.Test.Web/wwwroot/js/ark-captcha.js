class ArkCaptcha {
    constructor(options = {}) {
        this.apiUrl = options.apiUrl || "/ark/api/captcha";

        this.imageElement = options.imageElement || null;
        this.inputElement = options.inputElement || null;
        this.refreshButton = options.refreshButton || null;
        this.container = options.container || null;
        this.enableVerify = options.enableVerify || false;

        this.token = null;

        this.init();
    }

    async init() {
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

    // 🔥 Auto UI Renderer
    renderDefaultUI() {
        // Create container if not provided
        if (!this.container) {
            this.container = document.createElement("div");
            document.body.appendChild(this.container);
        }

        this.container.classList.add("captcha-wrapper");

        // Inject HTML
        this.container.innerHTML = `
            <div class="captcha-card">
                <div class="captcha-header">Security Check</div>
                <div class="captcha-image-container">
                    <img class="captcha-img" />
                    <button class="captcha-refresh" title="Refresh">↻</button>
                </div>
                <input type="text" class="captcha-input" placeholder="Enter code..." />
                ${(this.enableVerify ? '<button class="captcha-submit">Verify</button>' : '')}
                <div class="captcha-message"></div>
            </div>
        `;

        // Inject CSS once
        if (!document.getElementById("captcha-styles")) {
            const style = document.createElement("style");
            style.id = "captcha-styles";
            style.innerHTML = `
                .captcha-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 10px;
                }

                .captcha-card {
                    width: 100%;
                    max-width: 320px;
                    background: #fff;
                    border-radius: 16px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    padding: 20px;
                    font-family: Arial, sans-serif;
                    text-align: center;
                }

                .captcha-header {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 12px;
                }

                .captcha-image-container {
                    position: relative;
                    margin-bottom: 10px;
                }

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
                    background: rgba(0,0,0,0.6);
                    color: #fff;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    cursor: pointer;
                    font-size: 16px;
                }

                .captcha-input {
                    width: 100%;
                    padding: 10px;
                    border-radius: 8px;
                    border: 1px solid #ccc;
                    margin-bottom: 10px;
                    font-size: 14px;
                }

                .captcha-submit {
                    width: 100%;
                    padding: 10px;
                    border: none;
                    border-radius: 8px;
                    background: #007bff;
                    color: white;
                    font-weight: bold;
                    cursor: pointer;
                    transition: 0.3s;
                }

                .captcha-submit:hover {
                    background: #0056b3;
                }

                .captcha-message {
                    margin-top: 10px;
                    font-size: 13px;
                }

                .captcha-success {
                    color: green;
                }

                .captcha-error {
                    color: red;
                }
            `;
            document.head.appendChild(style);
        }

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