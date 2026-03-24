# ArkCaptcha

**ArkCaptcha** is a lightweight, self-hosted CAPTCHA solution for ASP.NET Core and modern web applications.

It provides:

* 🔐 Server-side CAPTCHA generation (ASP.NET Core)
* 🌐 Browser SDK (`ark-captcha.js`)
* 🧩 Razor TagHelper (`<ark-captcha>`)
* ⚡ Zero external dependencies (no Google reCAPTCHA)
* 🏢 Enterprise-ready architecture (scalable & extensible)

---

# 🚀 Features

* Image-based CAPTCHA with noise & distortion
* Token-based validation (one-time use)
* Auto-rendered UI (no HTML required)
* Custom UI support
* TagHelper integration for Razor
* Built-in CSS injection (no external styles required)
* Multi-instance safe (script loads only once)
* Async-friendly API

---

# 📦 Packages

## Backend (NuGet)

```bash
dotnet add package ArkCaptcha.AspNetCore
```

---

## Frontend (NPM / CDN)

```bash
npm install ark-captcha
```

OR

```html
<script src="https://cdn.jsdelivr.net/npm/ark-captcha@latest/ark-captcha.js"></script>
```

---

# 🏗️ Architecture

```
Browser (ArkCaptcha JS / TagHelper)
        ↓
ASP.NET Core API (/ark/api/captcha)
        ↓
Token + Image
        ↓
User Input
        ↓
Validation (Server-side)
```

---

# ⚙️ ASP.NET Core Setup

## 1. Register Services

```csharp
builder.Services.AddSingleton<ArkCaptchaService>();
```

---

## 2. Map Controller

```csharp
app.MapControllers();
```

---

## 3. Default Endpoints

| Endpoint                    | Description      |
| --------------------------- | ---------------- |
| `/ark/api/captcha`          | Generate CAPTCHA |
| `/ark/api/captcha/validate` | Validate CAPTCHA |

---

# 🧪 Usage Options

---

## ✅ 1. Auto Render (Zero HTML)

```html
<div id="captcha"></div>

<script>
new ArkCaptcha({
    container: document.getElementById("captcha"),
    apiUrl: "/ark/api/captcha",
    enableVerify: true
});
</script>
```

✔ Fully automatic UI
✔ Built-in styling
✔ Optional verify button

---

## ✅ 2. Custom UI Integration

```html
<img id="img" />
<input id="input" />
<button id="refresh">Refresh</button>
<button id="submit">Validate</button>

<script>
const captcha = new ArkCaptcha({
    apiUrl: "/ark/api/captcha",
    imageElement: document.getElementById("img"),
    inputElement: document.getElementById("input"),
    refreshButton: document.getElementById("refresh")
});

document.getElementById("submit").onclick = async () => {
    const valid = await captcha.validate();
    console.log(valid);
};
</script>
```

---

## ✅ 3. Razor TagHelper (Recommended for ASP.NET)

### Usage

```html
<ark-captcha api-url="/ark/api/captcha" enable-verify="true"></ark-captcha>
```

---

### Features

* Auto loads `ark-captcha.js` (once globally)
* Supports multiple instances per page
* Injects UI automatically
* Exposes instance via DOM:

```javascript
document.querySelector("#captcha_id").captcha
```

---

## 🧠 Access Value (Form Integration)

```javascript
const data = await captcha.getValue();

/*
{
  token: "...",
  value: "USER_INPUT"
}
*/
```

---

# 🔐 Server-Side Validation

```csharp
[HttpPost]
public IActionResult Submit(FormModel model)
{
    var isValid = _captchaService.ValidateCaptcha(
        model.Token,
        model.Value
    );

    if (!isValid)
    {
        return BadRequest("Invalid Captcha");
    }

    return Ok();
}
```

---

# 📡 API Contract

## GET `/ark/api/captcha`

* Returns: CAPTCHA image (PNG)
* Header:

```
X-Ark-Captcha-Token: <token>
```

---

## POST `/ark/api/captcha/validate`

```json
{
  "token": "string",
  "value": "string"
}
```

Response:

```json
{
  "success": true
}
```

---

# 🎨 UI Behavior

If no elements are provided:

* ArkCaptcha auto-injects:

  * HTML
  * CSS
  * Interaction logic

Optional:

```javascript
enableVerify: true
```

👉 Adds built-in **Verify button**

---

# ⚙️ Configuration Options

```javascript
new ArkCaptcha({
    apiUrl: "/ark/api/captcha",
    container: HTMLElement,
    imageElement: HTMLElement,
    inputElement: HTMLElement,
    refreshButton: HTMLElement,
    enableVerify: true
});
```

---

# 🧠 Methods

## `loadCaptcha()`

Refresh CAPTCHA image

## `validate()`

```javascript
const result = await captcha.validate();
```

Returns:

```javascript
true | false
```

---

## `getValue()`

```javascript
const data = await captcha.getValue();
```

Returns:

```javascript
{
  token,
  value
}
```

---

## `showSuccess()` / `showFailure()`

Manually control UI state

---

# 🔒 Security Features

* One-time token validation
* Token removed after validation
* Case-insensitive comparison
* No external tracking
* Self-hosted (GDPR friendly)

---

# 📁 Project Structure

```
ArkCaptcha/
 ├── ArkCaptcha.AspNetCore/
 │   ├── ArkCaptchaService.cs
 │   ├── CaptchaController.cs
 │   └── CaptchaTagHelper.cs
 ├── ark-captcha.js
 ├── LICENSE
 └── README.md
```

---

# ⚖️ Licensing

* MIT License (your code)
* Uses BSD-3 licensed dependencies (e.g. SkiaSharp)

---

# 💡 Best Practices

* Use Redis / distributed cache instead of in-memory store
* Add token expiry (5–10 minutes)
* Enable rate limiting for `/captcha` endpoints
* Use HTTPS in production
* Avoid exposing token in URLs

---

# 🚀 Roadmap

* [ ] Dark mode UI
* [ ] Canvas-based CAPTCHA
* [ ] Invisible CAPTCHA mode
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

If you find ArkCaptcha useful, give it a ⭐ on GitHub!

---
