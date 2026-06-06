using Marketplace.Application.Features.ProductImages;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Marketplace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class ProductImagesController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductImagesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductImageCommand command, CancellationToken cancellationToken)
    {
        var id = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll([FromQuery] Guid? productId, CancellationToken cancellationToken)
    {
        var productImages = await _mediator.Send(new GetAllProductImagesQuery(productId), cancellationToken);
        return Ok(productImages);
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var productImage = await _mediator.Send(new GetProductImageByIdQuery(id), cancellationToken);
        return productImage is null ? NotFound() : Ok(productImage);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductImageDto productImage, CancellationToken cancellationToken)
    {
        var updated = await _mediator.Send(new UpdateProductImageCommand(id, productImage), cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await _mediator.Send(new DeleteProductImageCommand(id), cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
