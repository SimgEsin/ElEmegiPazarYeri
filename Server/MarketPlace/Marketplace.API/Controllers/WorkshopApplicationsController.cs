using Marketplace.Application.Features.WorkshopApplications;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Marketplace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class WorkshopApplicationsController : ControllerBase
{
    private readonly IMediator _mediator;

    public WorkshopApplicationsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateWorkshopApplicationCommand command, CancellationToken cancellationToken)
    {
        var id = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var workshopApplications = await _mediator.Send(new GetAllWorkshopApplicationsQuery(), cancellationToken);
        return Ok(workshopApplications);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var workshopApplication = await _mediator.Send(new GetWorkshopApplicationByIdQuery(id), cancellationToken);
        return workshopApplication is null ? NotFound() : Ok(workshopApplication);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateWorkshopApplicationDto workshopApplication, CancellationToken cancellationToken)
    {
        var updated = await _mediator.Send(new UpdateWorkshopApplicationCommand(id, workshopApplication), cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await _mediator.Send(new DeleteWorkshopApplicationCommand(id), cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
