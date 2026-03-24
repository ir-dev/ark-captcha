using Microsoft.AspNetCore.Razor.TagHelpers;
using System.Text;

[HtmlTargetElement("ark-captcha")]
public class CaptchaTagHelper : TagHelper
{
    public string ArkJsUrl { get; set; } = "https://cdn.jsdelivr.net/npm/ark-captcha@latest/ark-captcha.js";
    public string ApiUrl { get; set; } = "/ark/api/captcha";
    public bool EnableVerify { get; set; }

    public string Id { get; set; } = $"captcha_{Guid.NewGuid().ToString("N")}";

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.Attributes.SetAttribute("id", $"{Id}");
        var html = new StringBuilder();
        // ⚙️ JS Wiring
        html.Append($@"
<script>
(function () {{

    function loadScriptOnce(src, callback) {{
        // ✅ Already loaded
        if (window.ArkCaptcha) {{
            callback();
            return;
        }}

        // ✅ Already loading
        if (window.__arkCaptchaLoading) {{
            window.__arkCaptchaLoading.push(callback);
            return;
        }}

        // 🚀 First time load
        window.__arkCaptchaLoading = [callback];

        const script = document.createElement(""script"");
        script.src = src;
        script.onload = function () {{
            window.__arkCaptchaLoading.forEach(cb => cb());
            window.__arkCaptchaLoading = null;
        }};

        document.head.appendChild(script);
    }}

    function initCaptcha() {{
        document.querySelector('#{Id}').captcha = new ArkCaptcha({{
            container: document.querySelector('#{Id}_captcha_contain'),
            apiUrl: '{ApiUrl}',
            enableVerify: {EnableVerify.ToString().ToLower()}
        }});
    }}

    loadScriptOnce('{ArkJsUrl}', initCaptcha);

}})();
</script>
");
        output.Content.SetHtmlContent(html.ToString());
    }
}