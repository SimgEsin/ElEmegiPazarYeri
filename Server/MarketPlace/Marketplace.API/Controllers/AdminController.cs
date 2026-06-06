using Marketplace.Application.Features.Admin;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Marketplace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
// NOTE: Admin role enforcement is not yet wired (no role middleware in the project);
// any authenticated user can read analytics for now. Gate with an admin role when available.
public sealed class AdminController : ControllerBase
{
    private readonly IMediator _mediator;

    public AdminController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("analytics")]
    public async Task<IActionResult> GetAnalytics(CancellationToken cancellationToken)
    {
        var analytics = await _mediator.Send(new GetAdminAnalyticsQuery(), cancellationToken);
        return Ok(analytics);
    }
}
