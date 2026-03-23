class ArkCaptcha {
    constructor(options) {
        this.apiUrl = options.apiUrl;
        this.imageElement = options.imageElement;
        this.inputElement = options.inputElement;
        this.refreshButton = options.refreshButton;
        this.token = null;

        this.init();
    }

    async init() {
        await this.loadCaptcha();

        if (this.refreshButton) {
            this.refreshButton.addEventListener("click", () => {
                this.loadCaptcha();
            });
        }
    }

    async loadCaptcha() {
        const response = await fetch(this.apiUrl);

        const blob = await response.blob();
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