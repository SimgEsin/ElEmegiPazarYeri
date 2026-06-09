namespace Marketplace.Application.Common.Models;

public sealed record EmailMessage
{
    public required string To { get; init; }
    public string? ToName { get; init; }
    public required string Subject { get; init; }
    public required string Body { get; init; }
    public bool IsHtml { get; init; } = true;
}
