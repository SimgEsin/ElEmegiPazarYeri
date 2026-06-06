using Marketplace.Application.Features.Notifications;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Marketplace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class NotificationsController : ControllerBase
{
    private readonly IMediator _mediator;

    public NotificationsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetMine(CancellationToken cancellationToken)
    {
        var notifications = await _mediator.Send(new GetMyNotificationsQuery(), cancellationToken);
        return Ok(notifications);
    }

    [HttpPut("{id:guid}/read")]
    public async Task<IActionResult> MarkRead(Guid id, CancellationToken cancellationToken)
    {
        var updated = await _mediator.Send(new MarkNotificationReadCommand(id), cancellationToken);
        return updated ? NoContent() : NotFound();
    }
}
