using Microsoft.AspNetCore.Razor.TagHelpers;
using System.Text;

[HtmlTargetElement("ark-captcha")]
public class CaptchaTagHelper : TagHelper
{
    public string ArkJsUrl { get; set; } = "https://cdn.jsdelivr.net/npm/ark-captcha@latest/ark-captcha.js";
    public string ApiUrl { get; set; } = "/ark/api/captcha";
    public bool EnableVerify { get; set; }

    public string Id { get; set; } = $"captcha_{Guid.NewGuid().ToString("N")}";
    private static bool _styleInjected = false;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.Attributes.SetAttribute("id", Id);

        var html = new StringBuilder();

        // 🔥 HTML STRUCTURE
        html.Append($@"
<div class='captcha-wrapper'>
    <div class='captcha-card'>
        <div class='captcha-header'>Security Check</div>

        <div class='captcha-image-container'>
            <img id='{Id}_img' class='captcha-img' />
            <button id='{Id}_refresh' class='captcha-refresh'>↻</button>
        </div>

        <input id='{Id}_input' class='captcha-input' placeholder='Enter code...' />

        {(EnableVerify ? $"<button id='{Id}_submit' class='captcha-submit'>Verify</button>" : "")}

        <div id='{Id}_msg' class='captcha-message'></div>
    </div>
</div>
");
        if (!_styleInjected)
        {
            // 🎨 CSS (inject once)
            html.Append(@"
<style>
.captcha-wrapper {
    display:flex;justify-content:center;align-items:center;padding:10px;
}
.captcha-card {
    width:100%;max-width:320px;background:#fff;border-radius:16px;
    box-shadow:0 10px 25px rgba(0,0,0,0.1);
    padding:20px;font-family:Arial;text-align:center;
}
.captcha-header {font-size:18px;font-weight:bold;margin-bottom:12px;}
.captcha-image-container {position:relative;margin-bottom:10px;}
.captcha-img {width:100%;height:80px;border-radius:8px;border:1px solid #ddd;}
.captcha-refresh {
    position:absolute;right:5px;top:5px;border:none;
    background:rgba(0,0,0,0.6);color:#fff;border-radius:50%;
    width:30px;height:30px;cursor:pointer;
}
.captcha-input {
    width:100%;padding:10px;border-radius:8px;border:1px solid #ccc;
    margin-bottom:10px;
}
.captcha-submit {
    width:100%;padding:10px;border:none;border-radius:8px;
    background:#007bff;color:white;font-weight:bold;cursor:pointer;
}
.captcha-message {margin-top:10px;font-size:13px;}
.captcha-success {color:green;}
.captcha-error {color:red;}
</style>
");
        }
        // ⚙️ JS Wiring
        html.Append($@"
<script>
(function () {{
    function init() {{
        if (typeof ArkCaptcha === 'undefined') return;

        const captcha = new ArkCaptcha({{
            apiUrl: '{ApiUrl}',
            imageElement: document.getElementById('{Id}_img'),
            inputElement: document.getElementById('{Id}_input'),
            refreshButton: document.getElementById('{Id}_refresh')
        }});

        {(EnableVerify ? @$"
        document.getElementById('{Id}_submit')
        .addEventListener('click', async () => {{
            const result = await captcha.validate();
            const msg = document.getElementById('{Id}_msg');
            if (result) {{
                msg.textContent = '✔ Verified';
                msg.className = 'captcha-message captcha-success';
            }} else {{
                msg.textContent = '✖ Invalid';
                msg.className = 'captcha-message captcha-error';
            }}
        }});" : "")}

        // 🔥 Hook token update
        const originalLoad = captcha.loadCaptcha.bind(captcha);

        captcha.loadCaptcha = async function() {{
            await originalLoad();
            document.getElementById('{Id}_token').value = captcha.token;
        }};
    }}
    setTimeout(() => {{
        if (typeof ArkCaptcha === 'undefined') {{
            const s = document.createElement('script');
            s.src = '{ArkJsUrl}';
            s.onload = init;
            document.head.appendChild(s);
        }} else {{
            init();
        }}
    }}, 100)
}})();
</script>
");
        output.Content.SetHtmlContent(html.ToString());
        _styleInjected = true;
    }
}