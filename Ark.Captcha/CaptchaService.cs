using SkiaSharp;

namespace Ark.Captcha;

public class ArkCaptchaService
{
    private readonly Dictionary<string, string> _store = new();

    public (string token, byte[] image) GenerateCaptcha()
    {
        var text = GenerateRandomText(6);
        var token = Guid.NewGuid().ToString();

        _store[token] = text;

        var imageBytes = GenerateImage(text);

        return (token, imageBytes);
    }

    public bool ValidateCaptcha(string token, string input)
    {
        if (_store.TryGetValue(token, out var value))
        {
            _store.Remove(token);
            return value.Equals(input, StringComparison.OrdinalIgnoreCase);
        }
        return false;
    }

    private string GenerateRandomText(int length)
    {
        const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        var rand = new Random();
        return new string(Enumerable.Range(0, length)
            .Select(_ => chars[rand.Next(chars.Length)]).ToArray());
    }

    private byte[] GenerateImage(string text)
    {
        int width = 200;
        int height = 80;

        using var bitmap = new SKBitmap(width, height);
        using var canvas = new SKCanvas(bitmap);

        canvas.Clear(SKColors.White);

        var rand = new Random();

        // Draw noise lines
        using var linePaint = new SKPaint
        {
            Color = SKColors.Gray,
            StrokeWidth = 1
        };

        for (int i = 0; i < 10; i++)
        {
            canvas.DrawLine(
                rand.Next(width), rand.Next(height),
                rand.Next(width), rand.Next(height),
                linePaint);
        }

        // Draw text
        using var textPaint = new SKPaint
        {
            Color = SKColors.Black,
            TextSize = 36,
            IsAntialias = true,
            FakeBoldText = true
        };

        canvas.DrawText(text, 20, 50, textPaint);

        // Encode image
        using var image = SKImage.FromBitmap(bitmap);
        using var data = image.Encode(SKEncodedImageFormat.Png, 100);

        return data.ToArray();
    }
}
