# ArkCaptcha

A lightweight, self-hosted CAPTCHA solution for modern web applications.

ArkCaptcha provides:

* 🔐 Secure CAPTCHA generation via ASP.NET Core (NuGet)
* 🌐 Reusable browser SDK (NPM / JS)
* 🧩 Razor TagHelper support (server-rendered UI)
* ⚡ Zero external dependencies (no third-party services)
* 🏢 Enterprise-ready (extensible, self-hosted, compliant)

---

# 📦 Packages

## Backend (NuGet)

```
ArkCaptcha.AspNetCore
```

## Frontend (NPM)

```
ark-captcha
```

---

# 🚀 Features

* Image-based CAPTCHA with noise & distortion
* Token-based validation (one-time use)
* Works with ASP.NET Core MVC / Razor Pages
* Drop-in TagHelper (`<captcha>`)
* Fully customizable UI or auto-rendered UI
* No external API calls (unlike reCAPTCHA)

---

# 🏗️ Architecture

```
Browser (ArkCaptcha JS)
        ↓
ASP.NET Core API (Captcha Middleware)
        ↓
Token + Image
        ↓
User Input
        ↓
Validation (Server-side)
```

---

# 🔧 Installation

## 1. NuGet (Backend)

```bash
dotnet add package ArkCaptcha.AspNetCore
```

---

## 2. NPM (Frontend)

```bash
npm install ark-captcha
```

Or include via script:

```html
<script src="/js/ark-captcha.js"></script>
```

---

# ⚙️ ASP.NET Core Setup

## Register Middleware

```csharp
builder.Services.AddArkCaptcha();

var app = builder.Build();

app.UseArkCaptcha();
```

---

## Default Endpoints

| Endpoint                | Description      |
| ----------------------- | ---------------- |
| `/api/captcha`          | Generate CAPTCHA |
| `/api/captcha/validate` | Validate CAPTCHA |

---

# 🧪 Usage Options

---

## ✅ Option 1: Automatic JS Rendering

```html
<script src="/js/ark-captcha.js"></script>

<script>
new ArkCaptcha({
    apiUrl: "/api/captcha"
});
</script>
```

✔ No HTML required
✔ Auto UI injected

---

## ✅ Option 2: Custom UI

```html
<img id="captchaImg" />
<input id="captchaInput" />
<button id="refresh">Refresh</button>

<script>
new ArkCaptcha({
    apiUrl: "/api/captcha",
    imageElement: document.getElementById("captchaImg"),
    inputElement: document.getElementById("captchaInput"),
    refreshButton: document.getElementById("refresh")
});
</script>
```

---

## ✅ Option 3: ASP.NET Core TagHelper

### Razor

```html
<captcha asp-for="Captcha" api-url="/api/captcha"></captcha>
```

---

### ViewModel

```csharp
public class CaptchaModel
{
    public string Token { get; set; }
    public string Value { get; set; }
}

public class FormModel
{
    public string Name { get; set; }
    public CaptchaModel Captcha { get; set; }
}
```

---

### Controller

```csharp
[HttpPost]
public IActionResult Submit(FormModel model)
{
    var isValid = _captchaService.ValidateCaptcha(
        model.Captcha.Token,
        model.Captcha.Value
    );

    if (!isValid)
    {
        ModelState.AddModelError("Captcha", "Invalid captcha");
        return View(model);
    }

    return Ok("Success");
}
```

---

# 🔐 Validation (Optional Attribute)

```csharp
[ValidateCaptcha]
public CaptchaModel Captcha { get; set; }
```

---

# 🎨 UI Behavior

If no elements are provided, ArkCaptcha:

* Injects responsive HTML
* Adds built-in CSS
* Handles validation UI

---

# ⚙️ Configuration (Optional)

```javascript
new ArkCaptcha({
    apiUrl: "/api/captcha",
    container: document.getElementById("captcha"),
    autoRender: true
});
```

---

# 🔒 Security Features

* One-time token validation
* Case-insensitive verification
* Noise + distortion rendering
* No third-party tracking
* Self-hosted (GDPR-friendly)

---

# 📁 Project Structure

```
ArkCaptcha/
 ├── src/
 │   ├── ArkCaptcha.AspNetCore/
 │   └── ark-captcha.js
 ├── LICENSE
 ├── THIRD-PARTY-NOTICES.txt
 └── README.md
```

---

# ⚖️ Licensing

* This project is licensed under the **MIT License**
* Includes third-party components under **BSD-3-Clause**

See:

* `LICENSE`
* `THIRD-PARTY-NOTICES.txt`

---

# 💡 Best Practices

* Use **distributed cache (Redis)** for production
* Enable **rate limiting** on CAPTCHA endpoints
* Set **token expiry (e.g. 5 minutes)**
* Avoid exposing token in query strings

---

# 🚀 Roadmap

* [ ] Dark mode support
* [ ] Canvas-based CAPTCHA
* [ ] Invisible CAPTCHA (behavior-based)
* [ ] Blazor component
* [ ] Multi-language support

---

# 🤝 Contributing

Contributions are welcome!

* Fork the repo
* Create a feature branch
* Submit a PR

---

# ⭐ Support

If you find this useful, consider giving a ⭐ on GitHub!

---

# ⭐ Author:

raj@immanuel - Immanuel R