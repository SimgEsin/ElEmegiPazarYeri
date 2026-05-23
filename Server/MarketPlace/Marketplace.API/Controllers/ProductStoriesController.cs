using Marketplace.Application.Features.ProductStories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Marketplace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class ProductStoriesController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductStoriesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductStoryCommand command, CancellationToken cancellationToken)
    {
        var id = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var productStories = await _mediator.Send(new GetAllProductStoriesQuery(), cancellationToken);
        return Ok(productStories);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var productStory = await _mediator.Send(new GetProductStoryByIdQuery(id), cancellationToken);
        return productStory is null ? NotFound() : Ok(productStory);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductStoryDto productStory, CancellationToken cancellationToken)
    {
        var updated = await _mediator.Send(new UpdateProductStoryCommand(id, productStory), cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await _mediator.Send(new DeleteProductStoryCommand(id), cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
