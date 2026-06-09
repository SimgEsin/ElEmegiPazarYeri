namespace Marketplace.Infrastructure.Messaging;

public sealed class SmtpOptions
{
    public const string SectionName = "Smtp";

    public string Host { get; set; } = "localhost";
    public int Port { get; set; } = 587;
    public bool EnableSsl { get; set; } = true;
    public string UserName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FromAddress { get; set; } = "noreply@elemegipazaryeri.com";
    public string FromName { get; set; } = "El Emeği Pazar Yeri";
}
