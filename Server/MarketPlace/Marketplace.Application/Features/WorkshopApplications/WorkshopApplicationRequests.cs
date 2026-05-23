using MediatR;

namespace Marketplace.Application.Features.WorkshopApplications;

public sealed record CreateWorkshopApplicationCommand(CreateWorkshopApplicationDto WorkshopApplication) : IRequest<Guid>;
public sealed record UpdateWorkshopApplicationCommand(Guid Id, UpdateWorkshopApplicationDto WorkshopApplication) : IRequest<bool>;
public sealed record DeleteWorkshopApplicationCommand(Guid Id) : IRequest<bool>;
public sealed record GetAllWorkshopApplicationsQuery : IRequest<IReadOnlyList<WorkshopApplicationDto>>;
public sealed record GetWorkshopApplicationByIdQuery(Guid Id) : IRequest<WorkshopApplicationDto?>;
