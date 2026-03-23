
namespace Ark.Captcha;
public static class ArkExtn
{
    public static void AddArkCaptcha(this IServiceCollection services)
    {
        services.AddSingleton<ArkCaptchaService>();
    }
}