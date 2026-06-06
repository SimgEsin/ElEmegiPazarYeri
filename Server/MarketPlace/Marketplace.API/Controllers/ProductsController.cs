using Marketplace.Application.Features.Products.Commands.DeleteProduct;
using Marketplace.Application.Features.Products.Commands.CreateProduct;
using Marketplace.Application.Features.Products.Commands.UpdateProduct;
using Marketplace.Application.Features.Products.Queries.GetAllProducts;
using Marketplace.Application.Features.Products.Queries.GetProductById;
using Marketplace.Application.Features.Products.Queries.GetProductBySlug;
using Marketplace.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Marketplace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductCommand command, CancellationToken cancellationToken)
    {
        var id = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll(
        [FromQuery] Guid? categoryId,
        [FromQuery] string? categorySlug,
        [FromQuery] Guid? artisanId,
        [FromQuery] string? search,
        [FromQuery] ProductStatus? status,
        CancellationToken cancellationToken)
    {
        var query = new GetAllProductsQuery(categoryId, categorySlug, artisanId, search, status ?? ProductStatus.Published);
        var products = await _mediator.Send(query, cancellationToken);
        return Ok(products);
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var product = await _mediator.Send(new GetProductByIdQuery(id), cancellationToken);
        return product is null ? NotFound() : Ok(product);
    }

    [HttpGet("slug/{slug}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBySlug(string slug, CancellationToken cancellationToken)
    {
        var product = await _mediator.Send(new GetProductBySlugQuery(slug), cancellationToken);
        return product is null ? NotFound() : Ok(product);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductDto product, CancellationToken cancellationToken)
    {
        var updated = await _mediator.Send(new UpdateProductCommand(id, product), cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await _mediator.Send(new DeleteProductCommand(id), cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
