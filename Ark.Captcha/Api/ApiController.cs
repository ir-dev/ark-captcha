using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ark.Captcha;

[ApiController]
[Route("ark/api/captcha")]
public class CaptchaController : ControllerBase
{
    ArkCaptchaService _captcha;

    public CaptchaController(ArkCaptchaService captcha)
    {
        _captcha = captcha;
    }

    [HttpGet]
    public IActionResult GetCaptcha()
    {
        var (token, image) = _captcha.GenerateCaptcha();
        Response.Headers["X-Ark-Captcha-Token"] = token;
        return File(image, "image/png");
    }

    [HttpPost("validate")]
    public IActionResult Validate([FromBody] CaptchaRequest request)
    {
        var result = _captcha.ValidateCaptcha(request.Token, request.Value);

        return Ok(new { success = result });
    }
}

public class CaptchaRequest
{
    public string Token { get; set; }
    public string Value { get; set; }
}