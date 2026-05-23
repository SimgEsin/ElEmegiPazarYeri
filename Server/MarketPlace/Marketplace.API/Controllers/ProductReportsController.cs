using Marketplace.Application.Features.ProductReports;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Marketplace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class ProductReportsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductReportsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductReportCommand command, CancellationToken cancellationToken)
    {
        var id = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var productReports = await _mediator.Send(new GetAllProductReportsQuery(), cancellationToken);
        return Ok(productReports);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var productReport = await _mediator.Send(new GetProductReportByIdQuery(id), cancellationToken);
        return productReport is null ? NotFound() : Ok(productReport);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductReportDto productReport, CancellationToken cancellationToken)
    {
        var updated = await _mediator.Send(new UpdateProductReportCommand(id, productReport), cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await _mediator.Send(new DeleteProductReportCommand(id), cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
