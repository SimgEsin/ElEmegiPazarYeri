using Marketplace.Application.Features.ArtisanProfiles.Commands.CreateArtisanProfile;
using Marketplace.Application.Features.ArtisanProfiles.Commands.DeleteArtisanProfile;
using Marketplace.Application.Features.ArtisanProfiles.Commands.UpdateArtisanProfile;
using Marketplace.Application.Features.ArtisanProfiles.Queries.GetAllArtisanProfiles;
using Marketplace.Application.Features.ArtisanProfiles.Queries.GetArtisanProfileById;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Marketplace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class ArtisanProfilesController : ControllerBase
{
    private readonly IMediator _mediator;

    public ArtisanProfilesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateArtisanProfileCommand command, CancellationToken cancellationToken)
    {
        var id = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var artisanProfiles = await _mediator.Send(new GetAllArtisanProfilesQuery(), cancellationToken);
        return Ok(artisanProfiles);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var artisanProfile = await _mediator.Send(new GetArtisanProfileByIdQuery(id), cancellationToken);
        return artisanProfile is null ? NotFound() : Ok(artisanProfile);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateArtisanProfileDto artisanProfile, CancellationToken cancellationToken)
    {
        var updated = await _mediator.Send(new UpdateArtisanProfileCommand(id, artisanProfile), cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await _mediator.Send(new DeleteArtisanProfileCommand(id), cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
