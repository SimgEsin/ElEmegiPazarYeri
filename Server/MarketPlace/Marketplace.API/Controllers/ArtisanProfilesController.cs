using Marketplace.Application.Features.ArtisanProfiles.Commands.CreateArtisanProfile;
using Marketplace.Application.Features.ArtisanProfiles.Commands.DeleteArtisanProfile;
using Marketplace.Application.Features.ArtisanProfiles.Commands.UpdateArtisanProfile;
using Marketplace.Application.Features.ArtisanProfiles.Queries.GetAllArtisanProfiles;
using Marketplace.Application.Features.ArtisanProfiles.Queries.GetArtisanProfileById;
using Marketplace.Application.Features.ArtisanProfiles.Queries.GetArtisanProfileBySlug;
using Marketplace.Application.Features.ArtisanProfiles.Queries.GetMyArtisanProfile;
using Marketplace.Application.Features.Follows;
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
    [AllowAnonymous]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var artisanProfiles = await _mediator.Send(new GetAllArtisanProfilesQuery(), cancellationToken);
        return Ok(artisanProfiles);
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMine(CancellationToken cancellationToken)
    {
        var artisanProfile = await _mediator.Send(new GetMyArtisanProfileQuery(), cancellationToken);
        return artisanProfile is null ? NotFound() : Ok(artisanProfile);
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var artisanProfile = await _mediator.Send(new GetArtisanProfileByIdQuery(id), cancellationToken);
        return artisanProfile is null ? NotFound() : Ok(artisanProfile);
    }

    [HttpGet("slug/{slug}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBySlug(string slug, CancellationToken cancellationToken)
    {
        var artisanProfile = await _mediator.Send(new GetArtisanProfileBySlugQuery(slug), cancellationToken);
        return artisanProfile is null ? NotFound() : Ok(artisanProfile);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateArtisanProfileDto artisanProfile, CancellationToken cancellationToken)
    {
        var updated = await _mediator.Send(new UpdateArtisanProfileCommand(id, artisanProfile), cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpGet("me/following")]
    public async Task<IActionResult> GetMyFollowing(CancellationToken cancellationToken)
    {
        var following = await _mediator.Send(new GetMyFollowingQuery(), cancellationToken);
        return Ok(following);
    }

    [HttpGet("{id:guid}/is-following")]
    public async Task<IActionResult> IsFollowing(Guid id, CancellationToken cancellationToken)
    {
        var isFollowing = await _mediator.Send(new IsFollowingQuery(id), cancellationToken);
        return Ok(isFollowing);
    }

    [HttpPost("{id:guid}/follow")]
    public async Task<IActionResult> Follow(Guid id, CancellationToken cancellationToken)
    {
        var followed = await _mediator.Send(new FollowArtisanCommand(id), cancellationToken);
        return followed ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}/follow")]
    public async Task<IActionResult> Unfollow(Guid id, CancellationToken cancellationToken)
    {
        var unfollowed = await _mediator.Send(new UnfollowArtisanCommand(id), cancellationToken);
        return unfollowed ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await _mediator.Send(new DeleteArtisanProfileCommand(id), cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
