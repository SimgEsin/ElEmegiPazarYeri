using Marketplace.Application.Features.SalesSettings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Marketplace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class SalesSettingsController : ControllerBase
{
    private readonly IMediator _mediator;

    public SalesSettingsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMine(CancellationToken cancellationToken)
    {
        var settings = await _mediator.Send(new GetMySalesSettingsQuery(), cancellationToken);
        return settings is null ? NotFound() : Ok(settings);
    }

    [HttpPut]
    public async Task<IActionResult> Upsert([FromBody] UpsertSalesSettingsDto settings, CancellationToken cancellationToken)
    {
        var id = await _mediator.Send(new UpsertSalesSettingsCommand(settings), cancellationToken);
        return Ok(id);
    }
}
