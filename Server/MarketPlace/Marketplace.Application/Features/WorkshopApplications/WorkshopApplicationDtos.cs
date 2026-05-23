namespace Marketplace.Application.Features.WorkshopApplications;

public sealed class WorkshopApplicationDto
{
    public Guid Id { get; init; }
    public Guid UserId { get; init; }
    public Guid ArtisanProfileId { get; init; }
    public string Message { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
}

public sealed class CreateWorkshopApplicationDto
{
    public required Guid ArtisanProfileId { get; init; }
    public required string Message { get; init; }
}

public sealed class UpdateWorkshopApplicationDto
{
    public required Guid ArtisanProfileId { get; init; }
    public required string Message { get; init; }
    public string Status { get; init; } = "Pending";
}
